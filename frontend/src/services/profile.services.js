import api from "../api/api";


const getProfile = (id) => api.get(`students/${id}`);

const editProfile = (id, profileData) => api.put(`students/${id}`, profileData);
console.log(editProfile, 'service')


const profileService = {
    getProfile,
    editProfile
};

export default profileService;
