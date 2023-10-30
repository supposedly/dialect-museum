import ruleset from './ruleset';

export default ruleset(
  {
    spec: {},
    env: {},
  },
  operations => ({
    default: [operations.mock(({affix}) => affix(`f`))],
  })
);
