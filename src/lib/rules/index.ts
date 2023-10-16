export {rulePack, finalize} from "./public";

// testing

import {rulePack, finalize} from "./public";
import {underlying} from "/languages/levantine/alphabets";



const test = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});
const test2 = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});

const defaultTest = test2({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment({affected: false})),
  was: {underlying: {spec: `consonant`}},
},
operations => ({
  woah: [
    operations.mock(({consonant}) => consonant(features => features.articulator.lips)),
    operations.mock({type: `consonant`, features: {articulator: `lips`}}),
    operations.mock.was.underlying(({consonant}) => consonant(features => features.articulator.lips)),
  ],
}),
{
  // beforeA: ({before}, {consonant, vowel}) => (
  //   // {env: {next: [{type: `consonant`}, {type: `consonant`, features: {match: `custom`, value: test => test.articulator === `lips`}}, {type: `vowel`, features: {round: true}}]}}
  //   before(
  //     consonant(),
  //     consonant({match: `custom`, value: test => test.articulator === `lips`}),
  //     vowel(features => features.round()),
  //     vowel({round: true}),
  //   )
  // ),
},
);

type Brr = typeof defaultTest.rules;

const what = test2({
  spec: {type: `consonant`, context: {affected: true}},
  // env: (where, segment) => ({match: `any`, value: [where.before(segment({affected: false})), where.after(segment.consonant({articulator: `lips`}))]}),
},
{
  woah: {etc: [{type: null as any, features: null as any, context: null as any}]},
  test: (c, e) => [{} as any],
},
{
  beforeA: ({before}, {consonant, vowel}) => (
    // {env: {next: [{type: `consonant`}, {type: `consonant`, features: {match: `custom`, value: test => test.articulator === `lips`}}, {type: `vowel`, features: {round: true}}]}}
    before(
      consonant(),
      // consonant({match: `custom`, value: test => test.articulator === `lips`}),
      vowel(features => features.round()),
      vowel({round: true}),
    )
  ),
  man: (env, segment) => {
    const tedst = segment.vowel(features => features.round(), context => ({match: `any`, value: [context.affected(), context.affected(false)]}));
    return null as never;
  },
},
);

const what2 = test({
  spec: {context: {affected: true}},
  env: {next: [{spec: {type: `consonant`, features: {emphatic: true}}}]},
},
{
  woah: {test: [{type: `consonant`, features: {} as any, context: {} as any}]},
},
{
  beforeA: ({before}, {consonant, vowel, suffix}) => (
    // {env: {next: [{type: `consonant`, features: {articulator: `lips`}}, {type: `vowel`, features: {backness: `back`}}]}}
    before(
      consonant(features => features.articulator.lips),
      vowel(features => features.backness.back),
      suffix((features, traits) => traits.plural)
    )
  ),
});

const what3 = test({
  spec: segment => segment(context => context.affected()),
  env: {next: [{spec: {type: `consonant`, features: {emphatic: true}}}]},
},
{
  base: {
    etc: test => [{type: `consonant`, features: {} as any, context: {} as any}],
  },
},
{
  beforeA: ({before}, {consonant, vowel}) => (
    {
      was: {underlying: {spec: `consonant`}},
    }
  ),
});

type Wa = typeof what3;

type Wat = typeof defaultTest;

const wat = defaultTest;

const eee = defaultTest.rules.woah.for;

const bruv = test2.pack({defaultTest, what});
type Waft = typeof bruv[`children`][`what`][`rules`][`woah`][`into`];
const bruh = test.pack({what2, bruv});

const final = finalize(bruv);

const yiss = final.what((is, when) => {const test = is.woah.etc().into;return[
  when.beforeA(
    is.woah.etc(),
  ),
  is.woah.etc(),
];});

const tesdt = final.defaults.defaultTest.woah();


yiss[0][0].for;

final.what((is, when) => {const test = is.woah.etc(3); const wat = test.for.value; return [];});
