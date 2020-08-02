<template>
	<div class="xswipe" ref="xswipe">
		<div class="xswipe_wrap">
			<ul class="clear">
				<li v-for="(item, $index) in sdata.items" :key="item.key">
					{{ item.desc }} {{ $index + 1 }}
				</li>
			</ul>
		</div>
		<template v-if="indicatorVaridation">
			<div class="indicator">
				<span
					v-for="$index in state.page"
					:class="{ act: state.idx === $index - 1 }"
					@click.stop="swpControl($index - 1)"
				>
				</span>
			</div>
		</template>
		<template v-if="controlBtn">
			<div class="control clear">
				<a @click="swpControl('p')"> prev</a>
				<a @click="swpControl('n')"> next</a>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	name: 'Swiper',
	props: ['sdata', 'indicator', 'controlBtn', 'spaceMax', 'spacePercent'],
	data() {
		return {
			s: {},
			state: {
				idx: 0,
				total: 0,
				view: 1,
				page: 0,
				pos: 0,
				touchPos: 0,
				touchPosY: 0,
				duration: 300,
				easing: 'easeOutExpo',
				autoHeight: true,
			},
			space: {
				w: window.innerWidth,
				max: this.spaceMax ? this.spaceMax : 0,
				p: this.spacePercent ? this.spacePercent : 20,
			},
			useScrollPos: this.scrollType == 'Y' ? 'Y' : null,
		};
	},
	computed: {
		indicatorVaridation() {
			const { sdata, indicator } = this;
			let value = false;
			if (indicator && sdata.items.length <= 6) value = true;
			return value;
		},
	},
	methods: {
		init(o) {
			this.settings(o);
			new this.$_hammer(this.s.pwrap).on('panstart panmove panend', e => {
				this.drag(e);
			});
		},
		settings(o) {
			const { s, state, getSize, getCubicBezier, align, resize } = this;
			//https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
			//객체 할당 ie 호환 x
			Object.assign(s, o);
			state.total = s.list.length;
			state.page = state.total / state.view;
			state.slicew = getSize().width / state.view;
			s.list.forEach((e, i) => {
				Object.assign(e.style, {
					width: state.slicew,
					left: 0,
					position: 'absolute',
					transform: 'translate( ' + 100 * i + '%,0px)',
				});
			});
			if (state.autoHeight) {
				Object.assign(s.pwrap.style, {
					'-webkit-transition':
						'height ' + state.duration + 'ms ' + getCubicBezier(state.easing),
					'-moz-transition':
						'height ' + state.duration + 'ms ' + getCubicBezier(state.easing),
					'-o-transition':
						'height ' + state.duration + 'ms ' + getCubicBezier(state.easing),
					'-ms-transition':
						'height ' + state.duration + 'ms ' + getCubicBezier(state.easing),
					transition: 'height ' + state.duration + 'ms ' + getCubicBezier(state.easing),
				});
			}
			window.addEventListener('resize', resize);
			resize();
			align(0);
		},
		getSize() {
			const { s } = this;
			return {
				width: window.innerWidth,
				height: window.innerHeight,
				p: {
					width: s.pwrap.innerWidth,
					height: s.pwrap.innerHeight,
				},
				w: {
					width: s.wrap.innerWidth,
					height: s.wrap.innerHeight,
				},
			};
		},
		resize() {
			const { s, space } = this;
			space.w = window.innerWidth;
			if (space.w >= space.max) {
				s.wrap.style.width = 100 - space.p + '%';
			} else {
				s.wrap.style.width = 'auto';
			}
		},
		setHeight() {
			const { s, state } = this;
			if (!state.autoHeight) return;
			let h = s.list[state.idx].clientHeight;
			s.pwrap.style.height = `${h}px`;
		},
		setStopAtr() {
			const _s = document.querySelector('body');
			_s.setAttribute('ondragstart', 'return false');
			_s.setAttribute('onselectstart', 'return false');
		},
		drag(e) {
			const { state } = this;
			this.setStopAtr();
			var touchProps = e.changedPointers[0];
			let touchX = touchProps.clientX,
				touchY = touchProps.clientY;
			switch (e.type) {
				case 'panstart':
					state.touchPos = touchX;
					state.touchPosY = touchY;
					break;
				case 'panmove':
					var cpos = state.touchPos - touchX,
						cy = state.touchPosY - touchY;
					if (Math.abs(cy) > 10 && this.useScrollPos != 'X') this.useScrollPos = 'Y';
					if (Math.abs(cpos) > 20 && this.useScrollPos != 'Y') this.useScrollPos = 'X';
					if (Math.abs(cpos) > window.innerWidth) return;
					if (this.useScrollPos != 'Y') this.draging(cpos);
					break;
				case 'panend':
					this.draging(state.touchPos - touchX, true);
					state.touchPos = state.touchPosY = 0;
					this.useScrollPos = null;
					break;
			}
		},
		count(i, s) {
			const { state } = this;
			let d = s == 'n' ? i + 1 : i - 1;
			if (d < 0) d = state.total - 1;
			if (d > state.total - 1) d = 0;
			return d;
		},
		align(i, ap) {
			const { s, state, count, setHeight } = this;
			var n = count(i, 'n'),
				p = count(i),
				h = s.wrap.children[0].clientHeight,
				d = -500;
			if (state.total == 2 && i == 1) p = 2;
			if (state.total == 2 && i == 0) p = 3;
			//https://ahnheejong.name/articles/less-famous-css-properties/
			Object.assign(s.pwrap.style, {
				width: '100%',
				overflow: 'hidden',
				height: `${h}px`,
				'will-change': 'transform',
				'pointer-events': 'auto',
			});

			s.list.forEach((e, c) => {
				var pos = d;
				if (c == i && pos == d) pos = 0;
				if (c == n && pos == d) pos = 100;
				if (c == p && pos == d) pos = -100;
				Object.assign(e.style, {
					width: '100%',
					transform: 'translate(' + pos + '%,0px)',
				});
			});
			Object.assign(s.wrap.style, {
				'-webkit-user-drag': 'none',
				'touch-action': 'pan-y',
				'user-select': 'none',
				'will-change': 'transform',
				'box-sizing': 'border-box',
				height: '100%',
				margin: '0 auto',
			});
			state.idx = i;
			setHeight();
		},
		getCubicBezier(type) {
			switch (type) {
				case 'easeOutExpo':
					return 'cubic-bezier(0.190, 1.000, 0.220, 1.000)';
				case 'easeInOutExpo':
					return 'cubic-bezier(1.000, 0.000, 0.000, 1.000)';
				case 'easeOutCubic':
					return 'cubic-bezier(0.215, 0.610, 0.355, 1.000)';
				case 'easeOutQuart':
					return 'cubic-bezier(0.165, 0.840, 0.440, 1.000)';
				case 'easeOutQuint':
					return 'cubic-bezier(0.230, 1.000, 0.320, 1.000)';
				case 'easeOutCirc':
					return 'cubic-bezier(0.785, 0.135, 0.150, 0.860)';
				default:
					return '';
			}
		},
		getEasing(easing) {
			const { state, getCubicBezier } = this;
			return easing
				? {
						'-webkit-transition':
							'-webkit-transform ' +
							state.duration +
							'ms ' +
							getCubicBezier(state.easing),
						'-moz-transition':
							'-webkit-transform ' +
							state.duration +
							'ms ' +
							getCubicBezier(state.easing),
						'-o-transition':
							'-webkit-transform ' +
							state.duration +
							'ms ' +
							getCubicBezier(state.easing),
						transition:
							'transform ' + state.duration + 'ms ' + getCubicBezier(state.easing),
				  }
				: {
						'-webkit-transition': '-webkit-transform 0ms',
						'-moz-transition': '-webkit-transform 0ms',
						'-o-transition': '-webkit-transform 0ms',
						transition: '-webkit-transform 0ms',
				  };
		},
		translate(c, p) {
			c['-webkit-transform'] = p;
			c['-moz-transform'] = p;
			c['-o-transform'] = p;
			c['-ms-transform'] = p;
			c['transform'] = p;
			return c;
		},
		draging(p, e) {
			const { s, state, count, align, translate, getEasing } = this;
			let np = state.pos - p;
			Object.assign(s.wrap.style, translate(getEasing(e), `translate(${np}px,0px)`));
			if (e) {
				let _s = p > 0 ? 'n' : 'p';
				Object.assign(
					s.wrap.style,
					translate(getEasing(e), 'translate(' + (_s == 'n' ? -100 : 100) + '%,0px)'),
				);
				setTimeout(function() {
					let cnt = count(state.idx, _s);
					Object.assign(s.wrap.style, translate(getEasing(), 'translate(0px,0px)'));
					align(cnt);
				}, state.duration);
			}
		},
		swpControl(v) {
			const { state, align, draging } = this;
			switch (v) {
				case 'n':
					draging(1, true);
					break;
				case 'p':
					draging(-1, true);
					break;
				default:
					if (typeof v != 'number' || v < 0 || v > state.page - 1) return;
					align(v, true);
			}
		},
	},
	mounted() {
		const base = this.$refs.xswipe;
		const config = {
			pwrap: base.querySelector('.xswipe_wrap'),
			wrap: base.querySelector('.xswipe_wrap ul'),
			list: base.querySelectorAll('.xswipe_wrap ul li'),
		};
		this.init(config);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize);
	},
};
</script>

<style scoped>
.xswipe {
	position: relative;
}
.xswipe_wrap {
}
.xswipe_wrap ul {
	margin: 0;
	padding: 0;
	list-style: none;
	white-space: nowrap;
	position: relative;
}
.xswipe_wrap li {
	padding: 80px 0;
	width: 100%;
	display: inline-block;
	text-align: center;
	background: #ccc;
}
.clear:after {
	content: '';
	display: block;
	clear: both;
}

.xswipe_wrap li:nth-child(1) {
	padding: 80px 0;
}
.xswipe_wrap li:nth-child(2) {
	padding: 70px 0;
	background: antiquewhite;
}
.xswipe_wrap li:nth-child(3) {
	padding: 90px 0;
	background: brown;
}
.xswipe_wrap li:nth-child(4) {
	padding: 100px 0;
}

.indicator {
	padding: 20px 0;
	text-align: center;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
.indicator span {
	display: inline-block;
	text-align: center;
	background: #444;
	border-radius: 50%;
	width: 6px;
	height: 6px;
	margin: 0 2px;
	font-size: 0;
}
.indicator span.act {
	background: #888;
}
.control {
	padding: 20px 10px;
}
.control a:first-child {
	float: left;
}
.control a:last-child {
	float: right;
}
</style>
