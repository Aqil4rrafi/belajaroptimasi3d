// types.ts
export interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export type PhaseState = "deck" | "reveal" | "swiper" | "return";
