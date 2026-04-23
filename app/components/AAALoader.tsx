// AAALoader.tsx
"use client";
import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function AAALoader({ isGameReady }: { isGameReady: boolean }) {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Sembunyikan jika download 100% dan SceneManager sudah lapor "Ready"
    if (isGameReady && progress === 100) {
      const timer = setTimeout(() => {
        setOpacity(0);
        setTimeout(() => setShow(false), 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isGameReady, progress]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999, background: '#050505',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 1s ease-in-out', opacity: opacity, pointerEvents: 'none'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#00ff88', fontSize: '10px', letterSpacing: '5px', marginBottom: '15px' }}>
          LOADING SYSTEM...
        </div>
        <div style={{ width: '200px', height: '2px', background: '#111', position: 'relative' }}>
          <div style={{ 
            width: `${progress}%`, height: '100%', background: '#00ff88', 
            boxShadow: '0 0 15px #00ff88', transition: 'width 0.3s ease' 
          }} />
        </div>
        <div style={{ color: '#555', fontSize: '12px', marginTop: '10px', fontFamily: 'monospace' }}>
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}