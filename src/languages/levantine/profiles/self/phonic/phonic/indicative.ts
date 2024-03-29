import phonic from 'src/languages/levantine/rule-packs/north-levantine/phonic/phonic';

export const indicative = phonic.indicative.thirdPerson(
  is => [
    // think this is only for eg *bye2uul and doesn't account for byektob
    // (no problem in my dialect but need bektob for others)
    is.be_(),
  ],
);
