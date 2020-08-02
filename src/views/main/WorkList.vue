<template>
	<div ref="sticky">
		<div class="sticky_wrap">
			<!-- list guide -->
			<!-- https://kr.vuejs.org/v2/guide/list.html -->
			<div v-for="item in lists" class="sticky_item">
				<p class="desc">{{ item.desc }}</p>
				<img :src="item.img" @load="onImgLoad" alt="#" />
			</div>
		</div>
		<div class="sticky_nb">
			<a class="btn" href="#" @click.prevent="nbToggle()">button</a>
			<div class="nb_wrap">
				<ul>
					<li
						class="nb_list"
						v-for="(item, index) in s.items"
						:class="{ act: index === state.sidx }"
					>
						<a href="#" @click.prevent="move(index)">
							{{ index }}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import bus from '@/common/bus/bus';

export default {
	name: 'collection',
	data() {
		return {
			lists: [
				{
					desc: '전시1',
					img: require('@/assets/img/cont1.gif'),
				},
				{
					desc: '전시2',
					img: require('@/assets/img/cont2.gif'),
				},
				{
					desc: '전시3',
					img: require('@/assets/img/cont3.gif'),
				},
				{
					desc: '전시4',
					img: require('@/assets/img/cont4.gif'),
				},
				{
					desc: '전시5',
					img: require('@/assets/img/cont5.gif'),
				},
			],
			isLoaded: false,
			s: {
				wrap: null,
				items: null,
				nbList: null,
			},
			state: {
				sidx: 0, // 스크롤 idx
				loadCidx: 0, //현재 idx
				loadNidx: 0, //현재 스크롤 다음 idx
				nbState: false,
				test: false,
			},
			nb: [],
		};
	},
	computed: {
		storeUihederT() {
			var _value = 50; //header_top default
			//try catch 문으로 변경 요망
			if (this.$store.state.UI.header_top) _value = this.$store.state.UI.header_top.value;
			return _value;
		},
		deviceInfo() {
			try {
				var value = this.$store.state.WATCHER.appObj.value;
			} catch (e) {
				console.log(e);
			}
			return value;
		},
	},
	watch: {
		isLoaded(newValue, oldValue) {
			this.init();
		},
	},
	methods: {
		init() {
			window.scrollTo(0, 0);
			this.target();
			this.setListener();
			this.work();
			this.currentIdx();

			window.addEventListener('resize', e => {
				// 모바일 임시방편 대응
				if (this.deviceInfo.osType == 'iPhone') return;
				this.setNb(e);
			});
		},
		target() {
			const { s, $refs } = this;
			const value = {
				wrap: $refs.sticky.querySelector('.sticky_wrap'),
				items: $refs.sticky.querySelectorAll('.sticky_item'),
			};
			Object.assign(s, value);
		},
		onImgLoad() {
			this.isLoaded = true;
		},
		setListener() {
			window.addEventListener('scroll', this.setEvent);
		},
		setEvent() {
			this.getScrollIdx();
			this.work();
		},
		getScrollIdx() {
			const _wy = window.pageYOffset;
			const { s, state, work } = this;
			let i = 0;
			for (i; i < s.items.length; i++) {
				//console.log("좌표값",_w.scrollY,this.s.items[i].offsetTop,window.innerHeight/2);
				if (_wy + this.storeUihederT >= s.items[i].offsetTop - window.innerHeight / 2) {
					state.sidx = i;
					work();
					continue;
				}
			}
			console.log('this IDX', this.state.sidx);
		},
		currentIdx() {
			const _wy = window.pageYOffset;
			const { s, state } = this;
			s.items.forEach(e => {
				if (_wy + this.storeUihederT >= e.offsetTop) {
					state.loadCidx = state.loadNidx++;
				}
			});
			//console.log("reload or other",this.state.loadCidx,this.state.loadNidx);
		},
		nbToggle() {
			const { state, nb } = this;
			state.nbState = !state.nbState;
			if (nb.length === 0) {
				this.setNb();
				return;
			}
			nb.forEach(e => {
				if (!state.nbState) e.reverse();
				if (state.nbState) this.setNb();
			});
		},
		setNb(event) {
			const { s, state, $_gsap, nb } = this;
			if (event && !state.nbState) return;

			s.nbList = document.querySelectorAll('.sticky_nb ul li');

			let lm = 180 + 180 / s.nbList.length, // 180 각안에서 끝지점 배치를 위해 각 설정
				rd = lm / s.nbList.length,
				pi = Math.PI / (rd * (s.nbList.length - 1)), // pi reset
				xdg = innerWidth / 10,
				ydg = innerWidth / 15;

			// nb 초기화
			nb.forEach(e => {
				e.kill();
			});
			nb.splice(0, nb.length);

			s.nbList.forEach((e, i) => {
				let rad = rd * i * pi,
					cx = Math.cos(rad) * xdg,
					sy = Math.sin(rad) * ydg;
				$_gsap.from(e, {
					opacity: 0,
					top: 0,
					right: 0,
					width: 0,
					height: 0,
				});
				nb[i] = $_gsap.to(e, {
					opacity: 1,
					top: `${sy}px`,
					right: `${cx}px`,
					width: 15,
					height: 15,
					delay: 0.7,
					duration: 0.8 + i / 5,
					ease: 'back.out(1.7)',
				});
			});
		},
		work() {
			const { s, state } = this;
			s.items[state.sidx].classList.add('act');
		},
		move(i) {
			const { s, state } = this;
			window.scrollTo(0, s.items[i].offsetTop);
		},
	},
	mounted() {
		setTimeout(() => {
			this.init();
			bus.$emit('appEvent', { handle: 'load', value: false });
		}, 500);
	},
	beforeDestroy() {
		window.removeEventListener('scroll', this.setEvent);
	},
};
</script>

<style scoped>
.sticky_wrap {
	position: relative;
}
.sticky_item {
	max-width: 640px;
	height: auto;
	margin: 0 auto;
	padding-bottom: 15px;
	border-bottom: 1px solid #000;
	opacity: 0;
}
.sticky_item.act {
	opacity: 1;
	animation: fade 1.2s ease-in-out;
	-webkit-animation: fade 1.2s ease-in-out;
}
.sticky_item .desc {
	font-size: 16px;
	padding: 15px 15px 15px 0;
}
.sticky_nb {
	position: fixed;
	top: 50%;
	right: 0px;
	width: 40px;
	height: 40px;
}
.nb_wrap {
	position: relative;
	top: -50%;
	transform: translateY(50%);
	-webkit-transform: translateY(50%);
}
.nb_wrap ul {
	transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
}
.nb_wrap ul li {
	position: absolute;
	top: 0;
	right: 0;
	width: 0;
	height: 0;
	opacity: 0;
}
.nb_wrap ul li a {
	display: block;
	width: 100%;
	height: 100%;
	background: #bdbdbd;
	border-radius: 100%;
	font-size: 0;
}
.nb_wrap ul li.act a {
	background: #000;
}
@keyframes fade {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
</style>
