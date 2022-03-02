/* all hope abandon ye who enter here */
import type {Function} from "ts-toolbelt";
import {SegType, Ps, Gn, Nb, Articulator, Location, Manner} from "../enums";

type $<T> = Function.Narrow<T>;

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
  type: SegType.suffix,
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

export type SymbolOf<K extends keyof any, T extends {[J in K]: unknown}> = T[K] extends {symbol: string} ? T[K][`symbol`] : K;
export type ValueOf<K extends keyof any, T extends {[J in K]: unknown}> = T[K] extends {value: string} ? T[K][`value`] : K;
// lowercase:
export type LowercaseSymbolOf<K extends keyof any, T extends {[J in K]: unknown}> = K extends string ? Lowercase<SymbolOf<K, T>> : SymbolOf<K, T>;
export type LowercaseValueOf<K extends keyof any, T extends {[J in K]: unknown}> = K extends string ? Lowercase<ValueOf<K, T>> : ValueOf<K, T>;

export type SymbolValueAnd<T> = {symbol?: string, value?: string} & T;
export type SymbolValueAndFeaturesOf<T, U extends string = never> = Record<
  string,
  T extends {features: Readonly<Record<string, unknown>>}
    ? SymbolValueAnd<Partial<T[`features`]>> & Pick<T[`features`], U>
    : SymbolValueAnd<{}>
>;

type BunchOfRecordsOf<U extends [string, any]> = {
  [K in U[0]]?: Record<string, U[1]>
};

// TODO: fix all this redundancy
export type AllTypes = BunchOfRecordsOf<
  | [`consonants`, Consonant]
  | [`vowels`, Vowel]
  | [`suffixes`, Suffix]
  | [`modifiers`, Modifier]
  | [`delimiters`, Delimiter]
  | [`pronouns`, Pronoun]
>;

export type Alphabet<T extends AllTypes = AllTypes> =
  & T[`consonants`]
  & T[`vowels`]
  & T[`suffixes`]
  & T[`modifiers`]
  & T[`delimiters`]
  & T[`pronouns`];

export function newAlphabet<T extends AllTypes>(o: $<T>): Alphabet<T> {
  // return o as unknown as ReturnType<typeof newAlphabet<T>>;
  return o as unknown as Alphabet<T>;
}

function force<T>(_: any): _ is T {
  return true;
}

export function consonants<
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
  // ])) as ReturnType<typeof consonants<T>>;  // this works in vscode but not in 'real' typescript...
  ])) as {[K in keyof typeof o]: Consonant<ValueOf<K, typeof o>, SymbolOf<K, typeof o>>};
}

export function vowels<
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
  // ])) as ReturnType<typeof vowels<T>>;
  ])) as {[K in keyof typeof o]: Vowel<ValueOf<K, typeof o>, SymbolOf<K, typeof o>>};
}

export function suffixes<T extends SymbolValueAndFeaturesOf<Suffix>>(
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
    } as Suffix
  // ])) as ReturnType<typeof suffixes<T>>;
  ])) as {[K in keyof typeof o]: Suffix<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>};
}

export function modifiers<T extends SymbolValueAndFeaturesOf<Modifier>> (
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
  // ])) as ReturnType<typeof modifiers<T>>;
  ])) as {[K in keyof typeof o]: Modifier<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>};
}

export function delimiters<T extends SymbolValueAndFeaturesOf<Delimiter>> (
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
  // ])) as ReturnType<typeof delimiters<T>>;
  ])) as {[K in keyof typeof o]: Delimiter<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>};
}

export function pronouns<T extends Record<`${Ps}${Gn}${Nb}`, [Ps, Gn, Nb]>>(o: $<T>): {[K in keyof T]: T[K] extends [Ps, Gn, Nb] ? Pronoun<T[K][0], T[K][2], T[K][1]> : never} {
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
  // ) as ReturnType<typeof pronouns<T>>;
  ) as {[K in keyof T]: T[K] extends [Ps, Gn, Nb] ? Pronoun<T[K][0], T[K][2], T[K][1]> : never};
}
