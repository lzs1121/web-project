import { ajax } from '../utils';

const url = '/api/orders';
const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('course');
const workshopApi = `/api/workshops/${key}`;
export const submit = data => ajax.postData(url, data);
export const update = (data, id) => ajax.updateData(`${url}/${id}`)(JSON.stringify(data));
export const getWorkshop = () => ajax.getList(workshopApi);
