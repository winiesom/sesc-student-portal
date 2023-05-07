import api from "../api/api";


const getProfile = (id) => api.get(`students/${id}`);

const editProfile = (id, first_name, last_name, username, email) => api.put(`students/${id}`, {
    first_name, 
    last_name, 
    username, 
    email
});


const profileService = {
    getProfile,
    editProfile
};

export default profileService;
