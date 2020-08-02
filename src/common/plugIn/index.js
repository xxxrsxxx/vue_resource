import { gsap } from 'gsap';
import Hammer from 'hammerjs';
export default {
	install(Vue) {
		Vue.prototype.$_event = new Vue();
		Vue.prototype.$_gsap = gsap;
		Vue.prototype.$_hammer = Hammer;
	},
};
