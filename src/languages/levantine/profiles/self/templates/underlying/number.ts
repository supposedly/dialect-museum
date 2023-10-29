import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';

export const oneM = templates.number.cardinal.one.masculine(
  is => [
    is.Waa7ad(),
  ]
);

export const oneF = templates.number.cardinal.one.feminine(
  is => [
    is.wi7de(),
  ]
);

export const eleven = templates.number.cardinal.teens.eleven(
  is => [
    is.xda3sh(),
  ]
);

export const twelve = templates.number.cardinal.teens.twelve(
  is => [
    is.Tna3sh(),
  ]
);

export const tneena = templates.number.bases.two(
  is => [
    is.tneen(),
  ]
);

// i don't think this will work how i intend
export const tman = templates.number.bases.eight(
  is => [
    is.tman(),
  ]
);

export const tlaat = templates.number.bases.three(
  is => [
    is.tlaat(),
  ]
);

export const tlatt = templates.number.bases.threeTeen(
  is => [
    is.tlatt(),
  ]
);
