import axios from 'axios'
function myAxios(axiosConfig) {
  const service = axios.create({
    baseURL: 'http://localhost'
  })
}