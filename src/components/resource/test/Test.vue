<template>
	<!-- 태그 이동 -->
	<div class="TEST_WRAP">
		<div id="map" style="width:100%;height:100%;"></div>
		<div class="TEST">
			<p>TEST</p>
		</div>
	</div>
	<!--// 태그 이동 -->
</template>

<script>
export default {
	name: 'TEST',
	props: {
		space: {
			type: Number,
			default: 10,
		},
	},
	data() {
		return {
			memo: {},
			state: {
				drag: false,
				pos: 0,
				sPosX: 0,
				sPosY: 0,
				limitX: window.innerWidth - this.space,
				limity: window.innerHeight - this.space,
				x: 0,
				y: 0,
				w: 200,
				h: 200,
			},
			windowEventListener: ['mousemove', 'mouseup'],
		};
	},
	methods: {
		init(o) {
			this.memo = { ...o };
			this.addEvent();
		},
		addEvent() {
			const { memo, windowEventListener, drag } = this;
			memo.anchor.addEventListener('mousedown', drag);
			windowEventListener.forEach(e => {
				window.addEventListener(e, this.eventSwitch);
			});
		},
		eventSwitch(e) {
			const { memo, space, state, draging } = this;
			switch (e.type) {
				case 'mousemove':
					if (state.drag === false) return;
					let movePosX = e.clientX - state.sPosX, // move pos;
						movePosY = e.clientY - state.sPosY, // move pos;
						rx = null,
						ry = null;
					state.x = state.sPosX + movePosX;
					state.y = state.sPosY + movePosY;
					rx = state.x + state.w;
					ry = state.y + state.h;
					// space limit
					if (state.x < space) state.x = space;
					if (state.y < space) state.y = space;
					if (rx > state.limitX) state.x = state.limitX - state.w;
					if (ry > state.limity) state.y = state.limity - state.h;

					console.log('mouseMoveX', state.sPosX, movePosX, state.x);
					console.log('mouseMoveY', state.sPosY, movePosY, state.y);
					draging(true, state.x, state.y, state.w, state.h);
					break;
				case 'mouseup':
					draging(false);
					break;
			}
		},
		drag(e) {
			const { state } = this;
			state.drag = true;
			state.sPosX = e.clientX;
			//console.log('drag', e.target);
		},
		draging(e, cx, cy, w, h) {
			const { memo, state } = this;
			if (e === false || !state.drag) state.drag = false;
			console.log('draging', e, cx, cy);
			const config = {
				left: `${cx}px`,
				top: `${cy}px`,
				width: `${w}px`,
				height: `${h}px`,
			};
			Object.assign(memo.anchor.style, config);
		},
	},
	mounted() {
		const config = {
			anchor: document.querySelector('.TEST'),
		};
		this.init(config);

		const mapContainer = document.getElementById('map'), // 지도를 표시할 div
			mapOption = {
				center: new kakao.maps.LatLng(37.65057316487021, 126.88712440006807), // 지도의 중심좌표
				level: 5, // 지도의 확대 레벨
			};

		var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

		// 지도를 클릭한 위치에 표출할 마커입니다
		var marker = new kakao.maps.Marker({
			// 지도 중심좌표에 마커를 생성합니다
			position: map.getCenter(),
		});
		// 지도에 마커를 표시합니다
		marker.setMap(map);
	},
};
</script>

<style scoped>
.TEST_WRAP {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
.TEST {
	position: absolute;
	top: 0;
	left: 0;
	width: 200px;
	height: 200px;
	border: 1px solid #000;
	z-index: 10;
}
</style>
