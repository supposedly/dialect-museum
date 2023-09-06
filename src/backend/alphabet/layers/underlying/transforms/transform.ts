import {letters} from "../letters";
import {underlying} from "../underlying";

underlying.transform.pronoun(() => ({
  // nonpast
  v_: {
    feed: (vowel: `a` | `i`) => ({replace: () => [{vowel: letters.vowel[vowel]}]}),
  },
  $_: {replace: () => [{consonant: letters.consonant.$}]},
  t_: {replace: () => [{consonant: letters.consonant.t}]},
  y_: {replace: () => [{consonant: letters.consonant.y}]},
  _i: {replace: () => [{vowel: letters.vowel.i}]},
  _u: {replace: () => [{vowel: letters.vowel.u}]},
  // past
  _t: {replace: () => [{consonant: letters.consonant.t}]},
  _vt: {feed: (vowel: `a` | `i`) => ({replace: () => [
    {vowel: letters.vowel[vowel]},
    {consonant: letters.consonant.t},
  ]})},
  _tu: {replace: () => [
    {consonant: letters.consonant.t},
    {vowel: letters.vowel.u},
  ]},
  // enclitic
  _ni: {replace: () => [
    {consonant: letters.consonant.n},
    {vowel: letters.vowel.i},
  ]},
  _na: {replace: () => [
    {consonant: letters.consonant.n},
    {vowel: letters.vowel.a},
  ]},
  _ak: {replace: () => [
    {vowel: letters.vowel.a},
    {consonant: letters.consonant.k},
  ]},
  _k: {replace: () => [{consonant: letters.consonant.k}]},
  _ik: {replace: () => [
    {vowel: letters.vowel.i},
    {consonant: letters.consonant.k},
  ]},
  _ki: {replace: () => [
    {consonant: letters.consonant.k},
    {vowel: letters.vowel.i},
  ]},
  _kun: {replace: () => [
    {consonant: letters.consonant.k},
    {vowel: letters.vowel.u},
    {consonant: letters.consonant.n},
  ]},
  _o: {replace: () => [
    {vowel: {height: `mid`, backness: `back`, long: false, round: false}},
  ]},
  _h: {replace: () => [{consonant: letters.consonant.h}]},
  _ha: {replace: () => [
    {consonant: letters.consonant.h},
    {vowel: letters.vowel.a},
  ]},
  _hun: {replace: () => [
    {consonant: letters.consonant.h},
    {vowel: letters.vowel.u},
    {consonant: letters.consonant.n},
  ]},
  // standalone (TODO)
}), library => library);
