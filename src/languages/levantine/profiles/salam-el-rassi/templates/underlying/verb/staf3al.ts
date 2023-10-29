import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

export const stafaxc = templates.verb.staf3al.prefix.hollowOrGeminate(
  (is, when) => [
    when.affected(
      // no idea about his dialect here
      is.a(50),
      is.noA(50),
    ),
    is.noA(),
  ]
);

export const stfilC = templates.verb.staf3al.hollow(
  is => [
    // don't know this about his dialect
    is.medial.stfilC(),
  ]
);
