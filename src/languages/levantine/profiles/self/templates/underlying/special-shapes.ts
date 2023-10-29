import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

export const af3al = templates.specialShapes.handle.af3al(
  is => [
    is.af3al(),
  ]
);

export const fa3aaliiq = templates.specialShapes.handle.fa3aaliiq(
  is => [
    is.fa3aliiq(80),
    is.f3aaliiq(20),
  ]
);

export const fa3aaliq = templates.specialShapes.handle.fa3aaliq(
  is => [
    is.fa3aaliq(50),
    is.f3aaliq(50),
  ]
);

export const fa3ale = templates.specialShapes.handle.fa3ale(
  (is, when) => [
    when.affected(
      is.fa3ale(),
    ),
    when.inConstruct(
      is.fa3le(),
    ),
    is.fa3ale(20),
    is.fa3le(80),
  ]
);

export const maf3ale = templates.specialShapes.handle.maf3ale(
  (is, when) => [
    when.affected(
      is.maf3ale(),
    ),
    is.maf3ale(20),
    is.maf3ile(80),
  ]
);
