import ruleset from './ruleset';
import {letters} from 'src/languages/levantine/alphabets/underlying';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  {
    i: [letters.plain.vowel.i],
    a: [letters.plain.vowel.a],
  },
  {
    // salam el rassi has bi- normally but eg baj3alha in the one interview
    // (ok not the best example bc affected verb but i heard it in a couple fully-3amiye ones too)
    beforeA: {
      env: ({before}, {consonant}) => (
        before(
          // this could've used to just be {env: {nextVowel: {spec: letters.plain.vowel.a}}} lol oh well
          {
            match: `array`,
            value: {
              fill: consonant(),
              length: {match: `any`, value: [2, 3]},
            },
          },
          letters.plain.vowel.a,
        )
      ),
    },
  }
);
