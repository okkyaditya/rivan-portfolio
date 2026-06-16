"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export type Project = {
  id: string;
  client: string;
  title: string;
  tags: string[];
  year: string;
  seed: string;
};

type GalleryCanvasProps = {
  active: boolean;
  projects: Project[];
  onHover: (project: Project | null) => void;
  onSelect: (project: Project) => void;
};

/* ── Cylindrical-wall layout ──
   Camera sits at the origin and looks around. Cards are placed on the inner
   surface of a CYLINDER (not a sphere) so every row shares the same radius.
   That keeps horizontal gaps even across all rows, rows perfectly level, and
   each card only yaws to face the central axis — no per-card vertical tilt.
   The result reads as a tidy, intentional "wall of screens" you can drag to
   spin around, like phantom.land's Work view. */

const COLS = 20; // columns around the full 360° wrap
const ROWS = 7; // stacked horizontal bands
const CARD_W = 2.5;
const CARD_H = 1.75;
const GAP_X = 0.16; // horizontal gap (≈ half of the previous ~0.33)
const GAP_Y = 0.275; // vertical gap (half of the previous 0.55)
// radius derived so the horizontal arc spacing matches CARD_W + GAP_X
const RADIUS = ((CARD_W + GAP_X) * COLS) / (2 * Math.PI);
const ROW_SPACING = CARD_H + GAP_Y; // even vertical gap between rows

// Look-control feel
const LOOK_SPEED = 0.0022;
const LERP = 0.075; // the lenis-style easing
const FRICTION = 0.94;
const MAX_PITCH = (42 * Math.PI) / 180;
const CLICK_THRESHOLD = 6; // px of movement below which a pointerup counts as a click

// Dramatic zoom-out (wider FOV) while dragging, easing back when released
const FOV_IDLE = 70;
const FOV_DRAG = 92;
const FOV_LERP = 0.08;

type Placed = {
  project: Project;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  tileSeed: string;
};

