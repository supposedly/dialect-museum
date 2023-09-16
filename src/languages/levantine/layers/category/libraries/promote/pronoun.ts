import {underlying} from '../../../underlying/underlying';
import {category} from '../../category';
import {letters} from '../../../underlying/letters';
import {promote as lib} from '/lib/transform';

const library = lib(category, `pronoun`, underlying, fix => ({
  nonpast: {
    $_: () => fix({consonant: letters.consonant.$}),
    a_: () => fix({vowel: letters.vowel.a}),
    t_: () => fix({consonant: letters.consonant.t}),
    n_: () => fix({consonant: letters.consonant.n}),
    _y_: () => fix({consonant: letters.consonant.y}),
    _i: () => fix({vowel: letters.vowel.i}),
    _u: () => fix({vowel: letters.vowel.u}),
    _w: () => fix({consonant: letters.consonant.w}),
  },
  past: {
    _t: () => fix({consonant: letters.consonant.t}),
    _vt: {feed: (vowel: `a` | `i`) => (() => fix(
      {vowel: letters.vowel[vowel]},
      {consonant: letters.consonant.t},
    ))},
    _tu: () => fix(
      {consonant: letters.consonant.t},
      {vowel: letters.vowel.u},
    ),
  },
  enclitic: {
    _ni: () => fix(
      {consonant: letters.consonant.n},
      {vowel: letters.vowel.i},
    ),
    _na: () => fix(
      {consonant: letters.consonant.n},
      {vowel: letters.vowel.a},
    ),
    _ak: () => fix(
      {vowel: letters.vowel.a},
      {consonant: letters.consonant.k},
    ),
    _k: () => fix({consonant: letters.consonant.k}),
    _ik: () => fix(
      {vowel: letters.vowel.i},
      {consonant: letters.consonant.k},
    ),
    _ki: () => fix(
      {consonant: letters.consonant.k},
      {vowel: letters.vowel.i},
    ),
    _kun: () => fix(
      {consonant: letters.consonant.k},
      {vowel: letters.vowel.u},
      {consonant: letters.consonant.n},
    ),
    _o: () => fix(
      {vowel: letters.vowel.o},
    ),
    _h: () => fix({consonant: letters.consonant.h}),
    _ha: () => fix(
      {consonant: letters.consonant.h},
      {vowel: letters.vowel.a},
    ),
    _hun: () => fix(
      {consonant: letters.consonant.h},
      {vowel: letters.vowel.u},
      {consonant: letters.consonant.n},
    ),
  },
  standalone: {
    hxx: {
      feed: (vowel: `u` | `i`, consonant?: `y` | `w` | `n` | `m`) => () =>
        consonant
          ? fix(
            {consonant: letters.consonant.h},
            {vowel: letters.vowel[vowel]},
            {consonant: letters.consonant[consonant]}
          )
          : fix(
            {consonant: letters.consonant.h},
            {vowel: letters.vowel[`${vowel}${vowel}` as `uu` | `ii`]},
          ),
    },
    _ce: {
      feed: (consonant: `y` | `w` | `n` | `m`) => () => fix(
        {consonant: letters.consonant[consonant]},
        {vowel: letters.vowel.e},
      ),
    },
    _v: {
      feed: (vowel: `a` | `i` | `e`) => () => fix(
        {vowel: letters.vowel[vowel]},
      ),
    },
    $int: () => fix(
      {consonant: letters.consonant.$},
      {vowel: letters.vowel.i},
      {consonant: letters.consonant.n},
      {consonant: letters.consonant.t},
    ),
    $ana: () => fix(
      {consonant: letters.consonant.$},
      {vowel: letters.vowel.a},
      {consonant: letters.consonant.n},
      {vowel: letters.vowel.a},
    ),
  },
}));

category.promote.pronoun(underlying, ({features}) => ({
  prefix: {
    cs1: {
      from: {match: `all`, value: [
        features.gender.common,
        features.number.singular,
        features.person.first,
      ]},
      into: [library.nonpast.$_],
    },
  },
}));
