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
        if (!response.ok)
          throw new Error("Gagal mengambil data open-source API");
        return response.json();
      })
      .then((data: JSONPlaceholderPost[]) => {
        const formattedCards: CardData[] = data.map((item, index) => {
          // REQ 3: Mengondisikan kartu ganjil memiliki foto, kartu genap tanpa foto
          const hasImage = index % 2 === 0;

          return {
            id: item.id.toString(),
            title: item.title.charAt(0).toUpperCase() + item.title.slice(1),
            description: item.body,
            image: hasImage
              ? `https://picsum.photos/id/${index + 42}/900/600`
              : undefined,
          };
        });

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
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black flex flex-col items-center justify-center p-4 overflow-hidden antialiased">
      {loading && (
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-xs tracking-wider">
            Membuat enkapsulasi data...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-2xl text-xs font-semibold">
          Error: {error}
        </div>
      )}

      {!loading && !error && cardsData.length > 0 && (
        <Deck initialCards={cardsData} />
      )}
    </main>
  );
}
