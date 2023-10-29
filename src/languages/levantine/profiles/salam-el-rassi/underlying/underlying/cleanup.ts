import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

const aauu = underlying.cleanup.aauu(is => [
  is.aw(),
]);

const aaii = underlying.cleanup.aaii(is => [
  is.ay(),
]);

const contraction = underlying.contractableLongVowel(
  (is, when) => [
    when.beforeDative(
      is.contracted(),
    ),
    when.beforeJiyy(
      is.contracted(),
    ),
  ]
);

const r = underlying.r(
  (is, when) => [
    when.directlyAfterShortI(
      // don't know this about his dialect (mdabbre? mdabbra?)
      is.emphatic(),
    ),
    when.afterShortI(
      is.plain(),
    ),
    when.afterLongII(
      is.plain(),
    ),
    when.inUmlaut(
      // don't know this about his dialect
      is.emphatic(50),
    ),
    when.beforeUmlaut(
      ...when.custom(
        {
          was: {
            templates: {
              spec: ({number}) => number({value: 4, type: `ordinal`}),
            },
          },
        },
        is.emphatic(),
      ),
      is.emphatic(25),
    ),
  ]
);


export default {
  rules: [
    aauu,
    aaii,
    contraction,
    r,
  ],
  orderings: [],
  children: [],
};
