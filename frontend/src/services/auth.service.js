import Cookies from "js-cookie";
import api from "../api/api";


const register = (signupData) => api.post("students", signupData);

const login = (loginData) =>
  api
    .post("login", loginData)
    .then((response) => {
      if (response.data) {
        Cookies.set("access", response.data["access-token"]);
      }
      return response.data;
    });


const logout = () =>
  api.post("logout", {}).then((response) => {
    if (response.data) {
      Cookies.remove("access");
    }
    return response.data;
  });



const authService = {
  register,
  login,
  logout
};

export default authService;
