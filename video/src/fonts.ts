import { loadFont as loadSpecialElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const specialElite = loadSpecialElite();
const inter = loadInter();

export const fontFamily = {
  heading: specialElite.fontFamily,
  body: inter.fontFamily,
};
