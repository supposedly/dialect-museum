import underlying from 'src/languages/levantine/rule-packs/north-levantine/underlying/underlying';
import {MatchAsType} from 'src/lib/utils/match';

export const pl1 = underlying.pronoun.standalone.firstPerson.plural(is => [is.ni7na()]);

export const sg2Stem = underlying.pronoun.standalone.secondPerson.stem(
  is => [
    is.int(),
  ]
);
export const msg2 = underlying.pronoun.standalone.secondPerson.singular.masculine(
  ending => [
    ending.none(),
  ]
);

export const msg3 = underlying.pronoun.standalone.thirdPerson.singular.masculine(
  is => [
    is.base.huu(),
  ]
);
export const fsg3 = underlying.pronoun.standalone.thirdPerson.singular.feminine(
  is => [
    is.base.hii(),
  ]
);
export const pl3 = underlying.pronoun.standalone.thirdPerson.plural(
  is => [
    // i forget if it's hinn or hinne
    is.base.hinn(),
    is.ending.e(),
  ]
);
