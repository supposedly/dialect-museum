import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

export const aauu = underlying.cleanup.aauu(is => [
  is.aw(),
]);

export const aaii = underlying.cleanup.aaii(is => [
  is.ay(),
]);

export const contraction = underlying.contractableLongVowel(
  (is, when) => [
    when.beforeDative(
      is.contracted(),
    ),
    when.beforeJiyy(
      is.contracted(),
    ),
  ]
);

export const r = underlying.r(
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
