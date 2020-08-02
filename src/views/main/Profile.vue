<template>
	<div>
		<chart-layout :chartData="chart"></chart-layout>
		<div class="description" style="font-size:16px">
			VUE로 작업한 시작 페이지 입니다. <br />
			아래 리액트 페이지 같은 경우 서버 구동 후 진행 됩니다.<br />
			기다려 주시면 화면이 출력 됩니다.<br />
			<a class="heroku_url" href="https://xxrsxx.herokuapp.com" target="_blank"
				>REACT https://xxrsxx.herokuapp.com</a
			>
			<br />
			<a class="git_url" v-bind:href="career.git" target="_blank">GIT URL {{ career.git }}</a>
		</div>

		<div class="career_wrap">
			<h3>{{ career.title }}</h3>

			<div v-for="item in career.items">
				<toggle-list-item :listData="item"></toggle-list-item>
			</div>
		</div>
	</div>
</template>

<script>
import bus from '@/common/bus/bus';
import ChartLayout from '@/components/resource/chart/ChartLayout';
import ToggleListItem from '@/components/layout/toggleList/ToggleListItem';
export default {
	name: 'profile',
	components: {
		ChartLayout,
		ToggleListItem,
	},
	computed: {
		chart() {
			try {
				return this.$store.state.API.profile.data.chart;
			} catch (e) {
				console.log(e);
			}
		},
		career() {
			try {
				return this.$store.state.API.profile.data.career;
			} catch (e) {
				console.log(e);
			}
		},
	},
	data() {
		return {};
	},
	mounted() {
		bus.$emit('appEvent', { handle: 'load', value: false });
	},
};
</script>

<style scoped>
.description {
	margin-top: 30px;
	width: 100%;
	text-align: center;
	letter-spacing: -0.5px;
}
.career_wrap {
	margin-top: 50px;
}
.career_wrap h3 {
	font-size: 20px;
}
.career_wrap .git_url {
	display: block;
}
</style>
