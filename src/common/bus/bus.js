import Vue from 'vue';
import { store } from '@/store/index';

export default new Vue({
	store,
	data() {
		return {
			screenType: 0,
			eventListener: [
				['resize', 'scroll'],
				['Android', 'iPhone', 'iPod', 'iPad'],
			],
			appObj: {
				iosType: null,
			},
		};
	},
	created() {
		const { init, eventListener } = this;
		init();
		eventListener[0].forEach(e => {
			window.addEventListener(e, this.addEvent);
		});
	},
	watch: {
		screenType(e) {
			this.$store.dispatch('FETCH_FN', {
				WATCHER: { key: 'screenType', params: e },
			});
		},
	},
	methods: {
		init() {
			this.deviceChek();
			this.screenFn();
			this.scrollFn();
		},
		deviceChek() {
			const { appObj, eventListener } = this;
			var result = [];
			eventListener[1].forEach((e, i) => {
				let m = navigator.userAgent.match(e);
				if (m !== null) result = m;
			});
			appObj.osType = result[0];
			this.$store.dispatch('FETCH_FN', {
				WATCHER: { key: 'appObj', params: this.appObj },
			});
		},
		addEvent(e) {
			switch (e.type) {
				case 'resize':
					this.screenFn();
					break;
				case 'scroll':
					this.scrollFn();
					break;
			}
		},
		screenFn() {
			const w = window.innerWidth;
			this.screenType = w < 768 ? 1 : w < 960 ? 2 : 3;
			const result = this.screenType;
			this.$emit('appEvent', { handle: 'screen', value: result });
		},
		scrollFn() {
			//console.log("scroll");
		},
	},
});
