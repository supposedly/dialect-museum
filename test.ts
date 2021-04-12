import { parseWord as $, parseSyllable as s, parseLetter as c } from "./src/utils/conversion/transformers/utils";

const C = {type: `consonant`, meta: {}, value: `Bbbbb`};

// const Bbbb = $`m.u.s._.t ${C}a${C} ${C}a${C}`
// const Cccc = c`a`;

const Bbbb = s`b.y`

console.log(Bbbb);

// console.log(Cccc);
