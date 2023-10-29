import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const epenthetic = phonic.cvcc.epenthetic(
  is => [
    is.e(50),
  ]
);
