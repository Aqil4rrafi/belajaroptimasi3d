"use client";
import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  Variants,
} from "framer-motion";
import { CardData, PhaseState } from "./types";

interface CardProps {
  data: CardData;
  index: number;
  totalCards: number;
  phase: PhaseState;
  onSwipeAway: (index: number) => void;
}

export default function Card({
  data,
  index,
  totalCards,
  phase,
  onSwipeAway,
}: CardProps) {
  const [isSwipingOut, setIsSwipingOut] = useState(false);
  const [exitTarget, setExitTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  const opacity = useTransform(
    x,
    [-300, -200, 0, 200, 300],
    [0.5, 1, 1, 1, 0.5],
  );

  const isFront = index === totalCards - 1;
  const positionFromFront = totalCards - 1 - index;

  const targetScale = phase === "swiper" ? 1 - positionFromFront * 0.03 : 1;
  const targetY = phase === "swiper" ? positionFromFront * 12 : 0;

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (phase !== "swiper") return;

    const { offset, velocity } = info;
    const dragDistance = Math.sqrt(offset.x ** 2 + offset.y ** 2);
    const dragSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

    if (dragDistance > 100 || dragSpeed > 500) {
      setIsSwipingOut(true);
      const safeDistance = dragDistance === 0 ? 1 : dragDistance;
      const pushFactor = 1000;

      setExitTarget({
        x: (offset.x / safeDistance) * pushFactor,
        y: (offset.y / safeDistance) * pushFactor,
      });

      setTimeout(() => {
        onSwipeAway(index);
        setIsSwipingOut(false);
        x.set(0);
        y.set(0);
      }, 450);
    }
  };

  // SOLUSI MUTLAK: Mendefinisikan struktur animasi menggunakan tipe Variants bawaan Framer Motion
  const cardVariants: Variants = {
    deck: {
      y: 60,
      scale: 0.3,
      opacity: 0,
      x: 0,
      transition: { type: "spring", stiffness: 180, damping: 26 },
    },
    reveal: {
      y: [-40, -320, 0],
      scale: [0.4, 1.02, 1],
      opacity: [0, 1, 1],
      x: 0,
      transition: {
        type: "tween",
        duration: 0.8,
        times: [0, 0.4, 1],
        ease: "easeOut",
        delay: positionFromFront * 0.06,
      },
    },
    swiper: {
      y: targetY,
      scale: targetScale,
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 180, damping: 26, mass: 0.9 },
    },
    return: {
      y: [targetY, -240, 60],
      scale: [targetScale, 0.65, 0.2],
      opacity: [1, 0.9, 0],
      x: 0,
      transition: {
        type: "tween",
        duration: 0.65,
        times: [0, 0.35, 1],
        ease: "easeInOut",
        delay: positionFromFront * 0.05,
      },
    },
    swipeOut: {
      x: exitTarget.x,
      y: exitTarget.y,
      scale: 0.9,
      opacity: 0,
      transition: { type: "spring", stiffness: 120, damping: 25, mass: 1 },
    },
  };

  // Menentukan string target aktif untuk variants
  const activeAnimation = isSwipingOut ? "swipeOut" : phase;

  return (
    <motion.div
      variants={cardVariants}
      animate={activeAnimation}
      style={{
        x,
        y,
        rotate: phase === "swiper" ? rotate : 0,
        opacity: isSwipingOut ? 0 : phase === "deck" ? 0 : opacity,
        zIndex: index,
        cursor: phase === "swiper" && isFront ? "grab" : "default",
      }}
      drag={phase === "swiper" && isFront}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.01 }}
      className="absolute w-[85vw] h-[55vh] md:w-[75vw] md:h-[33vh] max-w-md md:max-w-4xl bg-white rounded-3xl shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden select-none flex flex-col md:flex-row origin-bottom will-change-transform transform-gpu"
    >
      {data.image ? (
        <>
          <div className="h-[45%] w-full md:h-full md:w-[40%] relative bg-slate-50 overflow-hidden shrink-0">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/5 to-transparent" />
          </div>
          <div className="h-[55%] w-full md:h-full md:w-[60%] flex flex-col justify-between p-6 md:p-8 bg-white shrink-0">
            <div className="h-[60%] flex items-center">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 line-clamp-2 md:line-clamp-3 leading-tight tracking-tight">
                {data.title}
              </h3>
            </div>
            <div className="h-[40%] flex items-start border-t border-slate-100 pt-4">
              <p className="text-xs md:text-sm text-slate-500 line-clamp-3 md:line-clamp-4 leading-relaxed">
                {data.description}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-between p-8 md:p-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 relative">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-purple-600" />
          <div className="h-[40%] flex items-center">
            <h3 className="text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-900 line-clamp-2 md:line-clamp-3 leading-tight tracking-tight">
              {data.title}
            </h3>
          </div>
          <div className="h-[60%] flex items-start border-t border-slate-100 pt-5 md:pt-6">
            <p className="text-sm md:text-base text-slate-600 line-clamp-5 md:line-clamp-6 leading-relaxed font-medium">
              {data.description}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
