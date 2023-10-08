export {rulePack, finalize} from "./funcs";

// testing

import {rulePack, finalize} from "./funcs";
import {underlying} from "/languages/levantine/alphabets";



const test = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});
const test2 = rulePack(underlying, underlying, [underlying], {spec: {context: {affected: true}}});

const defaultTest = test2({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment({affected: false})),
},
{
  woah: [{type: `consonant`, features: {} as any}],
},
{
  // beforeA: ({before}, {consonant, vowel}, {affected}) => (
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
const what = test2({
  spec: {context: {affected: true}},
  env: (where, segment) => where.before(segment({affected: false})),
},
{
  woah: {etc: [{type: `consonant`, features: {} as any}]},
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
    // {env: {next: [{type: `consonant`}, {type: `consonant`, features: {match: `custom`, value: test => test.articulator === `lips`}}, {type: `vowel`, features: {round: true}}]}}
    before(
      consonant(),
      consonant({match: `custom`, value: test => test.articulator === `lips`}),
      vowel(features => features.round()),
      vowel({round: true}),
    )
  ),
},
);

const what2 = test({
  spec: {context: {affected: true}},
  env: {next: [{type: `consonant`, features: {emphatic: true}}]},
},
{
  woah: {test: [{type: `consonant`, features: {} as any}]},
},
{
  beforeA: ({before}, {consonant, vowel, suffix}, {affected}) => (
    // {env: {next: [{type: `consonant`, features: {articulator: `lips`}}, {type: `vowel`, features: {backness: `back`}}]}}
    before(
      consonant(features => features.articulator.lips),
      vowel(features => features.backness.back),
      suffix((features, traits) => traits.plural)
    )
  ),
});

const what3 = test({
  spec: {context: {affected: true}},
  env: {next: [{type: `consonant`, features: {emphatic: true}}]},
},
{
  base: {
    etc: test => [{type: `consonant`, features: {} as any}],
  },
},
{
  beforeA: ({before}, {consonant, vowel}, {affected}) => (
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

const yiss = final.what((is, when) => [
  is.woah.etc(3),
  when.beforeA(
    is.woah.etc(4)
  ),
]);

const tesdt = final.defaults.defaultTest.woah();


yiss[1][0].for;

final.what((is, when) => {const test = is.woah.etc(3); const wat = test.for.value; return [];});
