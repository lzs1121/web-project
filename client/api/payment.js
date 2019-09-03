import { ajax } from '../utils';

const url = '/api/stripeCharges/';
export const submit = data => ajax.postData(url, data);
