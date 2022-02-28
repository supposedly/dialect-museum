import type {List, Function as Func, Any, Object as Obj, Union} from "ts-toolbelt";

type $<T> = Func.Narrow<T>;

export enum Articulator {
  NULL = -1,
  throat,
  tongue,
  lips,
}

export enum Location {
  NULL = -1,
  glottis,
  pharynx,
  uvula,
  velum,
  palate,
  bridge,
  ridge,
  teeth,
  lips,
}

export enum Manner {
  NULL = -1,
  plosive,
  fricative,
  affricate,
  approximant,
  nasal,
  flap,
}

export enum SegType {
  NULL = -1,
  suffix,
  pronoun,
  augmentation,
  consonant,
  vowel,
  epenthetic,
  modifier,
  delimiter,
}

export enum Ps {
  first = 1,
  second = 2,
  third = 3
}

export enum Nb {
  singular = `s`,
  dual = `d`,
  plural = `p`
}

export enum Gn {
  masc = `m`,
  fem = `f`,
  common = `c`
}

export interface Segment<V, S> {
  type: SegType,
  meta?: Record<string, any>,
  features?: Readonly<Record<string, any>>,
  value: V,
  symbol: S
}

export interface Consonant<V = unknown, S = unknown> extends Segment<V, S> {
  type: SegType.consonant,
  meta: {
    weak: boolean,
  },
  features: Readonly<{
    emphatic: boolean,
    semivocalic: boolean,
    voiced: boolean,
    isNull: boolean
    articulator: Articulator,
    location: Location,
    manner: Manner
  }>
}

export interface Vowel<V = unknown, S = unknown> extends Segment<V, S> {
  type: SegType.vowel,
  meta: {
    lengthOffset: number,
    stressed: boolean,
  },
  features: Readonly<{
    length: V extends {length: number} ? V[`length`] : number,
    diphthongal: boolean,
    nasalized: boolean
  }>
}

export interface Suffix<V = unknown, S = unknown> extends Segment<V, S> {
  features: Readonly<{
    canContractVowels: boolean
  }>
}

export interface Modifier<V = unknown, S = unknown> extends Segment<V, S> {
  type: SegType.modifier,
  features: undefined
}

export interface Delimiter<V = unknown, S = unknown> extends Segment<V, S> {
  type: SegType.delimiter,
  features: undefined
}

export interface Pronoun<P extends Ps = Ps, N extends Nb = Nb, G extends Gn = Gn> extends Segment<`${P}${G}${N}`, undefined> {
  type: SegType.pronoun,
  features: Readonly<{
    person: P,
    number: N,
    gender: G
  }>
}

type BunchOfRecordsOf<U extends [string, any]> = {
  [K in U[0]]?: Record<string, U[1]>
};

type SymbolOf<K extends keyof any, T extends {[J in K]: unknown}> = T[K] extends {symbol: string} ? T[K][`symbol`] : K;
type ValueOf<K extends keyof any, T extends {[J in K]: unknown}> = T[K] extends {value: string} ? T[K][`value`] : K;
// lowercase:
type LowercaseSymbolOf<K extends keyof any, T extends {[J in K]: unknown}> = K extends string ? Lowercase<SymbolOf<K, T>> : SymbolOf<K, T>;
type LowercaseValueOf<K extends keyof any, T extends {[J in K]: unknown}> = K extends string ? Lowercase<ValueOf<K, T>> : ValueOf<K, T>;

type SymbolValueAnd<T> = {symbol?: string, value?: string} & T;
type SymbolValueAndFeaturesOf<T, U extends string = never> = Record<
  string,
  T extends {features: Readonly<Record<string, unknown>>}
    ? SymbolValueAnd<Partial<T[`features`]>> & Pick<T[`features`], U>
    : SymbolValueAnd<{}>
>;

// TODO: fix all this redundancy
type AllTypes = BunchOfRecordsOf<
  | [`consonants`, Consonant]
  | [`vowels`, Vowel]
  | [`suffixes`, Suffix]
  | [`modifiers`, Modifier]
  | [`delimiters`, Delimiter]
  | [`pronouns`, Pronoun]
>;

function newAlphabet<K extends AllTypes>(
  o: $<K>
): K[`consonants`] & K[`vowels`] & K[`suffixes`] & K[`modifiers`] & K[`delimiters`] & K[`pronouns`] {
  return o as unknown as ReturnType<typeof newAlphabet<K>>;
}

