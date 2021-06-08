import {request} from '../network/request'
export function findAllTestTitle() {
    return request({
        url: '/api/papertest/findAllTestTitle',
        method: 'get'
    })
}
export function deleteTestTitle(params) {
    return request({
        url: '/api/papertest/deleteTestTitle',
        method: 'get',
        params: params
    })
}
export function findTestTitleByParams(params) {
    return request({
        url: '/api/papertest/findTestTitleByParams',
        method: 'post',
        data: params
    })
}
export function addTestTitle(params) {
    return request({
        url: '/api/papertest/addTestTitle',
        method: 'post',
        data: params
    })
}

export function findTestTitleById(params) {
    return request({
        url: '/api/papertest/findTestTitleById',
        method: 'get',
        params: params
    })
}

export function updateTestTitleById(params) {
    return request({
        url: '/api/papertest/updateTestTitleById',
        method: 'post',
        data: params
    })
}

export function updateTestTitleByExamDetailId(params) {
    return request({
        url: '/api/papertest/updateTestTitleById',
        method: 'post',
        data: params
    })
}

export function findExamTitleByAuto(params) {
    return request({
        url: '/api/papertest/findAllTestTitleByAuto',
        method: 'get',
        params: params
    })
}

export function addTestTitleByAuto(params) {
    return request({
        url: '/api/papertest/addTestTitleByAuto',
        method: 'post',
        data: params
    })
}