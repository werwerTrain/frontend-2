import axios from "axios";
const api = axios.create(
  {
    baseURL: "http://localhost:30005/api", //这里配置的是后端服务提供的接口
  }
);
export default api;
