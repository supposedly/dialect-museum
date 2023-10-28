import {Alphabet, qualifiedPathsOf} from '../alphabet';
import {MatchSchema, matchers} from '../utils/match';
import {NestedRecordOr} from '../utils/typetools';
import {AddSpec, ContextFuncSeek, ContextFuncWithoutSeek, Specs, SpecsFuncs, TypesFunc, TypesFuncSeek, TypesFuncWithoutSeek, TypesFuncs} from './types/environment';
import {ExtractDefaults, ProcessPack} from './types/finalize';
import {SpecOperations} from './types/func';
import {IntoToFunc, Packed, Ruleset, RulesetWrapper, Unfunc, UnfuncSpec} from './types/helpers';

function addSpec<Arr extends ReadonlyArray<unknown>>(arr: Arr): AddSpec<Arr> {
  return arr.map(item => {
    if (Array.isArray(item)) {
      return addSpec(item as ReadonlyArray<unknown>);
    }
    if (typeof item !== `object` || item === null) {
      return {spec: item};
    }
    if (`spec` in item) {
      return item;
    }
    if (
      `match` in item && item.match === `array`
      && `value` in item && item.value !== null && typeof item.value === `object`
      && `length` in item.value && `fill` in item.value
    ) {
      return {match: `array`, value: {length: item.value.length, fill: addSpec([item.value.fill])[0]}};
    }
    if (`match` in item && (item.match === `any` || item.match === `all`) && `value` in item && Array.isArray(item.value)) {
      return {match: item.match, value: addSpec(item.value as ReadonlyArray<unknown>)};
    }
    return {spec: item};
  }) as AddSpec<Arr>;
}


function typesFuncs<ABC extends Alphabet>(alphabet: ABC): TypesFuncs<ABC> {
  return Object.assign(
    Object.assign(
      (segment => ({
        context: segment instanceof Function
          ? segment(qualifiedPathsOf(alphabet.context))
          : segment,
      })) as ContextFuncWithoutSeek<ABC>,
      {
        seek: (segment, filter?, length?) => [
          {
            match: `array`,
            value: {
              length: length ? {match: `any`, value: length} : {match: `type`, value: `number`},
              fill: filter ?? {},
            },
          },
          {
            context: segment instanceof Function
              ? segment(qualifiedPathsOf(alphabet.context))
              : segment,
          },
        ],
      } as ContextFuncSeek<ABC>
    ),
    Object.fromEntries(Object.entries(alphabet.types).map(([type, v]) => {
      return [
        type,
        Object.assign(
          ((features, context) => ({
            type,
            features: features instanceof Function
              ? features(
              qualifiedPathsOf(v) as never,
              alphabet.traits[type] as never
              )
              : Object.keys(v).length === 1
                ? {[Object.keys(v)[0]]: features}
                : features,
            context: context instanceof Function
              ? context(qualifiedPathsOf(alphabet.context))
              : context,
          })) as TypesFuncWithoutSeek<ABC, keyof ABC[`types`]>,
          {
            seek: (features, context, filter?, length?) => [
              {
                match: `array`,
                value: {
                  length: length ? {match: `any`, value: length} : {match: `type`, value: `number`},
                  fill: filter ?? {},
                },
              },
              {
                type,
                features: features instanceof Function
                  ? features(
                  qualifiedPathsOf(v) as never,
                  alphabet.traits[type] as never
                  )
                  : Object.keys(v).length === 1
                    ? {[Object.keys(v)[0]]: features}
                    : features,
                context: context instanceof Function
                  ? context(qualifiedPathsOf(alphabet.context))
                  : context,
              },
            ],
          } as TypesFuncSeek<ABC, keyof ABC[`types`]>
        ),
      ];
    })) as unknown as {[T in keyof ABC[`types`]]: TypesFunc<ABC, T>}
  );
}

function callSpecFunc<Spec extends object>(
  spec: Spec,
  funcs: SpecsFuncs<Alphabet, Alphabet, ReadonlyArray<Alphabet>>
): Unfunc<Spec, `spec`> {
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

function callEnvFunc<Env extends object>(
  env: Env,
  funcs: SpecsFuncs<Alphabet, Alphabet, ReadonlyArray<Alphabet>>
): Unfunc<Env, `env`> {
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

function _unfuncSpec<Specs>(
  specs: Specs,
  funcs: SpecsFuncs<Alphabet, Alphabet, ReadonlyArray<Alphabet>>
): UnfuncSpec<Specs> {
  if (specs === undefined || specs === null || typeof specs !== `object`) {
    return specs as UnfuncSpec<Specs>;
  }
  if (`match` in specs && `value` in specs && Array.isArray(specs[`value`])) {
    return {
      match: specs[`match`],
      value: specs[`value`].map(v => _unfuncSpec(v, funcs)) as {
        [Index in keyof typeof specs[`value`]]: UnfuncSpec<typeof specs[`value`][Index]>
      },
    } as UnfuncSpec<Specs>;
  }
  if (`spec` in specs || `env` in specs) {
    return {
      ...(`spec` in specs ? callSpecFunc(specs.spec as object, funcs) : {}),
      ...(`env` in specs ? callEnvFunc(specs.env as object, funcs) : {}),
    } as UnfuncSpec<Specs>;
  }
  return Object.fromEntries(
    Object.entries(specs).map(
      ([k, v]) => [k, _unfuncSpec(v, funcs)]
    )
  ) as UnfuncSpec<Specs>;
}

export function unfuncSpec<
  Specs,
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
>(
  specs: Specs,
  source: Source,
  target: Target,
  dependencies: Dependencies,
): UnfuncSpec<Specs> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return _unfuncSpec(specs, generateSpecFuncs(source, target, dependencies) as never);
}

function generateSpecFuncs<
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
>(source: Source, target: Target, dependencies: Dependencies): SpecsFuncs<Source, Target, Dependencies> {
  return {
    env: {
      before: (...arr) => ({next: addSpec(arr)}),
      after: (...arr) => ({prev: addSpec(arr)}),
      custom: (match, func) => ({
        match: `all`,
        value: [
          match,
          {match: `custom`, value: func as never},
        ],
      }),
    },
    types: typesFuncs(source),
  };
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
            ((...specs: ReadonlyArray<unknown>) => ({operation: `mock`, argument: specs})),
          ])
        ),
      }
    ),
    preject: (...specs) => <never>{operation: `preject`, argument: specs},
    postject: (...specs) => <never>{operation: `postject`, argument: specs},
    coalesce: (specs, env) => <never>{operation: `coalesce`, argument: {specs, env}},
  };
}

