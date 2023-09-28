import {alphabet} from "/lib/alphabet";
import {underlying} from "../underlying/underlying";

/*
  idafe
*/
export const category = alphabet({
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
