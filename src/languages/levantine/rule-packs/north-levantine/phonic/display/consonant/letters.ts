import ruleset from './ruleset';

export const h = ruleset(
  {
    spec: {
      features: {
        location: `glottis`,
        articulator: `throat`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `h`}, context: {capitalized: false}}],
  }
);

export const hEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `glottis`,
        articulator: `throat`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `h\u0323`}, context: {capitalized: false}}],
  }
);

export const $ = ruleset(
  {
    spec: {
      features: {
        location: `glottis`,
        articulator: `throat`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʔ`}, context: {capitalized: false}}],
  }
);

export const $Emphatic = ruleset(
  {
    spec: {
      features: {
        location: `glottis`,
        articulator: `throat`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʔ\u0323`}, context: {capitalized: false}}],
  }
);

export const x = ruleset(
  {
    spec: {
      features: {
        location: `pharynx`,
        articulator: `throat`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ħ`}, context: {capitalized: false}}],
  }
);

export const xEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `pharynx`,
        articulator: `throat`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ħ\u0323`}, context: {capitalized: false}}],
  }
);

export const c = ruleset(
  {
    spec: {
      features: {
        location: `pharynx`,
        articulator: `throat`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʕ`}, context: {capitalized: false}}],
  }
);

export const cEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `pharynx`,
        articulator: `throat`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʕ\u0323`}, context: {capitalized: false}}],
  }
);

export const kh = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `x`}, context: {capitalized: false}}],
  }
);

export const khEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `x\u0323`}, context: {capitalized: false}}],
  }
);

export const gh = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʁ`}, context: {capitalized: false}}],
  }
);

export const ghEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʁ\u0323`}, context: {capitalized: false}}],
  }
);

export const q = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `q`}, context: {capitalized: false}}],
  }
);

export const qEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `uvula`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `q\u0323`}, context: {capitalized: false}}],
  }
);

export const k = ruleset(
  {
    spec: {
      features: {
        location: `velum`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `k`}, context: {capitalized: false}}],
  }
);

export const kEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `velum`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `k\u0323`}, context: {capitalized: false}}],
  }
);

export const g = ruleset(
  {
    spec: {
      features: {
        location: `velum`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `g`}, context: {capitalized: false}}],
  }
);

export const gEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `velum`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `g\u0323`}, context: {capitalized: false}}],
  }
);

export const y = ruleset(
  {
    spec: {
      features: {
        location: `palate`,
        articulator: `tongue`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `j`}, context: {capitalized: false}}],
  }
);

export const yEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `palate`,
        articulator: `tongue`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `j\u0323`}, context: {capitalized: false}}],
  }
);

export const sh = ruleset(
  {
    spec: {
      features: {
        location: `bridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʃ`}, context: {capitalized: false}}],
  }
);

export const shEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `bridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʃ\u0323`}, context: {capitalized: false}}],
  }
);

export const j = ruleset(
  {
    spec: {
      features: {
        location: `bridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʒ`}, context: {capitalized: false}}],
  }
);

export const jEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `bridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ʒ\u0323`}, context: {capitalized: false}}],
  }
);

export const r = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `flap`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `r`}, context: {capitalized: false}}],
  }
);

export const rEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `flap`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `r\u0323`}, context: {capitalized: false}}],
  }
);

export const l = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: true,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `l`}, context: {capitalized: false}}],
  }
);

export const lEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: true,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `l\u0323`}, context: {capitalized: false}}],
  }
);

export const s = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `s`}, context: {capitalized: false}}],
  }
);

export const sEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `s\u0323`}, context: {capitalized: false}}],
  }
);

export const Z = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `Z`}, context: {capitalized: false}}],
  }
);

export const ZEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `Z\u0323`}, context: {capitalized: false}}],
  }
);

export const z = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `z`}, context: {capitalized: false}}],
  }
);

export const zEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `z\u0323`}, context: {capitalized: false}}],
  }
);

export const n = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: true,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `n`}, context: {capitalized: false}}],
  }
);

export const nEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: true,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `n\u0323`}, context: {capitalized: false}}],
  }
);

export const t = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `t`}, context: {capitalized: false}}],
  }
);

export const tEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `t\u0323`}, context: {capitalized: false}}],
  }
);

export const d = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `d`}, context: {capitalized: false}}],
  }
);

export const dEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `ridge`,
        articulator: `tongue`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `d\u0323`}, context: {capitalized: false}}],
  }
);

export const th = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `θ`}, context: {capitalized: false}}],
  }
);

export const thEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `θ\u0323`}, context: {capitalized: false}}],
  }
);

export const dh = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ð`}, context: {capitalized: false}}],
  }
);

export const dhEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `tongue`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `ð\u0323`}, context: {capitalized: false}}],
  }
);

export const f = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `lips`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `f`}, context: {capitalized: false}}],
  }
);

export const fEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `lips`,
        manner: `fricative`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `f\u0323`}, context: {capitalized: false}}],
  }
);

export const v = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `lips`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `v`}, context: {capitalized: false}}],
  }
);

export const vEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `teeth`,
        articulator: `lips`,
        manner: `fricative`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `v\u0323`}, context: {capitalized: false}}],
  }
);

export const w = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `w`}, context: {capitalized: false}}],
  }
);

export const wEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `approximant`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `w\u0323`}, context: {capitalized: false}}],
  }
);

export const m = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: true,
        nasal: true,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `m`}, context: {capitalized: false}}],
  }
);

export const mEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: true,
        nasal: true,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `m\u0323`}, context: {capitalized: false}}],
  }
);

export const b = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `b`}, context: {capitalized: false}}],
  }
);

export const bEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: true,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `b\u0323`}, context: {capitalized: false}}],
  }
);

export const p = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: false,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `p`}, context: {capitalized: false}}],
  }
);

export const pEmphatic = ruleset(
  {
    spec: {
      features: {
        location: `lips`,
        articulator: `lips`,
        manner: `stop`,
        voiced: false,
        nasal: false,
        lateral: false,
        emphatic: true,
      },
    },
    env: {},
  },
  {
    default: [{type: `literal`, features: {value: `p\u0323`}, context: {capitalized: false}}],
  }
);
