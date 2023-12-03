// router.js
import {createRouter, createWebHistory } from'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../components/CaseList'), // 替换成实际的首页组件路径

    },
    {
        path: '/details/:id',
        name: 'caseDetails',
        component: () => import('../components/CaseDetails'),
        props: true,
    },
];

const router=createRouter({

    history: createWebHistory(),//这个一定要加上

    routes

})

export default router;
