import ruleset from './ruleset';
import {letters, phonic} from '/languages/levantine/alphabets/phonic';
import {MatchAsType} from '/lib/utils/match';

type Consonant = MatchAsType<typeof phonic[`types`][`consonant`]>;

function equal(a: object, b: object): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  if (typeof a === `object`) {
    return Object.keys(a).every(key => equal(a[key as keyof typeof a], b[key as keyof typeof a]));
  }
  return a === b;
}

function closeEnough(a: Consonant, b: Consonant): boolean {
  const locations = phonic.types.consonant.location.value;
  return a.articulator === b.articulator
    && a.manner === b.manner
    && Math.abs(locations.indexOf(a.location) - locations.indexOf(b.location)) <= 1;
}

function sspValue(c: Consonant): number {
  if (c.manner === `approximant` && !c.lateral) {
    return 0;
  }
  if (c.lateral || c.manner === `flap`) {
    return 1;
  }
  if (c.nasal) {
    return 2;
  }
  if (c.manner === `fricative`) {
    return 3;
  }
  if (c.manner === `affricate`) {
    return 4;
  }
  if (c.manner === `stop`) {
    return 5;
  }
  // will never happen, all manners have branches
  throw new Error(`ssp broke (${c})`);
}

export default ruleset(
  {
    spec: null,
    env: ({before, after}, {consonant, vowel, boundary}) => ({
      match: `all`,
      value: [
        before(consonant(), boundary(`syllable`)),
        after(consonant(), vowel({long: false})),
      ],
    }),
  },
  {
    none: [],
  },
  {
    n_T: {
      env: ({before, after}, {consonant}) => ({
        ...after(letters.plain.consonant.n),
        ...before(consonant({
          articulator: `tongue`,
          manner: `stop`,
          nasal: false,
          location: `ridge`,
        })),
      }),
    },
    violatesSSP: {
      env: ({custom, before, after}, {consonant}) => {
        return custom(
          {
            ...after(consonant(phonic.types.consonant)),
            ...before(consonant(phonic.types.consonant)),
          },
          ({
            prev: [{spec: {features: a}}],
            next: [{spec: {features: b}}],
          }) => sspValue(a) > sspValue(b)
        );
      },
    },
    // following Haddad 1984 (thank you so so so much to dr lapierre's
    // margin notes in the old copy of kenstowicz she lent me lmao)
    matchesHaddad: {
      env: ({custom, before, after}, {consonant}) => {
        return custom(
          {
            ...after(consonant(phonic.types.consonant)),
            ...before(consonant(phonic.types.consonant)),
          },
          ({
            prev: [{spec: {features: a}}],
            next: [{spec: {features: b}}],
          }) => !equal(a, b) && (
            // (anything but m) + liquid
            // (7imel, nasel vs. nimr):
            !(a.nasal && a.articulator === `lips`) && (b.lateral || b.manner === `flap`)
            // (anything but l) + nasal
            // (firen vs. 7ilm):
            || !a.lateral && b.nasal
            // (2asesh, 7ajez, nasej):
            || closeEnough(a, b)
            // (stop, fricative) + noncoronal fricative
            // stop + noncoronal stop
            // (nasef, 7abek vs. 7arf, balf, nafs...):
            || (
              (a.manner === `stop` && (b.manner === `stop` || b.manner === `fricative`))
              || (a.manner === `fricative` && b.manner === `fricative`)
              && !(
                b.articulator === `tongue`
                && (
                  b.location === `ridge`
                  || b.location === `teeth`
                  || b.location === `bridge`
                )
              )
            )
          ),
        );
      },
    },
  }
);
