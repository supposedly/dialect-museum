import { type as segType } from '../../objects';
import { lax } from '../vowels';
import { parseWord, parseLetter } from '../../parse-word';
import { choice } from '../../objects';
import { wazn, tamToken } from '../../symbols';
import * as utils from '../../utils';
const {
  misc: { lastOf /* , backup */ }, syllables: { newSyllable },
} = utils;

const LAX_I = Object.freeze(parseLetter`I`);
const I = Object.freeze(parseLetter`i`);
const AA = Object.freeze(parseLetter`aa`);
const II = Object.freeze(parseLetter`ii`);
const AY = Object.freeze(parseLetter`ay`);
const SCHWA = Object.freeze(parseLetter`Schwa`);
// const AI = Object.freeze(parseLetter`a/i`);  // see final comment in fixGeminate

// transformer: replace -a.y in a parsed word with -aa if npst or no suffix (3ms pst),
// else replace -a.y- with -ay-
function fixAy(noSuffix) {
  return noSuffix
    ? base => {
      const lastSyllable = lastOf(base).value;
      if (lastOf(lastSyllable, 1).value === `a` && lastOf(lastSyllable).meta.weak) {
        lastSyllable.splice(-2, 2, AA);
      }
    }
    : base => {
      const lastSyllable = lastOf(base).value;
      if (lastOf(lastSyllable, 1).value === `a` && lastOf(lastSyllable).meta.weak) {
        lastSyllable.splice(-2, 2, AY);
      }
    };
}

// transformer: replaces -iy in a parsed word with -ii
function fixIy(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable, 1).value === `i` && lastOf(lastSyllable).meta.weak) {
    lastSyllable.splice(-2, 2, II);
  }
}

// transformer: replaces -CC at the end of a pasred word with -C.Cay-
// ONLY to be used with past-tense geminate verbs when there's a suffix
function fixGeminate(base) {
  const lastSyllable = lastOf(base).value;
  if (lastOf(lastSyllable, 1).value === lastOf(lastSyllable).value) {
    base.push(newSyllable([lastSyllable.pop(), AY]));
  }
  // // k.a.b.b.ay.t => k.a/i.b.b.ay.t
  // if (lastSyllable[1].value === `a`) {
  //   lastSyllable[1] = AI;
  // }
  // commented out because that can be an automatic rule that transforms `a`
  // to also account for 2addaysh/2iddaysh and stuff
  // unlike with f.a/i.33al where it can't be predicted
}

// post-transformer: adds augmentations to meta depending on end of base
// and contracts long vowel VVC in base if augmentation is dative -l-
function augment(augmentation) {
  return augmentation && ((base, meta) => {
    meta.augmentation = augmentation(base);
    // not contracting vowel for dative here because that's instead
    // being done in the word-initializer
  });
}

// post-transformer: turns fi3il (two ambiguous i's) into fI3il (explicitly
// lax i) if there's an augmentation
// *ONLY to be used with the literal verb pattern fi3il, 3ms.pst*
// FIXME: this is hacky, the lax i should specifically only be inserted for
// *stress-attracting* augmentations (e.g. lax for sImi3na "he heard us" and
// ambiguous for sim3ak "he heard you", or more-pertinently, lax for
// sImí3o "he heard him" and ambiguous for sim3o "he heard him") but i went
// nuts trying to figure out a sane way to implement that
function fixFi3il(base, meta) {
  if (meta.augmentation) {
    const firstSyllable = base[0];
    if (firstSyllable.value[1].value !== `i`) {
      throw new Error(`Can't use non-fi3il verb with fixFi3il: ${
        base.map(syllable => syllable.value.map(segment => segment.value).join()).join(`.`)
      }`);
    }
    firstSyllable.value[1] = lax(firstSyllable.value[1]);
  }
}

/*
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
      if (lastOf(rest).type === type.vowel) {
        const postPrefix = newSyllable([...rest]);
        while (firstSyllable[0].type === type.consonant && firstSyllable[1].type !== type.vowel) {
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

function makePrefixers(prefixes) {
  return prefixes.map(
    // the object { syllables, rest } is from `switch (tam) {}` in verb() below
    ({ syllables, rest }) => addPrefix(
      syllables.map(s => [...s]).map(newSyllable),
      [...rest]
    )
  );
}
*/

