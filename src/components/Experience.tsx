"use client";

import React, { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { KeyboardControls, Sky, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import Player from "./Player";
import AAALoader from "./AAALoader";

// 1. SceneManager: Pindahkan ke dalam scope yang punya akses ke R3F Hooks
function SceneManager({ url, onReady }: { url: string; onReady: () => void }) {
  const { scene } = useGLTF(url) as GLTF;
  const { gl, camera } = useThree();
  const hasCompiled = useRef(false);
  const meshData = useRef<{ mesh: THREE.Mesh; sphere: THREE.Sphere }[]>([]);
  
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    if (!scene) return;

    const list: any[] = [];
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.matrixAutoUpdate = false;
        m.updateMatrixWorld();
        
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const sphere = new THREE.Sphere();
        if (m.geometry.boundingSphere) {
          sphere.copy(m.geometry.boundingSphere).applyMatrix4(m.matrixWorld);
        }
        list.push({ mesh: m, sphere });
      }
    });
    meshData.current = list;

    // 2. Conditional gl.compile (Optimasi GPU)
    if (!hasCompiled.current) {
      gl.compile(scene, camera);
      hasCompiled.current = true;
      // 5. Trick Lighthouse: Kasih nafas 100ms sebelum render Player
      setTimeout(onReady, 100);
    }
  }, [scene, gl, camera, onReady]);

  useFrame(() => {
    if (meshData.current.length === 0) return;
    
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    const pPos = camera.position;

    for (let i = 0; i < meshData.current.length; i++) {
      const { mesh, sphere } = meshData.current[i];
      const distSq = sphere.center.distanceToSquared(pPos);
      
      if (distSq > 120 * 120) { mesh.visible = false; continue; }
      if (!frustum.intersectsSphere(sphere)) { mesh.visible = false; continue; }
      if (distSq > 50 * 50 && sphere.radius < 1) { mesh.visible = false; continue; }

      mesh.visible = true;
    }
  });

  return <primitive object={scene} />;
}

export default function Experience() {
  const [isGameReady, setIsGameReady] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const joystickRef = useRef({ x: 0, y: 0, active: false });

  // 3. WebGL Guard
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const support = !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    if (!support) setWebGLSupported(false);
  }, []);

  if (!webGLSupported) return <div className="p-10 text-white">Browser not supported.</div>;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#050505", position: "relative" }}>
      
      <AAALoader isGameReady={isGameReady} />

      {/* JOYSTICK UI */}
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
          gl={{ powerPreference: "high-performance", antialias: false, stencil: false, depth: true }}
          onCreated={({ scene }) => { scene.fog = new THREE.Fog("#050505", 20, 100); }}
        >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />

          {/* 4. Suspense Fallback (Tetap render AAALoader saat loading) */}
          <Suspense fallback={null}>
            <SceneManager 
                url="/Untitled.glb" 
                onReady={() => setIsGameReady(true)} 
            />
            {/* Hanya render Player jika SceneManager sudah siap */}
            {isGameReady && <Player joystickRef={joystickRef} />}
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}