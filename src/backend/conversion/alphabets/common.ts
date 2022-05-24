// https://stackoverflow.com/questions/63542526/merge-discriminated-union-of-object-types-in-typescript
// I can't use ts-toolbelt's MergeUnion<> because for some reason it randomly produces `unknowns` under
import {MergeUnion, ValuesOf} from "../utils/typetools";

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

export type Alphabet<
  ProtoABC extends Record<string, Record<string, Base>>,
  Types extends Record<string, Base>,
  Name extends string,
> = {
  abc: MergeUnion<ValuesOf<ProtoABC>>
  types: Set<keyof Types>
  name: Name
  /*
  // All of the base types this alphabet was created with
  [` bases`]: ValuesOf<Types>
  */
  // To be used when validating inputs: contains all of the
  // concrete value-type instances in `abc`, AND also contains
  // base types that don't have any predecided instances in `abc`
  // (so for example the `templated` Alphabet's `exactTypes` will
  // contain specific, concrete Pronouns, but only the base types
  // for stuff like Verb or Af3al)
  [` exactTypes`]: ValuesOf<{
    [K in keyof ProtoABC & keyof Types]:
      keyof ProtoABC[K] extends never
        ? Types[K]
        : ValuesOf<ProtoABC[K]>
  }>
};
export type AnyAlphabet = {
  abc: Record<string, Base>
  types: Set<string>
  name: string
  [` exactTypes`]: Base
};
export type ABC<A extends AnyAlphabet> = A[`abc`];
export type TypeNames<A extends AnyAlphabet> = A[`types`] extends Set<infer U extends string> ? U : never;
export type _ExactTypes<A extends AnyAlphabet> = A[` exactTypes`];
export type Named<A extends AnyAlphabet, S extends TypeNames<A>> = `${A[`name`]}:${S}`;

export type ValuesOfABC<A extends AnyAlphabet> = ValuesOf<ABC<A>>;
export type AllMatching<A extends AnyAlphabet, U> = Extract<ValuesOfABC<A>, U>;
export type AllOfType<A extends AnyAlphabet, T extends TypeNames<A>> = AllMatching<A, {type: Named<A, T>}>;

// I use this when I need to pass the runtime and compiler/type system
// slightly different info
// For example, in underlying.ts, I coerce a key-to-strings enum into a
// keys-to-interfaces type so that the type system can use those interfaces
// and newAlphabet() can just use the keys
export function cheat<T>(o: Record<keyof T, any>): T {
  return o as T;
}

type ExtractPreColon<S extends string> = S extends `${infer Name}:${infer _}` ? Name : ``;

// In the future: Add a fourth parameter to this, after `type`, that's something like a list of accent features
export function newAlphabet<
  Types extends Record<string, Base>,
  Symbols extends ProtoAlphabet<Types>,
  Name extends ExtractPreColon<ValuesOf<Types>[`type`]>,
>(name: Name, type: Types, o: Symbols): Alphabet<Symbols, Types, Name> {
  return {
    name,
    types: new Set(Object.keys(type)),
    abc: Object.fromEntries(Object.values(o).flatMap(group => Object.entries(group as any))),
  } as any;
}
