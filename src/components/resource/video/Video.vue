<template>
	<div>
		<div v-if="!state.load">
			video loading....
		</div>
		<div class="video_wrap" ref="xvideo" :class="{ on: state.load }">
			<div class="video_top">
				<video playsinline="true" webkit-playsinline="true" :poster="`${data.poster}`">
					<source type="video/mp4" :src="`${data.videoUrl}`" />
				</video>
				<div
					class="video_controller"
					:class="{ showVctrl: state.showCtrl }"
					@click.stop="showControl()"
				>
					<div class="control_in_wrap">
						<em
							class="ctr_btn btn_play"
							:class="{ btn_pause: state.pause }"
							@click.stop="videoPlay()"
						></em>
						<em class="ctr_btn btn_volume"></em>
						<em class="ctr_btn btn_arrow"></em>
					</div>
					<em class="btn_fullscreen"></em>
				</div>
			</div>
			<div class="video_bottom">
				<div class="table">
					<div class="cell">
						<div class="pregress">
							<div class="bar" :style="{ width: _progress }"></div>
							<div class="dragBar" :class="{ drag: state.drag }"></div>
						</div>
					</div>
					<div class="cell timer">
						<time>{{ state.timer }}</time>
					</div>
				</div>
			</div>
			<div v-if="!state.loading" class="loading"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'video.vue',
	props: ['data'],
	data() {
		return {
			s: {},
			x: {
				touchX: 0,
				posX: 0,
				limitX: 0,
			},
			state: {
				load: false,
				loading: false,
				showCtrl: false,
				play: 0,
				pause: 0,
				drag: false,
				timer: null,
				progress: 0,
				totalTime: 0,
				fullScreen: false,
				duration: null,
				currentTime: 0,
				limitX: 0,
				ended: false,
			},
			eventListener: [
				'ended',
				'error',
				'loadedmetadata',
				'loadstart',
				'pause',
				'play',
				'playing',
				'timeupdate',
				'volumechange',
				'waiting',
			],
		};
	},
	created() {},
	computed: {
		_store() {
			return this.$store.state;
		},
		_progress() {
			return this.state.progress;
		},
	},
	watch: {
		_progress: function(n, o) {
			const { s, state } = this;
			// progress watch, dragBar 좌표 구하기
			let limitX = state.limitX,
				dragBar = s.dragBar;
			//console.log("chk",n,o,!this.opt.vdState.drag,"/n",n!=o && !this.opt.vdState.drag);
			if (n != o && !state.drag) {
				let p = n.replace('%', ''),
					c = (p / 100) * limitX, //한계값 안에서 progress 현재 값
					x = (c / (limitX + dragBar.clientWidth)) * 100; //총 길이 에서 좌표값
				dragBar.style.left = `${x}%`;
				if (isNaN(c)) return;
				this.x.posX = -c;
			}
			if (n === '100%') this.state.ended = true;
		},
	},
	methods: {
		init(o) {
			this.s = { ...o };
			this.setVdStore();
			this.setListener();
			window.addEventListener('resize', this.xResize);
			this.getLimitX();
		},
		setVdStore() {
			const { _store, s } = this;
			if (typeof _store.videoList == 'undefined') _store.videoList = [];
			_store.videoList.push({
				video: s.video,
				controller: s.controller,
				btn: s.playBtn,
			});
		},
		setListener() {
			const { s, eventListener, switchEvent, $_hammer, dragEvent, progressTap } = this;
			for (let i in this.eventListener)
				s.video.addEventListener(eventListener[i], switchEvent, false);
			new $_hammer(this.s.dragBar).on('panstart panend panmove', function(e) {
				dragEvent(e);
			});
			new $_hammer(this.s.pregress).on('tap', function(e) {
				progressTap(e);
			});
		},
		progressTap(e) {
			e.preventDefault();
			const { s, state } = this;
			let cx = e.changedPointers[0].clientX,
				offset = s.pregress.getBoundingClientRect().left;
			s.video.currentTime = Math.abs(((cx - offset) / state.limitX) * state.totalTime);
		},
		showControl() {
			const { state } = this;
			state.showCtrl = true;
			setTimeout(() => {
				if (state.play == 1) state.showCtrl = false;
			}, 2500);
			state.play == 1 ? (state.pause = 1) : (state.pause = 0);
		},
		switchEvent(e) {
			const { s, state, showControl, showTime } = this;
			switch (e.type) {
				case 'loadedmetadata':
					s.dragBar.style.display = 'none';
					state.load = true;
					state.loading = true;
					state.showCtrl = true;
					state.totalTime = s.video.duration;
					if (state.totalTime != 0) s.dragBar.style.display = '';
					showTime(0, s.video.duration);
					break;
				case 'play':
					state.play = 1;
					state.showCtrl = false;
					break;
				case 'playing':
					//state.loading = true;
					break;
				case 'pause':
					if (!state.ended) {
						state.play = 0;
						state.showCtrl = true;
						showControl(e);
					}
					break;
				case 'timeupdate':
					showTime(s.video.currentTime, s.video.duration);
					state.loading = true;
					state.currentTime = (s.video.currentTime / s.video.duration) * 10;
					break;
				case 'waiting':
					state.loading = false;
					break;
				case 'ended':
					state.play = 0;
					state.showCtrl = true;
					break;
				case 'error':
					alert('video error');
					break;
			}
		},
		videoPlay() {
			const { s, state, _store } = this;
			if (s.video.paused) {
				let len = _store.videoList,
					cont;
				len.forEach((e, i) => {
					cont = _store.videoList[i];
					if (!cont.video.paused) cont.video.pause(); //다른 리스트 재생시
					state.showCtrl = true;
				});
			}
			if (state.play != 1) s.video.play();
			else s.video.pause();

			state.play == 1 ? (state.play = 0) : (state.play = 1);
		},
		dragEvent(e) {
			const { state, x, moveSeeker } = this;
			if (e === undefined) return;
			try {
				var _obj = e.changedPointers ? e.changedPointers[0] : e.changedTouches[0];
			} catch (e) {}
			switch (e.type) {
				case 'panstart':
					x.touchX = _obj.clientX;
					// 터치한 좌표
					state.drag = 1;
					break;
				case 'panmove':
					if (state.drag) {
						var cx = _obj.clientX - x.touchX;
						// 이동좌표 - 터치한 좌표 오른쪽 이동시 +
						moveSeeker(cx);
					}
					break;
				case 'panend':
					cx = _obj.clientX - x.touchX;
					state.drag = 0;
					moveSeeker(cx, true);
					break;
			}
		},
		moveSeeker(pos, end) {
			const { s, x, state, vseek } = this;
			let cp = x.posX - pos; //현재 이동한 포인터
			//console.log("opt.x",x.posX,"pos",cp);
			if (cp < -state.limitX || cp > 0) return;
			s.dragBar.style.left = -cp + 'px';

			if (state.play) vseek(cp, state.limitX);
			if (end) {
				x.posX = cp;
				if (!state.play) vseek(cp, state.limitX, true);
			}
		},
		getLimitX() {
			const { s, state, x } = this;
			x.touchX = 0;
			state.limitX = s.pregress.clientWidth - s.dragBar.clientWidth;
		},
		xResize() {
			const { getLimitX } = this;
			getLimitX();
		},
		addZero(n) {
			return n < 10 ? '0' + n : n;
		},
		showTime(c, t) {
			const { state, addZero } = this;
			let t_m = addZero(Math.floor(t / 60)),
				t_s = addZero(Math.floor(t % 60)),
				c_m = addZero(Math.floor(c / 60) % 60),
				c_s = addZero(Math.floor(c % 60));
			state.timer = `${c_m}:${c_s}/${t_m}:${t_s}`;
			state.progress = Math.floor((c / t) * 100) + '%';
		},
		vseek: function(ds, de, play) {
			const { s, state } = this;
			// 드래그 좌표 값 계산 후 비디오 시간 셋팅
			let currentSeek = Math.abs((ds / de) * state.totalTime);
			//console.log("vseek method",s, e,this.state.totalTime,currentSeek);
			s.video.currentTime = currentSeek;
			if (play && this.state.play) s.video.play();
		},
	},
	mounted() {
		const base = this.$refs.xvideo;
		const config = {
			top: base.querySelector('.video_top'),
			video: base.querySelector('video'),
			controller: base.querySelector('.video_controller'),
			playBtn: base.querySelector('.btn_play'),
			fullBtn: base.querySelector('.btn_fullscreen'),
			pregress: base.querySelector('.pregress'),
			dragBar: base.querySelector('.dragBar'),
			timer: base.querySelector('.timer'),
		};
		this.init(config);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.xResize);
		this.$store.state.videoList = [];
	},
};
</script>

