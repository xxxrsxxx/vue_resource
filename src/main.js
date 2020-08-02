import Vue from 'vue';
import App from './App.vue';
import { router } from './routes/index';
import { store } from './store/index';

import plugIn from './common/plugIn/index';

Vue.use(plugIn);
Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	router,
	store,
}).$mount('#app');
