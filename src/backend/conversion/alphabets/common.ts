/* all hope abandon ye who enter here */
// btw half of this file needs to be moved into underlying.ts because it's not actually "common"
// bc each alphabet needs to have its own concepts (eg no guarantee that a higher alphabet will
// have consonants, vowels, suffixes, whatevers)

import {Function as Func, Union} from "ts-toolbelt";

type $<T> = Func.Narrow<T>;

export type Widen<T> =
  T extends boolean ? boolean
  : T extends number ? number
  : T extends string ? string
  : T;
export type OrElse<T, Default> = T extends Widen<Default> ? T : Default;
export type FillDefaults<Values, Types> = {
  // Below, I'm using the ? modifier as a hacky shorthand for "widen this type if
  // I haven't been given anything to fill it in with"
  // so for example `emphatic?: false` means "Default to `false` if I've been
  // given a set of features and `emphatic` isn't in there, but if I haven't,
  // default to `Widen<false>` == `boolean`"
  // Whereas `articulator: Of<Articulator>` ONLY means "Default
  // to Of<Articulator>" and NEVER widens to string because I
  // haven't introduced it with `articulator?:`
  // This will probably fall apart and I'll have to come up with an actual
  // readable way to indicate "widen this in such-and-such case" or "don't widen
  // this in such-and-such case" but it's cool for now
  // --
  // `undefined extends Types[K]` means Types[K] has the question mark
  [K in keyof Types]-?: [unknown, undefined] extends [Values, Types[K]]
    // I don't have to Widen<Exclude<Types[K], undefined>> here because the
    // conditional type in Widen<...> will automatically distribute & handle the
    // actual thing and the `undefined` separately
    // And then the `undefined` will be discarded anyway because see below
    ? Widen<Types[K]>
    // I don't have to `Exclude<..., undefined>` here because the `-?` above automatically
    // does that if the original key was written with `?`
    : K extends keyof Values ? OrElse<Values[K], Types[K]> : Types[K]
};

export interface Base<T extends string = string, V = unknown> {
  type: T
  value: V
}

export type ProtoAlphabet<T> = {
  [K in keyof T]: Record<string, T[K]>
};

export type Alphabet<T extends Record<string, any>, Types> = {abc: Union.Merge<T[keyof T]>, __types: Set<Types>};
export type AnyAlphabet = {abc: Record<string, Base>, __types: Set<string>};
export type ABC<A extends AnyAlphabet> = A[`abc`];
export type Types<A extends AnyAlphabet> = A[`__types`] extends Set<infer U> ? U extends string ? U : never : never;

// I use this because I need to pass the runtime and compiler/type system
// slightly different info
// For example, in underlying.ts, I coerce a key-to-strings enum into a
// keys-to-interfaces type so that the type system can use those interfaces
// and newAlphabet() can just use the keys
export function cheat<T>(o: Record<keyof T, any>): T {
  return <T> o;
}

// In the future: Add a third parameter to this, after `type`, that's something like a list of accent features
export function newAlphabet<A, T extends ProtoAlphabet<A>>(type: A, o: $<T>): Alphabet<$<T>, keyof A> {
  return {
    __types: new Set(Object.keys(type)),
    abc: Object.fromEntries(Object.values(o).flatMap(group => Object.entries(group as any))),
  } as any;
}
