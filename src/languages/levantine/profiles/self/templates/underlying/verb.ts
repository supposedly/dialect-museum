import templates from '/languages/levantine/rule-packs/lebanese/templates/underlying';

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
    is.body.f3vl(25),  // how do i make this the same as the above 25 instead of the below :/
    is.body.f3vvl(75),
  ]
);
