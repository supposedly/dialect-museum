import {Alphabet, qualifiedPathsOf} from "../alphabet";
import {MatchAsType, MatchSchema, SafeMatchSchemaOf} from "../utils/match";
import {EnvironmentFunc, EnvironmentHelpers, SpecsFuncs, TypesFunc, TypesFuncs} from "./types/environment";
import {IntoSpec} from "./types/func";
import {Unfunc, UnfuncSpec, UnfuncTargets} from "./types/helpers";

function generateSpecFuncs<ABC extends Alphabet>(alphabet: ABC): SpecsFuncs<ABC> {
  return {
    env: {
      before(...prev) { return {env: {prev}}; },
      after(...next) {return {env: {next}}; },
    },
    types: Object.assign(
      (context: object | ((...args: unknown[]) => unknown)) => ({
        context: context instanceof Function
          ? context(qualifiedPathsOf(alphabet.context))
          : context,
      }),
      Object.fromEntries(Object.keys(alphabet.types).map(
        key => [
          key,
          (features, context) => ({
            type: key,
            features: features instanceof Function
              ? features(
                qualifiedPathsOf(alphabet.types[key] as ABC[`types`][typeof key]),
                alphabet.traits[key] as never
              )
              : features,
            context: context instanceof Function
              ? context(qualifiedPathsOf(alphabet.context))
              : context,
          }),
        ]
      )) as {[K in keyof ABC[`types`]]: TypesFunc<ABC, K>},
    ) as TypesFuncs<ABC>,
  };
}

function callSpecFunc<Spec extends object>(spec: Spec, funcs: SpecsFuncs<Alphabet>): Unfunc<Spec, `spec`> {
  if (`match` in spec && `value` in spec && Array.isArray(spec[`value`])) {
    return {
      match: spec[`match`],
      value: spec[`value`].map(v => callSpecFunc(v, funcs)),
    } as unknown as Unfunc<Spec, `spec`>;
  }
  if (spec instanceof Function) {
    return spec(funcs.types);
  }
  return {} as Unfunc<Spec, `spec`>;
}

function callEnvFunc<Env extends object>(env: Env, funcs: SpecsFuncs<Alphabet>): Unfunc<Env, `env`> {
  if (`match` in env && `value` in env && Array.isArray(env[`value`])) {
    return {
      match: env[`match`],
      value: env[`value`].map(v => callEnvFunc(v, funcs)),
    } as unknown as Unfunc<Env, `env`>;
  }
  if (env instanceof Function) {
    return env(funcs.env, funcs.types);
  }
  return {} as Unfunc<Env, `env`>;
}

function _unfuncSpec<Specs>(specs: Specs, funcs: SpecsFuncs<Alphabet>): UnfuncSpec<Specs> {
  if (specs === undefined || specs === null || typeof specs !== `object`) {
    return specs as UnfuncSpec<Specs>;
  }
  if (`match` in specs && `value` in specs && Array.isArray(specs[`value`])) {
    return {
      match: specs[`match`],
      value: specs[`value`].map(v => _unfuncSpec(v, funcs)),
    } as UnfuncSpec<Specs>;
  }
  return {
    ...(`spec` in specs ? callSpecFunc(specs.spec as object, funcs) : {}),
    ...(`env` in specs ? callEnvFunc(specs.env as object, funcs) : {}),
  } as UnfuncSpec<Specs>;
}

export function unfuncSpec<Specs, ABC extends Alphabet>(specs: Specs, alphabet: ABC): UnfuncSpec<Specs> {
  return _unfuncSpec(specs, generateSpecFuncs(alphabet) as never);
}

// export type TypesFunc<in out Source extends Alphabet, in out T extends keyof Source[`types`]> =
//   <
//     // typing V and Context as unions of (obj | func) was really hard on the compiler for some reason
//     // it would sporadically decide that only the object half of that union was valid and reject
//     // functions for not matching (maybe it had to do w/ the function's return type matching the expected
//     // obj type = common bug heuristic for "did you mean to call this expression"? not sure)
//     // anyway we can hijack inference to get around all that:
//     // (update after 1 profiling session: predictably this is slow as shit LOL)
//     const V extends (
//       // if this type has only one feature (like how some alphabets only have {value: (some symbol)}) then
//       // we can just allow that feature's value to be passed without the feature name as a key
//       _VCond<Source, T>
//       ),
//     const VF extends _TypesFuncVF<Source, T>,
//     const Context extends SafeMatchSchemaOf<Source[`context`]>,
//     const ContextF extends _TypesFuncContextF<Source>
//   >(features?: V | VF, context?: Context | ContextF) => {
//     type: T
//     // now we have to check which of V/VF, Context/ContextF was actually passed in
//     // since the funcs are invariant on Source and T it won't matter what order we
//     // do the `extends` check in, but since this order is used for covariant types
//     // we can stick with it here too
//     features: _FeaturesCond<Source, T, V, VF>
//     context: _ContextCond<Source, Context, ContextF>
//   }
// ;