<style scoped lang="scss">
@mixin translate($x: null, $y: null) {
	-webkit-transform: translate($x, $y);
	-moz-transform: translate($x, $y);
	-o-transform: translate($x, $y);
	-ms-transform: translate($x, $y);
	transform: translate($x, $y);
}
@mixin transtion($delay: null) {
	-webkit-transition-delay: $delay;
	-moz-transition-delay: $delay;
	-o-transition-delay: $delay;
	-ms-transition-delay: $delay;
	transition-delay: $delay;
}
.video_wrap {
	position: relative;
	overflow: hidden;
	height: 0;
	opacity: 0;
	&.on {
		height: auto;
		opacity: 1;
	}
	&:after {
		content: '';
		display: block;
		clear: both;
	}
}
.screenType02 .video_wrap {
	margin: 0 50px;
}
.video_top {
	position: relative;
}
.video_controller {
	text-align: center;
	background: rgba(0, 0, 0, 0.3);
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	position: absolute;
	-webkit-transition: opacity ease 0.6s;
	-moz-transition: opacity ease 0.6s;
	-o-transition: opacity ease 0.6s;
	-ms-transition: opacity ease 0.6s;
	transition: opacity ease 0.6s;
	opacity: 0;
	@include transtion($delay: 0.4s);
}
.video_controller span {
	color: #fff;
	position: absolute;
	display: table;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	top: 50%;
	left: 50%;
	@include translate($x: -50%, $y: -50%);
	background: rgba(0, 0, 0, 0.5);
}
.video_controller em {
	display: table-cell;
	vertical-align: middle;
}
.video_controller .ctr_btn {
	background: url('~@/assets/img/movie_btn.png') left top no-repeat;
	background-size: auto 99%;
	width: 53px;
	height: 53px;
	overflow: hidden;
	display: inline-block;
}
.video_controller .ctr_btn.btn_play {
	background-position: 0 center;
}
.video_controller .ctr_btn.btn_pause {
	background-position: -69px center;
}
.video_controller .ctr_btn.btn_full {
	background-position: -69px center;
}
.video_controller .ctr_btn.btn_volume {
	background-position: -208px center;
}
.video_controller .ctr_btn.mute {
	background-position: -277px center;
}
.video_controller .ctr_btn.btn_arrow {
	background-position: -139px center;
}
.video_controller .control_in_wrap {
	text-align: center;
	position: absolute;
	width: 100%;
	top: 50%;
	@include translate($x: 0%, $y: -50%);
}
.video_controller .control_in_wrap em {
	position: static;
	margin: 0 5px;
	-webkit-transition: -webkit-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-moz-transition: -moz-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-o-transition: -o-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-ms-transition: -ms-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	transition: -webkit-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;

	@include translate($x: 0, $y: 74px);
	opacity: 0;
}
.video_controller.showVctrl {
	@include transtion($delay: 0s);
	opacity: 1;
}
.video_controller.showVctrl .control_in_wrap {
}

