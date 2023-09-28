import {alphabet} from "/lib/alphabet";
import {underlying} from "../underlying/underlying";

const root = {match: `array`, value: {
  length: {match: `any`, value: [3, 4]},
  fill: {
    ...underlying.types.consonant,
    weak: {match: `type`, value: `boolean`},
  },
}} as const;

/*
  idafe
*/
export const templates = alphabet({
  name: `category`,
  context: {
    affected: {match: `type`, value: `boolean`},
  },
  types: {
    boundary: {
      word: {match: `type`, value: `boolean`},
      pause: {match: `type`, value: `boolean`},
      sentence: {match: `type`, value: `boolean`},
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
              underlying.types.consonant,
              underlying.types.vowel,
            ],
          },
        },
      },
    },
    verb: {
      root,
      subject: {match: `single`, value: underlying.types.pronoun},
      tam: [`past`, `subjunctive`, `indicative`, `imperative`],
      theme: [`a`, `i`, `u`],
      shape: [
        `f3vl`,
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
    suffix: underlying.types.suffix,
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
    hollow: {
      root: {1: {weak: true}},
    },
    defective: {
      root: {match: `any`, value: [
        {2: {weak: true}, length: 3},
        {3: {weak: true}, length: 4},
      ]},
    },
  },
});
