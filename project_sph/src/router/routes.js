import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Detail from "@/pages/Detail";
import AddCartSuccess from "@/pages/AddCartSuccess";
import ShopCart from "@/pages/ShopCart";
import Trade from "@/pages/Trade";
import Pay from "@/pages/Pay";
import PaySuccess from "@/pages/PaySuccess";
import center from "@/pages/Center";
import myOrder from "@/pages/Center/myOrder";
import groupOrder from "@/pages/Center/groupOrder";

export default  [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        // component: Home,
        component: () => import('@/pages/Home'),
        meta: {show:true}
    },
    {
        path: '/search/:keyword?',
        name: 'search',
        component: () => import('@/pages/Search'),
        meta: {show:true},
        // props: true
        props: ($route)=>{
            return {
                keyword:$route.params.keyword,
                k:$route.query.k
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/Login'),
        meta: {show:true}
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/Register'),
        meta: {show:true}
    },
    {
        path: '/detail/:skuid',
        name: 'detail',
        component: () => import('@/pages/Detail'),
        meta: {show:true}
    },
    {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: {show:true}
    },
    {
        path: '/shopcart',
        name: 'shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: {show:true}
    },
    {
        path: '/trade',
        name: 'trade',
        component: () => import('@/pages/Trade'),
        meta: {show:true},
        beforeEnter(to,from,next){
            if (from.path=='/shopcart'){
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/pay',
        name: 'pay',
        component: () => import('@/pages/Pay'),
        meta: {show:true},
        beforeEnter(to,from,next){
            if (from.path=='/trade'){
                next()
            } else {
                next(false)
            }
        }
    },
    {
        path: '/paysuccess',
        name: 'paysuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: {show:true}
    },
    {
        path: '/center',
        name: 'center',
        component: () => import('@/pages/Center'),
        meta: {show:true},
        children: [
            {
                path: 'myorder',
                name: 'myorder',
                component: () => import('@/pages/Center/myOrder'),
            },{
                path: 'grouporder',
                name: 'grouporder',
                component: () => import('@/pages/Center/groupOrder'),
            },
            {
                path:'/center',
                redirect:'/center/myorder',
            }
        ]
    },

    {
        path: '/communication',
        component: () => import('@/pages/Communication/Communication'),
        children: [
            {
                path: 'event',
                component: () => import('@/pages/Communication/EventTest/EventTest'),
                meta: {
                    isHideFooter: true
                },
            },
            {
                path: 'model',
                component: () => import('@/pages/Communication/ModelTest/ModelTest'),
                meta: {
                    isHideFooter: true
                },
            },
            {
                path: 'sync',
                component: () => import('@/pages/Communication/SyncTest/SyncTest'),
                meta: {
                    isHideFooter: true
                },
            },
            {
                path: 'attrs-listeners',
                component: () => import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
                meta: {
                    isHideFooter: true
                },
            },
            {
                path: 'children-parent',
                component: () => import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
                meta: {
                    isHideFooter: true
                },
            },
            {
                path: 'scope-slot',
                component: () => import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
                meta: {
                    isHideFooter: true
                },
            }
        ],
    },
]
