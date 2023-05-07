import api from "../api/api";


const getCourses = (page, pagesize, search) => api.get(`courses?page=${page}&pagesize=${pagesize}&search=${search}`);

const enrolCourse = (enrolData) => api.post("enrolments", enrolData);

const getEnrolments = () => api.get("enrolments");


const coursesService = {
    getCourses,
    enrolCourse,
    getEnrolments
};

export default coursesService;
