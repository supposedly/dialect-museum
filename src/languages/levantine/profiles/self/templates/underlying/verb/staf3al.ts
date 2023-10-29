import templates from '/languages/levantine/rule-packs/lebanese/templates/underlying';

const stafaxc = templates.verb.staf3al.prefix.hollowOrGeminate(
  (is, when) => [
    when.affected(
      is.a(50),
      is.noA(50),
    ),
    is.noA(),
  ]
);

const stfilC = templates.verb.staf3al.hollow(
  is => [
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