function intoToFunc<
  Into extends object,
  Spec,
  Source extends Alphabet,
  Target extends Alphabet,
  Dependencies extends ReadonlyArray<Alphabet>
>(
  into: Into,
  spec: Spec,
  source: Source,
  target: Target,
  dependencies: Dependencies
): IntoToFunc<Into, Spec> {
  if (Array.isArray(into)) {
    // XXX: what to do with odds :(
    return ((odds = 100) => ({for: unfuncSpec(spec, source, target, dependencies), into})) as never;
  }
  return Object.fromEntries(
    Object.entries(into).map(([k, v]) => [
      k,
      intoToFunc(v, spec, source, target, dependencies),
    ])
  ) as never;
}

export function processPack<
  RulePack extends Packed<
    Record<string,
      | RulesetWrapper<Record<string, Ruleset>, Record<string, Record<string, unknown>>>
      | Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
    >,
    unknown,
    unknown,
    Alphabet,
    Alphabet,
    ReadonlyArray<Alphabet>
  >
>(pack: RulePack): ProcessPack<RulePack> {
  return Object.fromEntries(Object.entries(pack.children).map(([k, v]) => {
    if (`rules` in v) {
      return [k,
        (fn: (...args: ReadonlyArray<unknown>) => unknown) => (
          fn(
            // is:
            Object.fromEntries(Object.entries(v.rules).map(([ruleName, rule]) => [
              ruleName,
              intoToFunc(
                rule.into,
                {match: `all`, value: [rule.for, pack.specs]},
                pack.source,
                pack.target,
                pack.dependencies,
              ),
            ])),
            // when:
            Object.assign(
              Object.fromEntries(Object.entries(v.constraints).map(([constraintName, constraint]) => [
                constraintName,
                Object.assign(
                  (...args: ReadonlyArray<{for: unknown, into: unknown}>) => args.map(
                    arg => ({
                      for: {match: `all`, value: [
                        arg.for,
                        unfuncSpec(constraint, pack.source, pack.target, pack.dependencies),
                      ]},
                      into: arg.into,
                    })
                  ),
                  {
                    negated: (...args: ReadonlyArray<{for: unknown, into: unknown}>) => args.map(
                      arg => ({
                        for: {match: `custom`, value: (obj: unknown) => !matchers.all(
                          [
                            arg.for as MatchSchema,
                            unfuncSpec(constraint, pack.source, pack.target, pack.dependencies),
                          ],
                          obj
                        )},
                      })
                    ),
                  }
                ),
              ])),
              {
                custom: (
                  spec: Specs<RulePack[`source`], RulePack[`target`], RulePack[`dependencies`]>,
                  ...args: ReadonlyArray<{for: unknown, into: unknown}>
                ) => args.map(arg => ({
                  for: {match: `all`, value: [
                    arg.for,
                    unfuncSpec(spec, pack.source, pack.target, pack.dependencies),
                  ]},
                  into: arg.into,
                })),
              }
            )
          )
        ),
      ];
    } else {
      // `v as never` was erroring on return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return [k, processPack(v as any)];
    }
  }));
}

function onlyOneTarget(into: object): boolean {
  if (Array.isArray(into)) {
    return true;
  }
  if (Object.keys(into).length !== 1) {
    return false;
  }
  return Object.values(into).every(onlyOneTarget);
}

export function extractDefaults<
  RulePack extends Packed<
    Record<string,
      | RulesetWrapper<Record<string, Ruleset>, Record<string, Record<string, unknown>>>
      | Packed<Record<string, unknown>, unknown, unknown, Alphabet, Alphabet, ReadonlyArray<Alphabet>>
    >,
    unknown,
    unknown,
    Alphabet,
    Alphabet,
    ReadonlyArray<Alphabet>
  >
>(
  pack: RulePack
): ExtractDefaults<RulePack> {
  return Object.fromEntries(
    Object.entries(pack.children)
      .filter(([_, v]) => `children` in v || Object.keys(v.constraints).length > 0)
      .map(([k, v]) => {
        if (`rules` in v) {
          return [
            k,
            Object.fromEntries(
              Object.entries(v.rules)
                .filter(([_, rule]) => onlyOneTarget(rule.into))
                .map(([ruleName, rule]) => [
                  ruleName,
                  intoToFunc(
                    rule.into,
                    {match: `all`, value: [rule.for, pack.specs]},
                    pack.source,
                    pack.target,
                    pack.dependencies,
                  ),
                ])),
          ];
        } else {
          return [k, extractDefaults(v as never)];
        }
      })) as never;
}
