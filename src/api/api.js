import axios from 'axios';

let base = '/api';

/*登录*/
export const requestLogin = params => { return axios.post(`${base}/admin/login`, params).then(res => res.data); };

/*注销*/
export const requestLogout = params => { return axios.get(`${base}/admin/logout`, { params: params }); };

/*验证是否登录*/
export const requestloginValid = params => { return axios.get(`${base}/admin/check_login`, { params: params }); };

/*分类CRUD*/
export const categoryList = params => { return axios.get(`${base}/category`, { params: params }).then(res => res.data); };
export const categoryAdd = params => { return axios.post(`${base}/category`, params).then(res => res.data); };
export const categoryDel = params => { return axios.delete(`${base}/category`,  { params: params }).then(res => res.data); };
export const categoryUpdate = params => { return axios.put(`${base}/category/${params.id}`,  params).then(res => res.data); };

/*指南CRUD*/
export const guideList = params => { return axios.get(`${base}/guide`, { params: params }).then(res => res.data); };
export const guideUpdate = params => { return axios.put(`${base}/guide/${params.id}`,  params).then(res => res.data); };


/*积分兑换CRUD*/
export const exchangeList = params => { return axios.get(`${base}/exchange`, { params: params }).then(res => res.data); };
export const exchangeAdd = params => { return axios.post(`${base}/exchange`, params).then(res => res.data); };
export const exchangeDel = params => { return axios.delete(`${base}/exchange`,  { params: params }).then(res => res.data); };
export const exchangeUpdate = params => { return axios.put(`${base}/exchange/${params.id}`,  params).then(res => res.data); };


/*配置CRUD*/
export const configList = params => { return axios.get(`${base}/config`, { params: params }).then(res => res.data); };
export const configUpdate = params => { return axios.put(`${base}/config/${params.id}`,  params).then(res => res.data); };

/*用户CRUD*/
export const usersList = params => { return axios.get(`${base}/users/list`, { params: params }).then(res => res.data); };
