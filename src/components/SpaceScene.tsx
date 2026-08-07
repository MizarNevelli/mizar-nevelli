// @ts-nocheck — three.js v0.185+ ships without .d.ts files
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function SpaceScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 12, 22]} />
        <SceneGroup />
      </Canvas>
    </div>
  );
}

function SceneGroup() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.03;
    const wantX = target.current.y * 0.15;
    const wantZ = target.current.x * 0.1;
    group.current.rotation.x += (wantX - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (wantZ - group.current.rotation.z) * 0.05;
  });

  return (
    <group ref={group}>
      <StarField count={2500} />
    </group>
  );
}

function StarField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random();
      if (c > 0.92) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 0.7;
      } else if (c > 0.85) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.82;
        colors[i * 3 + 2] = 1.0;
      } else {
        const w = 0.85 + Math.random() * 0.15;
        colors[i * 3] = w;
        colors[i * 3 + 1] = w;
        colors[i * 3 + 2] = w;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const mat = points.current.material as THREE.PointsMaterial;
    mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
