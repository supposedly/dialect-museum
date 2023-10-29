import templates from '/languages/levantine/rule-packs/north-levantine/templates/underlying';

const stafaxc = templates.verb.staf3al.prefix.hollowOrGeminate(
  (is, when) => [
    when.affected(
      // no idea about his dialect here
      is.a(50),
      is.noA(50),
    ),
    is.noA(),
  ]
);

const stfilC = templates.verb.staf3al.hollow(
  is => [
    // don't know this about his dialect
    is.medial.stfilC(),
  ]
);

export default {
  rules: [
    stafaxc,
    stfilC,
  ],
  orderings: [],
  children: [],
};
