// const vowels = require(`../vowels`);
import { obj } from '../../objects';
import { parseWord as $, parseSyllable } from '../../parse-word';
import utils from '../../utils';
const { misc: { lastOf }, syllables: { copy: copySyllable } } = utils;

// twenty and under
const uniqs = [
  // 0
  [
    ...$`s*.i.f.r`,
    ...$`s.i.f.r`,
  ],
  // 1
  {
    m: [
      ...$`w.AA 7.a.d`,
      ...$`w.aa 7.i.d`,
    ],
    f: $`w.i.7 d.c`,
  },
  // 2
  {
    m: $`t.n.ay.n`,
    f: [...$`t.i.n t.ay.n`, ...$`t.n.ay.n`],
  },
  // 3
  [
    // kl- will be added by transformers
    ...$`t.l.aa t.c`,
    ...$`t.n.aa t.c`,
  ],
  // 4
  $`2.a.r._.b 3.c`,
  // 5
  $`5.a.m s.c`,
  // 6
  $`s.i.t t.c`,
  // 7
  $`s.a.b 3.c`,
  // 8
  $`t.m.aa n.c`,
  // 9
  $`t.i.s 3.c`,
  // 10
  $`3.a.sh r.c`,
  // 11
  $`7.d.a.3.sh`,
  // 12
  $`t*.n.a.3.sh`,
  // 13
  [
    ...$`t.l.a.t t*.a.3.sh`,
    ...$`t.l.a.t* t*.a.3.sh`,
  ],
  // 14
  $`2.a.r b.a.3 t*.a.3.sh`,
  // 15
  $`5.a.m.s t*.a.3.sh`,
  // 16
  [
    ...$`s.i.t t*.a.3.sh`,
    ...$`s.i.t* t*.a.3.sh`,
  ],
  // 17
  $`s.a.b.3 t*.a.3.sh`,
  // 18
  $`t.m.a.n t*.a.3.sh`,
  // 19
  $`t.i.s.3 t*.a.3.sh`,
  // 20
  $`3.i.sh r.ii.n`,
];

// TODO: generate these automatically smdh
const construct = [
  // 0
  undefined,
  // 1
  undefined,
  // 2
  undefined,
  // 3
  [
    // kl- will be added by transformers
    ...$`t.l.aa.t`,
    ...$`t.l.a.t`,
    ...$`t.n.aa.t`,  // lol
    ...$`t.n.a.t`,  // x2
  ],
  // 4
  $`2.a.r b.a.3`,
  // 5
  $`5.a.m.s`,
  // 6
  $`s.i.t.t`,
  // 7
  $`s.a.b.3`,
  // 8
  [
    ...$`t.m.aa.n`,
    ...$`t.m.a.n`,
  ],
  // 9
  $`t.i.s.3`,
  // 10
  $`3.a.sh.r`,
  // 11
  $`7.d.a.3 sh.a.r`,
  // 12
  $`t*.n.a.3 sh.a.r`,
  // 13
  [
    ...$`t.l.a.t t*.a.3 sh.a.r`,
    ...$`t.l.a.t* t*.a.3 sh.a.r`,
  ],
  // 14
  $`2.a.r b.a.3 t*.a.3 sh.a.r`,
  // 15
  $`5.a.m.s t*.a.3 sh.a.r`,
  // 16
  [
    ...$`s.i.t t*.a.3 sh.a.r`,
    ...$`s.i.t* t*.a.3 sh.a.r`,
  ],
  // 17
  $`s.a.b.3 t*.a.3 sh.a.r`,
  // 18
  $`t.m.a.n t*.a.3 sh.a.r`,
  // 19
  $`t.i.s.3 t*.a.3 sh.a.r`,
];

// cursed lol
const tens = [
  undefined,
  undefined,
  undefined,
  ...uniqs.slice(0, 10).map(
    choices => choices.forEach(
      choice => ({
        ...choice,
        value: [
          ...choice.value.slice(0, -1),
          parseSyllable`${lastOf(choice.value).value[0]}.i.i.n`,
        ],
      })
    )
  ),
];

const hundreds = [
  undefined,
  // 100
  $`m.i.y y.c`,
  // 200
  $`m.ii t.ay.n`,  // XXX: maybe worth constructing as this[100] + dual
];

const thousands = [
  undefined,
  // 1000
  $`2.a.l.f`,
  // 2000
  $`2.a.l f.ay.n`, // XXX: ditto
];

function copyResults(results) {
  return results.map(
    result => obj.obj(
      result.type,
      ...result.meta,  // not copying bc this is only meant to run after the forms.forEach() below
      result.value.map(copySyllable),
    )
  );
}

// TODO: figure out -a in compound numbers (i.e. how to represent "wa7da w tletin" and stuff)
// TODO: figure out a solution to construct-state form that doesn't make the user specify it smh
export default function number({
  type: was,
  meta: {isConstruct = false, gender},
  value: {quantity},
}) {
  const wrap = (baseForms, constructForms) => {
    const forms = isConstruct ? baseForms : (constructForms || baseForms);
    forms.forEach(
      result => {
        result.meta = {was, quantity, gender};
      }
    );
    return forms.map(copyResults);
  };

  switch (quantity) {
    case 0:
      return wrap(uniqs[0]);
    case 1:
      return wrap(uniqs[1][gender]);
    case 2:
      return wrap(uniqs[2][gender]);
    case 3:
      return wrap(uniqs[3], construct[3]);
    case 4:
      return wrap(uniqs[4], construct[4]);
    case 5:
      return wrap(uniqs[5], construct[5]);
    case 6:
      return wrap(uniqs[6], construct[6]);
    case 7:
      return wrap(uniqs[7], construct[7]);
    case 8:
      return wrap(uniqs[8], construct[8]);
    case 9:
      return wrap(uniqs[9], construct[9]);
    case 10:
      return wrap(uniqs[10], construct[10]);
    case 11:
      return wrap(uniqs[11], construct[11]);
    case 12:
      return wrap(uniqs[12], construct[12]);
    case 13:
      return wrap(uniqs[13], construct[13]);
    case 14:
      return wrap(uniqs[14], construct[14]);
    case 15:
      return wrap(uniqs[15], construct[15]);
    case 16:
      return wrap(uniqs[16], construct[16]);
    case 17:
      return wrap(uniqs[17], construct[17]);
    case 18:
      return wrap(uniqs[18], construct[18]);
    case 19:
      return wrap(uniqs[19], construct[19]);
    case 20:
      return wrap(uniqs[20]);
    case 30:
      return wrap(tens[3]);
    case 40:
      return wrap(tens[4]);
    case 50:
      return wrap(tens[5]);
    case 60:
      return wrap(tens[6]);
    case 70:
      return wrap(tens[7]);
    case 80:
      return wrap(tens[8]);
    case 90:
      return wrap(tens[9]);
    case 100:
      return wrap(hundreds[1]);
    case 200:
      return wrap(hundreds[2]);
    case 1000:
      return wrap(thousands[1]);
    case 2000:
      return wrap(thousands[2]);
    default:
      throw new Error(`Can't construct arbitrary numbers with number tag, use idafah and "w"`);
  }
}
