const { parseWord } = require(`../utils/parseWord`);

function pp({
  meta: { conjugation, form, voice },
  value: {
    root: [$F, $3, $L, $Q],
    augmentation
  }
}) {
  const isActiveVoice = voice === `active`;

  const $ = parseWord({
    suffix: conjugation.participle.suffix,
    eraseStress: !!conjugation.participle.suffix,
    augmentation
  });

  const pickVoice = (active, passive) => (isActiveVoice ? active : passive);

  switch (form) {
    case `1/both`:
      if (isActiveVoice) {
        throw new Error(`Active voice is currently unsupported with 1/both`);
      }
      // now passive
      if ($3.meta.weak) {
        const variants = [];
        if ($F.value === `n`) {
          if ($L.meta.weak) {
            variants.push(
              $`-m.u.${$F} +t.i -${$3}.I.y`,
              $`m.u.${$F}.t ${$3}.I.y`,
              $`-m.u.${$F} +t.i -${$3}.ii.y`,
              $`m.u.${$F}.t ${$3}.ii.y`
            );
          } else {
            variants.push($`m.u.${$F} t.aa.${$L}`);
          }
        }
        if ($L.meta.weak) {
          // doesn't exist B)
          variants.push(
            $`m.i.${$F} y.I.y`,
            $`m.i.${$F} y.ii.y`
          );
        } else {
          variants.push(
            $`m.i.n ${$F}.aa.${$L}`,
            $`m.a.${$F} y.uu.${$L}`
          );
        }
        return variants;
      }
      if ($L.meta.weak) {
        return [
          $`m.i.${$F} ${$3}.I.y`,
          $`m.i.${$F} ${$3}.ii.y`
        ];
      }
      // default
      return [$`m.a.${$F} ${$3}.uu.${$L}`];
    case `1/fe3il`:
      if (isActiveVoice) {
        const variants = [];
        // 2akal, 2a5ad
        if ($F.value === `2` && $F.meta.weak) {
          variants.push(
            $3.meta.weak
              ? $`m.aa y.I.${$L}`  // doesn't exist B)
              : $`m.aa ${$3}.I.${$L}`
          );
        }
        if ($3.value === $L.value) {
          variants.push($`${$F}.aa.${$3}${$L}`);
        }
        return [
          ...variants,
          $3.meta.weak ? $`${$F}.aa y.I.${$L}` : $`${$F}.aa ${$3}.I.${$L}`
        ];
      }
      throw new Error(`Can't use passive voice with 1/fe3il`);
    case `1/fa3len`:
      if (isActiveVoice) {
        return [
          $`${$F}.i.${$3} ${$L}.aa.n`,
          $`${$F}.a.${$3} ${$L}.aa.n`
        ];
      }
      throw new Error(`Can't use passive voice with 1/fa3len`);
    case `fa33al`:
      return pickVoice(
        [
          $`m.u ${$F}.a.${$3} ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `tfa33al`:
      return pickVoice(
        [
          $L.meta.weak ? $`m.u ${$F}.a.${$3} ${$3}.aa` : $`m.u ${$F}.a.${$3} ${$3}.a.${$L}`,
          $`m.u.t ${$F}.a.${$3} ${$3}.I.${$L}`
        ],
        [$L.meta.weak ? $`m.u.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `stfa33al`:
      // stanna-yestanna
      if ($F.value === `2` && $F.weak) {
        return pickVoice(
          [
            $`m.u.s t.a.${$3} ${$3}.I.${$L}`,
            $L.meta.weak ? $`m.u.s t.a.${$3} ${$3}.aa` : $`m.u.s t.a.${$3} ${$3}.a.${$L}`
          ],
          [$L.meta.weak ? $`m.u.s t.a.${$3} ${$3}.aa` : $`m.u.s t.a.${$3} ${$3}.a.${$L}`]
        );
      }
      return pickVoice(
        [
          $`m.u.s._.t ${$F}.a.${$3} ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$3}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$3}.a.${$L}`]
      );
    case `fe3al`:
      return pickVoice(
        [
          $`m.u ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`]
      );
    case `tfe3al`:
      return pickVoice(
        [
          $`m.u ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u ${$F}.aa ${$3}.aa` : $`m.u ${$F}.aa ${$3}.a.${$L}`]
      );
    case `stfe3al`:
      // stehal-yestehal
      if ($F.value === `2` && $F.weak) {
        return pickVoice(
          [
            $`m.u.s t.aa ${$3}.I.${$L}`,
            $L.meta.weak ? $`m.u.s t.aa ${$3}.aa` : $`m.u.s t.aa ${$3}.a.${$L}`
          ],
          [$L.meta.weak ? $`m.u.s t.aa ${$3}.aa` : $`m.u.s t.aa ${$3}.a.${$L}`]
        );
      }
      return pickVoice(
        [
          $`m.u.s._.t ${$F}.aa ${$3}.I.${$L}`,
          $L.meta.weak ? $`m.u.s._.t ${$F}.aa ${$3}.aa` : $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`
        ],
        [$L.meta.weak ? $`m.u.s._.t ${$F}.aa ${$3}.aa` : $`m.u.s._.t ${$F}.aa ${$3}.a.${$L}`]
      );
    case `nfa3al`:
      if ($3.meta.weak) {
        return [$`m.u.n ${$F}.aa.${$L}`];
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [
            $`m.a.${$F} ${$3}.uu.${$L}`,
            $`m.u.n ${$F}.a.${$3}.${$L}`
          ],
          [$`m.u.n ${$F}.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        [
          $`m.a.${$F} ${$3}.uu.${$L}`,
          $`-m.u.n +${$F}.i -${$3}.I.${$L}`,
          $`-m.u.n +${$F}.a -${$3}.I.${$L}`,
          $`m.u.n ${$F}.i ${$3}.I.${$L}`,
          $`m.u.n ${$F}.a ${$3}.I.${$L}`
        ],
        [
          $L.meta.weak ? $`-m.u.n +${$F}.a -${$3}.aa` : $`-m.u.n +${$F}.a -${$3}.a.${$L}`,
          $L.meta.weak ? $`m.u.n ${$F}.a ${$3}.aa` : $`m.u.n ${$F}.a ${$3}.a.${$L}`
        ]
      );
    case `fta3al`:
      if ($3.meta.weak) {
        return [$`m.u.${$F} t.aa.${$L}`];
      }
      if ($3.value === $L.value) {
        return pickVoice(
          [$`m.u.${$F} t.a.${$3}.${$L}`],
          [$`m.u.${$F} t.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        [
          $`-m.u.${$F} +t.i -${$3}.I.${$L}`,
          $`-m.u.${$F} +t.a -${$3}.I.${$L}`,
          $`m.u.${$F} t.i ${$3}.I.${$L}`,
          $`m.u.${$F} t.a ${$3}.I.${$L}`,
          $`m.a.${$F} ${$3}.uu.${$L}`
        ],
        [
          $L.meta.weak ? $`-m.u.${$F} +t.a -${$3}.aa` : $`-m.u.${$F} +t.a -${$3}.a.${$L}`,
          $L.meta.weak ? $`m.u.${$F} t.a ${$3}.aa` : $`m.u.${$F} t.a ${$3}.a.${$L}`
        ]
      );
    case `staf3al`:
      if ($3.meta.weak) {
        return pickVoice(
          [$`m.u.s._.t ${$F}.ii.${$L}`],
          [$`m.u.s._.t ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
          [$`m.u.s._.t ${$F}.i.${$3}.${$L}`],
          [$`m.u.s._.t ${$F}.a.${$3}.${$L}`]
        );
      }
      return pickVoice(
        [$`m.u.s t.a.${$F} ${$3}.I.${$L}`],
        [$L.meta.weak ? $`m.u.s t.a.${$F} ${$3}.aa` : $`m.u.s t.a.${$F} ${$3}.a.${$L}`]
      );
    case `stAf3al`:
      if ($3.meta.weak) {
        return pickVoice(
          [$`m.u.s t.a ${$F}.ii.${$L}`],
          [$`m.u.s t.a ${$F}.aa.${$L}`]
        );
      }
      // geminate root
      if ($3.value === $L.value) {
        return pickVoice(
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
      return pickVoice(
        [
          $`m.u ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    case `tfa3la2`:
      return pickVoice(
        [
          $Q.meta.weak ? $`m.u ${$F}.a.${$3} ${$L}.aa` : $`m.u ${$F}.a.${$3} ${$L}.a.${$Q}`,
          $`m.u.t ${$F}.a.${$3} ${$L}.I.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.t ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    case `stfa3la2`:
      if ($F.value === `2` && $F.weak) {
        // doesn't exist B)
        return pickVoice(
          [
            $`m.u.s t.a.${$3} ${$L}.I.${$Q}`,
            $Q.meta.weak ? $`m.u.s t.a.${$3} ${$L}.aa` : $`m.u.s t.a.${$3} ${$L}.a.${$Q}`
          ],
          [$Q.meta.weak ? $`m.u.s t.a.${$3} ${$L}.aa` : $`m.u.s t.a.${$3} ${$L}.a.${$Q}`]
        );
      }
      return pickVoice(
        [
          $`m.u.s._.t ${$F}.a.${$3} ${$L}.I.${$Q}`,
          $Q.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`
        ],
        [$Q.meta.weak ? $`m.u.s._.t ${$F}.a.${$3} ${$L}.aa` : $`m.u.s._.t ${$F}.a.${$3} ${$L}.a.${$Q}`]
      );
    default:
      return null;
  }
}

module.exports = {
  pp
};
