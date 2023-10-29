import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

const morphology = phonic.stress.morphology(
  (is, when) => [
    when.Af3alatv(
      is.stressed(),
    ),
    when.inFemConj(
      is.stressed(),
    ),
    when.before3ms(
      is.stressed(25),
    ),
    // think this is maarkIto
    when.iCItv(
      is.stressed(25),
    ),
  ]
);

export default {
  rules: [
    morphology,
  ],
  orderings: [],
  children: [],
};
