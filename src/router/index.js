import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/components/DashboardLayout'
import Dashboard from '@/components/Dashboard'
import Queues from '@/components/Queues'
import Logs from '@/components/Logs'
import AccessTokens from '@/components/AccessTokens'
import Documentation from '@/components/Documentation'
import Settings from '@/components/Settings'
import Backends from '@/components/Backends'

import Auth from "@/components/Auth"
import AuthReset from "@/components/AuthReset"

Vue.use(Router)

var router = new Router({
    routes: [
    	{path: '/auth', name: 'auth', component: Auth},
    	{path: '/auth/reset/:code', name: 'auth_reset', component: AuthReset},
    	{path: '/', name: 'layout', component: DashboardLayout, children: [
	        {path: '/',name: 'dashboard',component: Dashboard},
	        {path: '/queues',name: 'queues',component: Queues},
	        {path: '/logs',name: 'logs',component: Logs},
	        {path: '/backends',name: 'backends',component: Backends},
	        {path: '/access_tokens',name: 'access_tokens',component: AccessTokens},
	        {path: '/settings',name: 'settings',component: Settings},
	        {path: '/doc',name: 'doc',component: Documentation},
    	]}
    ]
})

export default router