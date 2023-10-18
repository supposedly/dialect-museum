import {templates, underlying} from "/languages/levantine/alphabets";
import {rulePack} from "/lib/rules";

export default rulePack(
  templates,
  underlying,
  [],
  {
    spec: {type: `verb`},
    env: {},
  }
);
