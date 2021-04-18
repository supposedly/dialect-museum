const { parseWord } = require(`../utils/parseWord`);

function verb({
  meta: { conjugation, form, tam },
  value: { root, augmentation }
}) {
  const $ = parseWord({
    // TODO: implement suffix on conjugation
    suffix: conjugation.suffix,
    eraseStress: !!conjugation.suffix,
    augmentation
  });

  const [$F, $3, $L, $Q] = root;

  // hack to check if form is aa, ai, au, ia, ii, or iu
  if (form.length === 2) {
    if (tam === `pst`) {
      if (form[0] === `a`) {

      } else if (form[0] === `i`) {
        
      }
    } else {

    }
  }

  switch (form) {
    case `aa`:
      return [];
    case `ai`:
      return [];
    case `au`:
      return [];
    case `ia`:
      return [];
    case `ii`:
      return [];
    case `iu`:
      return [];
    case `fa33al`:
      return (
        [
          $`m.u ${$F}.a.${$3} ${$3}.I.${$L}`,
          $`m.u ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`
        ],
        [$`m.u ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `tfa33al`:
      return (
        [
          $`m.u ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`,
          $`m.u.t ${$F}.a.${$3} ${$3}.I.${$L}`
        ],
        [$`m.u.t ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `stfa33al`:
      // stanna-yestanna
      if ($F.value === `2` && $F.weak) {
        return (
          [
            $`m.u.s t.a.${$3} ${$3}.I.${$L}`,
            $`m.u.s t.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`
          ],
          [$`m.u.s t.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`]
        );
      }
      return (
        [
          $`m.u.s._.t ${$F}.a.${$3} ${$3}.I.${$L}`,
          $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`
        ],
        [$`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `fe3al`:
      return (
        [
          $`m.u ${$F}.aa ${$3}.I.${$L}`,
          $`m.u ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`
        ],
        [$`m.u ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `tfe3al`:
      return (
        [
          $`m.u ${$F}.aa ${$3}.I.${$L}`,
          $`m.u ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`
        ],
        [$`m.u ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `stfe3al`:
      // stehal-yestehal
      if ($F.value === `2` && $F.weak) {
        return (
          [
            $`m.u.s t.aa ${$3}.I.${$L}`,
            $`m.u.s t.aa ${$3}.a.${$L.meta.weak ? `` : $L}`
          ],
          [$`m.u.s t.aa ${$3}.a.${$L.meta.weak ? `` : $L}`]
        );
      }
      return (
        [
          $`m.u.s._.t ${$F}.aa ${$3}.I.${$L}`,
          $`m.u.s._.t ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`
        ],
        [$`m.u.s._.t ${$F}.aa ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `nfa3al`:
      if ($3.meta.weak) {
        return [$`m.u.n ${$F}.aa.${$L}`];
      }
      return (
        [
          $`m.a.${$F} ${$3}.uu.${$L}`,
          $`-m.u.n +${$F}.i -${$3}.I.${$L}`,
          $`-m.u.n +${$F}.a -${$3}.I.${$L}`,
          $`m.u.n ${$F}.i ${$3}.I.${$L}`,
          $`m.u.n ${$F}.a ${$3}.I.${$L}`
        ],
        [
          $`-m.u.n +${$F}.a -${$3}.a.${$L.meta.weak ? `` : $L}`,
          $`m.u.n ${$F}.a ${$3}.a.${$L.meta.weak ? `` : $L}`
        ]
      );
    case `fta3al`:
      if ($3.meta.weak) {
        return [$`m.u.${$F} t.aa.${$L}`];
      }
      return (
        [
          $`-m.u.${$F} +t.i -${$3}.I.${$L}`,
          $`-m.u.${$F} +t.a -${$3}.I.${$L}`,
          $`m.u.${$F} t.i ${$3}.I.${$L}`,
          $`m.u.${$F} t.a ${$3}.I.${$L}`,
          $`m.a.${$F} ${$3}.uu.${$L}`
        ],
        [
          $`-m.u.${$F} +t.a -${$3}.a.${$L.meta.weak ? `` : $L}`,
          $`m.u.${$F} t.a ${$3}.a.${$L.meta.weak ? `` : $L}`
        ]
      );
    case `staf3al`:
      if ($3.meta.weak) {
        return (
          [$`m.u.s._.t ${$F}.ii.${$L}`],
          [$`m.u.s._.t ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return (
          [$`m.u.s._.t ${$F}.i.${$3}.${$L}`],
          [$`m.u.s._.t ${$F}.a.${$3}.${$L}`]
        );
      }
      return (
        [$`m.u.s t.a.${$F} ${$3}.I.${$L}`],
        [$`m.u.s t.a.${$F} ${$3}.a.${$L.meta.weak ? `` : $L}`]
      );
    case `stAf3al`:
      if ($3.meta.weak) {
        return (
          [$`m.u.s t.a ${$F}.ii.${$L}`],
          [$`m.u.s t.a ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return (
          [$`m.u.s t.a ${$F}.i.${$3}.${$L}`],
          [$`m.u.s t.a ${$F}.a.${$3}.${$L}`]
        );
      }
      throw new Error(`Can't use stAf3al except with final-geminate and second-weak verbs`);
    case `f3all`:
      if (isActiveVoice) {
        return $`m.u.${$F} ${$3}.a.${$L}.${$L}`;
      }
      throw new Error(`Can't use passive voice with f3all`);
    case `fa3la2`:
      return (
        [
          $`m.u ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $`m.u ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`
        ],
        [$`m.u ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`]
      );
    case `tfa3la2`:
      return (
        [
          $`m.u ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`,
          $`m.u.t ${$F}.a.${$3} ${$L}.I.${$Q}`
        ],
        [$`m.u.t ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`]
      );
    case `stfa3la2`:
      if ($F.value === `2` && $F.weak) {
        // doesn't exist B)
        return (
          [
            $`m.u.s t.a.${$3} ${$L}.I.${$Q}`,
            $`m.u.s t.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`
          ],
          [$`m.u.s t.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`]
        );
      }
      return (
        [
          $`m.u.s._.t ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`
        ],
        [$`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q.meta.weak ? `` : $Q}`]
      );
    default:
      return null;
  }
}

module.exports = {
  pp: verb
};
