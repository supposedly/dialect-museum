import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

// idea: maybe runtime doesn't transform mock nodes that are the same as the fixture that's their parent
// thinking about aa -> aa and stuff... maybe also epenthetic null -> null... not sure

const alif = phonic.vowel.original.alif(
  (is, when) => [
    when.inDisyllable(
      ...when.beforeBackConsonant(
        is.ae(),
      ),
    ),
    when.afterPharyngeal(
      ...when.inFaa3il(
        is.ee(50),
      ),
      is.aa(),
    ),
    when.afterBackConsonant(
      ...when.inFaa3il(
        is.ee(50),
      ),
      is.ae(),
    ),
    when.afterR(
      ...when.nearI(
        // ????
        is.ee(),
      ),
      // maybe target was-emphatic R instead of this lol...
      is.highAA(),
    ),
    when.beforeR(
      ...when.beforeIyy(
        is.ee(),
      ),
      is.highAA(),
    ),
    when.nextToEmphatic(
      is.AA(),
    ),
    is.ee(),
  ]
);

export default {
  rules: [
    alif,
  ],
  orderings: [],
  children: [],
};
