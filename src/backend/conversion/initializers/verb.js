const {
  parseWord: { parseWord, parseLetter },
  misc: {
    lastOf,
    copy,
    newSyllable,
    invMap
  }
} = require(`../utils`);

const LAX_I = Object.freeze(parseLetter`i`);
const I = Object.freeze(parseLetter`I`);
const Y = Object.freeze({ ...parseLetter`y`, meta: { ...parseLetter`y`.meta, weak: true }});

function addPrefix(syllables, rest) {
  return base => {
    const firstSyllable = base[0].value;
    // yi+ktub => yik+tub
    // yi+stla2-2a => yist+la2-2a
    // (FIXME: idk what to do about noSchwa or whatever in that last case
    // -- in the future might have to do like _$`s._.t.blahblah` below
    // and then make noSchwa delete itself if not "/ CVC_C", but
    // that has to wait till i get the whole transformer system working)
    if (rest.length) {
      if (lastOf(rest).type === `vowel`) {
        const postPrefix = newSyllable(copy(rest));
        while (firstSyllable[0].type === `consonant` && firstSyllable[1].type !== `vowel`) {
          postPrefix.value.push(firstSyllable.shift());
        }
        base.unshift(postPrefix);
      } else {
        firstSyllable.unshift(...rest);
      }
    }
    base.unshift(...syllables);
  };
}

function makePrefixers(...prefixes) {
  return prefixes.map(
    // the object { syllables, rest } is from `switch (tam) {}` in verb() below
    ({ syllables, rest }) => addPrefix(
      syllables.map(copy).map(newSyllable),
      copy(rest)
    )
  );
}

function makeSuffixer(suffix) {
  if (!suffix.length) {
    return _base => {};
  }
  if (suffix[0].type === `consonant`) {
    return base => {
      base.push(newSyllable(copy(suffix)));
    };
  }
  return base => {
    const lastSyllable = lastOf(base).value;
    switch (lastOf(lastSyllable).type) {
      case `vowel`:
        if (
          // $`Fem` is the only `type: suffix` object that can be found on verbs here
          // and its initial segment is in fact a vowel
          suffix[0].type === `vowel` || suffix[0].value === `fem`
        ) {
          // if we have an ending like $`.aa`, delete it before adding a
          // vowel-initial suffix
          lastSyllable.splice(-1, 1);
        }
        // this is valid because suffixes are monosyllabic as implemented rn
        // if they weren't then this would need to be like ...suffix[0]
        // and the rest of the suffix's syllables would need to be
        // added to base afterwards
        lastSyllable.push(...suffix);
        // (btw this could also have been an if-else with the
        // first branch instead doing `.splice(-1, 1, ...suffix);`)
        break;
      case `consonant`:
        base.push(newSyllable([lastSyllable.pop(), ...suffix]));
        break;
      default:
        throw new Error(`Didn't expect types besides vowel/consonant in the base word`);
    }
  };
}

