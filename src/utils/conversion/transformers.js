const { syllabify: $ } = require(`./utils`);

function pp(o) {
  const { conjugation, form, voice } = o.meta;
  const { root, augmentation } = o.value;

  const pick = (active, passive) => (voice === `active` ? active : passive);

  const [$F, $3, $L, $Q] = root;

  switch (form) {
    case `fa33al`:
      return pick(
        [
          $`m.u ${$F}.a.${$3} ${$3}.i.${$L}`,
          $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$`m.u ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `tfa33al`:
      return pick(
        [
          $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`,
          $`m.u.t ${$F}.a.${$3} ${$3}.i.${$L}`
        ],
        [$`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `stfa33al`:
      return pick(
        [
          $`m.u.s._.t ${$F}.a.${$3} ${$3}.i.${$L}`,
          $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `fe3al`:
      return pick(
        [
          $`m.u ${$F}.aa ${$3}.i.${$L}`,
          $`m.u ${$F}.aa ${$3}.a.${$L}`
        ],
        [$`m.u ${$F}.aa ${$3}.a.${$L}`]
      );
    case `tfe3al`:
      return pick(
        [
          $`m.u ${$F}.aa ${$3}.i.${$L}`,
          $`m.u ${$F}.aa ${$3}.a.${$L}`
        ],
        [$`m.u ${$F}.aa ${$3}.a.${$L}`]
      );
    case `stfe3al`:
      return pick(
        [
          $`m.u.s._.t ${$F}.aa ${$3}.i.${$L}`,
          $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`
        ],
        [$`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`]
      );
    case `nfa3al`:
      return pick(
        [
          $`-m.u.n +${$F}.i -${$3}.i.${$L}`,
          $`m.a.${$F} ${$3}.uu.l`
        ]
      );
    default:
      return null;
  }
}

module.exports = {
  pp
};
