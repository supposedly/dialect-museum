import ruleset from './ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';
import {letters as underlying} from '/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    was: {underlying: {spec: letters.plain.vowel.ii}},
  },
  {
    ii: [letters.plain.vowel.ii],
    ee: [letters.plain.vowel.ee],
    aa: [letters.plain.vowel.aa],
  },
  {
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
