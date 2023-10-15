import {Alphabet, qualifiedPathsOf} from "../alphabet";
import {MatchAsType, MatchSchema, SafeMatchSchemaOf} from "../utils/match";
import {ValuesOf} from "../utils/typetools";
import {EnvironmentFunc, EnvironmentHelpers, SpecsFuncs, TypesFunc, TypesFuncs} from "./types/environment";
import {IntoSpec, SpecOperations} from "./types/func";
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

export function operations<
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
>(
  source: Source,
  target: Target,
  dependencies: Dependencies
): SpecOperations<Source, Target, Dependencies> {
  return {
    mock: Object.assign(
      ((...specs) => ({operation: `mock`, argument: specs})) as SpecOperations<Source, Target, Dependencies>[`mock`],
      {
        was: Object.fromEntries(
          dependencies.map(abc => [
            abc.name,
            ((...specs: ReadonlyArray<unknown>) => specs),
          ])
        ),
      }
    ),
    preject: (...specs) => <never>{operation: `preject`, argument: specs},
    postject: (...specs) => <never>{operation: `postject`, argument: specs},
    coalesce: (...specs) => <never>{operation: `coalesce`, argument: specs},
  };
}
