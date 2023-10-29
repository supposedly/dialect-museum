import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

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
