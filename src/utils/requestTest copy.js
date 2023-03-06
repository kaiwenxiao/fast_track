// import axios from 'axios'
// function myAxios(axiosConfig) {
//   const service = axios.create({
//     baseURL: 'http://localhost:8888',
//     timeout: 10000,
//     headers: { 'X-Custom-Header': 'foobar' }
//   })

//   return service(axiosConfig)
// }

// export default myAxios


import myAxios from './axios'

export function login(paramsList) {
  return myAxios({
    url: '/api/login',
    method: 'post',
    data: paramsList
  })
}