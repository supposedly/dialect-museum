import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

const quadriliteral = templates.masdar.quadriliteral(
  (is, when) => [
    when.tfa3la2(
      ...when.affected(
        is.tafa3lu2(),
      )
    ),
    is.fa3la2a(),
  ]
);

const tif3iil = templates.masdar.fa33al.other(
  (is, when) => [
    when.affected(
      is.taf3iil(),
    ),
    is.tif3iil(),
  ]
);

export default {
  rules: [
    quadriliteral,
    tif3iil,
  ],
  orderings: [],
  children: [],
};
