import type {List, Function as Func, Any, Object as Obj, Union} from "ts-toolbelt";

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
  prefix,
  augmentation,
  consonant,
  vowel,
  epenthetic,
  modifier,
  delimiter,
}

export interface Segment<N, S> {
  type: SegType,
  meta?: {features?: Readonly<Record<string, any>>} & Record<string, any>,
  value: N,
  symbol: S
}

export interface Consonant<N = unknown, S = unknown> extends Segment<N, S> {
  type: SegType.consonant,
  meta: {
    weak: boolean,
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
}

export interface Vowel<N = unknown, S = unknown> extends Segment<N, S> {
  type: SegType.vowel,
  meta: {
    lengthOffset: number,
    features: Readonly<{
      length: number,
      diphthongal: boolean,
      nasalized: boolean
    }>
  }
}

export interface Suffix<N = unknown, S = unknown> extends Segment<N, S> {
  type: SegType.suffix,
  meta: {
    features: Readonly<{
      contractsVowels: boolean
    }>
  }
}

// TODO: fill these in, add them to newAlphabet
export interface Epenthetic<N = unknown, S = unknown> extends Segment<N, S> {}

export interface Modifier<N = unknown, S = unknown> extends Segment<N, S> {}

export interface Delimiter<N = unknown, S = unknown> extends Segment<N, S> {}

export interface Pronoun<N = unknown, S = unknown> extends Segment<N, S> {}

type BunchOfRecordsOf<U extends [string, any]> = {
  [K in U[0]]: Record<string, U[1]>
};

function newAlphabet<K extends BunchOfRecordsOf<[`consonants`, Consonant] | [`vowels`, Vowel] | [`suffixes`, Suffix]>>(
  o: Func.Narrow<K>
): typeof o extends K ? typeof o[`consonants`] & typeof o[`vowels`] & typeof o[`suffixes`] : never {
  return o as unknown as ReturnType<typeof newAlphabet<K>>;
}

type SymbolAnd<T> = {symbol?: string} & T;
type SymbolOf<K extends keyof any, T extends {[J in K]: unknown}> = T[K] extends {symbol: string} ? T[K][`symbol`] : T;

function consonants<
  K extends
    Record<string, SymbolAnd<Partial<Consonant[`meta`][`features`]>>
    & Pick<Consonant[`meta`][`features`], `articulator` | `location` | `manner`>>
>(
  o: Func.Narrow<K>
): {[J in keyof typeof o]: Consonant<J, SymbolOf<J, typeof o>>} {
  if (((o: any): o is K => true)(o)) {  // for type inference unfortunately
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [
      k,
      {
        type: SegType.consonant,
        value: k,
        symbol: v.symbol ?? k,
        meta: {
          weak: false,
          features: {
            emphatic: v.emphatic ?? false,
            semivocalic: v.semivocalic ?? false,
            voiced: v.voiced ?? false,
            isNull: v.isNull ?? false,
            articulator: v.articulator,
            location: v.location,
            manner: v.manner
          }
        }
      }
    ])) as ReturnType<typeof consonants<K>>;
  }
}

function vowels<
  K extends Record<string, SymbolAnd<Partial<Vowel[`meta`][`features`]>>>
>(
  o: Func.Narrow<K>
): {[J in keyof typeof o]: Vowel<J, SymbolOf<J, typeof o>>} {
  if (((o: any): o is K => true)(o)) {  // for type inference unfortunately
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [
      k,
      {
        type: SegType.vowel,
        meta: {
          lengthOffset: 0, // 1 = elongated, -1 = contracted (don't think this is useful but it was already there lol)
          features: {
            length: v.length ?? 1,
            diphthongal: v.diphthongal ?? false,
            nasalized: v.nasalized ?? false
          }
        }
      }
    ])) as ReturnType<typeof vowels<K>>;
  }
}

const underlying = newAlphabet({
  consonants: consonants({
    // FIXME: no typechecking for these individual entries...
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
    Z: { // to be used for z <- S
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
    },
    null: {
      symbol: `0`,
      location: Location.NULL,
      articulator: Articulator.NULL,
      manner: Manner.NULL,
      voiced: true,
      isNull: true
    },
  }),
  vowels: vowels({
    a: {symbol: `a`},
    aa: {symbol: `A`},
    AA: {symbol: `&`},  // lowered aa, like in شاي
    ae: {symbol: `{`},  // 'foreign' ae, like in نان or فادي (hate xsampa for making { a reasonable way to represent this lmao)
  
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
  suffixes: {}
});
