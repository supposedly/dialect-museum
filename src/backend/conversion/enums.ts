import {B, Union} from "ts-toolbelt";

const SPACE = 0x20;  // char code of space

type DISTRIBUTE = any;
type WS = `\n  ` | ` ` | `  ` | `\n`;
type LB = '\n' | '\n ' | '\n  ';

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
  Trim<S> extends `${infer A}${LB}${infer B}`
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
  [K in keyof E]: Join<Name, ValueOf<E[K]>>
};

function join(name: string, value: string, idx?: number | false): string {
  const joined = name.length ? `${name}:${value}` : value;
  if (idx || idx === 0) {
    return `${String.fromCharCode(idx + +(idx >= SPACE))} ${joined}`;
  }
  return joined;
}

export function enumize<
  Name extends string,
  S extends string,
>(name: Name, s: S, ordered: boolean = false): Enum<Name, S> {
  return Object.fromEntries(
    s.trim()
      .replace(/\n/g, `,`)
      .replace(/\s+/g, ``)
      .split(`,`)
      .map((m, idx) => {
        if (m.includes(`=`)) {
          const [key, value] = m.split(`=`);
          return [key, join(name, value, ordered && idx)];
        }
        return [m, join(name, m, ordered && idx)];
      }),
  ) as any;
}

function nameOf<E extends EnumType>(e: E): NameOf<E> {
  const arbitraryVal = Object.values(e)[0];  // max efficiency
  return (arbitraryVal.split(`:`)[0] ?? ``) as any;
}

function rename<E extends EnumType, N extends string>(e: E, name: N): WithName<E, N> {
  return Object.fromEntries(Object.entries(e).map(
    ([k, v]) => [k, join(name, v.split(`:`)[1] ?? v)],
  )) as any;
}

function size(e: EnumType): number {
  return Object.entries(e).length - +Object.prototype.hasOwnProperty.call(e, `  LAST`);
}

function renumber<E extends EnumType>(e: E, from: number | null): E {
  const unordered = !Object.prototype.hasOwnProperty.call(e, `  LAST`);

  // from === null means remove ordering
  if (from === null || from === undefined) {
    return unordered ? e : Object.fromEntries(
      Object.entries(e).map(
        ([k, v]) => [k, v.slice(2)],
      ),
    ) as any;
  }

  if (unordered) {
    throw new Error(`Can't renumber an unordered enum`);
  }

  const length = size(e);
  const offset = +e[`  LAST`] - length + 1;
  return {
    ...Object.fromEntries(Object.entries(e).map(
      ([k, v]) => [
        k,
        `${String.fromCharCode(from + v.charCodeAt(0) - offset)}${v.slice(2)}`,
      ],
    )),
    [`  LAST`]: length + from,
  } as any;
}

function _merge<A extends EnumType, B extends EnumType>(a: A, b: B): Union.Merge<A | WithName<B, NameOf<A>>> {
  return {
    ...a,
    ...rename(b, nameOf(a)),
  } as any;
}

export function merge<A extends EnumType, B extends EnumType>(a: A, b: B): Union.Merge<A | WithName<B, NameOf<A>>> {
  return _merge(a, renumber(b, a[`  LAST`] as any)) as any;
}

export function extend<
  E extends EnumType,
  Name extends string,
  S extends string,
>(e: E, s: S): Union.Merge<Enum<Name, S> | WithName<E, Name>> {
  return merge(e, enumize(nameOf(e), s)) as any;
}

export const $Articulator = enumize(`articulator`, `
  throat
  tongue
  lips
`);
export type Articulator = typeof $Articulator;

export const $Location = enumize(`location`, `
  glottis
  pharynx
  uvula
  velum
  palate
  bridge
  ridge
  teeth
  lips
`, true);
export type Location = typeof $Location;

export const $Manner = enumize(`manner`, `
  plosive
  fricative
  affricate
  approximant
  nasal
  flap
`);
export type Manner = typeof $Manner;

const $HigherWazn = enumize(`wazn`, `
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
`, true);

export const $VerbWazn = extend($HigherWazn, `
  a
  i
  u
`, true);

export const $PPWazn = extend($HigherWazn, `
  anyForm1
  fe3il
  fa3len
`, true);
export type PPWazn = typeof $PPWazn;

export const $TamToken = enumize(`tam`, `
  pst
  sbjv
  ind
  imp
`);
export type TamToken = typeof $TamToken;

export const $VoiceToken = enumize(`voice`, `
  active
  passive
`);
export type VoiceToken = typeof $VoiceToken;

// These have to be nameless because I have some stupid code that
// depends on each variant being exactly 1 character long
export const $Ps = enumize(``, `
  first = 1
  second = 2
  third = 3
`);
export type Ps = typeof $Ps;

export const $Nb = enumize(``, `
  singular = s
  dual = d
  plural = p
`);
export type Nb = typeof $Nb;

export const $Gn = enumize(``, `
  masc = m
  fem = f
  common = c
`);
export type Gn = typeof $Gn;