.video_controller .control_in_wrap em:nth-child(1) {
	@include transtion($delay: 0.4s);
}
.video_controller .control_in_wrap em:nth-child(2) {
	@include transtion($delay: 0.3s);
}
.video_controller .control_in_wrap em:nth-child(3) {
	@include transtion($delay: 0.2s);
}
.video_controller .control_in_wrap em:nth-child(4) {
	@include transtion($delay: 0s);
}
.video_controller.showVctrl .control_in_wrap em {
	@include translate($x: 0, $y: 0px);
	opacity: 1;
}

.video_controller.showVctrl {
	.control_in_wrap {
		em {
			@for $i from 1 through 4 {
				&:nth-child(#{$i}) {
					/*@warn "계산 표현 #{$i}";*/
					@include transtion($delay: #{($i/10) + 0.2 + s});
				}
			}
		}
	}
}

.video_controller .btn_fullscreen {
	background: url('~@/assets/img/movie_play_btn_full.png') center center no-repeat;
	background-size: 100% auto;
	width: 25px;
	height: 25px;
	position: absolute;
	top: 0;
	right: 0;
	margin: 0 0px 5px 0;
	-webkit-transition: -webkit-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-moz-transition: -moz-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-o-transition: -o-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	-ms-transition: -ms-transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;
	transition: transform cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s,
		opacity cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.6s;

	@include transtion($delay: 0.2s);
	@include translate($x: 0, $y: 100px);
	opacity: 0;
}
.video_controller.showVctrl .btn_fullscreen {
	@include transtion($delay: 0.1s);
	@include translate($x: 0, $y: 0px);
	opacity: 1;
	z-index: 10;
}
.video_bottom {
	width: 100%;
	background: rgba(0, 0, 0, 0.4);
	z-index: 10;
}
.video_bottom .table {
	width: 90%;
	margin: 0 auto;
	display: table;
	height: 36px;
}
.video_bottom .table .cell {
	display: table-cell;
	vertical-align: middle;
}
.video_bottom .pregress {
	display: block;
	height: 4px;
	position: relative;
	background: rgba(255, 255, 255, 0.4);
}
.video_bottom .pregress .bar {
	display: block;
	height: 100%;
	width: 0%;
	position: absolute;
	background: #fff;
}
.video_bottom .pregress .bar {
	-webkit-transition: width ease 0.7s;
	-moz-transition: width ease 0.7s;
	-o-transition: width ease 0.7s;
	-ms-transition: width ease 0.7s;
	transition: width ease 0.7s;
}
.video_bottom .dragBar {
	display: block;
	position: absolute;
	width: 14px;
	height: 14px;
	left: 0;
	top: 50%;
	z-index: 10;
	@include translate($x: 0, $y: -50%);
}
.video_bottom .dragBar:after {
	content: '';
	position: absolute;
	width: 100%;
	height: 4px;
	background: dodgerblue;
	left: 50%;
	top: 50%;
	@include translate($x: -50%, $y: -50%);

	-webkit-transition: width ease 0.3s, height ease 0.3s, border ease 0.6s;
	-moz-transition: width ease 0.3s, height ease 0.3s, border ease 0.6s;
	-o-transition: width ease 0.3s, height ease 0.3s, border ease 0.6s;
	-ms-transition: width ease 0.3s, height ease 0.3s, border ease 0.6s;
	transition: width ease 0.3s, height ease 0.3s, border ease 0.6s;
}
.video_bottom .timer {
	text-align: right;
	width: 85px;
	font-size: 12px;
	color: #e9e9e9e9;
}
.video_bottom .dragBar.drag:after {
	-webkit-border-radius: 50%;
	-moz-border-radius: 50%;
	border-radius: 50%;
	height: 100%;
}
.video_top video {
	width: 100%;
	height: 100%;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.video_top video.fullscreen {
	background: #000;
}
.video_top video.init {
}

.showTxt .video_controller .control_in_wrap > em {
	margin: 0 25px;
}
.showTxt .video_controller .ctr_btn {
	overflow: unset;
	position: relative;
}
.showTxt .video_controller .ctr_btn:after {
	content: '';
	display: block;
	position: absolute;
	top: 113%;
	color: #fff;
	text-align: center;
	font-size: 14px;
	@include translate($x: -50%);
	left: 50%;
	white-space: nowrap;
}
.showTxt .video_controller .ctr_btn.btn_play:after {
	content: '재생';
}
.showTxt .video_controller .ctr_btn.btn_pause:after {
	content: '일시정시';
}
.showTxt .video_controller .ctr_btn.btn_volume:after {
	content: '음소거';
}
.showTxt .video_controller .ctr_btn.mute:after {
	content: '음소거해제';
}
.showTxt .video_controller .ctr_btn.btn_arrow:after {
	content: '자세히보기';
}

.video_wrap .loading {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
}
.video_wrap .loading:after {
	content: '';
	display: block;
	width: 40px;
	height: 40px;
	top: 50%;
	left: 50%;
	margin: -20px 0 0 -20px;
	position: absolute;
	background: url('~@/assets/img/loading.png') center center no-repeat;
	-webkit-animation: vSpin 2s linear infinite;
	-moz-animation: vSpin 2s linear infinite;
	-o-animation: vSpin 2s linear infinite;
	-ms-animation: vSpin 2s linear infinite;
	animation: vSpin 2s linear infinite;
	background-size: 100% 100%;
}
@keyframes vSpin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
