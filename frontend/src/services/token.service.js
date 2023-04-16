import Cookies from "js-cookie";

class TokenService {
  getAccessToken() {
    return Cookies.get("access");
  }
}

const tokenService = new TokenService();

export { tokenService };