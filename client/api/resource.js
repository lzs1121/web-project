import { ajax } from '../utils';
const url = '/api/resource';
export const update = (id, data) => ajax.updateData(`${url}/${id}`)(JSON.stringify(data));
