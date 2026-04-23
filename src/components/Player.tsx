// Player.tsx
"use client";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useKeyboardControls } from "@react-three/drei";

export default function Player({ joystickRef }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();
  const [, getKeys] = useKeyboardControls();

  const physics = useMemo(() => ({
    vel: new THREE.Vector3(),
    joySmooth: new THREE.Vector2(),
    fwd: new THREE.Vector3(),
    side: new THREE.Vector3(),
  }), []);

  useFrame((_, delta) => {
    if (!meshRef.current || !orbitRef.current) return;

    const joy = joystickRef.current;
    const keys = getKeys();

    // 1. Smooth Input (Exponential Decay) - 20fps-120fps tetap mulus
    const lerpFactor = 1 - Math.exp(-20 * delta);
    physics.joySmooth.x = THREE.MathUtils.lerp(physics.joySmooth.x, joy.active ? joy.x : 0, lerpFactor);
    physics.joySmooth.y = THREE.MathUtils.lerp(physics.joySmooth.y, joy.active ? joy.y : 0, lerpFactor);

    // 2. Gabung Input
    let x = physics.joySmooth.x;
    let z = physics.joySmooth.y;
    if (!joy.active) {
      x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      z = (keys.backward ? 1 : 0) - (keys.forward ? 1 : 0);
    }

    // 3. Arah Gerak
    camera.getWorldDirection(physics.fwd);
    physics.fwd.y = 0;
    physics.fwd.normalize();
    physics.side.crossVectors(physics.fwd, new THREE.Vector3(0, 1, 0)).normalize();

    const targetVel = new THREE.Vector3()
        .addScaledVector(physics.fwd, -z)
        .addScaledVector(physics.side, x);
    
    if (targetVel.length() > 1) targetVel.normalize();
    targetVel.multiplyScalar(13); // Speed

    // 4. Smooth Physics
    physics.vel.lerp(targetVel, 1 - Math.exp(-10 * delta));

    // 5. Update Posisi
    const move = physics.vel.clone().multiplyScalar(delta);
    meshRef.current.position.add(move);
    camera.position.add(move);

    // 6. Rotate Karakter
    if (physics.vel.length() > 0.5) {
      const angle = Math.atan2(physics.vel.x, physics.vel.z);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, angle, 0.15);
    }

    // 7. Kamera Follow
    orbitRef.current.target.copy(meshRef.current.position).add(new THREE.Vector3(0, 1.6, 0));
  });

  return (
    <>
      <OrbitControls ref={orbitRef} makeDefault enableDamping dampingFactor={0.06} />
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1.2, 4, 16]} />
        <meshStandardMaterial color="#00ff88" metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}