function verb({
  meta: { conjugation, form, tam },
  value: { root: [$F, $3, $L, $Q], augmentation }
}) {
  // either the 2nd segment of the form is a vowel
  // or the verb is form-1 with a weak medial consonant
  const isCV = `aeiou`.includes(form[1]) || (`aiu`.includes(form) && $3.meta.weak);

  let prefixers;
  let suffixer;
  switch (tam) {
    case `sbjv`:
      if (isCV) {
        prefixers = makePrefixers(
          // tkuun
          { syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cv },
          // t.kuun
          { syllables: [conjugation.nonpast.prefix.subjunctive.cv], rest: [] },
          // tikuun
          { syllables: [[...conjugation.nonpast.prefix.subjunctive.cv, LAX_I]], rest: [] }
        );
      } else {
        // tiktub
        prefixers = makePrefixers(
          { syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cc }
        );
      }
      suffixer = makeSuffixer(copy(conjugation.nonpast.suffix));
      break;
    case `ind`:
      if (isCV) {
        const cv = conjugation.nonpast.prefix.subjunctive.cv;
        if (cv[0].value === `y`) {
          prefixers = makePrefixers(
            {
              // "bikuun", tense i
              syllables: [[...conjugation.nonpast.prefix.indicative, I]],
              rest: []
            },
            {
              // "bekuun", lax i
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I]],
              rest: []
            },
            {
              // "biykuun", long vowel and possibly also some kinda phonetic diphthong
              // (3arabizi spellings: beykoun, biykoun)
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I, ...cv]],
              rest: []
            },
            // [huwwe] b.kuun
            {
              syllables: [conjugation.nonpast.prefix.indicative],
              rest: []
            },
            // [huwwe] bkuun (...maybe this one is too much to have idk)
            {
              syllables: [],
              rest: conjugation.nonpast.prefix.indicative
            }
          );
        } else {
          prefixers = makePrefixers(
            // minkuun, bitkuun
            {
              syllables: [[
                ...conjugation.nonpast.prefix.indicative,
                I,
                ...cv
              ]],
              rest: []
            },
            // mnikuun, btikuun (idk lol found it more than once online)
            // (3arabizi spellings: mnekoun, btekoun, mne2oul, bte2oul...)
            {
              syllables: [[
                ...conjugation.nonpast.prefix.indicative,
                ...cv,
                LAX_I
              ]],
              rest: []
            }
          );
        }
      } else {
        const cc = conjugation.nonpast.prefix.subjunctive.cc;
        // TODO: wonder if it'd work to have this as `cc[0].meta.weak` instead
        if (cc[0].value === `2`) {
          // b + 2 + ktub = biktub, not b2iktub
          // the sbjv prefix in this case starts with 2 so the .slice(1) gets rid of it
          prefixers = makePrefixers(
            { syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc.slice(1)] }
          );
        } else {
          prefixers = makePrefixers(
            // btiktub
            { syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc] },
            // bitiktub (again idk found it online more than once lul)
            {
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I]],
              rest: [[...cc, LAX_I]]
            }
          );
        }
      }
      suffixer = makeSuffixer(copy(conjugation.nonpast.suffix));
      break;
    case `imp`:
      prefixers = makePrefixers();
      suffixer = makeSuffixer(copy(conjugation.nonpast.suffix));
      break;
    case `pst`:
      prefixers = makePrefixers();
      suffixer = makeSuffixer(copy(conjugation.past.suffix));
      break;
    default:  // error?
      prefixers = undefined;
      suffixer = undefined;
  }

  const $ = invMap(
    prefixers.map(prefixer => parseWord({
      preTransform: [prefixer, suffixer],
      augmentation
    }))
  ).or(
    parseWord({
      preTransform: [suffixer],
      augmentation
    })
  );
  // these two are just so i can see more-easily which ones add affixes and which don't
  const $_ = $;
  const _$_ = $;

  // true if a verb is above form 1 and has no TAM suffix
  const noSuffix = tam === `pst`
    ? conjugation.person.third() && conjugation.gender.masc()
    : (!conjugation.gender.fem() || conjugation.number.third()) && !conjugation.number.plural();

  // only used when tam === `pst`
  const weakAA = $L.meta.weak && noSuffix;

  // TODO: might need to uncomment this if i want the verb's root to be accessible
  // (which i forget if that would have any purpose other than "let ppl see the verb's root")
  // const $originalL = $L;
  if ($L.meta.weak) {
    $L = Y;
  }

  // TODO: finish this line
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
          ...(conjugation.gender.masc() ? $`${$F}.${$3}.aa.${$L}` : $_`${$F}.${$3}.a.${$L}`),
          ...$_`2.i.${$F} ${$3}.a.${$L}`
        ];
      }
      return _$_`${$F}.${$3}.a.${$L}`;
    case `i`:
      if (tam === `pst`) {
        return $_`${$F}.i ${$3}.I.${$L}`;
      }
      if (tam === `imp`) {
        return $_`2.i.${$F} ${$3}.I.${$L}`;
      }
      return _$_`${$F}.${$3}.I.${$L}`;
    case `u`:
      if (tam === `pst`) {
        throw new Error(`No past-tense conjugation in /u/ exists`);
      }
      if (tam === `imp`) {
        return [
          ...(conjugation.gender.masc() ? $`${$F}.${$3}.oo.${$L}` : $_`${$F}.${$3}.U.${$L}`),
          ...$_`2.i.${$F} ${$3}.U.${$L}`
        ];
      }
      return _$_`${$F}.${$3}.U.${$L}`;
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
      return $L.meta.weak
        ? [..._$_`t.${$F}.a.${$3} ${$3}.aa`, ..._$_`t.${$F}.i.${$3} ${$3}.aa`]
        : [..._$_`t.${$F}.a.${$3} ${$3}.a.${$L}`, ..._$_`t.${$F}.i.${$3} ${$3}.a.${$L}`];
    case `stfa33al`:
      // stanna-yistanna
      if ($F.meta.weak) {
        return $L.meta.weak
          ? [..._$_`s.t.a.${$3} ${$3}.aa`, ..._$_`s.t.i.${$3} ${$3}.aa`]
          : [..._$_`s.t.a.${$3} ${$3}.a.${$L}`, ..._$_`s.t.i.${$3} ${$3}.a.${$L}`];
      }
      return $L.meta.weak
        ? [..._$_`s.t.${$F}.a.${$3} ${$3}.aa`, ..._$_`s.t.${$F}.i.${$3} ${$3}.aa`]
        : [..._$_`s.t.${$F}.a.${$3} ${$3}.a.${$L}`, ..._$_`s.t.${$F}.i.${$3} ${$3}.a.${$L}`];
    case `fe3al`:
      if (tam === `pst`) {
        return weakAA ? $`${$F}.aa ${$3}.aa` : $_`${$F}.aa ${$3}.a.${$L}`;
      }
      return $L.meta.weak ? _$_`${$F}.aa ${$3}.ii` : _$_`${$F}.aa ${$3}.I.${$L}`;
    case `tfe3al`:
      return $L.meta.weak ? _$_`t.${$F}.aa ${$3}.aa` : _$_`t.${$F}.aa ${$3}.a.${$L}`;
    case `stfe3al`:
      // stehal-yistehal
      if ($F.meta.weak) {
        return $L.meta.weak ? _$_`s.t.aa ${$3}.ii` : _$_`s.t.aa ${$3}.I.${$L}`;
      }
      return $L.meta.weak ? _$_`s.t.${$F}.aa ${$3}.aa` : _$_`s.t.${$F}.aa ${$3}.a.${$L}`;
    case `nfa3al`:
      if ($3.meta.weak) {
        return _$_`n.${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $_`n.${$F}.a.${$3}.${$L}`;
      }
      if (tam === `pst`) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.number.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lta2it, lta2yit (this is nfa3al not fta3al but same idea)
          // lta2u, lta2yu
          return [...$_`n.${$F}.a ${$3}.aa`, ...$_`n.${$F}.a.${$3}.y`];
        }
        return weakAA ? $`n.${$F}.a ${$3}.aa` : $_`n.${$F}.a ${$3}.a.${$L}`;
      }
      if (tam === `imp`) {
        return $L.meta.weak
          ? [
            ...$_`+n.${$F}.i -${$3}.ii`,
            ...$_`2.i.n ${$F}.i ${$3}.ii`,
            ...(noSuffix ? [] : $_`n.${$F}.a ${$3}.aa`)
          ]
          : [
            ...$_`+n.${$F}.i -${$3}.I.${$L}`,
            ...$_`2.i.n ${$F}.i ${$3}.I.${$L}`,
            ...(noSuffix ? [] : $_`n.${$F}.a ${$3}.a.${$L}`)
          ];
      }
      return $L.meta.weak
        ? [
          // about how the "+n." syllable interacts with prefixes:
          // the n will be taken by the prefix but the stress will remain on the Fi/Fa i think
          ..._$_`+n.${$F}.i -${$3}.ii`,  // TODO FIXME: i think this fails actually because stress is reassigned
          ..._$_`+n.${$F}.a -${$3}.aa`,
          ..._$_`n.${$F}.i ${$3}.ii`
        ]
        : [
          ..._$_`+n.${$F}.i -${$3}.I.${$L}`,
          ..._$_`+n.${$F}.a -${$3}.a.${$L}`,
          ..._$_`n.${$F}.i ${$3}.I.${$L}`
        ];
    case `nfi3il`:
      // almost the same as nfa3al except npst conj are always yinfi3il not yinfa3al
      if ($3.meta.weak) {
        return _$_`n.${$F}.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $_`n.${$F}.a.${$3}.${$L}`;
      }
      if (tam === `pst`) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.number.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lta2it, lta2yit (this is nfa3al not fta3al but same idea)
          // lta2u, lta2yu
          return [...$_`n.${$F}.a ${$3}.aa`, ...$_`n.${$F}.a.${$3}.y`];
        }
        return weakAA ? $`n.${$F}.a ${$3}.aa` : $_`n.${$F}.a ${$3}.a.${$L}`;
      }
      if (tam === `imp`) {
        return $L.meta.weak
          ? [
            ...$_`+n.${$F}.i -${$3}.ii`,
            ...$_`2.i.n ${$F}.i ${$3}.ii`
          ]
          : [
            ...$_`+n.${$F}.i -${$3}.I.${$L}`,
            ...$_`2.i.n ${$F}.i ${$3}.I.${$L}`
          ];
      }
      // TODO: could possibly check noSuffix and stuff here
      // to cut down on duplicates
      return $L.meta.weak
        ? [
          ..._$_`+n.${$F}.i -${$3}.ii`,
          ..._$_`n.${$F}.i ${$3}.ii`
        ]
        : [
          ..._$_`+n.${$F}.i -${$3}.I.${$L}`,
          ..._$_`n.${$F}.i ${$3}.I.${$L}`
        ];
    case `fta3al`:
      if ($3.meta.weak) {
        return _$_`${$F}.t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $_`${$F}.t.a.${$3}.${$L}`;
      }
      if (tam === `pst`) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.person.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lta2it, lta2yit
          // lta2u, lta2yu
          return [...$_`${$F}.t.a ${$3}.aa`, ...$_`${$F}.t.a.${$3}.y`];
        }
        return weakAA ? $`${$F}.t.a ${$3}.aa` : $_`${$F}.t.a ${$3}.a.${$L}`;
      }
      if (tam === `imp`) {
        return $L.meta.weak
          ? [
            ...$_`+${$F}.t.i -${$3}.ii`,
            ...$_`2.i.${$F} t.i ${$3}.ii`,
            ...(noSuffix ? [] : $_`${$F}.t.a ${$3}.aa`)
          ]
          : [
            ...$_`+${$F}.t.i -${$3}.I.${$L}`,
            ...$_`2.i.${$F} t.i ${$3}.I.${$L}`,
            ...(noSuffix ? [] : $_`${$F}.t.a ${$3}.a.${$L}`)
          ];
      }
      return $L.meta.weak
        ? [
          // about how the "+F." syllable interacts with prefixes:
          // the F will be taken by the prefix but the stress will remain on the ti/ta i think
          ..._$_`+${$F}.t.i -${$3}.ii`,
          ..._$_`+${$F}.t.a -${$3}.aa`,
          ..._$_`${$F}.t.i ${$3}.ii`
        ]
        : [
          ..._$_`+${$F}.t.i -${$3}.I.${$L}`,
          ..._$_`+${$F}.t.a -${$3}.a.${$L}`,
          ..._$_`${$F}.t.i ${$3}.I.${$L}`
        ];
    case `fti3il`:
      // almost the same as fta3al except npst conj are always yifti3il not yifta3al
      if ($3.meta.weak) {
        return _$_`${$F}.t.aa.${$L}`;
      }
      if ($3.value === $L.value) {
        return $_`${$F}.t.a.${$3}.${$L}`;
      }
      if (tam === `pst`) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.number.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lta2it, lta2yit
          // lta2u, lta2yu
          return [...$_`${$F}.t.a ${$3}.aa`, ...$_`${$F}.t.a.${$3}.y`];
        }
        return weakAA ? $`${$F}.t.a ${$3}.aa` : $_`${$F}.t.a ${$3}.a.${$L}`;
      }
      if (tam === `imp`) {
        return $L.meta.weak
          ? [
            ...$_`+${$F}.t.i -${$3}.ii`,
            ...$_`2.i.${$F} t.i ${$3}.ii`
          ]
          : [
            ...$_`+${$F}.t.i -${$3}.I.${$L}`,
            ...$_`2.i.${$F} t.i ${$3}.I.${$L}`
          ];
      }
      return $L.meta.weak
        ? [
          ..._$_`+${$F}.t.i -${$3}.ii`,
          ..._$_`${$F}.t.i ${$3}.ii`
        ]
        : [
          ..._$_`+${$F}.t.i -${$3}.I.${$L}`,
          ..._$_`${$F}.t.i ${$3}.I.${$L}`
        ];
    case `staf3al`:
      // stehal-yistehil
      if ($F.meta.weak) {
        if (tam === `pst`) {
          return weakAA ? $`s.t.aa ${$3}.aa` : $_`s.t.aa ${$3}.a.${$L}`;
        }
        return $L.meta.weak ? _$_`s.t.aa ${$3}.ii` : _$_`s.t.aa ${$3}.I.${$L}`;
      }
      if ($3.meta.weak) {
        return tam === `pst`
          ? [...$_`s.t.${$F}.aa.${$L}`, ...$_`s.t.a ${$F}.aa.${$L}`]
          : [..._$_`s.t.${$F}.ii.${$L}`, ..._$_`s.t.a ${$F}.ii.${$L}`];
      }
      if ($3.value === $L.value) {
        return tam === `pst`
          ? [...$_`s.t.${$F}.a.${$3}.${$L}`, ...$_`s.t.a ${$F}.a.${$3}.${$L}`]
          : [...$_`s.t.${$F}.i.${$3}.${$L}`, ...$_`s.t.a ${$F}.i.${$3}.${$L}`];
      }
      if (tam === `pst`) {
        return weakAA ? $`s.t.a.${$F} ${$3}.aa` : $`s.t.a.${$F} ${$3}.a.${$L}`;
      }
      if ($3.meta.weak) {
        // stuff like "yistarjyo" exists albeit apparently very rarely
        return [..._$_`s.t.a.${$F} ${$3}.ii`, ..._$_`s.t.a.${$F} ${$3}.I.y`];
      }
      // yista3mil, *yista3mul* (spelled yesta3mol)
      return [..._$_`s.t.a.${$F} ${$3}.I.${$L}`, ..._$_`s.t.a.${$F} ${$3}.U.${$L}`];
    case `f3all`:
      return _$_`${$F}.${$3}.a.${$L}.${$L}`;
    case `fa3la2`:
      if (tam === `pst`) {
        return weakAA
          ? [...$`${$F}.a.${$3} ${$L}.aa`, ...$`${$F}.i.${$3} ${$L}.aa`]
          : [...$_`${$F}.a.${$3} ${$L}.a.${$Q}`, ...$_`${$F}.i.${$3} ${$L}.a.${$Q}`];
      }
      return $Q.meta.weak
        ? [..._$_`${$F}.a.${$3} ${$L}.ii`, ..._$_`${$F}.i.${$3} ${$L}.ii`]
        : [..._$_`${$F}.a.${$3} ${$L}.I.${$Q}`, ..._$_`${$F}.i.${$3} ${$L}.I.${$Q}`];
    case `tfa3la2`:
      return $Q.meta.weak
        ? [..._$_`s.t.${$F}.a.${$3} ${$L}.aa`, ..._$_`s.t.${$F}.i.${$3} ${$L}.aa`]
        : [..._$_`s.t.${$F}.a.${$3} ${$L}.a.${$Q}`, ..._$_`s.t.${$F}.i.${$3} ${$L}.a.${$Q}`];
    case `stfa3la2`:
      // doesn't exist B)
      // XXX: idunno about these /a/ variants btw
      if ($F.meta.weak) {
        return $Q.meta.weak
          ? [..._$_`s.t.a.${$3} ${$L}.aa`, ..._$_`s.t.i.${$3} ${$L}.aa`]
          : [..._$_`s.t.a.${$3} ${$L}.a.${$Q}`, ..._$_`s.t.i.${$3} ${$L}.a.${$Q}`];
      }
      return $Q.meta.weak
        ? [..._$_`s.t.${$F}.a.${$3} ${$L}.aa`, ..._$_`s.t.${$F}.i.${$3} ${$L}.aa`]
        : [..._$_`s.t.${$F}.a.${$3} ${$L}.a.${$Q}`, ..._$_`s.t.${$F}.i.${$3} ${$L}.a.${$Q}`];
    default:
      return null;
  }
}

module.exports = {
  verb
};
