import axios from "axios";

const baseUrl = "https://user-management-2sdb.onrender.com/api/" 
const instance =axios.create({
    baseURL:baseUrl,
})

export default instance