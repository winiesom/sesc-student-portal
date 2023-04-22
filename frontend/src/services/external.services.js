import axios from "axios";


const registerLibrary = (librarySignupData) => axios.post("http://localhost:8082/accounts", librarySignupData);
const registerFinance = (financeSignupData) => axios.post("http://localhost:8083/accounts", financeSignupData);



const externalService = {
    registerLibrary,
    registerFinance
};

export default externalService;
