import Cookies from "js-cookie";

class TokenService {
  getAccessToken() {
    return Cookies.get("access");
  }
}

export default new TokenService();
