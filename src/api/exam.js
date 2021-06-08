import {request} from '../network/request'
export function addExam(params) {
    return request({
        url: '/api/paper/addExam',
        method: 'post',
        data: params
    })
}
export function findAllExam() {
    return request({
        url: '/api/paper/findAllExam',
        method: 'get'
    })
}
export function deleteExam(params) {
    return request({
        url: '/api/paper/deleteExam',
        method: 'get',
        params:  params
    })
}
export function findExamByParams(params) {
    return request({
        url: '/api/paper/findExamByParams',
        method: 'post',
        data: params
    })
}
export function updateExamById(params) {
    return request({
        url: '/api/paper/updateExamById',
        method: 'post',
        data: params
    })
}