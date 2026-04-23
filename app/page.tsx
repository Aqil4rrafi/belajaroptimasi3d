"use client";
import React, { Suspense, useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Sky, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import Player from "./components/Player";// Pastikan path benar
import AAALoader from "./components/AAALoader";

// Preload agar loading lebih cepat
useGLTF.preload("/Untitled.glb");

export default function Game() {
  const [isGameReady, setIsGameReady] = useState(false);
  const joystickRef = useRef({ x: 0, y: 0, active: false });

  return (
    <main style={{ width: "100vw", height: "100vh", background: "#050505", overflow: "hidden", position: "relative" }}>
      
      <AAALoader isGameReady={isGameReady} />

      {/* JOYSTICK UI (DOM Manual - Anti Lag) */}
      <div 
        style={{ 
          position: "absolute", bottom: 60, left: 60, zIndex: 100, 
          width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)", touchAction: "none" 
        }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          joystickRef.current.active = true;
        }}
        onPointerMove={(e) => {
          if (!joystickRef.current.active) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          const dist = Math.sqrt(x*x + y*y);
          joystickRef.current.x = dist > 1 ? x / dist : x;
          joystickRef.current.y = dist > 1 ? y / dist : y;
          
          const knob = document.getElementById('knob');
          if (knob) knob.style.transform = `translate(${joystickRef.current.x * 40}px, ${joystickRef.current.y * 40}px)`;
        }}
        onPointerUp={() => {
          joystickRef.current = { x: 0, y: 0, active: false };
          const knob = document.getElementById('knob');
          if (knob) knob.style.transform = `translate(0,0)`;
        }}
      >
        <div id="knob" style={{
          width: 50, height: 50, borderRadius: "50%", background: "#00ff88",
          position: "absolute", top: "50%", left: "50%", marginLeft: -25, marginTop: -25,
          boxShadow: "0 0 15px #00ff88", pointerEvents: 'none', transition: 'transform 0.1s ease-out'
        }} />
      </div>

      <KeyboardControls map={[
        { name: "forward", keys: ["KeyW", "ArrowUp"] },
        { name: "backward", keys: ["KeyS", "ArrowDown"] },
        { name: "left", keys: ["KeyA", "ArrowLeft"] },
        { name: "right", keys: ["KeyD", "ArrowRight"] },
      ]}>
        <Canvas 
          shadows 
          dpr={[1, 1.5]} 
          gl={{ powerPreference: "high-performance", antialias: false }}
          onCreated={({ scene }) => { scene.fog = new THREE.Fog("#050505", 20, 100); }}
        >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />

          <Suspense fallback={null}>
            <SceneManager 
                url="/Untitled.glb" 
                onReady={() => setIsGameReady(true)} 
            />
            {isGameReady && <Player joystickRef={joystickRef} />}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </main>
  );
}

// --- SUB-KOMPONEN: SceneManager (OPTIMASI RENDER) ---
function SceneManager({ url, onReady }: { url: string, onReady: () => void }) {
  const { scene } = useGLTF(url);
  const { gl, camera } = useThree();

  const meshData = useRef<any[]>([]);
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    const list: any[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.matrixAutoUpdate = false;
        m.updateMatrixWorld();
        
        const sphere = new THREE.Sphere();
        if (m.geometry.boundingSphere) {
          sphere.copy(m.geometry.boundingSphere).applyMatrix4(m.matrixWorld);
        }
        list.push({ mesh: m, sphere });
      }
    });
    meshData.current = list;
    gl.compile(scene, camera);
    onReady();
  }, [scene, gl, camera, onReady]);

  useFrame(() => {
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    const pPos = camera.position;

    for (let i = 0; i < meshData.current.length; i++) {
      const { mesh, sphere } = meshData.current[i];
      
      const distSq = sphere.center.distanceToSquared(pPos);
      
      // 1. Distance Culling (Jauh = Hapus)
      if (distSq > 120 * 120) { mesh.visible = false; continue; }
      
      // 2. Frustum Culling (Belakang Kamera = Hapus)
      if (!frustum.intersectsSphere(sphere)) { mesh.visible = false; continue; }

      // 3. Occlusion Light (Kecil & Lumayan Jauh = Anggap Tertutup)
      if (distSq > 50 * 50 && sphere.radius < 1) { mesh.visible = false; continue; }

      mesh.visible = true;
    }
  });

  return <primitive object={scene} />;
}
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";