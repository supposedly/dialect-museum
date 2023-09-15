import {alphabet} from "/lib/alphabet/alphabet";
import {underlying} from "../underlying/underlying";

/*
  idafe
*/
export const templated = alphabet({
  name: `templated`,
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
      subject: {match: `single`, value: underlying.types.pronoun},
      tam: [`past`, `subjunctive`, `indicative`, `imperative`],
      wazn: [
        `a`,
        `i`,
        `u`,
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `fe3al`,
        `tfe3al`,
        `stfe3al`,
        `af3al`,
        `nfa3al`,
        `nfi3il`,
        `fta3al`,
        `fti3il`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
      root: {
        match: `array`,
        value: {
          length: {match: `any`, value: [3, 4]},
          fill: {
            ...underlying.types.consonant,
            weak: {match: `type`, value: `boolean`},
          },
        },
      },
    },
    participle: {
      subject: {match: `single`, value: underlying.types.pronoun},
      voice: [`active`, `passive`],
      wazn: [
        `base$fe3il`,
        `base$fa3len`,
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `fe3al`,
        `tfe3al`,
        `stfe3al`,
        `af3al`,
        `nfa3al`,
        `nfi3il`,
        `fta3al`,
        `fti3il`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
      root: {
        match: `array`,
        value: {
          length: {match: `any`, value: [3, 4]},
          fill: {
            ...underlying.types.consonant,
            weak: {match: `type`, value: `boolean`},
          },
        },
      },
    },
    l: {},
    af3al: {
      root: {
        match: `array`,
        value: {
          length: {match: `any`, value: [3, 4]},
          fill: {
            ...underlying.types.consonant,
            weak: {match: `type`, value: `boolean`},
          },
        },
      },
    },
    masdar: {
      wazn: [
        `fa33al`,
        `tfa33al`,
        `stfa33al`,
        `fe3al`,
        `tfe3al`,
        `stfe3al`,
        `af3al`,
        `nfa3al`,
        `nfi3il`,
        `fta3al`,
        `fti3il`,
        `staf3al`,
        `f3all`,
        `fa3la2`,
        `tfa3la2`,
        `stfa3la2`,
      ],
      root: {
        match: `array`,
        value: {
          length: {match: `any`, value: [3, 4]},
          fill: {
            ...underlying.types.consonant,
            weak: {match: `type`, value: `boolean`},
          },
        },
      },
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
    triliteral: {
      root: {
        match: `all`,
        value: [
          {length: 3},
          // XXX: this will probably accidentally work in practice but i probably x2 want an actual equality check
          {match: `custom`, value: root => root[1] !== root[2]},
        ],
      },
    },
    biliteral: {
      root: {
        match: `all`,
        value: [
          {length: 3},
          // XXX: this will probably accidentally work in practice but i probably x2 want an actual equality check
          {match: `custom`, value: root => root[1] === root[2]},
        ],
      },
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
      root: {2: {weak: true}},
    },
    nonpast: {
      tam: {
        match: `any`,
        value: [`imperative`, `indicative`, `subjunctive`],
      },
    },
  },
});
