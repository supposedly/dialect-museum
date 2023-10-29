import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

const af3al = templates.specialShapes.handle.af3al(
  is => [
    is.af3al(),
  ]
);

const fa3aaliiq = templates.specialShapes.handle.fa3aaliiq(
  is => [
    // don't know this about his dialect
    is.fa3aliiq(80),
    is.f3aaliiq(20),
  ]
);

const fa3aaliq = templates.specialShapes.handle.fa3aaliq(
  is => [
    is.fa3aaliq(50),
    is.f3aaliq(50),
  ]
);

const fa3ale = templates.specialShapes.handle.fa3ale(
  (is, when) => [
    when.inConstruct(
      ...when.beforePronoun(
        // raqbato
        is.fa3le(),
      ),
    ),
    is.fa3ale(),
  ]
);

const maf3ale = templates.specialShapes.handle.maf3ale(
  (is, when) => [
    when.affected(
      is.maf3ale(),
    ),
    is.maf3ale(20),
    // not sure about this in his dialect
    is.maf3ile(80),
  ]
);

export default {
  rules: [
    af3al,
    fa3aaliiq,
    fa3aaliq,
    fa3ale,
    maf3ale,
  ],
  orderings: [],
  children: [],
};
