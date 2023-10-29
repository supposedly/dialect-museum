import templates from '/languages/levantine/rule-packs/north-levantine/templates/underlying';

const oneM = templates.number.cardinal.one.masculine(
  is => [
    // -> wee7ad
    is.waa7ad(),
  ]
);

const oneF = templates.number.cardinal.one.feminine(
  is => [
    is.wi7de(),
  ]
);

const eleven = templates.number.cardinal.teens.eleven(
  is => [
    is.xda3sh(),
  ]
);

const twelve = templates.number.cardinal.teens.twelve(
  is => [
    is.Tna3sh(),
  ]
);

const tneena = templates.number.bases.two(
  is => [
    is.tneen(),
  ]
);

// i don't think this will work how i intend
const tman = templates.number.bases.eight(
  is => [
    is.tman(),
  ]
);

const tlaat = templates.number.bases.three(
  is => [
    // tleeti
    is.tlaat(),
  ]
);

const tlatt = templates.number.bases.threeTeen(
  is => [
    // don't know this about his dialect
    is.tlatt(),
  ]
);


export default {
  rules: [
    oneM,
    oneF,
    eleven,
    twelve,
    tneena,
    tman,
    tlaat,
    tlatt,
  ],
  orderings: [],
  children: [],
};
