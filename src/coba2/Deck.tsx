"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, RotateCcw } from "lucide-react";
import Card from "./Card";
import { CardData, PhaseState } from "./types";

interface DeckProps {
  initialCards: CardData[];
}

export default function Deck({ initialCards }: DeckProps) {
  const [cards, setCards] = useState<CardData[]>(initialCards);
  const [phase, setPhase] = useState<PhaseState>("deck");

  const handleSwipeAway = (currentIndex: number) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const [swipedCard] = updatedCards.splice(currentIndex, 1);
      return [swipedCard, ...updatedCards];
    });
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[700px] w-full relative select-none">
      {/* AREA UTAMA INTERAKSI (Membungkus kartu sesuai rasio laptop/HP Anda) */}
      <div className="relative w-[85vw] h-[55vh] md:w-[75vw] md:h-[33vh] max-w-md md:max-w-4xl flex items-center justify-center">
        {/* DECK BOX CONTAINER */}
        {phase !== "swiper" && (
          <motion.div
            onClick={triggerOpenDeck}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: phase === "reveal" ? 0 : 1,
              scale: phase === "reveal" ? 0.95 : 1,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={phase === "deck" ? { scale: 1.02 } : undefined}
            whileTap={phase === "deck" ? { scale: 0.98 } : undefined}
            /* PERUBAHAN UKURAN: 
              - Semula: w-64 (16rem = 256px) -> Ditambah 20% menjadi w-[19.2rem] (~307px)
              - Semula: h-80 (20rem = 320px) -> Ditambah 30% menjadi h-[26rem] (~416px)
            */
            className={`absolute w-[19.2rem] h-[26rem] bg-slate-800 rounded-3xl z-[100] shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center border border-slate-700/70 p-8 ${
              phase === "deck" ? "cursor-pointer group" : "pointer-events-none"
            }`}
          >
            {/* FLAP / TUTUP ATAS DECK BOX */}
            <motion.div
              initial={{
                rotateX: phase === "return" ? -120 : 0,
                y: phase === "return" ? -30 : 0,
              }}
              animate={
                phase === "reveal"
                  ? { rotateX: -120, y: -40, opacity: 0 }
                  : phase === "return"
                    ? { rotateX: 0, y: 0, opacity: 1 }
                    : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 20,
                delay: phase === "return" ? 0.45 : 0,
              }}
              // Mengikuti pelebaran lebar box baru
              className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-t-3xl origin-top border-b border-indigo-400/50 shadow-md flex items-center justify-center z-[102]"
            >
              <div className="w-12 h-2 bg-indigo-300 rounded-full opacity-60" />
            </motion.div>

            {/* Badan Utama Box */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 rounded-3xl border-2 border-slate-700/40 flex flex-col items-center justify-center text-white p-8 overflow-hidden">
              <motion.div
                animate={phase === "deck" ? { y: [0, -6, 0] } : {}}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="text-indigo-400 mb-4 group-hover:text-indigo-300 transition-colors"
              >
                <Layers className="w-12 h-12" />
              </motion.div>
              <h2 className="text-xl font-black tracking-wider text-slate-100 group-hover:text-white transition-colors">
                Buka Kotak Kartu
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-medium max-w-[180px] text-center leading-relaxed">
                Kartu akan mengarah ke atas secara sinematik
              </p>
            </div>
          </motion.div>
        )}

        {/* DISTRIBUSI KARTU AKTIF */}
        {cards.map((card, index) => (
          <Card
            key={card.id}
            data={card}
            index={index}
            totalCards={cards.length}
            phase={phase}
            onSwipeAway={handleSwipeAway}
          />
        ))}
      </div>

      {/* TOMBOL KEMBALI KE DECK */}
      {phase === "swiper" && (
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={resetToDeck}
          className="absolute -bottom-12 flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-xs font-bold tracking-wider shadow-xl border border-slate-700 active:scale-95 z-[999]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          MASUKKAN KEMBALI KE DECK
        </motion.button>
      )}
    </div>
  );
}
