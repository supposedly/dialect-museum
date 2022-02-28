import {Function} from "ts-toolbelt";
import { Articulator, Location, Manner, Ps as P, Gn as G, Nb as N } from "../enums";
import * as common from "./common";

function $<T>(o: Function.Narrow<T>): Function.Narrow<T> {
  return o;
}

export default common.newAlphabet({
  consonants: common.consonants({
    // FIXME: these individual entries don't have typechecking that lights up bad keys...
    h: {
      location: Location.glottis,
      articulator: Articulator.throat,
      manner: Manner.fricative,
      voiced: false,
    },
    2: {
      location: Location.glottis,
      articulator: Articulator.throat,
      manner: Manner.plosive,
      voiced: false,
    },
    7: {
      location: Location.pharynx,
      articulator: Articulator.throat,
      manner: Manner.fricative,
      voiced: false,
    },
    3: {
      location: Location.pharynx,
      articulator: Articulator.throat,
      manner: Manner.approximant,
      voiced: true,
    },
    5: {
      location: Location.uvula,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: false,
    },
    gh: {
      symbol: `9`,
      location: Location.uvula,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: true,
    },
    q: {
      location: Location.uvula,
      articulator: Articulator.tongue,
      manner: Manner.plosive,
      voiced: false,
    },
    k: {
      location: Location.velum,
      articulator: Articulator.tongue,
      manner: Manner.plosive,
      voiced: false,
    },
    g: {
      location: Location.velum,
      articulator: Articulator.tongue,
      manner: Manner.plosive,
      voiced: true,
    },
    y: {
      location: Location.palate,
      articulator: Articulator.tongue,
      manner: Manner.approximant,
      voiced: true,
      semivocalic: true,
    },
    sh: {
      symbol: `x`,
      location: Location.bridge,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: false,
    },
    j: {
      location: Location.bridge,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: true,
    },
    r: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.flap,
      voiced: true,
    },
    R: {  // the """""""emphatic""""""""" r
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.flap,
      voiced: true,
    },
    l: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.approximant,  // lateral don't real
      voiced: true,
    },
    s: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: false,
    },
    Z: { // to be used for z <- S (i guess :/)
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: true,
    },
    z: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: true,
    },
    n: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.nasal,
      voiced: true,
    },
    t: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.plosive,
      voiced: false,
    },
    d: {
      location: Location.ridge,
      articulator: Articulator.tongue,
      manner: Manner.plosive,
      voiced: true,
    },
    th: {
      symbol: `8`,
      location: Location.teeth,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: false,
    },
    dh: {
      symbol: `6`,
      location: Location.teeth,
      articulator: Articulator.tongue,
      manner: Manner.fricative,
      voiced: true,
    },
    f: {
      location: Location.teeth,
      articulator: Articulator.lips,
      manner: Manner.fricative,
      voiced: false,
    },
    v: {
      location: Location.teeth,
      articulator: Articulator.lips,
      manner: Manner.fricative,
      voiced: true,
    },
    w: {
      location: Location.lips,
      articulator: Articulator.lips,
      manner: Manner.approximant,
      voiced: true,
      semivocalic: true,
    },
    m: {
      location: Location.lips,
      articulator: Articulator.lips,
      manner: Manner.nasal,
      voiced: true,
    },
    b: {
      location: Location.lips,
      articulator: Articulator.lips,
      manner: Manner.plosive,
      voiced: true,
    },
    p: {
      location: Location.lips,
      articulator: Articulator.lips,
      manner: Manner.plosive,
      voiced: false,
    }
  }),
  vowels: common.vowels({
      a: {symbol: `a`},
      aa: {symbol: `A`},
      AA: {symbol: `&`},  // lowered aa, like in شاي
      ae: {symbol: `{`},  // (possibly supplanted by ^) 'foreign' ae, like in نان or فادي (hate xsampa for making { a reasonable way to represent this lmao)
    
      I: {symbol: `1`},  /* lax i, specifically for unstressed open syllables
                          * like null<i<a when still in the medial stage, e.g. for ppl with kitIr كتير
                          * aaand for stuff like mixYk/mixEke and mixAn (when not something like mxYk and mxAn)
                          */
      i: {symbol: `i`},  // default unspecified-tenseness i (= kasra)
      ii: {symbol: `I`},
    
      U: {symbol: `0`},  /* lax u, specifically for unstressed open syllables
                          * like l08C instead of lu8C (is that a thing?)
                          */
      u: {symbol: `u`},  // default unspecified-tenseness u (= damme)
      uu: {symbol: `U`},
    
      e: {symbol: `e`},  /* word-final for *-a, like hYdIke
                          * plus undecided on e.g. hEdIk vs hedIk (or just hYdIk?) for the short pron of هيديك
                          * .......or h1dIk lol
                          * also for loans like fetta فتا or elI" إيلي
                          */
      ee: {symbol: `E`},
    
      o: {symbol: `o`},  // motEr?
      oo: {symbol: `O`},
    
      ay: {symbol: `Y`, diphthongal: true},
      aw: {symbol: `W`, diphthongal: true}
  }),
  suffixes: common.suffixes({
    // fem suffix is its own thing bc -a vs -e vs -i variation
    c: {value: `fem`},
    // not sure if this is a good idea?
    // FemDual: {
    //   symbol: `<`,
    //   value: `fdual`
    // },
    C: {value: `fplural`},
    // dual suffix is its own thing bc -ayn/-een vs -aan variation (per Mekki 1984)
    Dual: {symbol: `=`},  // equals sign bc it's two lines
    // plural suffix is its own thing bc -iin-l- vs -in-l- variation, or stuff
    // like meshteryiin vs meshtriyyiin vs meshtriin
    Plural: {symbol: `+`},  // plus sign because plural is uhh... more
    // fossilized "dual" suffix like 3YnYn => 3Yn# and 7awAlYn => 7awAl#
    AynPlural: {
      symbol: `#`,  // kindasortamaybenot like a mix between + and = lol
      value: `ayn`,
    },
    // adverbial -an, ـًا
    An: {symbol: `@`},  // bc i needed an unused symbol that still resembles an A
    // nisbe suffix ـي
    // necessary bc it alternates between -i and -iyy-
    // (and maybe -(consonant)%= can become -yIn ~ -In instead of -iyyIn too?)
    // also bc it has effects like معمار mi3mar => معماري mi3meri
    // (still don't know how to handle """emphatic""" R...)
    Iyy: {symbol: `%`},  // ahahahaha get it
    // -ji suffix... has to be separate from $`j.Iyy` because this one contracts preceding vowels
    Jiyy: {
      symbol: `G`,  // ha
    },
    // -sh suffix (this one also contracts preceding vowels in some dialects)
    Negative: {
      symbol: `X`,  // capital X because normal sh is a lowercase x
    },
  }),
  delimiters: common.delimiters({
    Of: {  // introduces idafe pronouns
      symbol: `-`,
      value: `genitive`,
    },
    Object: {  // introduces verbs and active participles
      symbol: `.`,
    },
    PseudoSubject: {  // s`arr~3ms/s`all~3ms, badd~3ms/bidd~3ms, أوعك أصحك etc
      symbol: `~`,
      value: `pseudo-subject`,
    },
    Dative: {  // this stands for the dative L
      symbol: `|`,
    },
  }),
  modifiers: common.modifiers({
    Emphatic: {
      symbol: `*`
    },
    Stressed: {  // goes after the stressed vowel; only use if the word's stress is not automatic
      symbol: `"`,
    },
    Nasalized: {  // nasalized and, if final, stressed; 2ONrI" lOsyON kappitAN
      symbol: `N`,
    },
    // marks something as fus7a (goes into ctx i guess)
    // e.g. for me T = /t/ while T^ = /s/ (and both are interdental for someone who preserves interdentals)
    // or -I = /e/ while -I^ = /i/
    // i guess this actually supplants ae because I can do aa^ instead... might still be useful for loans like نان though?
    Fus7a: {
      symbol: `^`,
    },
  }),
  // TODO: this is a monster lol
  // gotta figure out how to generate this automatically...
  // or at least how to only have to type each combo out once...
  // or at leastest how to not have to narrow() every individual thing for the compiler to be cool :/
  pronouns: common.pronouns({
    [$(`${P.first }${G.masc  }${N.singular}`)]: $([P.first,  G.masc,   N.singular]),  // -e according to loun
    [$(`${P.first }${G.fem   }${N.singular}`)]: $([P.first,  G.fem,    N.singular]),  // -i according to loun
    [$(`${P.first }${G.common}${N.singular}`)]: $([P.first,  G.common, N.singular]),  // the normal neutral one idk
    [$(`${P.first }${G.common}${N.plural  }`)]: $([P.first,  G.common, N.plural  ]),
    [$(`${P.second}${G.masc  }${N.singular}`)]: $([P.second, G.masc,   N.singular]),
    [$(`${P.second}${G.fem   }${N.singular}`)]: $([P.second, G.fem,    N.singular]),
    [$(`${P.second}${G.masc  }${N.plural  }`)]: $([P.second, G.masc,   N.plural  ]),    // -kVm in case it exists in some southern dialect
    [$(`${P.second}${G.fem   }${N.plural  }`)]: $([P.second, G.fem,    N.plural  ]),    // ditto but -kVn
    [$(`${P.second}${G.common}${N.plural  }`)]: $([P.second, G.common, N.plural  ]),
    [$(`${P.third }${G.masc  }${N.singular}`)]: $([P.third,  G.masc,   N.singular]),
    [$(`${P.third }${G.fem   }${N.singular}`)]: $([P.third,  G.fem,    N.singular]),
    [$(`${P.third }${G.masc  }${N.plural  }`)]: $([P.third,  G.masc,   N.plural  ]),    // ditto but -(h)Vm
    [$(`${P.third }${G.fem   }${N.plural  }`)]: $([P.third,  G.fem,    N.plural  ]),    // ditto but -(h)Vn
    [$(`${P.third }${G.common}${N.plural  }`)]: $([P.third,  G.common, N.plural  ]),
  
    /* forms that don't exist */
    [$(`${P.first }${G.masc  }${N.dual    }`)]: $([P.first,  G.masc,   N.dual    ]),
    [$(`${P.first }${G.fem   }${N.dual    }`)]: $([P.first,  G.fem,    N.dual    ]),
    [$(`${P.first }${G.common}${N.dual    }`)]: $([P.first,  G.common, N.dual    ]),
    [$(`${P.first }${G.masc  }${N.plural  }`)]: $([P.first,  G.masc,   N.plural  ]),
    [$(`${P.first }${G.fem   }${N.plural  }`)]: $([P.first,  G.fem,    N.plural  ]),
    [$(`${P.second}${G.common}${N.singular}`)]: $([P.second, G.common, N.singular]),  // maybe in the future?
    [$(`${P.second}${G.masc  }${N.dual    }`)]: $([P.second, G.masc,   N.dual    ]),
    [$(`${P.second}${G.fem   }${N.dual    }`)]: $([P.second, G.fem,    N.dual    ]),
    [$(`${P.second}${G.common}${N.dual    }`)]: $([P.second, G.common, N.dual    ]),
    [$(`${P.third }${G.common}${N.singular}`)]: $([P.third,  G.common, N.singular]),  // maybe in the future?
    [$(`${P.third }${G.masc  }${N.dual    }`)]: $([P.third,  G.masc,   N.dual    ]),
    [$(`${P.third }${G.fem   }${N.dual    }`)]: $([P.third,  G.fem,    N.dual    ]),
    [$(`${P.third }${G.common}${N.dual    }`)]: $([P.third,  G.common, N.dual    ]),
  })
});
