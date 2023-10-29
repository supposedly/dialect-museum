import templates from '/languages/levantine/rule-packs/lebanese/templates/underlying';

const voicing = templates.participle.higherForms(
  is => [
    is.distinctVoices(),
  ]
);

export default {
  rules: [
    voicing,
  ],
  orderings: [],
  children: [],
};
