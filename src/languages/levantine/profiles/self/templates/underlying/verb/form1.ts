import templates from '/languages/levantine/rule-packs/north-levantine/templates/underlying';

const form1Imperative = templates.verb.form1.f3vl.imperative(
  (is, when) => [
    when.defective(
      is.prefix.$i(),
      is.body.f3vl(),
    ),
    when.hasAffix(
      is.body.f3vl(),
    ),
    is.prefix.$i(25),
    is.body.f3vl(25),  // how do i make this the same as the above 25 instead of the sole complement of the 75 :(
    is.body.f3vvl(75),
  ]
);

const fi3i = templates.verb.form1.fa3il.defective(
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

export default {
  rules: [
    form1Imperative,
    fi3i,
  ],
  orderings: [],
  children: [],
};
