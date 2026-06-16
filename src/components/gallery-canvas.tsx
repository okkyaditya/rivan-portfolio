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

/* ── Flat grid layout ──
   Cards are placed on a flat plane (wall) with uniform spacing.
   Camera sits in front and pans across to explore. All cards
   are the same size, evenly spaced, with no tilt or rotation. */

const COLS = 20; // columns in the grid
const ROWS = 9; // rows in the grid
const CARD_W = 2.5;
const CARD_H = 1.75;
const GAP_X = 0.3; // horizontal gap between cards
const GAP_Y = 0.3; // vertical gap between cards
const CAMERA_Z = 8; // distance of camera from the wall

// Look-control feel
const PAN_SPEED = 0.012;
const LERP = 0.075; // the lenis-style easing
const FRICTION = 0.94;
const CLICK_THRESHOLD = 6; // px of movement below which a pointerup counts as a click

type Placed = {
  project: Project;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  tileSeed: string;
};

function buildLayout(projects: Project[]): Placed[] {
  const placed: Placed[] = [];
  // All cards face +Z (toward the camera), no rotation needed
  const quaternion = new THREE.Quaternion(); // identity quaternion = no rotation
  let i = 0;

  // Calculate total grid dimensions to center it
  const cellW = CARD_W + GAP_X;
  const cellH = CARD_H + GAP_Y;
  const totalW = COLS * cellW - GAP_X;
  const totalH = ROWS * cellH - GAP_Y;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      // Position cards in a flat grid centered at origin on the XY plane at z=0
      const x = col * cellW - totalW / 2 + CARD_W / 2;
      const y = -(row * cellH - totalH / 2 + CARD_H / 2); // top-down row order
      const z = 0;
      const position = new THREE.Vector3(x, y, z);

      const project = projects[i % projects.length];
      placed.push({ project, position, quaternion: quaternion.clone(), tileSeed: `${project.seed}-${row}-${col}` });
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

  // Calculate bounds for clamping camera pan
  const bounds = useMemo(() => {
    const cellW = CARD_W + GAP_X;
    const cellH = CARD_H + GAP_Y;
    const totalW = COLS * cellW - GAP_X;
    const totalH = ROWS * cellH - GAP_Y;
    return { halfW: totalW / 2, halfH: totalH / 2 };
  }, []);

  const ctrl = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    velX: 0,
    velY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    movedDist: 0,
  });

  useEffect(() => {
    camera.position.set(0, 0, CAMERA_Z);
    camera.lookAt(0, 0, 0);
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
      c.velX = 0;
      c.velY = 0;
      el.setPointerCapture?.(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      const c = ctrl.current;
      if (!c.dragging) return;
      const dx = e.clientX - c.lastX;
      const dy = e.clientY - c.lastY;
      c.movedDist += Math.abs(dx) + Math.abs(dy);
      // drag right -> camera moves left (content moves right): natural "grab the world"
      c.targetX -= dx * PAN_SPEED;
      c.targetY += dy * PAN_SPEED;
      // Clamp within grid bounds
      c.targetX = THREE.MathUtils.clamp(c.targetX, -bounds.halfW, bounds.halfW);
      c.targetY = THREE.MathUtils.clamp(c.targetY, -bounds.halfH, bounds.halfH);
      c.velX = -dx * PAN_SPEED;
      c.velY = dy * PAN_SPEED;
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
  }, [active, gl, hoveredId, placed, onSelect, bounds]);

  useFrame(() => {
    const c = ctrl.current;

    // inertia glide after release
    if (active && !c.dragging) {
      c.targetX += c.velX;
      c.targetY += c.velY;
      // Clamp within grid bounds
      c.targetX = THREE.MathUtils.clamp(c.targetX, -bounds.halfW, bounds.halfW);
      c.targetY = THREE.MathUtils.clamp(c.targetY, -bounds.halfH, bounds.halfH);
      c.velX *= FRICTION;
      c.velY *= FRICTION;
    }

    c.x = THREE.MathUtils.lerp(c.x, c.targetX, LERP);
    c.y = THREE.MathUtils.lerp(c.y, c.targetY, LERP);

    // pan the camera across the flat wall
    camera.position.x = c.x;
    camera.position.y = c.y;
    camera.position.z = CAMERA_Z;

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
        camera={{ fov: 70, near: 0.1, far: 100, position: [0, 0, CAMERA_Z] }}
      >
        <color attach="background" args={["#050506"]} />
        <fog attach="fog" args={["#050506", 12, 30]} />
        <GalleryRig {...props} />
      </Canvas>
    </div>
  );
}
