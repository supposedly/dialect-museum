import {templates, underlying} from "/languages/levantine/alphabets";
import {rulePack} from "/lib/rules";

import fa3al from "./fa3al";

const verb = rulePack(
  templates,
  underlying,
  [],
  {spec: {type: `verb`}}
);

export default verb.pack({fa3al});
