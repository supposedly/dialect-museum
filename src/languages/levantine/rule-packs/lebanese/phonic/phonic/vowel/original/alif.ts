import ruleset from '../../ruleset';
import {letters} from '/languages/levantine/alphabets/phonic';

export default ruleset(
  {
    was: {underlying: {spec: letters.plain.vowel.aa}},
  },
  {
    ii: [letters.plain.vowel.ii],
    II: [letters.plain.vowel.ɪɪ],
    ee: [letters.plain.vowel.ee],
    EE: [letters.plain.vowel.ɛɛ],
    oo: [letters.plain.vowel.oo],
    OO: [letters.plain.vowel.ɔɔ],
    lowOO: [letters.plain.vowel.ɒɒ],
    AA: [letters.plain.vowel.ɑɑ],
    highAA: [letters.plain.vowel.ʌʌ],
  },
  {
    nextToEmphatic: {
      env: ({before, after}, {consonant}) => ({
        match: `any`,
        value: [
          before(consonant({emphatic: true})),
          after(consonant({emphatic: true})),
        ],
      }),
    },
    afterPlainConsonant: {
      env: ({after}, {consonant}) => after(consonant({emphatic: false})),
    },
    afterPharyngeal: {
      env: ({after}, {consonant}) => after(consonant({location: `pharynx`})),
    },
    // xvnaa2, bvzaa2, dvhaan
    inDisyllable: {
      env: ({before, after}, {boundary, consonant, vowel}) => ({
        match: `all`,
        value: [
          after(
            boundary(`syllable`),
            boundary.seek(
              `word`,
              {},
              {match: `any`, value: [consonant(), vowel()]}
            ),
          ),
          before(consonant(), boundary(`word`)),
        ],
      }),
    },
    afterHamze: {
      env: ({after}) => after(letters.plain.consonant.$),
    },
    afterBackConsonant: {
      env: ({after}, {consonant}) => after(consonant((features, traits) => traits.back)),
    },
    beforeBackConsonant: {
      env: ({before}, {consonant}) => before(consonant((features, traits) => traits.back)),
    },
    atVerbBoundary: {
      env: ({before}, {boundary}) => before(boundary(`morpheme`)),
      was: {templates: {spec: {type: `verb`}}},
    },
    inFinalSyllable: {
      env: ({before}, {boundary, consonant}) => before(boundary.seek(`word`, {}, consonant())),
    },
    wordFinal: {
      env: ({before}, {boundary}) => before(boundary(`word`)),
    },
    nearI: {
      env: ({before, after}, {vowel, consonant}) => ({
        match: `any`,
        value: [
          // xeeyif
          before(vowel.seek(letters.plain.vowel.i.features, {}, consonant(), [1])),
          // liseen, mitrees
          after(vowel.seek(letters.plain.vowel.i.features, {}, consonant(), [1, 2])),
        ],
      }),
    },
    beforeR: {
      env: ({before}) => before(letters.plain.consonant.r),
    },
    inFaa3il: {
      was: {
        templates: {
          spec: ({participle}) => participle({shape: `faa3il`}),
        },
      },
    },
    inFaa3al: {
      was: {
        templates: {
          spec: ({verb}) => verb({door: `faa3al`}),
        },
      },
    },
    inFa3aaliq: {
      was: {
        templates: {
          spec: ({special}) => special({shape: `fa3aaliq`}),
        },
      },
    },
    inFa3aaliiq: {
      was: {
        templates: {
          spec: ({special}) => special({shape: `fa3aaliiq`}),
        },
      },
    },
  }
);
