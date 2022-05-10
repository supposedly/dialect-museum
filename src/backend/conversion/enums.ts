import {Union} from "ts-toolbelt";

type DISTRIBUTE = any;

type Trim<S extends string> = S extends ` ${infer Sub} ` | `${infer Sub} ` | ` ${infer Sub}` ? Trim<Sub> : S;
type Join<Name extends string, Value extends string> = `` extends Name ? Value : `${Name}:${Value}`;
type Entry<Name extends string, Line extends string> =
  Line extends `${infer Key}=${infer Value}`
    ? Record<Trim<Key>, Join<Name, Trim<Value>>>
    : Record<Line, Join<Name, Line>>;

export type Enum<Name extends string, S extends string> =
  S extends `${' ' | '\n'}${infer Sub}` | `${infer Sub}${' ' | '\n'}`
    ? Enum<Name, Sub>
    : S extends `${infer A}\n${infer B}`
      ? Union.Merge<Entry<Name, A> | Enum<Name, B>>
      : `` extends S
        ? {}
        : Entry<Name, S>;

export type EnumOf<Name extends string, Keys extends string> = Union.Merge<
  Keys extends DISTRIBUTE ? Enum<Name, Keys> : never
>;

export type Of<O> = O[keyof O];

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
