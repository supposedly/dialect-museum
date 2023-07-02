import {Function, Union} from "ts-toolbelt";
import {cheat, Base, newAlphabet, FillDefaults} from "../common";
import {
  Of, EnumOf, enumerate,
  Articulator, Location, Manner,
  Ps, Gn, Nb,
} from "../../enums";
import * as basic from "../basic-symbols";

export const NAME = `underlying`;
type $<T> = Function.Narrow<T>;

export type Types = {
  consonant: Consonant
  vowel: Vowel
  suffix: Suffix
  delimiter: Delimiter
  pronoun: Pronoun
};
// Not a fan of this duplication
// At least I can use EnumOf<...> to statically verify it but still :/
export const $Type: EnumOf<typeof NAME, keyof Types> = enumerate(NAME, `
  consonant
  vowel
  suffix
  delimiter
  pronoun
  boundary
  literal
`);
export type Type = typeof $Type;

export interface Segment<V, S> extends Base<Of<Type>, V> {
  type: Of<Type>
  meta?: Record<string, any>
  features?: Readonly<Record<string, any>>
  value: V
  symbol: S
}

type StringSegment<V, S> = Segment<
  V extends number ? `${V}` : V,
  S extends number ? `${S}` : S
>;

export interface Consonant<V = any, S = any, Features = any> extends StringSegment<V, S> {
  type: Type[`consonant`]
  meta: {
    weak: boolean
  }
  features: Readonly<FillDefaults<Features, {
    emphatic?: false
    semivocalic?: false
    voiced?: false
    isNull?: false
    articulator: Of<Articulator>
    location: Of<Location>
    manner: Of<Manner>
  }>>
}

export interface Vowel<V = any, S = any, Features = any> extends StringSegment<V, S> {
  type: Type[`vowel`]
  meta: {
    lengthOffset: number
    stressed: boolean
  }
  features: Readonly<FillDefaults<Features, {
    length: V extends {length: number} ? V[`length`] : number
    diphthongal?: false
    rounded?: false
    nasalized?: false
  }>>
}

export interface Suffix<V = any, S = any> extends StringSegment<V, S> {
  type: Type[`suffix`]
}

export interface Delimiter<V = any, S = any> extends StringSegment<V, S> {
  type: Type[`delimiter`]
  features?: {}
}

export interface Pronoun<
  P extends Of<Ps> = Of<Ps>,
  N extends Of<Nb> = Of<Nb>,
  G extends Of<Gn> = Of<Gn>,
> extends Segment<`${P}${G}${N}`, undefined> {
  type: Type[`pronoun`]
  features: Readonly<{
    person: P,
    number: N,
    gender: G
  }>
}

export type SymbolOf<K extends keyof any, T extends Record<K, any>> = T[K] extends {symbol: string} ? T[K][`symbol`] : K;
export type ValueOf<K extends keyof any, T extends Record<K, any>> = T[K] extends {value: string} ? T[K][`value`] : K;
// lowercase:
export type LowercaseSymbolOf<K extends keyof any, T extends Record<K, any>> = K extends string ? Lowercase<SymbolOf<K, T>> : SymbolOf<K, T>;
export type LowercaseValueOf<K extends keyof any, T extends Record<K, any>> = K extends string ? Lowercase<ValueOf<K, T>> : ValueOf<K, T>;

export type SymbolValueAnd<T> = {symbol?: string, value?: string} & T;
export type SymbolValueAndFeaturesOf<T, U extends string = never> = Record<
  string,
  T extends {features: Readonly<Record<string, any>>}
    ? SymbolValueAnd<Partial<T[`features`]>> & Pick<T[`features`], U>
    : SymbolValueAnd<{}>
>;

export function consonants<
  T extends SymbolValueAndFeaturesOf<Consonant, `articulator` | `location` | `manner`>,
>(
  o: $<T>,
): $<{[K in keyof typeof o]: Consonant<ValueOf<K, typeof o>, SymbolOf<K, typeof o>, typeof o[K]>}> {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.consonant,
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
      },
    } as Consonant,
  ])) as any;
}

export function vowels<
  T extends SymbolValueAndFeaturesOf<Vowel>,
>(
  o: $<T>,
): $<{[K in keyof typeof o]: Vowel<ValueOf<K, typeof o>, SymbolOf<K, typeof o>, typeof o[K]>}> {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [
    k,
    {
      type: $Type.vowel,
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
        rounded: v.rounded ?? false,
      },
    } as Vowel,
  ])) as any;
}

export function suffixes<T extends SymbolValueAndFeaturesOf<Suffix>>(
  o: $<T>,
): {[K in keyof typeof o]: Suffix<LowercaseValueOf<K, $<T>>, SymbolOf<K, $<T>>>} {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.suffix,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Suffix,
  ])) as any;
}

export function delimiters<T extends SymbolValueAndFeaturesOf<Delimiter>>(
  o: $<T>,
): $<{[K in keyof typeof o]: Delimiter<LowercaseValueOf<K, typeof o>, SymbolOf<K, typeof o>>}> {
  return Object.fromEntries(Object.entries(o as T).map(([k, v]) => [
    k,
    {
      type: $Type.delimiter,
      value: (v.value ?? k).toLowerCase(),
      symbol: v.symbol ?? k,
    } as Delimiter,
  ])) as any;
}

type PronounString<S> =
  S extends `${infer P extends Of<Ps>}${infer G extends Of<Gn>}${infer N extends Of<Nb>}`
    ? Pronoun<P, N, G>
    : never;
type PronounStringArray<T extends string[]> = {[K in T[Union.Select<keyof T, number>]]: PronounString<K>};

export function pronouns<T extends `${Of<Ps>}${Of<Gn>}${Of<Nb>}`[]>(p: T): PronounStringArray<T> {
  return Object.fromEntries(
    p.map(s => [s, {
        type: $Type.pronoun,
        value: s,
        /* symbol: none */
        features: {
          person: s[0],
          gender: s[1],
          number: s[2],
        },
      } as PronounString<typeof s>]),
  ) as any;
}

export default newAlphabet(
  NAME,
  cheat<Types>($Type),  // see cheat()'s function comment
  {
    consonant: consonants(basic.consonant),
    vowel: vowels(basic.vowel),
    suffix: suffixes(basic.suffix),
    delimiter: delimiters(basic.delimiter),
    pronoun: pronouns(basic.pronoun),
  },
);
