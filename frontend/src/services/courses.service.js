import api from "../api/api";


const getCourses = () => api.get("courses");


const coursesService = {
    getCourses
};

export default coursesService;
