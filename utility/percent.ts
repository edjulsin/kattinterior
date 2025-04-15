import constrain from './constrain';
import precise from './precise';

export default (min: number, max: number, value: number) => constrain(min, max, precise(value))