function buildLayout(projects: Project[]): Placed[] {
  const placed: Placed[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  let i = 0;

  // center the stack of rows vertically around y = 0
  const totalH = (ROWS - 1) * ROW_SPACING;

  for (let row = 0; row < ROWS; row += 1) {
    const y = row * ROW_SPACING - totalH / 2;

    for (let col = 0; col < COLS; col += 1) {
      // even angular spacing around the full circle — no alternating offset,
      // so columns stay vertically aligned and the grid reads as clean
      const azimuth = (col / COLS) * Math.PI * 2;

      const x = RADIUS * Math.sin(azimuth);
      const z = RADIUS * Math.cos(azimuth);
      const position = new THREE.Vector3(x, y, z);

      // face the central axis at the SAME height -> yaw-only rotation.
      // every card stays upright and level (no vertical tilt).
      const target = new THREE.Vector3(0, y, 0);
      const m = new THREE.Matrix4().lookAt(position, target, up);
      const quaternion = new THREE.Quaternion().setFromRotationMatrix(m);

      const project = projects[i % projects.length];
      // distinct image per tile so the wall doesn't read as a repeating loop
      placed.push({ project, position, quaternion, tileSeed: `${project.seed}-${row}-${col}` });
      i += 1;
    }
  }
  return placed;
}

function imageUrl(seed: string) {
  // Images are served from your own files under /public/images/work/.
  // Each project uses /public/images/work/<seed>.jpg (e.g. phantom-st.jpg).
  return `/images/work/${seed}.jpg`;
}

/* Card: plane with async-loaded texture + fallback gradient */
function Card({
  placed,
  hovered,
}: {
  placed: Placed;
  hovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let alive = true;
    loader.load(imageUrl(placed.project.seed), (tex) => {
      if (!alive) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    return () => {
      alive = false;
    };
  }, [placed.project.seed]);

  const fallback = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 420;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 420, 300);
      g.addColorStop(0, "#1a1a1f");
      g.addColorStop(1, "#0a0a0d");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 420, 300);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = hovered ? 1.06 : 1;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, target, 0.15);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group
      ref={groupRef}
      position={placed.position}
      quaternion={placed.quaternion}
      userData={{ projectId: placed.project.id }}
    >
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshBasicMaterial
          map={texture ?? fallback}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* hover frame */}
      <mesh position={[0, 0, 0.01]} visible={hovered}>
        <planeGeometry args={[CARD_W + 0.08, CARD_H + 0.08]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GalleryRig({ active, projects, onHover, onSelect }: GalleryCanvasProps) {
  const placed = useMemo(() => buildLayout(projects), [projects]);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl, raycaster, pointer } = useThree();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const ctrl = useRef({
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    velYaw: 0,
    velPitch: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    movedDist: 0,
  });

  useEffect(() => {
    camera.position.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      if (!active) return;
      const c = ctrl.current;
      c.dragging = true;
      c.lastX = e.clientX;
      c.lastY = e.clientY;
      c.movedDist = 0;
      c.velYaw = 0;
      c.velPitch = 0;
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const c = ctrl.current;
      if (!c.dragging) return;
      const dx = e.clientX - c.lastX;
      const dy = e.clientY - c.lastY;
      c.movedDist += Math.abs(dx) + Math.abs(dy);
      // drag right -> look right (content moves left): natural "grab the world"
      c.targetYaw += dx * LOOK_SPEED;
      c.targetPitch += dy * LOOK_SPEED;
      c.targetPitch = THREE.MathUtils.clamp(c.targetPitch, -MAX_PITCH, MAX_PITCH);
      c.velYaw = dx * LOOK_SPEED;
      c.velPitch = dy * LOOK_SPEED;
      c.lastX = e.clientX;
      c.lastY = e.clientY;
    };

    const onUp = (e: PointerEvent) => {
      if (!active) return;
      const c = ctrl.current;
      const wasClick = c.movedDist < CLICK_THRESHOLD;
      c.dragging = false;
      el.releasePointerCapture?.(e.pointerId);
      if (wasClick && hoveredId) {
        const hit = placed.find((p) => p.project.id === hoveredId);
        if (hit) onSelect(hit.project);
      }
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [active, gl, hoveredId, placed, onSelect]);

  useFrame(() => {
    const c = ctrl.current;

    // inertia glide after release
    if (active && !c.dragging) {
      c.targetYaw += c.velYaw;
      c.targetPitch += c.velPitch;
      c.targetPitch = THREE.MathUtils.clamp(c.targetPitch, -MAX_PITCH, MAX_PITCH);
      c.velYaw *= FRICTION;
      c.velPitch *= FRICTION;
    }

    // very subtle idle drift so the wall feels alive
    if (active && !c.dragging && Math.abs(c.velYaw) < 0.0002) {
      c.targetYaw += 0.0004;
    }

    c.yaw = THREE.MathUtils.lerp(c.yaw, c.targetYaw, LERP);
    c.pitch = THREE.MathUtils.lerp(c.pitch, c.targetPitch, LERP);

    // look around from the center of the cylinder
    camera.rotation.order = "YXZ";
    camera.rotation.y = c.yaw;
    camera.rotation.x = c.pitch;

    // dramatic zoom-out: widen FOV while dragging, ease back on release
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = camera as THREE.PerspectiveCamera;
      const targetFov = active && c.dragging ? FOV_DRAG : FOV_IDLE;
      const nextFov = THREE.MathUtils.lerp(cam.fov, targetFov, FOV_LERP);
      if (Math.abs(nextFov - cam.fov) > 0.01) {
        cam.fov = nextFov;
        cam.updateProjectionMatrix();
      }
    }

    // hover raycast
    if (active && groupRef.current) {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(groupRef.current.children, true);
      const ud = hits[0]?.object.parent?.userData as { projectId?: string } | undefined;
      const id = ud?.projectId ?? null;
      if (id !== hoveredId) {
        setHoveredId(id);
        onHover(id ? placed.find((p) => p.project.id === id)?.project ?? null : null);
      }
      gl.domElement.style.cursor = c.dragging ? "grabbing" : id ? "pointer" : "grab";
    }
  });

  return (
    <>
      <ambientLight intensity={1.4} />
      <group ref={groupRef}>
        {placed.map((p, idx) => (
          <Card key={`${p.project.id}-${idx}`} placed={p} hovered={hoveredId === p.project.id && !ctrl.current.dragging} />
        ))}
      </group>
      <Preload all />
    </>
  );
}

export function GalleryCanvas(props: GalleryCanvasProps) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${
        props.active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, 0] }}
      >
        <color attach="background" args={["#050506"]} />
        <fog attach="fog" args={["#050506", 8, 16]} />
        <GalleryRig {...props} />
      </Canvas>
    </div>
  );
}
