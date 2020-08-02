import Vue from 'vue';
import VueRouter from 'vue-router';
import bus from '@/common/bus/bus';
import { store } from '@/store/index';
Vue.use(VueRouter);

// router alias example
// https://github.com/vuejs/vue-router/blob/dev/examples/route-alias/app.js

export const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '*',
			redirect: 'profile',
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('@/views/main/Profile.vue'),
			beforeEnter: (to, from, next) => {
				bus.$emit('appEvent', { handle: 'load', value: true });
				store
					.dispatch('FETCH_FN', {
						UI: { key: 'nav', params: false },
						API: { key: 'profile', params: null },
					})
					.then(() => next())
					.catch(e => console.log('rouer1 dispatch', e));
			},
		},
		{
			path: '/library',
			name: 'library',
			component: () => import('@/views/main/Library.vue'),
			beforeEnter: (to, from, next) => {
				bus.$emit('appEvent', { handle: 'load', value: true });
				store
					.dispatch('FETCH_FN', {
						UI: { key: 'nav', params: true },
						API: { key: 'library', params: null },
					})
					.then(() => next())
					.catch(e => console.log('rouer2 dispatch', e));
			},
		},
		{
			path: '/workList',
			name: 'workList',
			component: () => import('@/views/main/WorkList.vue'),
			beforeEnter: (to, from, next) => {
				bus.$emit('appEvent', { handle: 'load', value: true });
				store
					.dispatch('FETCH_FN', {
						UI: { key: 'nav', params: false },
						/*API : {key:'nav',params: null}*/
					})
					.then(() => next())
					.catch(e => console.log('rouer3 dispatch', e));
			},
		},
		{
			path: '/test',
			name: 'test',
			component: () => import('@/views/main/Test.vue'),
			beforeEnter: (to, from, next) => {
				bus.$emit('appEvent', { handle: 'load', value: true });
				next();
			},
		},
	],
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 0 };
	},
});
