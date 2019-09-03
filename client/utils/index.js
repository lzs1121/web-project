import * as ajaxFetch from './ajax';

export const ajax = ajaxFetch;
export function isArray(arr) {
	return Object.prototype.toString.call(arr) === '[object Array]';
}
