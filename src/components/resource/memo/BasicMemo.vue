<template>
	<!-- 스티커 메모 -->
	<div class="wrap">
		<form @submit.prevent="submitForm" class="memoform">
			<textarea id="fm" v-model="memo.fmdata" placeholder="메모 입력 생성"></textarea>
			<button type="submit" class="btn">생성</button>
		</form>
		<template v-for="(item, $index) in memo.mlist">
			<p>console {{ item }}</p>
			<div
				class="memo"
				:style="{
					left: `${item.x}px`,
					top: `${item.y}px`,
					width: `${item.w}px`,
					height: `${item.h}px`,
					zIndex: `${item.z}`,
				}"
				v-on:mousedown="chgZindx(item)"
			>
				<div class="header" v-on:mousedown.prevent="drag($event, item, 'move')">
					<h1 class="blind">메모장</h1>
					<button class="btn_close" @click.prevent="deleteMemo($index)">
						<span class="blind">닫기</span>
					</button>
				</div>
				<div class="content">
					<div class="textarea" contenteditable="true">
						<textarea v-model="item.cont"></textarea>
					</div>
					<button class="btn_size" v-on:mousedown.prevent="drag($event, item, 'resize')">
						<span class="blind">메모장 크기 조절</span>
					</button>
				</div>
			</div>
		</template>
	</div>
	<!--// 스티커 메모 -->
</template>

<script>
export default {
	name: 'basicMemo',
	data() {
		return {
			memo: {
				mlist: [], // memolist array
				fmdata: null, // set form data
			},
			state: {
				min_w: 200, // min-width
				min_h: 100, // min-height
				space: 10, // space pd
				origin: {}, // basicMemo component obj
				currentMemo: null,
			},
			eventListener: ['mousemove', 'mouseup'],
		};
	},
	methods: {
		/**
		 * init
		 */
		init() {
			const { memo, setMemo, clickSetMemo } = this;
			// mouse right click
			document.onmousedown = clickSetMemo;
			// reload get storage
			let str = localStorage.getItem('memo');
			if (str == null) return;

			let list = JSON.parse(str);
			if (!Array.isArray(list)) {
				setMemo();
				return;
			}
			memo.mlist = list;
		},
		/**
		 * clcik memo data
		 */
		clickSetMemo(evt) {
			if (evt.button !== 2) return;
			this.addMemo(evt.clientX, evt.clientY);
		},
		/**
		 * set memo data
		 */
		setMemo() {
			const { memo } = this;
			let arr = [].concat(memo.mlist);
			let str = JSON.stringify(arr);
			localStorage.setItem('memo', str);
		},
		/**
		 * add memo
		 * @param cx - x number
		 * @param cy - y number
		 * @param fmdata - string form data
		 */
		addMemo(cx, cy, fmdata) {
			const { memo, state, setMemo } = this;
			const config = {
				w: 200,
				h: 100,
				x: cx,
				y: cy,
				z: memo.mlist.length + 1,
			};
			// obj assign
			let item = {
				cont: fmdata ? fmdata : '메모',
				...config,
			};
			memo.mlist.push(item);
			state.currentMemo = item;
			setMemo();
		},
		/**
		 * delete memo
		 */
		deleteMemo(i) {
			const { memo, setMemo } = this;
			memo.mlist.splice(i, 1);
			setMemo();
		},
		/**
		 * mouse event add listener
		 */
		addEvtListener() {
			const { eventListener, switchEvent } = this;
			eventListener.forEach(evt => {
				window.addEventListener(evt, switchEvent);
			});
		},
		/**
		 * mouse event remove listener
		 */
		removeEvtListener() {
			const { eventListener, switchEvent } = this;
			eventListener.forEach(evt => {
				window.removeEventListener(evt, switchEvent);
			});
		},
		switchEvent(e) {
			const { dragging, dragEnd } = this;
			switch (e.type) {
				case 'mousemove':
					dragging(e);
					break;
				case 'mouseup':
					dragEnd();
					break;
			}
		},
		/**
		 * mousedown event handler
		 * @param evt - event object
		 * @param item - memo object
		 * @param act - action to apply
		 */
		drag(evt, item, act) {
			const { state, addEvtListener, removeEvtListener } = this;
			removeEvtListener();
			addEvtListener();
			const config = {
				act: act,
				item: item,
				cx: evt.clientX,
				cy: evt.clientY,
				x: item.x,
				y: item.y,
				w: item.w,
				h: item.h,
			};
			state.origin = { ...config };
		},
		/**
		 * mousemove event handler
		 */
		dragging(e) {
			const { state } = this;

			let item = state.origin.item,
				cx = e.clientX - state.origin.cx, // current moveX
				cy = e.clientY - state.origin.cy; // current moveY
			setTimeout(function() {
				let x, y, w, h, x2, y2, X, Y;
				X = window.innerWidth - state.space;
				Y = window.innerHeight - state.space;

				if (state.origin.act == 'move') {
					x = state.origin.x + cx;
					y = state.origin.y + cy;
					w = state.origin.w;
					h = state.origin.h;
					x2 = x + w;
					y2 = y + h;
					if (x < state.space) x = state.space;
					if (y < state.space) y = state.space;
					if (x2 > X) x = X - w;
					if (y2 > Y) y = Y - h;
					item.x = x;
					item.y = y;
				}
				if (state.origin.act == 'resize') {
					w = state.origin.w + cx;
					h = state.origin.h + cy;
					x = state.origin.x;
					y = state.origin.y;
					x2 = x + w;
					y2 = y + h;
					if (w < state.min_w) w = state.min_w;
					if (h < state.min_h) h = state.min_h;
					if (x2 > X) w = X - x;
					if (y2 > Y) h = Y - y;
					item.w = w;
					item.h = h;
				}
			}, 0);
		},
		/**
		 * mouseup event handler
		 */
		dragEnd() {
			const { setMemo, removeEvtListener } = this;
			removeEvtListener();
			setMemo();
		},
		/**
		 * element chage z-index
		 */
		chgZindx(item) {
			const { memo, state, setMemo } = this;
			let z = item.z;
			memo.mlist.forEach(itm => {
				if (itm.z > z) {
					itm.z--;
				}
			});
			setTimeout(function() {
				item.z = memo.mlist.length;
				setMemo();
			}, 0);
			state.currentMemo = item;
		},
		/**
		 * form memo
		 */
		submitForm(e) {
			const { addMemo, memo } = this;
			addMemo(200, 200, memo.fmdata);
			memo.fmdata = '';
		},
	},

	mounted() {
		this.init();
	},
};
</script>

