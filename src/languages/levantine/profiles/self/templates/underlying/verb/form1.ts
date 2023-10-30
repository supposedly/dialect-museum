import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';
import sharedOdds from 'src/lib/rules/odds';

const if3vlOdds = sharedOdds();
export const form1Imperative = templates.verb.form1.f3vl.imperative(
  (is, when) => [
    when.defective(
      is.prefix.$i(),
      is.body.f3vl(),
    ),
    when.hasAffix(
      is.body.f3vl(),
    ),
    is.prefix.$i(if3vlOdds(25)),
    is.body.f3vl(if3vlOdds(25)),
    is.body.f3vvl(75),
  ]
);

export const fi3i = templates.verb.form1.fa3il.defective(
  (is, when) => [
    when.beforeVowel(
      ...when.wasMaziid(
        is.ending.none(),
      ),
      ...when.velarFinal(
        is.ending.y(50),
        is.ending.none(50),
      ),
    ),
    is.ending.y(),
  ]
);
