export interface Quote {
  text: string;
  author: string;
}

/**
 * The cover quote. Pinned as its own export because the hero banner always
 * shows this one — it is the line the cover art was chosen for — while the
 * footer rotates through the whole list below.
 */
export const COVER_QUOTE: Quote = {
  text: "Emancipate yourselves from mental slavery, none but ourselves can free our minds.",
  author: "Bob Marley",
};

export const QUOTES: Quote[] = [
  COVER_QUOTE,
  {
    text: "Work is love made visible.",
    author: "Kahlil Gibran",
  },
  {
    text: "When you give up, your dreams and everything else fade away.",
    author: "Ichigo Kurosaki, Bleach",
  },
  {
    text: "A dropout will beat a genius through hard work.",
    author: "Rock Lee, Naruto",
  },
  {
    text: "If you don't take risks, you can't create a future.",
    author: "Monkey D. Luffy, One Piece",
  },
  {
    text: "A lesson without pain is meaningless, for you cannot gain something without sacrificing something else in return.",
    author: "Edward Elric, Fullmetal Alchemist",
  },
];
