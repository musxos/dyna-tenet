import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.dynaswap.app/",
});

export default instance;