function n<T>(t: $<T>): $<T> {
  return t;
}

function force<T>(_: any): _ is T {
  return true;
}

function consonants<
  T extends SymbolValueAndFeaturesOf<Consonant, `articulator` | `location` | `manner`>
>(
  o: $<T>
): {[K in keyof typeof o]: Consonant<ValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  if (!force<T>(o)) {  // for type inference unfortunately
    throw new Error("a function whose one job is to return true returned false");
  }
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: SegType.consonant,
      value: v.value ?? k,
      symbol: v.symbol ?? k,
      meta: {
        weak: false,
      },
      features: {
        articulator: v.articulator,
        location: v.location,
        manner: v.manner,
        emphatic: v.emphatic ?? false,
        semivocalic: v.semivocalic ?? false,
        voiced: v.voiced ?? false,
        isNull: v.isNull ?? false,
      }
    } as Consonant
  ])) as ReturnType<typeof consonants<T>>;
}

function vowels<
  T extends SymbolValueAndFeaturesOf<Vowel>
>(
  o: $<T>
): {[K in keyof typeof o]: Vowel<ValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  if (!force<T>(o)) {  // for type inference unfortunately
    throw new Error("a function whose one job is to return true returned false");
  }
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: SegType.vowel,
      value: v.value ?? k,
      symbol: v.symbol ?? k,
      meta: {
        lengthOffset: 0, // 1 = elongated, -1 = contracted (don't think this is useful but it was already there lol)
        stressed: false,
      },
      features: {
        length: v.length ?? k.length,
        diphthongal: v.diphthongal ?? false,
        nasalized: v.nasalized ?? false,
      }
    } as Vowel
  ])) as ReturnType<typeof vowels<T>>;
}

function suffixes<T extends SymbolValueAndFeaturesOf<Suffix>>(
  o: $<T>
): {[K in keyof typeof o]: Suffix<LowercaseValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  if (!force<T>(o)) {
    throw new Error("a function whose one job is to return true returned false");
  }
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: SegType.suffix,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
      features: {
        canContractVowels: v.canContractVowels ?? false
      },
    } as Suffix
  ])) as ReturnType<typeof suffixes<T>>;
}

function modifiers<T extends SymbolValueAndFeaturesOf<Modifier>> (
  o: $<T>
): {[K in keyof typeof o]: Modifier<LowercaseValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  if (!force<T>(o)) {
    throw new Error("a function whose one job is to return true returned false");
  }
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: SegType.modifier,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Modifier
  ])) as ReturnType<typeof modifiers<T>>;
}

function delimiters<T extends SymbolValueAndFeaturesOf<Delimiter>> (
  o: $<T>
): {[K in keyof typeof o]: Delimiter<LowercaseValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  if (!force<T>(o)) {
    throw new Error("a function whose one job is to return true returned false");
  }
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: SegType.delimiter,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Delimiter
  ])) as ReturnType<typeof delimiters<T>>;
}

function pronouns<T extends Record<`${Ps}${Gn}${Nb}`, [Ps, Gn, Nb]>>(o: $<T>): {[K in keyof T]: T[K] extends [Ps, Gn, Nb] ? Pronoun<T[K][0], T[K][2], T[K][1]> : never} {
  // force() doesn't really work here, maybe because the type is more convoluted?
  return Object.fromEntries(
    Object.entries(o)
      .map(([k, v]) => [k, v] as [`${Ps}${Gn}${Nb}`, [Ps, Gn, Nb]])  // XXX: this should not be necessary
      .map(([k, v]) => [
        k,
        {
          type: SegType.pronoun,
          value: k,
          /* no symbol */
          features: {
            person: v[0],
            gender: v[1],
            number: v[2],
          }
        } as Pronoun
      ])
  ) as ReturnType<typeof pronouns<T>>;
}

