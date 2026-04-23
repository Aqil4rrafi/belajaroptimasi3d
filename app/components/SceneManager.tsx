// components/SceneManager.tsx
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// Definisikan tipe untuk data mesh agar TS tidak komplain
interface MeshData {
  mesh: THREE.Mesh;
  sphere: THREE.Sphere;
}

export default function SceneManager({ url, onReady }: { url: string; onReady: () => void }) {
  // Fix error: casting ke GLTF agar 'scene' terbaca
  const gltf = useGLTF(url) as GLTF;
  const { scene } = gltf;
  const { gl, camera } = useThree();

  const meshData = useRef<MeshData[]>([]);
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  useEffect(() => {
    if (!scene) return;

    const list: MeshData[] = [];
    // Fix error: tambahkan tipe data (obj: THREE.Object3D)
    scene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        
        // Optimasi: Matikan hitungan matrix otomatis untuk objek statis
        m.matrixAutoUpdate = false;
        m.updateMatrixWorld();
        
        // Buat bounding sphere untuk kalkulasi culling yang cepat
        const sphere = new THREE.Sphere();
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        
        if (m.geometry.boundingSphere) {
          sphere.copy(m.geometry.boundingSphere).applyMatrix4(m.matrixWorld);
        }
        
        list.push({ mesh: m, sphere });
      }
    });

    meshData.current = list;
    
    // Optimasi: Paksa GPU compile semua shader sebelum tampil
    gl.compile(scene, camera);
    onReady();
  }, [scene, gl, camera, onReady]);

  useFrame(() => {
    if (meshData.current.length === 0) return;

    // Update Frustum kamera setiap frame
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);
    const pPos = camera.position;

    // Loop ultra cepat melalui mesh yang sudah di-cache
    for (let i = 0; i < meshData.current.length; i++) {
      const { mesh, sphere } = meshData.current[i];
      
      const distSq = sphere.center.distanceToSquared(pPos);
      
      // 1. Distance Culling: Sembunyikan jika terlalu jauh (> 120 unit)
      if (distSq > 120 * 120) { 
        mesh.visible = false; 
        continue; 
      }
      
      // 2. Frustum Culling: Sembunyikan jika di luar sudut pandang kamera
      if (!frustum.intersectsSphere(sphere)) { 
        mesh.visible = false; 
        continue; 
      }

      // 3. Occlusion Light: Sembunyikan objek kecil yang lumayan jauh
      if (distSq > 50 * 50 && sphere.radius < 1) { 
        mesh.visible = false; 
        continue; 
      }

      // Jika lolos semua cek, tampilkan
      mesh.visible = true;
    }
  });

  return <primitive object={scene} />;
}