import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

export const quadriliteral = templates.masdar.quadriliteral(
  (is, when) => [
    when.tfa3la2(
      ...when.affected(
        is.tafa3lu2(),
      )
    ),
    is.fa3la2a(),
  ]
);

export const tif3iil = templates.masdar.fa33al.other(
  (is, when) => [
    when.affected(
      is.taf3iil(),
    ),
    is.tif3iil(),
  ]
);
