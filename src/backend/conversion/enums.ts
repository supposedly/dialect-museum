import {Union} from "ts-toolbelt";

type DISTRIBUTE = any;
type WS = `\n  ` | ` ` | `  ` | `\n`;

type Trim<S extends string> = S extends
  | `${WS}${infer Sub}${WS}`
  | `${infer Sub}${WS}`
  | `${WS}${infer Sub}`
  ? Trim<Sub> : S;

type Join<Name extends string, Value extends string> = `` extends Name ? Value : `${Name}:${Value}`;
type Entry<Name extends string, Line extends string> =
  Line extends `${infer Key}=${infer Value}`
    ? Record<Trim<Key>, Join<Name, Trim<Value>>>
    : Record<Line, Join<Name, Line>>;

type _Enum<Name extends string, S extends string> =
  Trim<S> extends `${infer A}${'\n' | '\n ' | '\n  '}${infer B}`
    ? Entry<Name, Trim<A>> | _Enum<Name, B>
    : `` extends S
      ? {}
      : Entry<Name, Trim<S>>;
export type Enum<Name extends string, S extends string> = Union.Merge<_Enum<Name, S>>;
export type EnumType = Record<string, string>;

export type EnumOf<Name extends string, Keys extends string> = Union.Merge<
  Keys extends DISTRIBUTE ? Enum<Name, Keys> : never
>;

export type Of<O> = O[keyof O];

type NameOf<E> = E[keyof E] extends `${infer Name}:${infer _}` ? Name : ``;
type ValueOf<V> = V extends `${infer _}:${infer Value}` ? Value : V;
type WithName<E extends EnumType, Name extends string> = {
  [K in keyof E]: `${Name}${ValueOf<E[K]>}`
};

function join(name: string, value: string): string {
  return name.length ? `${name}:${value}` : value;
}

export function toEnum<Name extends string, S extends string>(name: Name, s: S): Enum<Name, S> {
  return Object.fromEntries(
    s.trim()
      .replace(/\n/g, `,`)
      .replace(/\s+/g, ``)
      .split(`,`)
      .map(m => {
        if (m.includes(`=`)) {
          const [key, value] = m.split(`=`);
          return [key, join(name, value)];
        }
        return [m, join(name, m)];
      }),
  ) as Enum<Name, S>;
}

export function merge<A extends EnumType, B extends EnumType>(a: A, b: B): Union.Merge<A | WithName<B, NameOf<A>>> {
  const arbitraryVal = Object.values(a)[0];  // max efficiency
  const name = arbitraryVal.split(`:`)[0] ?? arbitraryVal;

  return {
    ...a,
    ...Object.fromEntries(Object.entries(b).map(([k, v]) => [k, `${name}${v.split(`:`)[1]}`])),
  } as any;
}

export function extend<
  E extends EnumType,
  Name extends string,
  S extends string,
>(e: E, name: Name, s: S): Union.Merge<Enum<Name, S> | WithName<E, Name>> {
  return merge(toEnum(name, s), e) as any;
}

export const $Articulator = toEnum(`articulator`, `
  throat
  tongue
  lips
`);
export type Articulator = typeof $Articulator;

export const $Location = toEnum(`location`, `
  glottis
  pharynx
  uvula
  velum
  palate
  bridge
  ridge
  teeth
  lips
`);
export type Location = typeof $Location;

export const $Manner = toEnum(`manner`, `
  plosive
  fricative
  affricate
  approximant
  nasal
  flap
`);
export type Manner = typeof $Manner;

export const $Wazn = toEnum(`wazn`, `
  a
  i
  u
  fa33al
  tfa33al
  stfa33al
  fe3al
  tfe3al
  stfe3al
  af3al
  nfa3al
  nfi3il
  fta3al
  fti3il
  staf3al
  f3all
  fa3la2
  tfa3la2
  stfa3la2
`);
export type Wazn = typeof $Wazn;

export const $PPWazn = extend($Wazn, `ppwazn`, `
  anyForm1
  fe3il
  fa3len
`);
export type PPWazn = typeof $PPWazn;

export const $TamToken = toEnum(`tam`, `
  pst
  sbjv
  ind
  imp
`);
export type TamToken = typeof $TamToken;

export const $VoiceToken = toEnum(`voice`, `
  active
  passive
`);
export type VoiceToken = typeof $VoiceToken;

// These have to be nameless because I have some stupid code that
// depends on each variant being exactly 1 character long
export const $Ps = toEnum(``, `
  first = 1
  second = 2
  third = 3
`);
export type Ps = typeof $Ps;

export const $Nb = toEnum(``, `
  singular = s
  dual = d
  plural = p
`);
export type Nb = typeof $Nb;

export const $Gn = toEnum(``, `
  masc = m
  fem = f
  common = c
`);
export type Gn = typeof $Gn;
