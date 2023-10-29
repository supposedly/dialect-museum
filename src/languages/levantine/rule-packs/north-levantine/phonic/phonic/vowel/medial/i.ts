import ruleset from './ruleset';
import {letters, phonic} from 'src/languages/levantine/alphabets/phonic';
import {MatchAsType} from 'src/lib/utils/match';

type Consonant = MatchAsType<typeof phonic[`types`][`consonant`]>;

function closeEnough(a: Consonant, b: Consonant): boolean {
  const locations = phonic.types.consonant.location.value;
  return a.articulator === b.articulator
    && a.manner === b.manner
    && Math.abs(locations.indexOf(a.location) - locations.indexOf(b.location)) <= 1;
}

export default ruleset(
  {
    spec: letters.plain.vowel.i,
    env: {},
  },
  {
    i: [letters.plain.vowel.i],
    I: [letters.plain.vowel.ɪ],
    e: [letters.plain.vowel.e],
    deleted: [],
  },
  {
    betweenSimilarConsonants: {
      env: ({before, after, custom}, {consonant}) => (
        custom(
          {
            ...before(consonant(phonic.types.consonant)),
            ...after(consonant(phonic.types.consonant)),
          },
          ({
            prev: [{spec: {features: a}}],
            next: [{spec: {features: b}}],
          }) => closeEnough(a, b)
        )
      ),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
    stressed: {
      spec: ({vowel}) => vowel({stressed: true}),
    },
    unstressedOpen: {
      spec: ({vowel}) => vowel({stressed: false}),
      env: ({before}, {boundary}) => before(boundary(`syllable`)),
    },
  }
);
