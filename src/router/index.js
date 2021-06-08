import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '登录页',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/user/login.vue')
  },
  // {
  //   path: '/controlPanel',
  //   name: 'control-panel',
  //   component: () => import('../views/controllerPanel/controllerPanel.vue')
  // },
  {
    path: '/exam/testmanager',
    name: 'exam-testmanager',
    component: () => import('../views/exam/testManager.vue')
  },
  {
    path: '/exam/detail',
    name: 'exam-detail',
    component: () => import('../views/exam/examDetail.vue')
  },
  {
    path: '/exam/add',
    name: 'exam-add',
    component: () => import('../views/exam/examAdd.vue')
  },
  {
    path: '/exam/manager',
    name: 'exam-manager',
    component: () => import('../views/exam/examManager.vue')
  },
  {
    path: '/test/add',
    name: 'test-add',
    component: () => import('../views/exam/testAdd.vue')
  },
  {
    path: '/user/personal',
    name: 'personal-data',
    component: () => import('../views/user/personalData.vue')
  },
  {
    path: '/test/modify',
    name: 'test-modify',
    component: () => import('../views/exam/testModify.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
