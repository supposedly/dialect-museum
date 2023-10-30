import templates from 'src/languages/levantine/rule-packs/north-levantine/templates/underlying';
import sharedOdds from 'src/lib/rules/odds';

const if3vl = sharedOdds();
export const form1Imperative = templates.verb.form1.f3vl.imperative(
  (is, when) => [
    when.defective(
      is.prefix.$i(),
      is.body.f3vl(),
    ),
    when.hasAffix(
      is.body.f3vl(),
    ),
    is.prefix.$i(if3vl(25)),
    is.body.f3vl(if3vl(25)),
    is.body.f3vvl(75),  // don't know if this describes his dialect or not
  ]
);

export const fi3i = templates.verb.form1.fa3il.defective(
  (is, when) => [
    when.beforeVowel(
      ...when.wasMaziid(
        // don't know this about his dialect
        is.ending.none(),
      ),
    ),
    is.ending.y(),
  ]
);
