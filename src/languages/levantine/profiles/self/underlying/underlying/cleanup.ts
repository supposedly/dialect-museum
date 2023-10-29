import underlying from '/languages/levantine/rule-packs/north-levantine/underlying/underlying';

const aauu = underlying.cleanup.aauu(is => [
  is.uu(),
]);

const aaii = underlying.cleanup.aaii(is => [
  is.ii(),
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
