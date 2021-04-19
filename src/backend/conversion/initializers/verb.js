const { parseWord, parseLetter } = require(`../utils/parseWord`);

const LAX_I = Object.freeze(parseLetter`i`);
const I = Object.freeze(parseLetter`I`);

function verb({
  meta: { conjugation, form, tam },
  value: { root, augmentation }
}) {
  const [$F, $3, $L, $Q] = root;

  // either the 2nd segment of the form is a vowel
  // or the verb is form-1 with a weak medial consonant
  const isCV = `aeiou`.includes(form[1]) || (`aiu`.includes(form) && $3.meta.weak);

  let prefixes;
  let suffix;
  switch (tam) {
    case `sbjv`:
      if (isCV) {
        prefixes = [
          // tkuun
          { syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cv },
          // tikuun
          { syllables: [[...conjugation.nonpast.prefix.subjunctive.cv, LAX_I]], rest: [] }
        ];
      } else {
        // tiktub
        prefixes = [
          { syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cc }
        ];
      }
      suffix = conjugation.nonpast.suffix;
      break;
    case `ind`:
      if (isCV) {
        prefixes = [
          // bitkuun
          {
            syllables: [[
              ...conjugation.nonpast.prefix.indicative,
              I,
              ...conjugation.nonpast.prefix.subjunctive.cv
            ]],
            rest: []
          },
          // btikuun (idk lol found it more than once online)
          {
            syllables: [[
              ...conjugation.nonpast.prefix.indicative,
              ...conjugation.nonpast.prefix.subjunctive.cv,
              LAX_I
            ]],
            rest: []
          }
        ];
      } else {
        const cc = conjugation.nonpast.prefix.subjunctive.cc;
        if (cc[0].value === `2`) {
          // b + 2 + ktub = biktub, not b2iktub
          // the sbjv prefix in this case starts with 2 so the .slice(1) gets rid of it
          prefixes = [
            { syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc.slice(1)] }
          ];
        } else {
          prefixes = [
            // btiktub
            { syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc] },
            // bitiktub (again idk found it online more than once lul)
            {
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I]],
              rest: [[...cc, LAX_I]]
            }
          ];
        }
      }
      suffix = conjugation.nonpast.suffix;
      break;
    case `imp`:
      prefixes = [];
      suffix = conjugation.nonpast.suffix;
      break;
    case `pst`:
      prefixes = [];
      suffix = conjugation.past.suffix;
      break;
    default:  // error?
      prefixes = undefined;
      suffix = undefined;
  }

  /* eslint-disable indent */  // (for the second branch of the conditional)
  const parsers = (
    prefixes
      ? prefixes.map(prefix => parseWord({
        prefix,
        suffix,
        eraseStress: !!suffix,
        augmentation
      }))
      : [parseWord({
          prefix: null,
          suffix,
          eraseStress: !!suffix,
          augmentation
        })]
  );
  /* eslint-enable indent */

  const $ = (...args) => parsers.map(f => f(...args));

  switch (form) {
    case `a`:
      return [];
    case `i`:
      return [];
    case `u`:
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
      return $`m.u.${$F} ${$3}.a.${$L}.${$L}`;
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
