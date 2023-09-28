import {underlying} from '../../../underlying/underlying';
import {category} from '../../category';
import {letters} from '../../../underlying/letters';
import {promote as lib} from '/lib/transform';

const library = lib(category, `pronoun`, underlying, x => ({
  nonpast: {
    $_: () => x({consonant: letters.consonant.$}),
    a_: () => x({vowel: letters.vowel.a}),
    t_: () => x({consonant: letters.consonant.t}),
    n_: () => x({consonant: letters.consonant.n}),
    _y_: () => x({consonant: letters.consonant.y}),
    _i: () => x({vowel: letters.vowel.i}),
    _u: () => x({vowel: letters.vowel.u}),
    _w: () => x({consonant: letters.consonant.w}),
  },
  past: {
    _t: () => x({consonant: letters.consonant.t}),
    _vt: {feed: (vowel: `a` | `i`) => (() => x(
      {vowel: letters.vowel[vowel]},
      {consonant: letters.consonant.t},
    ))},
    _tu: () => x(
      {consonant: letters.consonant.t},
      {vowel: letters.vowel.u},
    ),
  },
  enclitic: {
    _ni: () => x(
      {consonant: letters.consonant.n},
      {vowel: letters.vowel.i},
    ),
    _na: () => x(
      {consonant: letters.consonant.n},
      {vowel: letters.vowel.a},
    ),
    _ak: () => x(
      {vowel: letters.vowel.a},
      {consonant: letters.consonant.k},
    ),
    _k: () => x({consonant: letters.consonant.k}),
    _ik: () => x(
      {vowel: letters.vowel.i},
      {consonant: letters.consonant.k},
    ),
    _ki: () => x(
      {consonant: letters.consonant.k},
      {vowel: letters.vowel.i},
    ),
    _kun: () => x(
      {consonant: letters.consonant.k},
      {vowel: letters.vowel.u},
      {consonant: letters.consonant.n},
    ),
    _o: () => x(
      {vowel: letters.vowel.o},
    ),
    _h: () => x({consonant: letters.consonant.h}),
    _ha: () => x(
      {consonant: letters.consonant.h},
      {vowel: letters.vowel.a},
    ),
    _hun: () => x(
      {consonant: letters.consonant.h},
      {vowel: letters.vowel.u},
      {consonant: letters.consonant.n},
    ),
  },
  standalone: {
    hxx: {
      feed: (vowel: `u` | `i`, consonant?: `y` | `w` | `n` | `m`) => () =>
        consonant
          ? x(
            {consonant: letters.consonant.h},
            {vowel: letters.vowel[vowel]},
            {consonant: letters.consonant[consonant]}
          )
          : x(
            {consonant: letters.consonant.h},
            {vowel: letters.vowel[`${vowel}${vowel}` as `uu` | `ii`]},
          ),
    },
    _ce: {
      feed: (consonant: `y` | `w` | `n` | `m`) => () => x(
        {consonant: letters.consonant[consonant]},
        {vowel: letters.vowel.e},
      ),
    },
    _v: {
      feed: (vowel: `a` | `i` | `e`) => () => x(
        {vowel: letters.vowel[vowel]},
      ),
    },
    $int: () => x(
      {consonant: letters.consonant.$},
      {vowel: letters.vowel.i},
      {consonant: letters.consonant.n},
      {consonant: letters.consonant.t},
    ),
    $ana: () => x(
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
