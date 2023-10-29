import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';

export const aauu = underlying.cleanup.aauu(is => [
  is.uu(),
]);

export const aaii = underlying.cleanup.aaii(is => [
  is.ii(),
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
      is.emphatic(),
    ),
    when.afterShortI(
      is.plain(),
    ),
    when.afterLongII(
      is.plain(),
    ),
    when.inUmlaut(
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
