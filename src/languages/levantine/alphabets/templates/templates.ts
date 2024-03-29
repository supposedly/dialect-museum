import {alphabet} from 'src/lib/alphabet';
import {underlying} from '../underlying';
import {Merge} from 'src/lib/utils/typetools';
import {MatchInstance} from 'src/lib/utils/match';

export function withFlags<
  const Original extends object,
  const Names extends ReadonlyArray<string>
>(original: Original, ...names: Names): Merge<Original, {[Name in Names[number]]: MatchInstance<`type`, `boolean`>}> {
  return {
    ...original,
    ...Object.fromEntries(names.map(name => [name, {match: `type`, value: `boolean`}])),
  } as Merge<Original, {[Name in Names[number]]: MatchInstance<`type`, `boolean`>}>;
}

const root = {match: `array`, value: {
  length: {match: `any`, value: [3, 4]},
  fill: withFlags(underlying.types.consonant, `weak`, `affected`),
}} as const;

// missing idafe
export const templates = alphabet({
  name: `templates`,
  context: {
    affected: {match: `type`, value: `boolean`},
  },
  types: {
    boundary: {
      type: [
        `syllable`,
        // `morpheme`,  // with a feature-tree model i could do this instead of delimiter
        `word`,
        `pause`,  // 'petite pause'
        `sentence`,  // 'grande pause'
      ],
    },
    literal: {
      value: {match: `type`, value: `string`},
    },
    word: {
      string: {
        match: `array`,
        value: {
          length: {match: `type`, value: `number`},
          fill: {
            match: `any`,
            value: [
              {
                type: `consonant`,
                features: underlying.types.consonant,
                context: {affected: {match: `type`, value: `boolean`}},
              },
              {
                type: `vowel`,
                features: underlying.types.vowel,
                context: {affected: {match: `type`, value: `boolean`}},
              },
            ],
          },
        },
      },
    },
    verb: {
      root,
      subject: {match: `single`, value: underlying.types.pronoun},
      tam: [`past`, `subjunctive`, `indicative`, `imperative`],
      // alternative or addendum to below comment: this should be a computed trait...
      // (aka "i should implement computed traits...")
      theme: [`a`, `i`, `u`],
      // this would be better if i had an actual feature tree model :(
      // could restrict theme.u to wazn.f3vl and wazn.fa3vl to traits.nonpast, wazn.f3vl to tam.past
      // (cypriot /rma/ would be handled as a transformation from wazn.fa3vl + root:[r, m, ~y],
      // not by defining those kinds of cypriot verbs as wazn.f3vl from the outset)
      door: [
        // i was originally doing `fa3vl` and using the theme vowel to select one
        // but i actually need to use the theme vowel to know hwo to render hollow
        // verbs when they have a consonant-initial conj suffix lol
        // oh well
        `fa3al`,
        `fa3il`,
        // nonpast, f3al f3il f3ul
        `f3vl`,
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `faa3al`,
        `tfaa3al`,
        `stfaa3al`,
        `af3al`,
        // nonpast (mayyyybe past but most probably just nonpast), nfa3al nfa3il
        `nfa3vl`,
        // nonpast (ditto), fta3al fta3il
        `fta3vl`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
    },
    participle: {
      root,
      subject: {match: `single`, value: underlying.types.pronoun},
      voice: [`active`, `passive`],
      shape: [
        // again feature tree would be great so i could specify form-1
        // which would be a cleaner way to target form-1 passive pp than
        // specifying it for both faa3il and fa3laan (meaningless)
        `faa3il`,
        `fa3laan`,
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `faa3al`,
        `tfaa3al`,
        `stfaa3al`,
        `af3al`,
        `nfa3vl`,
        `fta3vl`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
    },
    l: {},
    masdar: {
      root,
      shape: [
        `fa3l`,
        `fi3l`,
        `fu3l`,
        `fa33al`,
        // `tfa33al`,
        // `stfa33al`,
        // `faa3al`,
        // `tfaa3al`,
        // `stfaa3al`,
        // `af3al`,
        // `nfa3al`,
        // `fta3al`,
        // `staf3al`,
        // `f3all`,
        `fa3la2`,
        `tfa3la2`,
        // `stfa3la2`,
      ],
    },
    number: {
      value: {match: `type`, value: `number`},
      type: [
        `cardinal`,
        `ordinal`,
        `construct`,
        `linking`,
      ],
      gender: [
        `masculine`,
        `feminine`,
      ],
    },
    special: {
      root,
      shape: [
        `af3al`,
        `fa3ale`,
        `maf3ale`,
        `fa3aaliq`,
        `fa3aaliiq`,
      ],
    },
    affix: underlying.types.affix,
    delimiter: underlying.types.delimiter,
    pronoun: underlying.types.pronoun,
  },
}, {
  boundary: {
    pausal: {
      type: {match: `any`, value: [`pause`, `sentence`]},
    },
    suprasyllabic: {
      type: {match: `any`, value: [`word`, `pause`, `sentence`]},
    },
    prosodic: {
      type: {match: `any`, value: [`syllable`, `word`, `pause`, `sentence`]},
    },
  },
  verb: {
    nonpast: {
      tam: {
        match: `any`,
        value: [`imperative`, `indicative`, `subjunctive`],
      },
    },
  },
  participle: {
    mujarrad: {
      shape: {match: `any`, value: [`faa3il`, `fa3laan`]},
    },
    bareMaziid: {
      shape: {match: `any`, value: [
        `fa33al`,
        `faa3al`,
        `af3al`,
        `nfa3vl`,
        `fta3vl`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
      ]},
    },
    maziidT: {
      shape: {
        match: `any`,
        value: [
          `tfa33al`,
          `tfaa3al`,
          `tfa3la2`,
        ],
      },
    },
    maziidST: {
      shape: {
        match: `any`,
        value: [
          `stfa33al`,
          `stfaa3al`,
          `stfa3la2`,
        ],
      },
    },
  },
  masdar: {
    form1: {
      shape: {
        match: `any`,
        value: [`fa3l`, `fi3l`, `fu3l`],
      },
    },
  },
},
{
  has: {root},
  traits: {
    // sound: {
    //   root: {match: `array`, value: {length: {match: `any`, value: [3, 4]}, fill: {weak: false}}},
    // },
    sound: {
      root: {
        match: `array`,
        value: {
          length: {match: `any`, value: [3, 4]},
          // ????????????
          // this or `any` makes an error that i don't understand go away
          // hopefully if i ever fix trait defs it'll just fix itself though
          fill: {match: `all`, value: [{weak: false}]},
        },
      },
    },
    geminate: {
      root: {match: `any`, value: [
        {match: `all`, value: [
          {length: 3},
          {match: `custom`, value: root => Object.entries(root[1]).every(
            ([k, v]) => v === root[2][k as keyof typeof root[1]]
          )},
        ]},
        {match: `all`, value: [
          {length: 4},
          {match: `custom`, value: root => Object.entries(root[2]).every(
            ([k, v]) => v === root[3][k as keyof typeof root[2]]
          )},
        ]},
      ]},
    },
    ingeminate: {
      root: {match: `any`, value: [
        {match: `all`, value: [
          {length: 3},
          {match: `custom`, value: root => Object.entries(root[1]).some(
            ([k, v]) => v !== root[2][k as keyof typeof root[1]]
          )},
        ]},
        {match: `all`, value: [
          {length: 4},
          {match: `custom`, value: root => Object.entries(root[2]).some(
            ([k, v]) => v !== root[3][k as keyof typeof root[2]]
          )},
        ]},
      ]},
    },
    triliteral: {
      root: {length: 3},
    },
    quadriliteral: {
      root: {length: 4},
    },
    assimilated: {
      root: {0: {weak: true}},
    },
    wawated: {
      root: {0: {weak: true, articulator: `lips`, location: `lips`, manner: `approximant`}},
    },
    hamzated: {
      root: {0: {weak: true, articulator: `throat`, location: `glottis`, manner: `stop`}},
    },
    hollow: {
      root: {1: {weak: true}, length: 3},
    },
    defective: {
      root: {match: `any`, value: [
        {2: {weak: true}, length: 3},
        {3: {weak: true}, length: 4},
      ]},
    },
  },
});
