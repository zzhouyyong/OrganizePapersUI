import {request} from '../network/request'
export function userLogin(param) {
    return request({
        url: '/api/user/login',
        method: 'post',
        data: param
    })
}
export function userRegister(param) {
    return request({
        url: '/api/user/register',
        method: 'post',
        data: param
    })
}

export function loginOut() {
    return request({
        url: '/api/user/loginOut',
        method: 'get'
    })
}

export function updateUser(params) {
    return request({
        url: '/api/user/updateUser',
        method: 'post',
        data: params
    })
}

export function findUserById(params) {
    return request({
        url: '/api/user/findUserById',
        method: 'get',
        params: params
    })
}