import axios from 'axios';

// 重复请求队列
const pendingMap = new Map()

const LoadingInstance = {
  _target: null,
  _count: 0
}

function myAxios(axiosConfig, customOptions, loadingOptions) {
  const service = axios.create({
    baseURL: 'http://locahost:8888',
    timeout: 10000
  })
}

const custom_options = Object.assign({
  repeat_request_cancel: true,
  loading: false,
  reduct_data_format: true,
  error_message_show: true,
  code_message_show: false
}, customOptions)

service.interceptors.request.use(
  config => {
    !custom_options.repeat_request_cancel && removePending(config)
    custom_options.repeat_request_cancel && addPending(config)
    if (custom_options.options.loading) {
      LoadingInstance._count++
      if (LoadingInstance._count === 1) {
        LoadingInstance._target = ElLoading.service(loadingOptions)
      }
    }
    if (getTokenAUTH() && typeof window !== 'undefined') {
      config.headers.Authorization = getTokenAUTH()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    removePending(response.config)
    custom_options.loading && closeLoading(custom_options)
    // 业务代码错误
    if (custom_options.code_message_show && response.data && response.data.code !== 0) {
      ElMessage({
        type: error,
        message: response.data.message
      })
      return Promise.reject(response.data)
    }
    return custom_options.reduct_data_format ? response.data : response
  },
  error => {
    error.config && removePending(error.config)
    custom_options.loading && closeLoading(custom_options)
    custom_options.error_message_show && httpErrorStatusHandle(error)
    return Promise.reject(error)
  }
)

function httpErrorStatusHandle(error) {
  if (axios.isCancel(error)) return console.log(`请求的重复请求：${  error.message}`)
  let message = ''
  if (error && error.response) {
    switch (error.response.status) {
      case 302: message = '接口重定向'; break;
      case 400: message = '参数不正确！'; break;
      case 401: message = '您未登录，或者登录已经超时，请先登录！'; break;
      case 403: message = '您没有权限操作！'; break;
      case 404: message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
      case 408: message = '请求超时！'; break;
      case 409: message = '系统已存在相同数据！'; break;
      case 500: message = '服务器内部错误！'; break;
      case 501: message = '服务未实现！'; break;
      case 502: message = '网关错误！'; break;
      case 503: message = '服务不可用！'; break;
      case 504: message = '服务暂时无法访问，请稍后再试！'; break;
      case 505: message = 'HTTP版本不受支持！'; break;
      default: message = '异常问题，请联系管理员！'; break
    }
  }
  if (error.message.includes('timeout')) message = '网络请求超时'
  if (error.message.includes('Network')) message = window.navigator.onLine ? '服务端异常' : '您断网了'
  ElMessage({
    type: 'error',
    message
  })
}

function closeLoading(_options) {
  if (_options.loading && LoadingInstance._count > 0) {
    LoadingInstance._count--
  } if (LoadingInstance._count === 0) {
    LoadingInstance._target.close()
    LoadingInstance._target = null
  }
}
function addPending(config) {
  // 每个请求的唯一值
  const pendingKey = getPendingKey(config)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    if (!pendingMap.has(pendingKey)) {
      pendingMap.set(pendingKey, cancel)
    }
  })
}

function removePending(config) {
  const pendingKey = getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

// 生成每个请求的唯一值
function getPendingKey(config) {
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data)
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

export default myAxios