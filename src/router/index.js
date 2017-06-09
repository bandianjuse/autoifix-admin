import Vue from 'vue'
import Router from 'vue-router'
import { requestloginValid } from '../api/api';
import Login from '../pages/Login.vue'
import NotFound from '../pages/404.vue'
import Home from '../pages/Home.vue'
import Main from '../pages/Main.vue'
import Category from '../pages/guide/Category.vue'
import Guide from '../pages/guide/Guide.vue'
import Exchange from '../pages/exchange/Exchange.vue'
import Banner from '../pages/basis/Banner.vue'
import Users from '../pages/users/Users.vue'

/*import News from '../pages/info/News.vue'
import Concept from '../pages/info/Concept.vue'
import Works from '../pages/works/Works.vue'

import Service from '../pages/service/Service.vue'
import Job from '../pages/service/Job.vue'
import Team from '../pages/service/Team.vue'
import Confing from '../pages/basis/Confing.vue'*/

Vue.use(Router)
const router = new Router({
  /*mode: 'history',*/
  routes: [
    {
      path: '/login',
      component: Login,
      name: '',
      hidden: true
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '基础配置',
      iconCls: 'fa fa-cog',
      children: [
        { path: '/banner', component: Banner, name: '首页焦点图' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '维修指南管理',
      iconCls: 'fa fa-cog',
      children: [
        { path: '/category', component: Category, name: '分类管理' },
        { path: '/guide', component: Guide, name: '维修指南审核' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '积分兑换',
      iconCls: 'fa fa-cog',
      children: [
        { path: '/exchange', component: Exchange, name: '积分兑换' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      iconCls: 'fa fa-cog',
      children: [
        { path: '/users', component: Users, name: '用户列表' },
      ]
    },
   /* {
      path: '/',
      component: Home,
      name: '资讯管理',
      iconCls: 'fa fa-newspaper-o',//图标样式class
      children: [
        { path: '/news', component: News, name: '动态资讯' },
        { path: '/concept', component: Concept, name: '杨清观点' },
        { path: '/main', component: Main, name: '主页', hidden: true },
        /!*{ path: '/table', component: Table, name: '表格' },
        { path: '/form', component: Form, name: '表单' },*!/
        /!*{ path: '/user', component: user, name: '列表' },*!/
      ]
    },
    {
      path: '/',
      component: Home,
      name: '作品管理',
      iconCls: 'fa fa-picture-o',
      children: [
        { path: '/works', component: Works, name: '杨清作品' },
        { path: '/category', component: Category, name: '作品分类' },
      ]
    },
    {
      path: '/',
      component: Home,
      name: '服务管理',
      iconCls: 'fa fa-server',
      children: [
        { path: '/service', component: Service, name: '杨清服务' },
        { path: '/job', component: Job, name: '招聘信息' },
        { path: '/team', component: Team, name: '团队风采' }
      ]
    },*/
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})

//登录栏截
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
  } else {
    requestloginValid({}).then((res) => {
      if (res.data.code === 0) {
        next()
      } else {
        next({ path: '/login' })
      }
    });
  }
});


export default router

