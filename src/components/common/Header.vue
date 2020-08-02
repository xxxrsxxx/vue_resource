<template>
	<div class="header">
		<div class="top">
			<h1 @click.stop="changeUrl({ path: '/profile', name: 'profile' })">
				<img src="@/assets/logo.png" alt="logo" />
			</h1>
			<span>x_workspace</span>
			<div class="menu_item">
				<button class="fas fa-bars" @click.prevent="toggleNav()"></button>
			</div>
		</div>
		<nav @click.stop="toggleNav()" :class="{ on: menuState }">
			<ul>
				<li @click.stop="changeUrl({ path: '/profile', name: 'profile' }, $event)">
					<span>profile</span>
				</li>
				<li @click.stop="changeUrl({ path: '/library', name: 'library' }, $event)">
					<span>library</span>
				</li>
				<li @click.stop="changeUrl({ path: '/workList', name: 'workList' }, $event)">
					<span>workList</span>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { store } from '@/store';
export default {
	name: 'header-component',
	data() {
		return {
			menuState: false,
			navList: [],
		};
	},
	computed: {
		...mapGetters(['fetchedUi']),
		headerT() {
			return document.querySelector('.header .top');
		},
		navEl() {
			return document.querySelectorAll('nav ul li');
		},
	},
	methods: {
		toggleNav() {
			const { navEl, $_gsap, navList } = this;
			this.menuState = !this.menuState;
			navEl.forEach((e, i) => {
				if (navList[i] === undefined) {
					navList[i] = $_gsap.to(e, {
						duration: 1 + i,
						opacity: 1,
						y: 0,
						delay: 1.2,
						ease: 'expo.out',
					});
				} else if (this.menuState == false) navList[i].reverse();
				else navList[i].restart();
			});
		},
		changeUrl(gnbInfo) {
			const { path, name } = gnbInfo;
			if (this.$route.name === name) {
				this.$_event.$emit('gnbLoad');
			} else this.$router.push(path);
			setTimeout(() => {
				this.menuState = false;
			}, 50);
		},
		test() {
			//this.$store.dispatch("FETCT_TEST",[{k:1}]);
		},
	},
	mounted() {
		this.test();
		this.$store.dispatch('FETCH_FN', {
			UI: { key: 'header_top', params: this.headerT.clientHeight },
		});
	},
};
</script>

<style scoped lang="scss">
@import 'src/assets/css/common';
.header {
	position: fixed;
	top: 0;
	width: 100%;
	line-height: $header-height;
	z-index: 99;
	color: #333;
	.top {
		background: linear-gradient(45deg, #000, #bdbdbd);
		height: $header-height;
		h1 {
			display: inline-block;
			width: 25px;
			height: 25px;
			padding: 12.5px;
			box-sizing: initial;
		}
		span {
			display: inline-block;
			vertical-align: top;
			color: #fff;
		}
		.menu_item {
			position: absolute;
			top: 0;
			right: 0;
			.fa-bars {
				width: 50px;
				height: 50px;
				background: #fff;
				&:before {
					font-size: 1.5em;
					color: #000;
				}
			}
		}
	}
	nav {
		position: fixed;
		left: -100%;
		width: 100%;
		height: 100%;
		background: #fff;
		opacity: 0;
		transition-property: opacity, left;
		transition-duration: 0.4s, 0s;
		transition-delay: 0.1s, 0.2s;
		transition-timing-function: ease-out, ease;
		&.on {
			left: 0;
			opacity: 1;
		}
		ul {
			position: absolute;
			top: 50%;
			left: 0;
			width: 100%;
			text-align: center;
			transform: translateY(-100%);
			-webkit-transform: translateY(-100%);
			li {
				display: inline-block;
				width: auto;
				margin-left: 10px;
				transform: translate(0px, -100px);
				-webkit-transform: translate(0px, -100px);
				opacity: 0;
				&:first-child {
					margin-left: 0;
				}
			}
		}
	}
}
</style>
