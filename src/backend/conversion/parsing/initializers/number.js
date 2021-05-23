const {parseWord: $, parseSyllable} = require(`../../parse-word`);
const {misc: {lastOf}} = require(`../../utils`);

// twenty and under
const genUniqs = () => [
  // 0
  [
    ...$`s*.i.f.r`,
    ...$`s.i.f.r`,
  ],
  // 1
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
  $`t.m.aa.n.c`,
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

// cursed lol
const genTens = uniq => [
  undefined,
  undefined,
  undefined,
  ...uniq.slice(0, 10).map(
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

const genHundreds = () => [
  undefined,
  // 100
  $`m.i.y y.c`,
  // 200
  $`m.ii t.ay.n`,  // XXX: maybe worth constructing as this[100] + dual
];

const genThousands = () => [
  undefined,
  // 1000
  $`2.a.l.f`,
  // 2000
  $`2.a.l f.ay.n`, // XXX: ditto
];

// TODO: figure out -a in compound numbers (i.e. how to represent "wa7da w tletin" and stuff)
function number({
  type: was,
  value: {quantity, gender},
}) {
  const wrap = results => results.forEach(
    result => {
      result.meta = {was, quantity, gender, endsIn: lastOf(lastOf(result.value).value).value};
    }
  );
  const uniq = genUniqs();
  const tens = genTens(uniq);
  const hundreds = genHundreds();
  const thousands = genThousands();

  switch (quantity) {
    case 0:
      return wrap(uniq[0]);
    case 1:
      return wrap(uniq[1][gender]);
    case 2:
      return wrap(uniq[2][gender]);
    case 3:
      return wrap(uniq[3]);
    case 4:
      return wrap(uniq[4]);
    case 5:
      return wrap(uniq[5]);
    case 6:
      return wrap(uniq[6]);
    case 7:
      return wrap(uniq[7]);
    case 8:
      return wrap(uniq[8]);
    case 9:
      return wrap(uniq[9]);
    case 10:
      return wrap(uniq[10]);
    case 11:
      return wrap(uniq[11]);
    case 12:
      return wrap(uniq[12]);
    case 13:
      return wrap(uniq[13]);
    case 14:
      return wrap(uniq[14]);
    case 15:
      return wrap(uniq[15]);
    case 16:
      return wrap(uniq[16]);
    case 17:
      return wrap(uniq[17]);
    case 18:
      return wrap(uniq[18]);
    case 19:
      return wrap(uniq[19]);
    case 20:
      return wrap(uniq[20]);
    case 30:
      return wrap(tens[3]);
    case 40:
      return wrap(tens[4]);
    case 50:
      return wrap(tens[5]);
    case 60:
      return wrap(uniq[6]);
    case 70:
      return wrap(uniq[7]);
    case 80:
      return wrap(uniq[8]);
    case 90:
      return wrap(uniq[9]);
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

module.exports = {
  number,
};
