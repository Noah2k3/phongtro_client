import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // gắn token vào header
    let token = window.localStorage.getItem('persist:auth') && JSON.parse(window.localStorage.getItem("persist:auth"))?.token?.slice(1, -1)
    config.headers = {
        authorization: token ? `Bearer ${token}` : null
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // refresh token
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default instance

// import axios from "axios";

// const instance = axios.create({
//     baseURL: process.env.REACT_APP_SERVER_URL
// })

// // Thêm một bộ đón chặn request
// instance.interceptors.request.use(function (config) {
//   // Làm gì đó trước khi request dược gửi đi
//   // gắn token vào header
//   return config;
// }, function (error) {
//   // Làm gì đó với lỗi request
//   return Promise.reject(error);
// });

// // Thêm một bộ đón chặn response
// instance.interceptors.response.use(function (response) {
//   // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
//   // Làm gì đó với dữ liệu response
//   // refresh token
//   return response;
// }, function (error) {
//   // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
//   // Làm gì đó với lỗi response
//   return Promise.reject(error);
// });

// export default instance

