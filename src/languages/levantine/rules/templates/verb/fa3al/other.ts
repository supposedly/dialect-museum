import fa3al from "./base";
import {letters} from "/languages/levantine/alphabets/underlying";
import {separateContext} from "/lib/rules";

export const other = fa3al(
  {
    spec: ({verb}) => verb((features, traits) => traits.sound),
  },
  {
    fa3al: ({features: {root, theme}}) => {
      const [$F, $3, $L] = root.map(l => separateContext(l, `affected`));
      return [
        $F,
        letters.plain.vowel.a,
        $3,
        letters.plain.vowel[theme],
        $L,
      ];
    },
  }
);
