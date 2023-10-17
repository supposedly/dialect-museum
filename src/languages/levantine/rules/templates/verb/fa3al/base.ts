import {templates, underlying} from "/languages/levantine/alphabets";
import {rulePack} from "/lib/rules";

export default rulePack(
  templates,
  underlying,
  [],
  {spec: ({verb}) => verb({
    theme: templates.types.verb.theme,
    shape: `fa3vl`,
    root: {length: 3},
  })}
);
