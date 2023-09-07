import type {ApplyMatchAsType} from "src/backend/alphabet/alphabet";
import {templated} from "../../templated/templated";
import {letters} from "../letters";
import {underlying} from "../underlying";

function vowelToObject(vowel: `a` | `i` | `u`): ApplyMatchAsType<typeof underlying.types.vowel> {
  switch (vowel) {
    case `a`:
      return letters.vowel.a;
    case `i`:
      return letters.vowel.i;
    case `u`:
      return letters.vowel.u;
  }
}

function laxLongVowelToObject(vowel: `a` | `i` | `u` | `e` | `o`): ApplyMatchAsType<typeof underlying.types.vowel> {
  switch (vowel) {
    case `a`:
      return letters.vowel.aa;
    case `i`:
    case `e`:
      return letters.vowel.ee;
    case `u`:
    case `o`:
      return letters.vowel.oo;
  }
}

function tenseLongVowelToObject(vowel: `a` | `i` | `u`): ApplyMatchAsType<typeof underlying.types.vowel> {
  switch (vowel) {
    case `a`:
      return letters.vowel.aa;
    case `i`:
      return letters.vowel.ii;
    case `u`:
      return letters.vowel.uu;
  }
}

const verb = templated.promote.verb(underlying, {
  n_: {
    left: () => [{consonant: letters.consonant.n}],
  },
  st_: {
    left: () => [
      {consonant: letters.consonant.s},
      {consonant: letters.consonant.t},
    ],
  },
  sta_: {
    left: () => [
      {consonant: letters.consonant.s},
      {consonant: letters.consonant.t},
      {vowel: vowelToObject(`a`)},
    ],
  },
  v_: {
    feed: (vowel: `a` | `i`) => ({
      left: () => [
        {consonant: letters.consonant.$},
        {vowel: letters.vowel[vowel]},
      ],
    }),
  },
  fv33: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => [
      {consonant: f},
      {vowel: letters.vowel[vowel]},
      {consonant: c},
      {consonant: c},
    ],
  },
  fv3vl: {
    feed: (vowel1: `a` | `i` | `u`, vowel2: `a` | `i` | `u`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {vowel: letters.vowel[vowel1]},
      {consonant: c},
      {vowel: letters.vowel[vowel2]},
      {consonant: l},
    ],
  },
  f3vl: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
      {consonant: l},
    ],
  },
  f3vvl: {
    feed: (vowel: `a` | `i` | `u` | `e` | `o`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {consonant: c},
      {vowel: laxLongVowelToObject(vowel)},
      {consonant: l},
    ],
  },
  fv3v: {
    feed: (vowel: `a` | `i`) => ({root: [f, c]}) => [
      {consonant: f},
      {vowel: letters.vowel[vowel]},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
    ],
  },
  f3vv: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => [
      {consonant: f},
      {consonant: c},
      {vowel: tenseLongVowelToObject(vowel)},
    ],
  },
  f3v: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => [
      {consonant: f},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
    ],
  },
  fvvl: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, _, l]}) => [
      {consonant: f},
      {vowel: tenseLongVowelToObject(vowel)},
      {consonant: l},
    ],
  },
  fa33vl: {
    feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {vowel: vowelToObject(`a`)},
      {consonant: c},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
      {consonant: l},
    ],
  },
  fa33v: {
    feed: (vowel: `a` | `i`) => ({root: [f, c]}) => [
      {consonant: f},
      {vowel: vowelToObject(`a`)},
      {consonant: c},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
    ],
  },
  fe3vl: {
    feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {vowel: laxLongVowelToObject(`a`)},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
      {consonant: l},
    ],
  },
  fe3v: {
    feed: (vowel: `a` | `i`) => ({root: [f, c]}) => [
      {consonant: f},
      {vowel: laxLongVowelToObject(`a`)},
      {consonant: c},
      {vowel: letters.vowel[vowel]},
    ],
  },
  ftv33: {
    feed: (vowel: `a` | `i` | `u`) => ({root: [f, c]}) => [
      {consonant: f},
      {consonant: letters.consonant.t},
      {vowel: letters.vowel[vowel]},
      {consonant: c},
      {consonant: c},
    ],
  },
  ftv3vl: {
    feed: (vowel1: `a` | `i`, vowel2: `a` | `i`) => ({root: [f, c, _]}) => [
      {consonant: f},
      {consonant: letters.consonant.t},
      {vowel: letters.vowel[vowel1]},
      {consonant: c},
      {vowel: letters.vowel[vowel2]},
    ],
  },
  ftv3v: {
    feed: (vowel1: `a` | `i`, vowel2: `a` | `i`) => ({root: [f, c, _]}) => [
      {consonant: f},
      {consonant: letters.consonant.t},
      {vowel: letters.vowel[vowel1]},
      {consonant: c},
      {vowel: letters.vowel[vowel2]},
    ],
  },
  ftvvl: {
    feed: (vowel: `a` | `i`) => ({root: [f, _, l]}) => [
      {consonant: f},
      {consonant: letters.consonant.t},
      {vowel: tenseLongVowelToObject(vowel)},
      {consonant: l},
    ],
  },
  f3all: ({root: [f, c, l]}) => [
    {consonant: f},
    {consonant: c},
    {vowel: vowelToObject(`a`)},
    {consonant: l},
    {consonant: l},
  ],
  fa3lv2: {
    feed: (vowel: `a` | `i`) => ({root: [f, c, l, q]}) => [
      {consonant: f},
      {vowel: vowelToObject(`a`)},
      {consonant: c},
      {consonant: l},
      {vowel: letters.vowel[vowel]},
      {consonant: q},
    ],
  },
  fa3lv: {
    feed: (vowel: `a` | `i`) => ({root: [f, c, l]}) => [
      {consonant: f},
      {vowel: vowelToObject(`a`)},
      {consonant: c},
      {consonant: l},
      {vowel: letters.vowel[vowel]},
    ],
  },
}, {});
