"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { KeyboardControls, useGLTF, Sky } from "@react-three/drei";
import { Suspense, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import Player from "./components/Player";

// --- Komponen Kota dengan Optimasi Culling ---
// --- Optimasi SmartCity ---
function SmartCity({ url, playerRef }: { url: string; playerRef: React.RefObject<THREE.Mesh | null> }) {
  const { scene } = useGLTF(url);
  
  // Reusable objects untuk menghindari Garbage Collection
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);
  const _vector = useMemo(() => new THREE.Vector3(), []);

  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // 1. Matikan matrix auto update jika objek statis
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        // 2. Pre-calculate bounding sphere untuk frustum culling lebih cepat
        if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
        list.push(mesh);
      }
    });
    return list;
  }, [scene]);

  useFrame((state) => {
    if (!playerRef.current) return;

    // Update Frustum hanya sekali per frame
    projScreenMatrix.multiplyMatrices(state.camera.projectionMatrix, state.camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    const playerPos = playerRef.current.position;
    const maxDistSq = 150 * 150;

    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      
      // Hitung jarak tanpa membuat objek Vector3 baru
      const distSq = _vector.copy(mesh.position).distanceToSquared(playerPos);
      
      // Frustum culling menggunakan bounding sphere lebih ringan daripada intersectsObject penuh
      const inFrustum = frustum.intersectsObject(mesh);
      
      const shouldBeVisible = distSq < maxDistSq && inFrustum;
      
      // Hanya update jika status berubah (mengurangi beban draw call)
      if (mesh.visible !== shouldBeVisible) {
        mesh.visible = shouldBeVisible;
      }
    }
  });

  return <primitive object={scene} />;
}

// --- Komponen Utama ---
export default function Game() {
  const playerRef = useRef<THREE.Mesh>(null);
  const [joystick, setJoystick] = useState({ x: 0, y: 0, active: false });

  // Handler Input Mobile
  const handlePointer = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setJoystick({ x, y, active: true });
  };

  return (
    <main style={{ width: "100vw", height: "100vh", background: "#111", position: "relative", touchAction: "none", overflow: "hidden" }}>
      
      {/* UI Joystick */}
      <div 
        style={{ 
          position: "absolute", bottom: 60, left: 60, zIndex: 100, 
          width: 120, height: 120, background: "rgba(255,255,255,0.1)", 
          borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)",
          touchAction: "none", userSelect: "none"
        }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointer(e);
        }}
        onPointerMove={(e) => joystick.active && handlePointer(e)}
        onPointerUp={() => setJoystick({ x: 0, y: 0, active: false })}
      >
        <div style={{
          width: 50, height: 50, background: "white", borderRadius: "50%", position: "absolute",
          top: "50%", left: "50%", pointerEvents: "none",
          transform: `translate(calc(-50% + ${joystick.x * 40}px), calc(-50% + ${joystick.y * 40}px))`
        }} />
      </div>

      <KeyboardControls map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "left", keys: ["ArrowLeft", "KeyA"] },
        { name: "right", keys: ["ArrowRight", "KeyD"] },
      ]}>
        <Canvas 
          shadows 
          dpr={[1, 1.5]} 
          camera={{ fov: 45, position: [0, 5, 10] }}
          onCreated={(s) => s.scene.fog = new THREE.Fog("#111", 50, 150)}
        >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={1.5} />
          
          <Suspense fallback={null}>
            <SmartCity url="/Untitled.glb" playerRef={playerRef} />
            <Player ref={playerRef} joystick={joystick} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </main>
  );
}