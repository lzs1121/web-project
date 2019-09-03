import axios from 'axios';

export function fetchTraining() {
	return axios.get('/api/training').then(res => res.data);
}

export function fetchTechnologyStack() {
	return axios.get('/api/technology-stack').then(res => res.data.data);
}

export function fetchCourse() {
	return axios.get('/api/course/listCourseWithUni').then(res => res.data);
}

export function fetchUniversity() {
	return axios.get('/api/university').then(res => res.data);
}

export function fetchCareerCoaching() {
	return axios.get('/api/services?type=Career').then(res=>res.data.services);
}

export function fetchLecturer() {
	return axios.get('/api/teacher').then(res => res.data.data);
}

export function fetchTutor() {
	return axios.get('/api/tutor').then(res => res.data.data);
}