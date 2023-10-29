import {templates, underlying} from 'src/languages/levantine/alphabets';
import {rulePack} from 'src/lib/rules';

export default rulePack(templates, underlying, [], {spec: {type: `word`}, env: {}});
