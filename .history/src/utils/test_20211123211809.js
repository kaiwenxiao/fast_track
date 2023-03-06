import axios from 'axios'

axios.defaults.header['Content-Type'] = 'application/x-www-form-urlencoded'
const checkStatus = response => {
  const status = response.status || -1000
  if((status >= 200 && status < 300))
}