<template>
	<div id="app" :class="screenMode">
		<header-component></header-component>
		<transition name="container">
			<router-view class="container_wrap" :key="$route.path + componentKey"></router-view>
		</transition>
		<load-flow :loading="UI.loading"></load-flow>
		<footer style="height:120px;display: flex;justify-content: center;align-items: center">
			Copyright © xxxrsxxx All rights reserved<br />
			Contact xxxrsxxx for more information. zmfl3668@naver.com
		</footer>
	</div>
</template>

<script>
import HeaderComponent from '@/components/common/Header';
import LoadFlow from '@/components/common/LoadingFlow';
import bus from '@/common/bus/bus';

export default {
	name: 'app',
	components: {
		HeaderComponent,
		LoadFlow,
	},
	data() {
		return {
			UI: {
				loading: true,
				screenType: 0,
				scroll: {},
			},
			componentKey: 0, // 플러그인으로 삽입한 $evnts 활용하여 라우터 재업로드시 되는지 확인
		};
	},
	computed: {
		screenMode() {
			return `screenType0${this.UI.screenType}`;
		},
	},
	methods: {
		//{handle : 'load',value:}
		setBusEvent(e) {
			const { handle, value } = e;
			if (handle == 'load') this.setLoading(value);
			if (handle == 'screen') this.setScreen(value);
		},
		setLoading(v) {
			this.UI.loading = v;
		},
		setScreen(e) {
			this.UI.screenType = e;
		},
	},
	created() {
		this.UI.screenType = bus.$data.screenType;
		bus.$on('appEvent', this.setBusEvent);

		// 전역 $event
		this.$_event.$on('gnbLoad', () => (this.componentKey += 1));
	},
	beforeDestroy() {
		bus.$off('appEvent', this.setBusEvent);
		this.$_event.$off('gnbLoad');
	},
};
</script>

<style lang="scss">
@import 'assets/css/common.scss';
.container_wrap {
	overflow: hidden;
	width: 100%;
	max-width: 960px;
	min-height: calc(100vh - 80px);
	margin: 0 auto;
	padding: 50px 10px 0;
}
.container-enter-active,
.container-leave-active {
	background: #fff;
	transition: opacity 0.3s ease;
}
.container-enter, .container-leave-to /* .page-leave-active below version 2.1.8 */ {
	opacity: 0;
}
</style>
