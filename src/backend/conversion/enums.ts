/*
This file defines an enum that maps keys to unique-ish strings
That's better to me than TypeScript's enums, which map strings to
numbers (not even symbols!) and offer no way to enforce that an
actual member of the desired enum is being used
This file's enums are understood to the type system as value types,
but they're also ordered by default by inserting a character with some
specific codepoint at the start (unbeknownst to the type systems) --
so unless you set `ordered` to `false` when using toEnum(), you CAN'T
compare enum members to the raw strings they appear to be
Also, because of ordering, be careful (at least IMHO) to only use extend()
if shared entries will also share indices in each extending enum
*/

import {MergeUnion} from "./utils/typetools";

const SPACE = 0x20;  // char code of space
const SPECIAL = `  `;
const MAKE_SPECIAL = (s: string) => `${SPECIAL}${s.toUpperCase()}`;
const LAST = MAKE_SPECIAL(`LAST`);
const NOT_SPECIAL = ([k, _]: [string, string]) => !k.startsWith(SPECIAL);
const IS_SPECIAL = (k: string) => k.startsWith(SPECIAL);  // very consistency

type DISTRIBUTE = any;
type WS = `\n  ` | ` ` | `  ` | `\n`;
type LB = '\n' | '\n ' | '\n  ';

enum Order {
  Before,
  After,
}

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
export type Enum<Name extends string, S extends string> = MergeUnion<_Enum<Name, S>>;
export type EnumType = Record<string, string>;

export type EnumOf<Name extends string, Keys extends string> = MergeUnion<
  Keys extends DISTRIBUTE ? Enum<Name, Keys> : never
>;

export type Of<O> = O[keyof O];

type NameOf<E> = E[keyof E] extends `${infer Name}:${infer _}` ? Name : ``;
type ValueOf<V> = V extends `${infer _}:${infer Value}` ? Value : V;
type WithName<E extends EnumType, Name extends string> = {
  [K in keyof E]: Join<Name, ValueOf<E[K]>>
};

function join(name: string, value: string, idx?: number | false, normalize: boolean = true): string {
  const joined = name.length ? `${name}:${value}` : value;
  if (idx || idx === 0) {
    return `${String.fromCharCode(idx + +(normalize && idx >= SPACE))} ${joined}`;
  }
  return joined;
}

export function enumerate<
  Name extends string,
  S extends string,
>(name: Name, s: S, ordered: boolean = true): Enum<Name, S> {
  const o = Object.fromEntries(
    s.trim()
      .replace(/\n/g, `,`)
      .replace(/\s+/g, ``)
      .split(`,`)
      .map(
        ordered
          ? (m, idx) => {
            if (m.includes(`=`)) {
              const [key, value] = m.split(`=`);
              return [key, join(name, value, idx)];
            }
            return [m, join(name, m, idx)];
          }
          : m => {
            if (m.includes(`=`)) {
              const [key, value] = m.split(`=`);
              return [key, join(name, value)];
            }
            return [m, join(name, m)];
        },
      ),
  );

  if (ordered) {
    return {
      ...o,
      [LAST]: Object.keys(o).length,
    } as any;
  }

  return o as any;
}

function getArbitraryVal<E extends EnumType>(e: E): E[keyof E] {
  const values = Object.values(e);  // max efficiency
  if (typeof values[0] === `string`) {
    return values[0] as any;
  }
  return values[1] as any;
}

function nameOf<E extends EnumType>(e: E): NameOf<E> {
  const preColon = getArbitraryVal(e).split(`:`)[0] ?? ``;
  if (preColon.indexOf(` `) > 0) {
    return preColon.split(` `)[1] as any;
  }
  return preColon as any;
}

function rename<E extends EnumType, N extends string>(e: E, name: N): WithName<E, N> {
  return Object.fromEntries(Object.entries(e).map(
    ([k, v]) => (IS_SPECIAL(k) ? [k, v] : [k, join(name, v.split(`:`)[1] ?? v, v.charCodeAt(0), false)]),
  )) as any;
}

function size(e: EnumType): number {
  return Object.keys(e).length - +Object.prototype.hasOwnProperty.call(e, LAST);
}

function renumber<E extends EnumType>(e: E, from: number | null): E {
  const unordered = !Object.prototype.hasOwnProperty.call(e, LAST);

  // from === null means remove ordering
  if (from === null || from === undefined) {
    return unordered ? e : Object.fromEntries(
      Object.entries(e)
        .filter(NOT_SPECIAL)
        .map(([k, v]) => [k, v.slice(2)]),
    ) as any;
  }

  if (unordered) {
    throw new Error(`Can't renumber an unordered enum`);
  }

  const length = size(e);
  const offset = +e[LAST] - length + 1;
  return {
    ...Object.fromEntries(
      Object.entries(e)
        .filter(NOT_SPECIAL)
        .map(([k, v]) => [
          k,
          `${String.fromCharCode(from + v.charCodeAt(0) - offset)} ${v.slice(2)}`,
        ]),
    ),
    [LAST]: length + from,
  } as any;
}

export function merge<A extends EnumType, B extends EnumType>(a: A, b: B): MergeUnion<A | WithName<B, NameOf<A>>> {
  return {
    ...a,
    ...rename(renumber(b, a[LAST] as any), nameOf(a)),
  } as any;
}

export function extend<
  E extends EnumType,
  S extends string,
  Name extends string = NameOf<E>,
>(e: E, s: S, order: Order = Order.After): MergeUnion<Enum<Name, S> | WithName<E, Name>> {
  const extension = enumerate(nameOf(e), s);
  return (
    order === Order.After
      ? merge(e, extension)
      : merge(extension, e)
  ) as any;
}

export function index<E extends EnumType>(member: E[keyof E]): number {
  if (!member.includes(` `)) {
    throw new Error(`Unordered enum member has no index`);
  }
  return member.charCodeAt(0);
}

export const $Articulator = enumerate(`articulator`, `
  throat
  tongue
  lips
`);
export type Articulator = typeof $Articulator;

export const $Location = enumerate(`location`, `
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

export const $Manner = enumerate(`manner`, `
  approximant
  flap
  fricative
  affricate
  nasal
  plosive
`);
export type Manner = typeof $Manner;

export const $HigherWazn = enumerate(`wazn`, `
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
export type HigherWazn = typeof $HigherWazn;

export const $VerbWazn = extend($HigherWazn, `
  a
  i
  u
`, Order.Before);
export type VerbWazn = typeof $VerbWazn;

export const $PPWazn = extend($HigherWazn, `
  anyForm1
  fe3il
  fa3len
`, Order.Before);
export type PPWazn = typeof $PPWazn;

export const $TamToken = enumerate(`tam`, `
  pst
  sbjv
  ind
  imp
`);
export type TamToken = typeof $TamToken;

export const $VoiceToken = enumerate(`voice`, `
  active
  passive
`);
export type VoiceToken = typeof $VoiceToken;

// These have to be nameless because I have some stupid code that
// depends on each variant being exactly 1 character long
export const $Ps = enumerate(``, `
  first = 1
  second = 2
  third = 3
`, false);
export type Ps = typeof $Ps;

export const $Nb = enumerate(``, `
  singular = s
  dual = d
  plural = p
`, false);
export type Nb = typeof $Nb;

export const $Gn = enumerate(``, `
  masc = m
  fem = f
  common = c
`, false);
export type Gn = typeof $Gn;
