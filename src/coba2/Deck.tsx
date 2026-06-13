"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Card from "./Card";
import { CardData, PhaseState, SwipeDirection, SwipeSignal } from "./types";

interface DeckProps {
  initialCards: CardData[];
}

export default function Deck({ initialCards }: DeckProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [phase, setPhase] = useState<PhaseState>("deck");
  const [swipeSignal, setSwipeSignal] = useState<SwipeSignal | null>(null);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const handleSwipeAway = (currentIndex: number) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const swipedCard = updatedCards[currentIndex];
      if (!swipedCard) return prevCards;

      const filtered = updatedCards.filter((_, idx) => idx !== currentIndex);
      // Memindahkan kartu yang ter-swipe ke indeks 0 (paling bawah/belakang)
      return [swipedCard, ...filtered];
    });
    setSwipeSignal(null);
  };

  const triggerOpenDeck = () => {
    if (phase !== "deck") return;
    setPhase("reveal");
    setTimeout(() => {
      setPhase("swiper");
    }, 850);
  };

  const resetToDeck = () => {
    if (phase !== "swiper") return;
    setPhase("return");
    setTimeout(() => {
      setCards(initialCards);
      setPhase("deck");
    }, 850);
  };

  const triggerAutoSwipe = (direction: SwipeDirection) => {
    if (phase !== "swiper" || cards.length === 0) return;
    const frontCard = cards[cards.length - 1];
    setSwipeSignal({ cardId: frontCard.id, direction });
  };

  // RESPONSIVE BOX & CARD DIMENSIONS (Pas tanpa overflow scroll)
  const dimensionsClass =
    "w-[19.5rem] h-[28rem] sm:w-[22rem] sm:h-[31rem] md:w-[46rem] md:h-[26rem] lg:w-[56rem] lg:h-[29rem] xl:w-[65rem] xl:h-[33rem]";

  return (
    <div className="flex flex-col items-center justify-center min-h-[620px] lg:min-h-[760px] w-full relative select-none px-4">
      <div className="relative flex items-center justify-center">
        {/* AUTOMATIC NAVIGATION BUTTONS (Hanya muncul di breakpoint lg ke atas) */}
        <AnimatePresence>
          {phase === "swiper" && (
            <div className="hidden lg:block">
              {/* TOMBOL KIRI */}
              <motion.button
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onClick={() => triggerAutoSwipe("left")}
                className="absolute -left-24 top-1/2 -translate-y-1/2 z-[1000] p-4.5 rounded-full bg-slate-900/70 backdrop-blur-xl border border-amber-500/25 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] active:scale-90 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              {/* TOMBOL KANAN */}
              <motion.button
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onClick={() => triggerAutoSwipe("right")}
                className="absolute -right-24 top-1/2 -translate-y-1/2 z-[1000] p-4.5 rounded-full bg-slate-900/70 backdrop-blur-xl border border-amber-500/25 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] active:scale-90 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>

              {/* TOMBOL ATAS */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                onClick={() => triggerAutoSwipe("top")}
                className="absolute -top-20 left-1/2 -translate-x-1/2 z-[1000] p-3.5 rounded-full bg-slate-900/70 backdrop-blur-xl border border-amber-500/25 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] active:scale-90 transition-all duration-300"
              >
                <ChevronUp className="w-5 h-5" />
              </motion.button>

              {/* TOMBOL BAWAH */}
              <motion.button
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onClick={() => triggerAutoSwipe("bottom")}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 z-[1000] p-3.5 rounded-full bg-slate-900/70 backdrop-blur-xl border border-amber-500/25 text-amber-400 hover:border-amber-400 hover:text-amber-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] active:scale-90 transition-all duration-300"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* CONTAINER UTAMA KOTAK */}
        <div
          className={`relative ${dimensionsClass} flex items-center justify-center`}
        >
          {/* GLASSMORPHISM BOX DECK */}
          <motion.div
            onClick={triggerOpenDeck}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: phase === "swiper" ? 0 : phase === "reveal" ? 0 : 1,
              scale: phase === "reveal" ? 0.95 : 1,
              y: phase === "reveal" ? 20 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={phase === "deck" ? { scale: 1.012 } : undefined}
            whileTap={phase === "deck" ? { scale: 0.988 } : undefined}
            className={`absolute inset-0 bg-slate-950/65 backdrop-blur-2xl rounded-3xl shadow-[0_35px_75px_rgba(0,0,0,0.75)] border-2 border-amber-500/20 p-8 z-[101] flex flex-col items-center justify-center ${
              phase === "deck" ? "cursor-pointer group" : "pointer-events-none"
            }`}
            style={{ visibility: phase === "swiper" ? "hidden" : "visible" }}
          >
            {/* TENTANG FLAP GRADIENT EMAS */}
            <motion.div
              initial={{ rotateX: 0, y: 0 }}
              animate={
                phase === "reveal"
                  ? { rotateX: -120, y: -45, opacity: 0 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-t-3xl origin-top border-b border-amber-400/30 shadow-md flex items-center justify-center z-[102]"
            >
              <div className="w-12 h-1.5 bg-amber-200/40 rounded-full" />
            </motion.div>

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                animate={phase === "deck" ? { y: [0, -6, 0] } : {}}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="text-amber-400 mb-4 group-hover:text-amber-300 transition-colors"
              >
                <Layers className="w-12 h-12 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
              </motion.div>
              <h2 className="text-xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                Buka Kotak Kartu
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-medium max-w-[200px] leading-relaxed">
                Kartu pelayanan kesehatan akan terbuka secara sinematik
              </p>
            </div>
          </motion.div>

          {/* RENDERING ANTARMUKA KARTU KAMPUS */}
          {cards.map((card, index) => (
            <Card
              key={card.id}
              data={card}
              index={index}
              totalCards={cards.length}
              phase={phase}
              onSwipeAway={handleSwipeAway}
              dimensionsClass={dimensionsClass}
              swipeSignal={swipeSignal}
            />
          ))}
        </div>
      </div>

      {/* RE-INSERT TRIGGER ACCENT */}
      <AnimatePresence>
        {phase === "swiper" && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={resetToDeck}
            className="mt-28 lg:mt-24 flex items-center gap-2 bg-slate-950/90 hover:bg-slate-900 text-amber-400 px-6 py-3 rounded-xl text-xs font-bold tracking-wider shadow-2xl border border-amber-500/30 backdrop-blur-md active:scale-95 transition-all z-[999]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            MASUKKAN KEMBALI KE KOTAK
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
