import { applicationConstants } from '../_constants';

export function application(state = {}, action) {
	switch (action.type) {
	case applicationConstants.SUBMIT_APPLICATION_REQUEST:
		return {
			loading: true
		};
	case applicationConstants.SUBMIT_APPLICATION_SUCCESS:
		return {
			slug: action.data.data.slug,
			id: action.data.data._id,
			name: action.data.data.temporaryName,
			wechat: action.data.data.wechat,
			phone: action.data.data.phone,
			email: action.data.data.email,
			city: action.data.data.city,
			service: action.data.data.service,
			university: action.data.data.university,
			studyTarget: action.data.data.studyTarget
		};
	case applicationConstants.SUBMIT_APPLICATION_FAILURE:
		return {
			error: action.error
		};

	default:
		return state;
	}
}