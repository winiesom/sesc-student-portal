import axios from "axios";


const registerLibrary = (librarySignupData) => axios.post("http://localhost:8082/accounts", librarySignupData);
const registerFinance = (financeSignupData) => axios.post("http://localhost:8083/accounts", financeSignupData);


const generateAnInvoice = (invoiceData) => axios.post("http://localhost:8083/invoices", invoiceData);

const getOutstanding = (account_id) => axios.get(`http://localhost:8083/accounts/${account_id}`);



const externalService = {
    registerLibrary,
    registerFinance,
    generateAnInvoice,
    getOutstanding
};

export default externalService;
