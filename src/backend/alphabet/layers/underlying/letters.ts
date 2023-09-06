import type {ApplyMatchAsType} from "../../alphabet";
import type {underlying} from "./underlying";

export const letters = {
  consonant: {
    h: {
      location: `glottis`,
      articulator: `throat`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    $: {
      location: `glottis`,
      articulator: `throat`,
      manner: `plosive`,
      voiced: false,
      emphatic: false,
    },
    x: {
      location: `pharynx`,
      articulator: `throat`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    c: {
      location: `pharynx`,
      articulator: `throat`,
      manner: `approximant`,
      voiced: true,
      emphatic: false,
    },
    kh: {
      location: `uvula`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    gh: {
      location: `uvula`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    q: {
      location: `uvula`,
      articulator: `tongue`,
      manner: `plosive`,
      voiced: false,
      emphatic: false,
    },
    k: {
      location: `velum`,
      articulator: `tongue`,
      manner: `plosive`,
      voiced: false,
      emphatic: false,
    },
    g: {
      location: `velum`,
      articulator: `tongue`,
      manner: `plosive`,
      voiced: true,
      emphatic: false,
    },
    y: {
      location: `palate`,
      articulator: `tongue`,
      manner: `approximant`,
      voiced: true,
      emphatic: false,
    },
    sh: {
      location: `bridge`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    j: {
      location: `bridge`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    r: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `flap`,
      voiced: true,
      emphatic: false,
    },
    l: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `approximant`,  // lateral don't real
      voiced: true,
      emphatic: false,
    },
    s: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    Z: { // to be used for z <- S (i guess :/)
      location: `ridge`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    z: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    n: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `nasal`,
      voiced: true,
      emphatic: false,
    },
    t: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `plosive`,
      voiced: false,
      emphatic: false,
    },
    d: {
      location: `ridge`,
      articulator: `tongue`,
      manner: `plosive`,
      voiced: true,
      emphatic: false,
    },
    th: {
      location: `teeth`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    dh: {
      location: `teeth`,
      articulator: `tongue`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    f: {
      location: `teeth`,
      articulator: `lips`,
      manner: `fricative`,
      voiced: false,
      emphatic: false,
    },
    v: {
      location: `teeth`,
      articulator: `lips`,
      manner: `fricative`,
      voiced: true,
      emphatic: false,
    },
    w: {
      location: `lips`,
      articulator: `lips`,
      manner: `approximant`,
      voiced: true,
      emphatic: false,
    },
    m: {
      location: `lips`,
      articulator: `lips`,
      manner: `nasal`,
      voiced: true,
      emphatic: false,
    },
    b: {
      location: `lips`,
      articulator: `lips`,
      manner: `plosive`,
      voiced: true,
      emphatic: false,
    },
    p: {
      location: `lips`,
      articulator: `lips`,
      manner: `plosive`,
      voiced: false,
      emphatic: false,
    },
  },
  vowel: {
    a: {long: false, backness: `front`, height: `low`, round: false},
    aa: {long: true, backness: `front`, height: `low`, round: false},
    AA: {long: true, backness: `back`, height: `mid`, round: false},
    i: {long: false, backness: `front`, height: `high`, round: false},
    ii: {long: true, backness: `front`, height: `high`, round: false},
    u: {long: false, backness: `back`, height: `high`, round: true},
    uu: {long: true, backness: `back`, height: `high`, round: true},
    e: {long: false, backness: `front`, height: `mid`, round: false},
    ee: {long: true, backness: `front`, height: `mid`, round: false},
    o: {long: false, backness: `back`, height: `mid`, round: true},
    oo: {long: true, backness: `back`, height: `mid`, round: true},
  },
  delimiter: {},
  pronoun: {},
  suffix: {},
} as const satisfies {[K in keyof typeof underlying.types]: Record<string, ApplyMatchAsType<typeof underlying.types[K]>>};
