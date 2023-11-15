import ruleset from './ruleset';

export const i = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `high`,
        backness: `front`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `i`}, context: {capitalized: false}}],
  }
);

export const iStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `high`,
        backness: `front`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `i\u0301`}, context: {capitalized: false}}],
  }
);

export const iLong = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `high`,
        backness: `front`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `iː`}, context: {capitalized: false}}],
  }
);

export const iLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `high`,
        backness: `front`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `i\u0301ː`}, context: {capitalized: false}}],
  }
);

export const y = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `front`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `y`}, context: {capitalized: false}}],
  }
);

export const yStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `front`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `y\u0301`}, context: {capitalized: false}}],
  }
);

export const yLong = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `front`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `yː`}, context: {capitalized: false}}],
  }
);

export const yLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `front`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `y\u0301ː`}, context: {capitalized: false}}],
  }
);

export const u = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `u`}, context: {capitalized: false}}],
  }
);

export const uStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `u\u0301`}, context: {capitalized: false}}],
  }
);

export const uLong = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `uː`}, context: {capitalized: false}}],
  }
);

export const uLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `u\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ɪ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɪ`}, context: {capitalized: false}}],
  }
);

export const ɪStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɪ\u0301`}, context: {capitalized: false}}],
  }
);

export const ɪLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɪː`}, context: {capitalized: false}}],
  }
);

export const ɪLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɪ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ʊ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʊ`}, context: {capitalized: false}}],
  }
);

export const ʊStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʊ\u0301`}, context: {capitalized: false}}],
  }
);

export const ʊLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʊː`}, context: {capitalized: false}}],
  }
);

export const ʊLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `high`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʊ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const e = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `e`}, context: {capitalized: false}}],
  }
);

export const eStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `e\u0301`}, context: {capitalized: false}}],
  }
);

export const eLong = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `eː`}, context: {capitalized: false}}],
  }
);

export const eLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `e\u0301ː`}, context: {capitalized: false}}],
  }
);

export const o = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `o`}, context: {capitalized: false}}],
  }
);

export const oStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `o\u0301`}, context: {capitalized: false}}],
  }
);

export const oLong = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `oː`}, context: {capitalized: false}}],
  }
);

export const oLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: true,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `o\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ɛ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɛ`}, context: {capitalized: false}}],
  }
);

export const ɛStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɛ\u0301`}, context: {capitalized: false}}],
  }
);

export const ɛLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɛː`}, context: {capitalized: false}}],
  }
);

export const ɛLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `front`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɛ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ʌ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʌ`}, context: {capitalized: false}}],
  }
);

export const ʌStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʌ\u0301`}, context: {capitalized: false}}],
  }
);

export const ʌLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʌː`}, context: {capitalized: false}}],
  }
);

export const ʌLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ʌ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ɔ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɔ`}, context: {capitalized: false}}],
  }
);

export const ɔStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɔ\u0301`}, context: {capitalized: false}}],
  }
);

export const ɔLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɔː`}, context: {capitalized: false}}],
  }
);

export const ɔLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `mid`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɔ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const æ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `front`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `æ`}, context: {capitalized: false}}],
  }
);

export const æStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `front`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `æ\u0301`}, context: {capitalized: false}}],
  }
);

export const æLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `front`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `æː`}, context: {capitalized: false}}],
  }
);

export const æLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `front`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `æ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const a = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `mid`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `a`}, context: {capitalized: false}}],
  }
);

export const aStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `mid`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `a\u0301`}, context: {capitalized: false}}],
  }
);

export const aLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `mid`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `aː`}, context: {capitalized: false}}],
  }
);

export const aLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `mid`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `a\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ɑ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɑ`}, context: {capitalized: false}}],
  }
);

export const ɑStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɑ\u0301`}, context: {capitalized: false}}],
  }
);

export const ɑLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɑː`}, context: {capitalized: false}}],
  }
);

export const ɑLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `low`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɑ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ɒ = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `low`,
        backness: `back`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɒ`}, context: {capitalized: false}}],
  }
);

export const ɒStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `low`,
        backness: `back`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɒ\u0301`}, context: {capitalized: false}}],
  }
);

export const ɒLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `low`,
        backness: `back`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɒː`}, context: {capitalized: false}}],
  }
);

export const ɒLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: true,
        height: `low`,
        backness: `back`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ɒ\u0301ː`}, context: {capitalized: false}}],
  }
);

export const ə = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `mid`,
        stressed: false,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ə`}, context: {capitalized: false}}],
  }
);

export const əStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `mid`,
        stressed: true,
        long: false,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ə\u0301`}, context: {capitalized: false}}],
  }
);

export const əLong = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `mid`,
        stressed: false,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `əː`}, context: {capitalized: false}}],
  }
);

export const əLongStressed = ruleset(
  {
    spec: {
      features: {
        tense: false,
        round: false,
        height: `mid`,
        backness: `mid`,
        stressed: true,
        long: true,
      },
    },
  },
  {
    default: [{type: `literal`, features: {value: `ə\u0301ː`}, context: {capitalized: false}}],
  }
);
