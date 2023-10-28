import ruleset from './ruleset';

export default ruleset(
  {
    spec: ({pronoun}) => pronoun({gender: `feminine`}),
    env: {},
  },
  operations => ({
    aat: [operations.mock(({affix}) => affix(`fplural`))],
    iin: [operations.mock(({affix}) => affix(`plural`))],
  })
);
