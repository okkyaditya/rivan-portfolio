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

/* ── Sphere-interior layout ──
   Camera sits at the origin. Cards are placed on the inner surface of a
   sphere using a latitude/longitude grid so the result reads as an
   intentional wrapped "wall of screens", not a random scatter. Each card
   is oriented to face the center. */

const RADIUS = 9;
const COLS = 20; // longitude divisions (full wrap)
const ROWS = 9; // latitude bands
const MAX_ELEVATION = (48 * Math.PI) / 180; // clamp band so poles stay empty
const CARD_W = 2.5;
const CARD_H = 1.75;

// Look-control feel
const LOOK_SPEED = 0.0022;
const LERP = 0.075; // the lenis-style easing
const FRICTION = 0.94;
const MAX_PITCH = (62 * Math.PI) / 180;
const CLICK_THRESHOLD = 6; // px of movement below which a pointerup counts as a click

type Placed = {
  project: Project;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  tileSeed: string;
};

function buildLayout(projects: Project[]): Placed[] {
  const placed: Placed[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const center = new THREE.Vector3(0, 0, 0);
  let i = 0;

  for (let row = 0; row < ROWS; row += 1) {
    // elevation from -MAX..+MAX across the rows
    const tRow = ROWS === 1 ? 0.5 : row / (ROWS - 1);
    const elevation = THREE.MathUtils.lerp(-MAX_ELEVATION, MAX_ELEVATION, tRow);

    for (let col = 0; col < COLS; col += 1) {
      // offset alternate rows for a tighter, less mechanical weave
      const azOffset = row % 2 === 0 ? 0 : Math.PI / COLS;
      const azimuth = (col / COLS) * Math.PI * 2 + azOffset;

      const x = RADIUS * Math.cos(elevation) * Math.sin(azimuth);
      const y = RADIUS * Math.sin(elevation);
      const z = RADIUS * Math.cos(elevation) * Math.cos(azimuth);
      const position = new THREE.Vector3(x, y, z);

      // face the center
      const m = new THREE.Matrix4().lookAt(position, center, up);
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
  return `https://picsum.photos/seed/${seed}/420/300`;
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
    loader.load(imageUrl(placed.tileSeed), (tex) => {
      if (!alive) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    return () => {
      alive = false;
    };
  }, [placed.tileSeed]);

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

    // look around from the center of the sphere
    camera.rotation.order = "YXZ";
    camera.rotation.y = c.yaw;
    camera.rotation.x = c.pitch;

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
