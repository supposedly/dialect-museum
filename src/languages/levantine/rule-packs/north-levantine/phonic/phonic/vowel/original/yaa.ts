import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/phonic';
import {letters as underlying} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    was: {underlying: {spec: letters.plain.vowel.ii}},
  },
  {
    i: [letters.plain.vowel.i],
    ii: [letters.plain.vowel.ii],
    ee: [letters.plain.vowel.ee],
    aa: [letters.plain.vowel.aa],
    ay: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.a.features,
          second: letters.plain.vowel.i.features,
        },
        context: {affected: false},
      },
    ],
    ey: [
      {
        type: `diphthong`,
        features: {
          first: letters.plain.vowel.e.features,
          second: letters.plain.vowel.i.features,
        },
        context: {affected: false},
      },
    ],
  },
  {
    inPause: {
      env: ({before}, {boundary}) => before(boundary((features, traits) => traits.pausal)),
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant(), [1])),
    },
    // northern syrian -aa (and -ahne altho i haven't preimplemented -hne)
    before3ms: {
      env: ({before}, {boundary}) => (
        before(
          boundary(`morpheme`),
          {spec: {}, was: {underlying: {spec: underlying.plain.pronoun.ms3}}}
        )
      ),
    },
  }
);
