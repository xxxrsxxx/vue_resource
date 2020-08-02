<template>
	<div v-if="loading">
		<div class="lds_dim"></div>
		<div class="lds_flow">
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		loading: {
			type: Boolean,
			required: true,
		},
	},
};
</script>

<style scoped lang="scss">
@import 'src/assets/css/common';
.lds_dim {
	position: fixed;
	top: $header-height;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 99;
	background: #fff;
}
.lds_flow {
	display: inline-block;
	position: absolute;
	width: 64px;
	height: 64px;
	top: 50%;
	left: 50%;
	z-index: 100;
	transform: translate(-50%, -50%);
	-webkit-transform: translate(-50%, -50%);
}
.lds_flow div {
	display: inline-block;
	position: absolute;
	left: 6px;
	width: 13px;
	background: #000;
	animation: lds-flow 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds_flow div:nth-child(1) {
	left: 6px;
	animation-delay: -0.24s;
}
.lds_flow div:nth-child(2) {
	left: 26px;
	animation-delay: -0.12s;
}
.lds_flow div:nth-child(3) {
	left: 45px;
	animation-delay: 0;
}
@keyframes lds-flow {
	0% {
		top: 6px;
		height: 51px;
	}
	50%,
	100% {
		top: 19px;
		height: 26px;
	}
}
</style>
