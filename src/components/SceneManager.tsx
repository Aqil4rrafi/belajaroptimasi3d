"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

interface MeshData {
  mesh: THREE.Mesh;
  sphere: THREE.Sphere;
}

export default function SceneManager({ url, onReady }: { url: string; onReady: () => void }) {
  const gltf = useGLTF(url) as GLTF;
  const { scene } = gltf;
  const { gl, camera } = useThree();
  
  const meshData = useRef<MeshData[]>([]);
  const hasCompiled = useRef(false); // 1. Guard untuk conditional compile
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    if (!scene) return;

    // WebGL Guard Check (Internal Three.js check)
    if (!gl.getContext()) {
      console.error("WebGL not supported");
      return;
    }

    const list: MeshData[] = [];
    scene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.matrixAutoUpdate = false;
        m.updateMatrixWorld();
        
        const sphere = new THREE.Sphere();
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        if (m.geometry.boundingSphere) {
          sphere.copy(m.geometry.boundingSphere).applyMatrix4(m.matrixWorld);
        }
        list.push({ mesh: m, sphere });
      }
    });

    meshData.current = list;
    
    // 1. Conditional gl.compile: Hanya jalankan jika belum pernah
    if (!hasCompiled.current) {
      gl.compile(scene, camera);
      hasCompiled.current = true;
      
      // 5. Trick Lighthouse: Delay sedikit setelah compile agar main thread bernafas
      const timeout = setTimeout(() => {
        onReady();
      }, 100); 
      return () => clearTimeout(timeout);
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