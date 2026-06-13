// types.ts
export interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
}

export type PhaseState = "deck" | "reveal" | "swiper" | "return";
export type SwipeDirection = "left" | "right" | "top" | "bottom";

export interface SwipeSignal {
  cardId: string;
  direction: SwipeDirection;
}
