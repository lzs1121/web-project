import { ajax } from '../utils';
const url = '/api/resource-request';

export const submit = (data) => ajax.postData(url, data);