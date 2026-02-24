import axios from "axios";

axios.defaults.baseURL = "https://inkspire-blog-app.onrender.com";
axios.defaults.withCredentials = true;

export default axios;