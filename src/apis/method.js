import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.timeout = 10000

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // do something here ...
    // console.log('[config]', config)

    return config;
  }, function(error) {
    // message.error(error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    console.log('[interceptors.response]', response);
    if (response.status >= 400) {
      // message.error(response.message);
      console.log(response.message)
    }

    return response;
  }, function(error) {
    // message.error(error);
    return Promise.reject(error);
  }
);

export const get = async (url) => {
  return await axios({
    method: 'get',
    url,
  });
};

export const post = async (url, data = {}, ...rest) => {
  return await axios({
    method: 'post',
    url,
    data,
    ...rest,
  });
};
