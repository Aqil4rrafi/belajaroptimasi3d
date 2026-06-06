"use client";
import React, { useState, useEffect } from "react";
import Deck from "@/src/coba2/Deck";
import { CardData } from "@/src/coba2/types";

interface JSONPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Home() {
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then((response) => {
        if (!response.ok) throw new Error("Gagal terhubung ke API");
        return response.json();
      })
      .then((data: JSONPlaceholderPost[]) => {
        const formattedCards: CardData[] = data.map((item, index) => ({
          id: item.id.toString(),
          title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
          description: item.body,
          // Mengambil gambar alam/objek beresolusi HD dari Picsum Photos
          image: `https://picsum.photos/id/${index + 36}/800/600`,
        }));

        setCardsData(formattedCards);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-4 overflow-hidden antialiased">
      <div className="text-center mb-12 max-w-md px-2">
        <h1 className="text-3xl font-black text-white tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Cinematic Fluid Swiper
        </h1>
        <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed">
          Coba geser perlahan atau sentak kartu ke arah mana saja. Kartu akan
          meluncur melewati layar sebelum berputar masuk ke posisi paling
          belakang.
        </p>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs tracking-wider">
            Sinkronisasi asset API...
          </p>
        </div>
      )}

      {/* ERROR STATE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-xs font-semibold">
          Gagal Memuat: {error}
        </div>
      )}

      {/* SUCCESS STATE */}
      {!loading && !error && cardsData.length > 0 && (
        <Deck initialCards={cardsData} />
      )}
    </main>
  );
}
