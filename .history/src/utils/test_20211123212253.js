import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
const checkStatus = response => {
  const status = response.status || -1000 // 连接错误，没有返回
  if ((status >= 200 && status < 300) || status === 304) {
    return response.data
  }
}