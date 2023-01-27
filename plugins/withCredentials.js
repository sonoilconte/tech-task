export default (context) => {
  const axios = context.$vsf.$ct.client;
  axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    return config;
  });
};
