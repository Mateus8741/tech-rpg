import { loadFont } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: serif } = loadFont("normal", { weights: ["600", "800"] });
export const { fontFamily: sans } = loadInter("normal", { weights: ["400", "600", "700"] });

export const C = {
  bg: "#0b0b16",
  card: "#14142a",
  border: "#2a2a4a",
  text: "#e2e8f0",
  muted: "#8b93b0",
  gold: "#f5c451",
  goldDark: "#b8892a",
  indigo: "#6366f1",
  violet: "#8b5cf6",
};

export const FPS = 30;
