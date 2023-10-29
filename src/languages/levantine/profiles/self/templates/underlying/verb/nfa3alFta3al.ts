import templates from '/languages/levantine/rule-packs/north-levantine/templates/underlying';

const fti3il = templates.verb.fta3vl.fta3il(
  is => [
    is.fti3il(),
  ]
);

const ftilC = templates.verb.fta3vl.hollow(
  is => [
    is.medial.ftilC(),
  ]
);

const nfi3il = templates.verb.nfa3vl.nfa3il(
  is => [
    is.nfi3il(),
  ]
);

const nfilC = templates.verb.nfa3vl.hollow(
  is => [
    is.medial.nfilC(),
  ]
);

export default {
  rules: [
    fti3il,
    ftilC,
    nfi3il,
    nfilC,
  ],
  orderings: [],
  children: [],
};
