import {category, underlying} from './layers';
import {language} from '/lib/language';

language([category, underlying],
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: {modify: {} as any, promote: {} as any},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    underlying: {modify: {} as any},
  }
);//.modify.;