const underlying = newAlphabet({
  consonants: consonants({
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
  vowels: vowels({
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
  suffixes: suffixes({
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
      features: {canContractVowels: true},
    },
    // -sh suffix (this one also contracts preceding vowels in some dialects)
    Negative: {
      symbol: `X`,  // capital X because normal sh is a lowercase x
      features: {canContractVowels: true},
    },
  }),
  delimiters: delimiters({
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
  modifiers: modifiers({
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
  pronouns: pronouns({
    [n(`${Ps.first }${Gn.masc  }${Nb.singular}`)]: n([Ps.first,  Gn.masc,   Nb.singular]),  // -e according to loun
    [n(`${Ps.first }${Gn.fem   }${Nb.singular}`)]: n([Ps.first,  Gn.fem,    Nb.singular]),  // -i according to loun
    [n(`${Ps.first }${Gn.common}${Nb.singular}`)]: n([Ps.first,  Gn.common, Nb.singular]),  // the normal neutral one idk
    [n(`${Ps.first }${Gn.common}${Nb.plural  }`)]: n([Ps.first,  Gn.common, Nb.plural]),
    [n(`${Ps.second}${Gn.masc  }${Nb.singular}`)]: n([Ps.second, Gn.masc,   Nb.singular]),
    [n(`${Ps.second}${Gn.fem   }${Nb.singular}`)]: n([Ps.second, Gn.fem,    Nb.singular]),
    [n(`${Ps.second}${Gn.masc  }${Nb.plural  }`)]: n([Ps.second, Gn.masc,   Nb.plural]),    // -kVm in case it exists in some southern dialect
    [n(`${Ps.second}${Gn.fem   }${Nb.plural  }`)]: n([Ps.second, Gn.fem,    Nb.plural]),    // ditto but -kVn
    [n(`${Ps.second}${Gn.common}${Nb.plural  }`)]: n([Ps.second, Gn.common, Nb.plural]),
    [n(`${Ps.third }${Gn.masc  }${Nb.singular}`)]: n([Ps.third,  Gn.masc,   Nb.singular]),
    [n(`${Ps.third }${Gn.fem   }${Nb.singular}`)]: n([Ps.third,  Gn.fem,    Nb.singular]),
    [n(`${Ps.third }${Gn.masc  }${Nb.plural  }`)]: n([Ps.third,  Gn.masc,   Nb.plural]),    // ditto but -(h)Vm
    [n(`${Ps.third }${Gn.fem   }${Nb.plural  }`)]: n([Ps.third,  Gn.fem,    Nb.plural]),    // ditto but -(h)Vn
    [n(`${Ps.third }${Gn.common}${Nb.plural  }`)]: n([Ps.third,  Gn.common, Nb.plural]),
  
    /* forms that don't exist */
    [n(`${Ps.first }${Gn.masc  }${Nb.dual    }`)]: n([Ps.first,  Gn.masc,   Nb.dual    ]),
    [n(`${Ps.first }${Gn.fem   }${Nb.dual    }`)]: n([Ps.first,  Gn.fem,    Nb.dual    ]),
    [n(`${Ps.first }${Gn.common}${Nb.dual    }`)]: n([Ps.first,  Gn.common, Nb.dual    ]),
    [n(`${Ps.first }${Gn.masc  }${Nb.plural  }`)]: n([Ps.first,  Gn.masc,   Nb.plural  ]),
    [n(`${Ps.first }${Gn.fem   }${Nb.plural  }`)]: n([Ps.first,  Gn.fem,    Nb.plural  ]),
    [n(`${Ps.second}${Gn.common}${Nb.singular}`)]: n([Ps.second, Gn.common, Nb.singular]),  // maybe in the future?
    [n(`${Ps.second}${Gn.masc  }${Nb.dual    }`)]: n([Ps.second, Gn.masc,   Nb.dual    ]),
    [n(`${Ps.second}${Gn.fem   }${Nb.dual    }`)]: n([Ps.second, Gn.fem,    Nb.dual    ]),
    [n(`${Ps.second}${Gn.common}${Nb.dual    }`)]: n([Ps.second, Gn.common, Nb.dual    ]),
    [n(`${Ps.third }${Gn.common}${Nb.singular}`)]: n([Ps.third,  Gn.common, Nb.singular]),  // maybe in the future?
    [n(`${Ps.third }${Gn.masc  }${Nb.dual    }`)]: n([Ps.third,  Gn.masc,    Nb.dual   ]),
    [n(`${Ps.third }${Gn.fem   }${Nb.dual    }`)]: n([Ps.third,  Gn.fem,     Nb.dual   ]),
    [n(`${Ps.third }${Gn.common}${Nb.dual    }`)]: n([Ps.third,  Gn.common,  Nb.dual   ]),
  })
});