function makeSuffixer(suffix, conjugation, tam) {
  if (!conjugation.vowelInitialSuffix(tam === tamToken.pst)) {
    return base => {
      base.push(suffix);
    };
  }
  return base => {
    const lastSyllable = lastOf(base).value;
    const lastSegment = lastOf(lastSyllable);
    // the .meta.weak is a lame compensation for not yet having
    // collapsed a.y into the diphthong ay at this point
    if (lastSegment.type === segType.vowel || lastSegment.meta.weak) {
      // if we have an ending like $`.aa`, delete it before adding a
      // vowel-initial suffix
      lastSyllable.splice(-1, 1);
    }
    base.push(suffix);
  };
}

function getAffixes(tam, conjugation, isCV) {
  let prefixes;
  let suffix;
  switch (tam) {
    case tamToken.sbjv:
      if (isCV) {
        prefixes = choice(
          // tkuun
          {syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cv},
          // t.kuun
          {syllables: [conjugation.nonpast.prefix.subjunctive.cv], rest: []},
          // tikuun
          {syllables: [[...conjugation.nonpast.prefix.subjunctive.cv, LAX_I]], rest: []},
        );
      } else {
        // tiktub
        prefixes = choice(
          {syllables: [], rest: conjugation.nonpast.prefix.subjunctive.cc},
        );
      }
      suffix = [...conjugation.nonpast.suffix];
      break;
    case tamToken.ind:
      if (isCV) {
        const cv = conjugation.nonpast.prefix.subjunctive.cv;
        if (cv.length == 0) {
          prefixes = choice(
            // b.kuun
            {
              syllables: [conjugation.nonpast.prefix.indicative],
              rest: [],
            },
            // bkuun (...maybe this one is too much to have idk)
            {
              syllables: [],
              rest: conjugation.nonpast.prefix.indicative,
            }
          );
        } else if (cv[0].value === `y`) {
          prefixes = choice(
            {
              // "bikuun", tense i
              syllables: [[...conjugation.nonpast.prefix.indicative, I]],
              rest: [],
            },
            {
              // "bikuun", lax i
              // (3arabizi spelling: bekoun)
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I]],
              rest: [],
            },
            {
              // "biykuun", long vowel and/or possibly also some kinda phonetic diphthong
              // (3arabizi spellings: beykoun, biykoun)
              syllables: [[...conjugation.nonpast.prefix.indicative, I, ...cv]],
              rest: [],
            },
            // [huwwe] b.kuun
            {
              syllables: [conjugation.nonpast.prefix.indicative],
              rest: [],
            },
            // [huwwe] bkuun (...maybe this one is too much to have idk)
            {
              syllables: [],
              rest: conjugation.nonpast.prefix.indicative,
            },
          );
        } else {
          prefixes = choice(
            // minkuun, bitkuun
            {
              syllables: [[
                ...conjugation.nonpast.prefix.indicative,
                I,
                ...cv,
              ]],
              rest: [],
            },
            // mnikuun, btikuun (idk lol found it more than once online)
            // (3arabizi spellings: mnekoun, btekoun, mne2oul, bte2oul...)
            {
              syllables: [[
                ...conjugation.nonpast.prefix.indicative,
                ...cv,
                LAX_I,
              ]],
              rest: [],
            },
          );
        }
      } else {
        const cc = conjugation.nonpast.prefix.subjunctive.cc;
        // TODO: wonder if it'd work to have this as `cc[0].meta.weak` instead
        if (cc[0].value === `2`) {
          // b + 2 + ktub = biktub, not b2iktub
          // the sbjv prefix in this case starts with 2 so the .slice(1) gets rid of it
          prefixes = choice(
            {syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc.slice(1)]},
          );
        } else {
          prefixes = choice(
            // btiktub
            {syllables: [], rest: [...conjugation.nonpast.prefix.indicative, ...cc]},
            // bitiktub (again idk found it online more than once lul)
            {
              syllables: [[...conjugation.nonpast.prefix.indicative, LAX_I]],
              rest: cc,
            },
          );
        }
      }
      suffix = [...conjugation.nonpast.suffix];
      break;
    case tamToken.imp:
      if (!conjugation.person.second()) {
        throw new Error(`Can't use an imperative verb on persons other than second; try sbjv`);
      }
      prefixes = null;
      suffix = [...conjugation.nonpast.suffix];
      break;
    case tamToken.pst:
      prefixes = null;
      suffix = [...conjugation.past.suffix];
      break;
    default:  // error?
      throw new Error(
        `Unrecognized TAM in verb-initializer: ${tam} (supported values are sbjv, ind, imp, pst)`,
      );
  }
  return {prefixes, suffix};
}

