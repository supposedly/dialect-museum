const { parseWord, parseLetter } = require(`../utils/parseWord`);

const LAX_I = Object.freeze(parseLetter`i`);
const I = Object.freeze(parseLetter`I`);
const Y = Object.freeze({ ...parseLetter`y`, meta: { ...parseLetter`y`.meta, weak: true }});

function verb({
  meta: { conjugation, form, tam },
  value: { root: [$F, $3, $L, $Q], augmentation }
}) {
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
          // t.kuun
          { syllables: [conjugation.nonpast.prefix.subjunctive.cv], rest: [] },
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

  /* eslint-disable indent, semi-style */
  const parsers = prefixes
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
  ;
  /* eslint-enable indent, semi-style */

  // theo ther two are just so i can see more-easily which ones add affixes and which don't
  const $ = (...args) => parsers.map(f => f(...args));
  const $_ = $;
  const _$_ = $;

  const weakAA = $L.meta.weak && conjugation.person.first && conjugation.gender.masc;
  // const $originalL = $L;
  if ($L.meta.weak) {
    $L = Y;
  }

  // if (`aiu`.includes(form) && )  // 3atyit

  switch (form) {
    case `a`:
      if (tam === `pst`) {
        return $_`${$F}.a ${$3}.a.${$L}`;
      }
      if (tam === `imp`) {
        if ($L.meta.weak) {
          return [
            ...$_`2.i.${$F} ${$3}.aa`,
            ...$_`${$F}.${$3}.aa`
          ];
        }
        return [
          ...(conjugation.gender.masc ? $`${$F}.${$3}.aa.${$L}` : $_`${$F}.${$3}.a.${$L}`),
          $_`2.i.${$F} ${$3}.a.${$L}`
        ];
      }
      return _$_`${$F} ${$3}.a.${$L}`;
    case `i`:
      if (tam === `pst`) {
        return $_`${$F}.i ${$3}.I.${$L}`;
      }
      if (tam === `imp`) {
        return $_`2.i.${$F} ${$3}.I.${$L}`;
      }
      return _$_`${$F} ${$3}.I.${$L}`;
    case `u`:
      if (tam === `pst`) {
        throw new Error(`No past-tense conjugation in /u/ exists`);
      }
      if (tam === `imp`) {
        return [
          ...(conjugation.gender.masc ? $`${$F}.${$3}.oo.${$L}` : $_`${$F}.${$3}.U.${$L}`),
          $_`2.i.${$F} ${$3}.U.${$L}`
        ];
      }
      return _$_`${$F} ${$3}.U.${$L}`;
    case `fa33al`:
      if (tam === `pst`) {
        return weakAA
          ? [...$`${$F}.a.${$3} ${$3}.aa`, ...$`${$F}.i.${$3} ${$3}.aa`]
          : [...$_`${$F}.a.${$3} ${$3}.a.${$L}`, ...$_`${$F}.i.${$3} ${$3}.a.${$L}`];
      }
      // no need for "if imp" case bc this handles imperative too (right?)
      return $L.meta.weak
        ? [..._$_`${$F}.a.${$3} ${$3}.ii`, ..._$_`${$F}.i.${$3} ${$3}.ii`]
        : [..._$_`${$F}.a.${$3} ${$3}.I.${$L}`, ..._$_`${$F}.i.${$3} ${$3}.I.${$L}`];
    case `tfa33al`:
      if (tam === `pst`) {
        return weakAA
          ? [...$`t.${$F}.a.${$3} ${$3}.aa`, ...$`t.${$F}.i.${$3} ${$3}.aa`]
          : [...$_`t.${$F}.a.${$3} ${$3}.a.${$L}`, ...$_`t.${$F}.i.${$3} ${$3}.a.${$L}`];
      }
      return $L.meta.weak
        ? [..._$_`t.${$F}.a.${$3} ${$3}.ii`, ..._$_`t.${$F}.i.${$3} ${$3}.ii`]
        : [..._$_`t.${$F}.a.${$3} ${$3}.I.${$L}`, ..._$_`t.${$F}.i.${$3} ${$3}.I.${$L}`];
    case `stfa33al`:
      // stanna-yistanna
      if ($F.value === `2` && $F.weak) {
        if (tam === `pst`) {
          return weakAA
            ? [...$`s.t.a.${$3} ${$3}.aa`, ...$`s.t.i.${$3} ${$3}.aa`]
            : [...$_`s.t.a.${$3} ${$3}.a.${$L}`, ...$_`s.t.i.${$3} ${$3}.a.${$L}`];
        }
        return $L.meta.weak
          ? [..._$_`s.t.a.${$3} ${$3}.ii`, ..._$_`s.t.i.${$3} ${$3}.ii`]
          : [..._$_`s.t.a.${$3} ${$3}.I.${$L}`, ..._$_`s.t.i.${$3} ${$3}.I.${$L}`];
      }
      if (tam === `pst`) {
        return weakAA
          ? [...$`s.t.${$F}.a.${$3} ${$3}.aa`, ...$`s.t.${$F}.i.${$3} ${$3}.aa`]
          : [...$_`s.t.${$F}.a.${$3} ${$3}.a.${$L}`, ...$_`s.t.${$F}.i.${$3} ${$3}.a.${$L}`];
      }
      return $L.meta.weak
        ? [..._$_`s.t.${$F}.a.${$3} ${$3}.ii`, ..._$_`s.t.${$F}.i.${$3} ${$3}.ii`]
        : [..._$_`s.t.${$F}.a.${$3} ${$3}.I.${$L}`, ..._$_`s.t.${$F}.i.${$3} ${$3}.I.${$L}`];
    case `fe3al`:
      if (tam === `pst`) {
        return weakAA ? $`${$F}.aa ${$3}.aa` : $_`${$F}.aa ${$3}.a.${$L}`;
      }
      return $L.meta.weak ? _$_`${$F}.aa ${$3}.ii` : _$_`${$F}.aa ${$3}.I.${$L}`;
    case `tfe3al`:
      if (tam === `pst`) {
        return weakAA ? $`t.${$F}.aa ${$3}.aa` : $_`t.${$F}.aa ${$3}.a.${$L}`;
      }
      return $L.meta.weak ? _$_`t.${$F}.aa ${$3}.ii` : _$_`t.${$F}.aa ${$3}.I.${$L}`;
    case `stfe3al`:
      // stehal-yistehal
      if ($F.value === `2` && $F.weak) {
        if (tam === `pst`) {
          return weakAA ? $`s.t.aa ${$3}.aa` : $_`s.t.aa ${$3}.a.${$L}`;
        }
        return $L.meta.weak ? _$_`s.t.aa ${$3}.ii` : _$_`s.t.aa ${$3}.I.${$L}`;
      }
      if (tam === `pst`) {
        return weakAA ? $`s.t.${$F}.aa ${$3}.aa` : $_`s.t.${$F}.aa ${$3}.a.${$L}`;
      }
      return $L.meta.weak ? _$_`s.t.${$F}.aa ${$3}.ii` : _$_`s.t.${$F}.aa ${$3}.I.${$L}`;
    case `nfa3al`:
      if ($3.meta.weak) {
        return _$_`n.${$F}.aa.${$L}`;
      }
      if (tam === `pst`) {
        return weakAA ? $`n.${$F}.a ${$3}.aa` : $_`n.${$F}.a ${$3}.a.${$L}`;
      }
      return;  // yinfa3al, yinfi3il, yinf3il
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
