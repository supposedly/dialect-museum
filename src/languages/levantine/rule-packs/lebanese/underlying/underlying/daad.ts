import ruleset from './ruleset';

const spec = {
  type: `consonant`,
  features: {
    location: `ridge`,
    articulator: `tongue`,
    manner: `stop`,
    voiced: true,
    emphatic: true,
    nasal: false,
    lateral: false,
  },
  context: {
    affected: false,
  },
} as const;

// we want to fricate it underlyingly so it can be treated the same as ظ going forward
// but it 'had' to be different leading up to this point so we can hackily refer back to
// it when exporting to arabic script
export default ruleset(
  {
    spec,
    env: {},
  },
  {
    default: [
      {
        type: `consonant`,
        features: {
          location: `teeth`,
          articulator: `tongue`,
          manner: `fricative`,
          voiced: true,
          emphatic: true,
          nasal: false,
          lateral: false,
        },
        context: {
          affected: false,
        },
      },
    ],
  },
);
