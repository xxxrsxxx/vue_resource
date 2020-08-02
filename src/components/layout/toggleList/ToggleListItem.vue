<template>
	<div class="tg_wrap" @click="toggle($event)">
		<div class="top">
			<i>{{ listData.id }}</i>
			<span>{{ listData.tit }}</span>
			<i class="fas fa-sort-down">btn</i>
		</div>
		<template class="bottom" v-if="isActive">
			<p v-html="listData.desc"></p>
			<div class="sub">
				<div v-for="item in listData.list">
					<a v-bind:href="item.link" target="_blank">{{ item.link }}</a>
					<span>공헌도 {{ item.contribution }}% </span>
				</div>
			</div>
			<p>근무 기간 {{ listData.date }}</p>
			<strong v-if="listData.id == 0"
				>2020.05.01 기준 롯데온 서비스 플랫폼 출시하여 이전 서비스는 종료 되었습니다.
			</strong>
		</template>
	</div>
</template>

<script>
export default {
	name: 'ToggleListItem',
	props: ['listData'],
	methods: {
		toggle() {
			this.isActive = !this.isActive;
		},
	},
	data() {
		return {
			isActive: true,
		};
	},
};
</script>

<style scoped>
.tg_wrap {
	margin-top: 15px;
}
.tg_wrap .top {
	height: 36px;
	display: flex;
	align-items: center;
	font-size: 16px;
	color: #fff;
	background: #3e3e3e;
	border-radius: 10px;
}
.screenType01 .top {
	height: 30px;
	font-size: 14px;
}
.tg_wrap .top > * {
	padding-left: 10px;
}
.top .fa-sort-down {
	font-size: 0;
	flex: none;
	margin-left: auto;
	margin-right: 15px;
}
.top .fa-sort-down:before {
	font-size: 15px;
}
.tg_wrap .bottom {
	padding: 20px;
	color: #333;
}
.screenType01 .bottom {
	font-size: 12px;
}
.bottom .sub a {
	color: #012aaf;
}
.bottom .sub span {
	padding-left: 10px;
}
</style>
