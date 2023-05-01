import axios from "axios";


const registerLibrary = (librarySignupData) => axios.post("http://localhost:8082/accounts", librarySignupData);
const registerFinance = (financeSignupData) => axios.post("http://localhost:8083/accounts", financeSignupData);


const generateAnInvoice = (invoiceData) => axios.post("http://localhost:8083/invoices", invoiceData);


const externalService = {
    registerLibrary,
    registerFinance,
    generateAnInvoice
};

export default externalService;