export default function verb({
  type: was,
  meta: {conjugation, form, tam},
  value: {root: [$F, $3, $L, $Q], augmentation},
}) {
  const stringForm = wazn.keys[form];
  // xor but being extra-explicit about it
  // (if form is quadriliteral then $Q must be given, and if not then not)
  if (Boolean($Q) !== Boolean(stringForm.endsWith(`2`))) {
    throw new Error(`Didn't expect fourth radical ${$Q} with form ${stringForm}`);
  }

  const prefix = tam === tamToken.pst ? null : conjugation.prefix(tam === tamToken.ind);
  const suffix = conjugation.suffix();

  const suffixer = makeSuffixer(suffix, conjugation, tam);

  // true if a verb is above form 1 and has no TAM suffix
  const noSuffix = tam === tamToken.pst
    ? conjugation.person.third() && conjugation.gender.masc()
    : (!conjugation.gender.fem() || conjugation.person.third()) && !conjugation.number.plural();

  const biliteral = $Q ? $L.value === $Q.value : $3.value === $L.value;
  const lastRadical = $Q || $L;
  const finalWeak = lastRadical.meta.weak;
  const nonpast = tam !== tamToken.pst;

  const meta = {
    was,
    conjugation,
    form,
    tam,
    root: $Q ? [$F, $3, $L, $Q] : [$F, $3, $L],
  };

  const $ = parseWord({
    meta,
    // XXX: it would be cool, even if inefficient, if this $ were instead declared like
    // `const $ = ({ pre, post }) => parseWord({ preTransform: pre, postTransform: post, ... })`
    // so that i could put these transformers in the actual switch branches next to
    // the forms they apply to instead of having them detached & condition-guarded up here
    preTransform: [[
      (finalWeak) && fixAy(noSuffix || nonpast),
      (nonpast && finalWeak) && fixIy,
      (biliteral && !nonpast && conjugation.heavierPastSuffix()) && fixGeminate,
      (nonpast && (!noSuffix || augmentation)) && uToI,
      // suffixer doesn't have a condition attached because both pst AND npst suffixes are very
      // strongly attached to the verb (unlike npst prefixes and also clitic pronouns),
      // meaning the conjugation suffix can always just be attached
      // maybe this is a bad move and i should allow transformers to access the stem of the
      // verb but ah well
      prefix && (base => { base.unshift(prefix); }),
      suffixer,
    ]],
    // see XXX above
    postTransform: [[
      augment(augmentation),
      (form === `i` && tam === tamToken.pst && conjugation.person.third() && conjugation.gender.masc()) && fixFi3il,
    ]],
  });
  // these two are just so i can see more-easily when $ adds affixes and when it doesn't
  const $_ = $;
  const _$_ = $;

  switch (form) {
    case wazn.a:
      if (biliteral) {
        return _$_`${$F}.a.${$3}.${$L}`;
      }
      if ($3.meta.weak) {
        return _$_`${$F}.aa.${$L}`;
      }
      if (tam === tamToken.pst) {
        if ($L.meta.weak && !conjugation.gender.masc() && !conjugation.heavierPastSuffix()) {
          // 3atit, 3atyit
          return [...$_`${$F}.a.${$3}`, ...$_`${$F}.a.${$3}.y`];
        }
        return $_`${$F}.a ${$3}.a.${$L}`;
      }
      if (tam === tamToken.imp) {
        if ($F.meta.weak) {
          // not a thing
          return conjugation.gender.masc() ? $`${$F}.aa.${$L}` : $`${$F}.a.${$L}`;
        }
        if ($L.meta.weak) {
          return [
            ...$_`2.i.${$F} ${$3}.aa`,
            ...$_`${$F}.${$3}.aa`,
          ];
        }
        return [
          ...(conjugation.gender.masc() ? $`${$F}.${$3}.aa.${$L}` : $_`${$F}.${$3}.a.${$L}`),
          ...$_`2.i.${$F} ${$3}.a.${$L}`,
        ];
      }
      return _$_`${$F}.${$3}.a.${$L}`;
    case wazn.i:
      if (biliteral) {
        return _$_`${$F}.i.${$3}.${$L}`;
      }
      if ($3.meta.weak) {
        // possible for past-tense verbs technically, like صِيب (fus7a-ish passive)
        return _$_`${$F}.ii.${$L}`;
      }
      if (tam === tamToken.pst) {
        if ($L.meta.weak && !conjugation.gender.masc() && !conjugation.heavierPastSuffix()) {
          // 7ikyit, 7ikit
          return [...$_`${$F}.i.${$3}.y`, ...$_`${$F}.i.${$3}`];
        }
        // this will be postTransformed to convert the first ambiguous i to a lax I
        // if there's an augmentation [should be only if it stresses the 3iL syllable
        // but that specificity isn't implemented yet]
        return $_`${$F}.i ${$3}.i.${$L}`;
      }
      if (tam === tamToken.imp) {
        if ($F.meta.weak) {
          // not a thing
          return conjugation.gender.masc() ? $`${$F}.ee.${$L}` : $`${$F}.I.${$L}`;
        }
        if ($L.meta.weak) {
          return [
            ...$_`2.i.${$F} ${$3}.ii`,
            ...$_`${$F}.${$3}.ii`,
          ];
        }
        return $_`2.i.${$F} ${$3}.i.${$L}`;
      }
      return _$_`${$F}.${$3}.i.${$L}`;
    case wazn.u:
      if (tam === tamToken.pst) {
        throw new Error(`No past-tense Form 1 conjugation in /u/ exists: ${$F}${$3}${$L}`);
      }
      if ($L.meta.weak) {
        throw new Error(`No final-weak Form 1 conjugation in /u/ exists: ${$F}${$3}${$L}`);
      }
      if (biliteral) {
        return _$_`${$F}.u.${$3}.${$L}`;
      }
      if ($3.meta.weak) {
        // above error also applies here, yeet
        return _$_`${$F}.uu.${$L}`;
      }
      if (tam === tamToken.imp) {
        if ($F.meta.weak) {
          // kool, 5ood, and for some, 3ood = 23ood/q3ood
          return conjugation.gender.masc() ? $`${$F}.oo.${$L}` : $`${$F}.U.${$L}`;
        }
        return [
          ...(conjugation.gender.masc() ? $`${$F}.${$3}.oo.${$L}` : $_`${$F}.${$3}.u.${$L}`),
          ...$_`2.i.${$F} ${$3}.u.${$L}`,
        ];
      }
      return _$_`${$F}.${$3}.u.${$L}`;
    case wazn.fa33al:
      if (tam === tamToken.pst) {
        return [
          ...$_`${$F}.a.${$3} ${$3}.a.${$L}`,
          ...$_`${$F}.i.${$3} ${$3}.a.${$L}`,
        ];
      }
      // no need for "if imp" case bc this handles imperative too (right?)
      return [
        ..._$_`${$F}.a.${$3} ${$3}.i.${$L}`,
        ..._$_`${$F}.i.${$3} ${$3}.i.${$L}`,
      ];
    case wazn.tfa33al:
      return [
        ..._$_`t.${$F}.a.${$3} ${$3}.a.${$L}`,
        ..._$_`t.${$F}.i.${$3} ${$3}.a.${$L}`,
      ];
    case wazn.stfa33al:
      // stanna-yistanna
      if ($F.meta.weak) {
        return [
          ..._$_`s.t.a.${$3} ${$3}.a.${$L}`,
          ..._$_`s.t.i.${$3} ${$3}.a.${$L}`,
        ];
      }
      return [
        ..._$_`s.t.${$F}.a.${$3} ${$3}.a.${$L}`,
        ..._$_`s.t.${$F}.i.${$3} ${$3}.a.${$L}`,
      ];
    case wazn.fe3al:
      if (tam === tamToken.pst) {
        return $_`${$F}.aa ${$3}.a.${$L}`;
      }
      return _$_`${$F}.aa ${$3}.i.${$L}`;
    case wazn.tfe3al:
      return _$_`t.${$F}.aa ${$3}.a.${$L}`;
    case wazn.stfe3al:
      // stehal-yistehal
      if ($F.meta.weak) {
        return _$_`s.t.aa ${$3}.a.${$L}`;
      }
      return _$_`s.t.${$F}.aa ${$3}.a.${$L}`;
    case wazn.af3al:
      if (tam === tamToken.pst) {
        return [
          ...$_`2.a.${$F} ${$3}.a.${$L}`,
          ...$_`2.i.${$F} ${$3}.a.${$L}`,
        ];
      }
      return [
        ...$`${$F}.${$3}.i.${$L}`,
        ...$`2.a.${$F} ${$3}.i.${$L}`,
        ...$`2.i.${$F} ${$3}.i.${$L}`,
      ];
    case wazn.nfa3al:
      if ($3.meta.weak) {
        if (tam === tamToken.pst && conjugation.heavierPastSuffix()) {
          return [
            ...$_`n.${$F}.a.${$L}`,
            ...$_`n.${$F}.i.${$L}`,
          ];
        }
        return _$_`n.${$F}.aa.${$L}`;
      }
      if (biliteral) {
        return $_`n.${$F}.a.${$3}.${$L}`;
      }
      if (tam === tamToken.pst) {
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
        return $_`n.${$F}.a ${$3}.a.${$L}`;
      }
      if (tam === tamToken.imp) {
        return [
          ...$_`n.${$F}.I ${$3}.i.${$L}`,
          ...$_`2.i.n ${$F}.I ${$3}.i.${$L}`,
          ...(noSuffix ? [] : $_`n.${$F}.a ${$3}.a.${$L}`),
        ];
      }
      return [
        ..._$_`+n.${$F}.I -${$3}.i.${$L}`,
        ..._$_`+n.${$F}.a -${$3}.a.${$L}`,
        ..._$_`n.${$F}.I ${$3}.i.${$L}`,
      ];
    case wazn.nfi3il:
      // npst conj are always yinfi3il not yinfa3al
      // and (idk if this exists but) pst conj are nfi3il not nfa3al
      if ($3.meta.weak) {
        if (tam === tamToken.pst && conjugation.heavierPastSuffix()) {
          return [
            ...$_`n.${$F}.a.${$L}`,
            ...$_`n.${$F}.i.${$L}`,
          ];
        }
        return _$_`n.${$F}.aa.${$L}`;  // no way nfiil exists right...?
      }
      if (biliteral) {
        return $_`n.${$F}.i.${$3}.${$L}`;
      }
      if (tam === tamToken.pst) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.number.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lti2it, lti2yit (this is nfi3il not fti3il but same idea)
          // lti2u (sus), lti2yu
          return [...$_`n.${$F}.I ${$3}.ii`, ...$_`n.${$F}.i.${$3}.y`];
        }
        return $_`n.${$F}.I ${$3}.i.${$L}`;
      }
      if (tam === tamToken.imp) {
        return [
          ...$_`n.${$F}.I ${$3}.i.${$L}`,
          ...$_`2.i.n ${$F}.I ${$3}.i.${$L}`,
        ];
      }
      // TODO: could possibly check noSuffix and stuff here
      // to cut down on duplicates
      return [
        ..._$_`+n.${$F}.I -${$3}.i.${$L}`,
        ..._$_`n.${$F}.I ${$3}.i.${$L}`,
      ];
    case wazn.fta3al:
      if ($3.meta.weak) {
        if (tam === tamToken.pst && conjugation.heavierPastSuffix()) {
          return [
            ...$_`${$F}.t.a.${$L}`,
            ...$_`${$F}.t.i.${$L}`,
          ];
        }
        return _$_`${$F}.t.aa.${$L}`;
      }
      if (biliteral) {
        return $_`${$F}.t.a.${$3}.${$L}`;
      }
      if (tam === tamToken.pst) {
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
        return $_`${$F}.t.a ${$3}.a.${$L}`;
      }
      if (tam === tamToken.imp) {
        return [
          ...$_`${$F}.t.I ${$3}.i.${$L}`,
          ...$_`2.i.${$F} t.I ${$3}.i.${$L}`,
          ...(noSuffix ? [] : $_`${$F}.t.a ${$3}.a.${$L}`),
        ];
      }
      return [
        ..._$_`+${$F}.t.I -${$3}.i.${$L}`,
        ..._$_`+${$F}.t.a -${$3}.a.${$L}`,
        ..._$_`${$F}.t.I ${$3}.i.${$L}`,
      ];
    case wazn.fti3il:
      // npst conj are always yifti3il not yifta3al
      // and (idk if this exists but) pst conj are fti3il not fta3al
      if ($3.meta.weak) {
        if (tam === tamToken.pst && conjugation.heavierPastSuffix()) {
          return [
            ...$_`${$F}.t.a.${$L}`,
            ...$_`${$F}.t.i.${$L}`,
          ];
        }
        return _$_`${$F}.t.aa.${$L}`;  // no way ftiil exists right...?
      }
      if (biliteral) {
        return $_`${$F}.t.i.${$3}.${$L}`;
      }
      if (tam === tamToken.pst) {
        if (
          !noSuffix
          && $L.meta.weak
          && conjugation.person.third()
          && (conjugation.gender.fem() || conjugation.number.plural())
        ) {
          // lti2it, lti2yit
          // lti2u, lti2yu
          return [...$_`${$F}.t.I ${$3}.ii`, ...$_`${$F}.t.i.${$3}.y`];
        }
        return $_`${$F}.t.I ${$3}.i.${$L}`;
      }
      if (tam === tamToken.imp) {
        return [
          ...$_`${$F}.t.I ${$3}.i.${$L}`,
          ...$_`2.i.${$F} t.I ${$3}.i.${$L}`,
        ];
      }
      // TODO: could possibly check noSuffix and stuff here
      // to cut down on duplicates
      return [
        ..._$_`+${$F}.t.I -${$3}.i.${$L}`,
        ..._$_`${$F}.t.I ${$3}.i.${$L}`,
      ];
    case wazn.staf3al:
      // stehal-yistehil
      if ($F.meta.weak) {
        if (tam === tamToken.pst) {
          return $_`s.t.aa ${$3}.a.${$L}`;
        }
        return _$_`s.t.aa ${$3}.I.${$L}`;
      }
      if ($3.meta.weak) {
        if (tam === tamToken.pst && conjugation.heavierPastSuffix()) {
          return [
            ...$_`s.t.${$F}.a.${$L}`,
            ...$_`s.t.${$F}.i.${$L}`,
          ];
        }
        return tam === tamToken.pst
          ? [...$_`s.t.${$F}.aa.${$L}`, ...$_`s.t.a ${$F}.aa.${$L}`]
          : [..._$_`s.t.${$F}.ii.${$L}`, ..._$_`s.t.a ${$F}.ii.${$L}`];
      }
      if (biliteral) {
        return tam === tamToken.pst
          ? [...$_`s.t.${$F}.a.${$3}.${$L}`, ...$_`s.t.a ${$F}.a.${$3}.${$L}`]
          : [...$_`s.t.${$F}.i.${$3}.${$L}`, ...$_`s.t.a ${$F}.i.${$3}.${$L}`];
      }
      if (tam === tamToken.pst) {
        return $`s.t.a.${$F} ${$3}.a.${$L}`;
      }
      if ($3.meta.weak) {
        // stuff like "yistarjyo" exists albeit apparently very rarely
        return [..._$_`s.t.a.${$F} ${$3}.ii`, ..._$_`s.t.a.${$F} ${$3}.i.y`];
      }
      // yista3mil, *yista3mul* (spelled yesta3mol)
      return [..._$_`s.t.a.${$F} ${$3}.i.${$L}`, ..._$_`s.t.a.${$F} ${$3}.u.${$L}`];
    case wazn.f3all:
      return _$_`${$F}.${$3}.a.${$L}.${$L}`;
    case wazn.fa3la2:
      if (tam === tamToken.pst) {
        return [
          ...$_`${$F}.a.${$3} ${$L}.a.${$Q}`,
          ...$_`${$F}.i.${$3} ${$L}.a.${$Q}`,
        ];
      }
      return [
        ..._$_`${$F}.a.${$3} ${$L}.i.${$Q}`,
        ..._$_`${$F}.i.${$3} ${$L}.i.${$Q}`,
      ];
    case wazn.tfa3la2:
      return [
        ..._$_`s.t.${$F}.a.${$3} ${$L}.a.${$Q}`,
        ..._$_`s.t.${$F}.i.${$3} ${$L}.a.${$Q}`,
      ];
    case wazn.stfa3la2:
      // doesn't exist B)
      // XXX: idunno about these /a/ variants btw
      if ($F.meta.weak) {
        return [
          ..._$_`s.t.a.${$3} ${$L}.a.${$Q}`,
          ..._$_`s.t.i.${$3} ${$L}.a.${$Q}`,
        ];
      }
      return [
        ..._$_`s.t.${$F}.a.${$3} ${$L}.a.${$Q}`,
        ..._$_`s.t.${$F}.i.${$3} ${$L}.a.${$Q}`,
      ];
    default:
      throw new Error(`Unknown verb form ${form} ('${wazn.keys[form]}')`);
  }
}
