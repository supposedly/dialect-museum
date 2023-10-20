import {alphabet} from "/lib/alphabet";
import {underlying} from "../underlying/underlying";
import {Merge} from "/lib/utils/typetools";
import {MatchInstance} from "/lib/utils/match";

function withFlags<
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
      value: {match: `type`, value: `string`},
      spacing: [
        `before`,
        `after`,
        `around`,
      ],
      pausal: {match: `type`, value: `boolean`},
    },
    literal: {
      value: {match: `type`, value: `string`},
    },
    word: {
      value: {
        match: `array`,
        value: {
          length: {match: `type`, value: `number`},
          fill: {
            match: `any`,
            value: [
              withFlags(underlying.types.consonant, `affected`),
              withFlags(underlying.types.vowel, `affected`),
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
        `faa3il`,
        `fa3laan`,
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `faa3al`,
        `tfaa3al`,
        `stfaa3al`,
        `af3al`,
        `nfa3al`,
        `nfa3il`,
        `fta3al`,
        `fta3il`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
    },
    l: {},
    af3al: {
      root,
    },
    masdar: {
      root,
      shape: [
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `faa3al`,
        `tfaa3al`,
        `stfaa3al`,
        `af3al`,
        `nfa3al`,
        `fta3al`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
    },
    number: {
      value: {match: `type`, value: `number`},
    },
    suffix: underlying.types.affix,
    delimiter: underlying.types.delimiter,
    pronoun: underlying.types.pronoun,
  },
}, {
  verb: {
    nonpast: {
      tam: {
        match: `any`,
        value: [`imperative`, `indicative`, `subjunctive`],
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
      root: {0: {weak: true, articulator: `throat`, location: `glottis`, manner: `plosive`}},
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
