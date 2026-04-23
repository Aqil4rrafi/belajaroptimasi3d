"use client";
import * as THREE from "three";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, OrbitControls } from "@react-three/drei";

interface PlayerProps {
  joystick: { x: number; y: number; active: boolean };
}

const Player = forwardRef<THREE.Mesh, PlayerProps>(({ joystick }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  useImperativeHandle(ref, () => meshRef.current!);

  // Variabel persisten agar tidak membuat objek baru setiap frame (GC optimization)
  const moveDir = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const side = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  useFrame((_state, delta) => {
    if (!meshRef.current || !orbitRef.current) return;

    const keys = getKeys();
    const speed = 10;

    // 1. Ambil Input (Keyboard vs Joystick)
    let inputX = 0;
    let inputZ = 0;

    if (joystick.active) {
      inputX = joystick.x; 
      inputZ = joystick.y; 
    } else {
      inputX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      inputZ = (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0);
    }

    // 2. Hitung Arah Berdasarkan Rotasi Kamera
    camera.getWorldDirection(forward);
    forward.y = 0; // Kunci sumbu Y agar tidak terbang
    forward.normalize();

    // Side = arah kanan relatif terhadap kamera
    side.crossVectors(forward, up).normalize();

    // 3. Kalkulasi Vektor Gerak Akhir
    // -inputZ karena joystick ke atas adalah negatif, dikali forward (depan) = MAJU
    moveDir
      .set(0, 0, 0)
      .addScaledVector(forward, -inputZ)
      .addScaledVector(side, inputX)
      .normalize()
      .multiplyScalar(speed * delta);

    // 4. Eksekusi Gerakan
    meshRef.current.position.add(moveDir);
    camera.position.add(moveDir);

    // 5. Update Fokus Kamera (Orbit Target)
    const targetPos = meshRef.current.position.clone();
    targetPos.y += 1.6; // Tinggi mata player
    orbitRef.current.target.copy(targetPos);
    orbitRef.current.update();
  });

  return (
    <>
      <OrbitControls ref={orbitRef} enablePan={false} enableDamping={false} makeDefault />
      <mesh ref={meshRef} position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color="orange" transparent opacity={0.6} />
      </mesh>
    </>
  );
});

Player.displayName = "Player";
export default Player;