<style scoped>
.memoform {
	display: flex;
}
.memoform > * {
	flex: auto;
}
textarea {
	display: block;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 5px;
	border: none;
	background: transparent;
	font-size: 12px;
	resize: none;
	box-sizing: border-box;
}
#fm {
	width: 70%;
	background: #fff;
	border: 1px solid #000;
}
.blind {
	overflow: hidden;
	position: absolute;
	clip: rect(0 0 0 0);
	width: 1px;
	height: 1px;
	margin: -1px;
}
.wrap {
	position: relative;
	height: 100%;
	background-color: #f2f2f2;
}
.wrap .header {
	position: relative;
	height: 15px;
	background-color: #f9f978;
	border-bottom: 1px solid #eee;
	cursor: move;
}

.memo {
	position: absolute;
	background-color: lightyellow;
	border: 1px solid #eee;
}
.content {
	position: absolute;
	overflow-x: hidden;
	overflow-y: auto;
	padding: 10px;
	top: 15px;
	left: 0;
	bottom: 0;
	right: 0;
}
.content .textarea {
	outline: none;
	height: 100%;
}
.btn_close {
	position: absolute;
	top: 0;
	right: 0;
	width: 15px;
	height: 15px;
	appearance: button;
	-webkit-appearance: button;
	-moz-appearance: button;
	border: 0;
	background-color: #fff;
	cursor: pointer;
	outline: 0;
	text-align: center;
}
.btn_close:after {
	position: absolute;
	top: -1px;
	right: 0;
	width: 15px;
	content: '\d7';
	font-size: 15px;
	line-height: 15px;
	color: #666;
	text-align: center;
}
.btn_size {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 15px;
	height: 15px;
	appearance: button;
	-webkit-appearance: button;
	-moz-appearance: button;
	border: 0;
	background: transparent;
	cursor: nwse-resize;
	outline: 0;
	text-align: center;
}
</style>
