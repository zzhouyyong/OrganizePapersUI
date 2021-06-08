import {request} from '../network/request'
export function findAllTitle(params) {
    return request({
        url: '/api/paperexam/findAllExamTitle',
        method: 'get',
        params: params
    })
}
export function findExamTitleByParams(params) {
    return request({
        url:'/api/paperexam/findExamTitleByParams',
        method: 'post',
        data: params
    })
}
export function deleteExamTitle(params) {
    return request({
        url: '/api/paperexam/deleteExamTitle',
        method: 'get',
        params: params
    })
}
export function updateExamTitleById(params) {
    return request({
        url: '/api/paperexam/updateExamTitleById',
        method: 'post',
        data: params
    })
}

export function addExamTitle(params) {
    return request({
        url: '/api/paperexam/addExamTitle',
        method: 'post',
        data: params
    })
}

export function findExamTitleByTitleType(params) {
    return request({
        url: '/api/paperexam/findExamTitleByTitleType',
        method: 'get',
        params: params
    })
}