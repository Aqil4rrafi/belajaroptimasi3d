"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  Variants,
} from "framer-motion";
import { ExternalLink } from "lucide-react";
import { CardData, PhaseState, SwipeSignal } from "./types";

interface CardProps {
  data: CardData;
  index: number;
  totalCards: number;
  phase: PhaseState;
  onSwipeAway: (index: number) => void;
  dimensionsClass: string;
  swipeSignal: SwipeSignal | null;
}

export default function Card({
  data,
  index,
  totalCards,
  phase,
  onSwipeAway,
  dimensionsClass,
  swipeSignal,
}: CardProps) {
  const [isSwipingOut, setIsSwipingOut] = useState(false);
  const [exitTarget, setExitTarget] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-8, 8]);
  const opacity = useTransform(
    x,
    [-300, -200, 0, 200, 300],
    [0.65, 1, 1, 1, 0.65],
  );

  const isFront = index === totalCards - 1;
  const positionFromFront = totalCards - 1 - index;

  const targetScale =
    phase === "swiper" ? Math.max(0.93, 1 - positionFromFront * 0.025) : 1;
  const targetY = phase === "swiper" ? positionFromFront * 12 : 0;

  useEffect(() => {
    if (
      phase === "swiper" &&
      isFront &&
      swipeSignal &&
      swipeSignal.cardId === data.id
    ) {
      executeSwipeAnimation(swipeSignal.direction);
    }
  }, [swipeSignal, isFront, phase, data.id]);

  const executeSwipeAnimation = (dir: "left" | "right" | "top" | "bottom") => {
    setIsSwipingOut(true);
    const force = 1100; // Didorong jauh ke luar layar agar efek perpindahan bersih
    let tx = 0,
      ty = 0;

    if (dir === "left") tx = -force;
    if (dir === "right") tx = force;
    if (dir === "top") ty = -force;
    if (dir === "bottom") ty = force;

    setExitTarget({ x: tx, y: ty });

    setTimeout(() => {
      onSwipeAway(index);
      setIsSwipingOut(false);
    }, 320); // Durasi penundaan disinkronkan presisi dengan animasi keluar tween
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_event: any, info: PanInfo) => {
    setIsDragging(false);
    if (phase !== "swiper" || !isFront) return;

    const { offset, velocity } = info;
    const dragDistance = Math.sqrt(offset.x ** 2 + offset.y ** 2);
    const dragSpeed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

    if (dragDistance > 120 || dragSpeed > 480) {
      setIsSwipingOut(true);
      const safeDistance = dragDistance === 0 ? 1 : dragDistance;
      const forceFactor = 1100;

      setExitTarget({
        x: (offset.x / safeDistance) * forceFactor,
        y: (offset.y / safeDistance) * forceFactor,
      });

      setTimeout(() => {
        onSwipeAway(index);
        setIsSwipingOut(false);
      }, 320);
    }
  };

  const cardVariants: Variants = {
    deck: {
      y: 80,
      scale: 0.2,
      opacity: 0,
      x: 0,
      transition: { type: "spring", stiffness: 220, damping: 28 },
    },
    reveal: {
      y: [-60, -230, targetY],
      scale: [0.3, 1.01, targetScale],
      opacity: [0, 1, 1],
      x: 0,
      transition: {
        type: "tween",
        duration: 0.85,
        times: [0, 0.5, 1],
        ease: "easeOut",
        delay: positionFromFront * 0.07,
      },
    },
    swiper: {
      y: targetY,
      scale: targetScale,
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 125, // Diempuk sedikit agar kartu yang kembali ke kolong belakang meluncur dengan elegan
        damping: 24,
        mass: 1.25,
      },
    },
    return: {
      y: [targetY, -150, 80],
      scale: [targetScale, 0.6, 0.1],
      opacity: [1, 0.8, 0],
      x: 0,
      transition: {
        type: "tween",
        duration: 0.55,
        times: [0, 0.4, 1],
        ease: "easeInOut",
        delay: positionFromFront * 0.04,
      },
    },
    swipeOut: {
      x: exitTarget.x,
      y: exitTarget.y,
      scale: 0.96,
      opacity: 1, // FIX ANIMASI: Tetap bernilai 1 agar kartu tampak jelas saat terbang keluar dan masuk kembali ke kolong bawah
      transition: { ease: "easeOut", duration: 0.32 },
    },
  };

  const activeAnimation = isSwipingOut ? "swipeOut" : phase;

  return (
    <motion.div
      variants={cardVariants}
      animate={activeAnimation}
      style={{
        x,
        y,
        rotate: phase === "swiper" && isFront ? rotate : 0,
        opacity: isSwipingOut ? 1 : phase === "deck" ? 0 : opacity,
        zIndex: index,
      }}
      drag={phase === "swiper" && isFront}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.65}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.005 }}
      className={`absolute ${dimensionsClass} bg-slate-900/75 backdrop-blur-2xl rounded-3xl shadow-[0_20px_55px_rgba(0,0,0,0.5)] border border-amber-500/15 overflow-hidden flex flex-col md:flex-row origin-bottom will-change-transform transform-gpu ${
        phase === "swiper" && isFront
          ? "cursor-grab active:cursor-grabbing"
          : "pointer-events-none"
      }`}
    >
      {/* SEKTOR MEDIA GAMBAR */}
      {data.image && (
        <div className="h-[28%] w-full md:h-full md:w-[38%] relative bg-slate-950/40 overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-amber-500/10">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover pointer-events-none brightness-[0.8]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/90 via-transparent to-transparent" />
        </div>
      )}

      {/* SEKTOR INFORMASI UTAMA (FIX: Tidak ada Scroll / No Overflow-Y) */}
      <div
        className={`flex-1 flex flex-col justify-between p-5 md:p-8 ${!data.image ? "pt-6" : "pt-4 md:pt-8"}`}
      >
        {/* Kontainer Teks Terkunci Rapi tanpa Scrollbar */}
        <div
          className={`flex-1 min-h-0 ${isDragging ? "pointer-events-none select-none" : "pointer-events-auto"}`}
        >
          <h3 className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-tight leading-snug mb-3">
            {data.title}
          </h3>
          <div
            className="text-xs md:text-[14px] text-slate-300 leading-relaxed space-y-2.5 font-medium antialiased selection:bg-amber-500/30"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>

        {/* INTEGRASI TOMBOL KUNJUNGAN */}
        {data.link && (
          <div className="flex justify-end items-center mt-4 pt-3 border-t border-slate-800/60 shrink-0 pointer-events-auto">
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-[11px] md:text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
            >
              Kunjungi Website
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
