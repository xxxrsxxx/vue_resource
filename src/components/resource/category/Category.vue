<template>
	<div ref="xcate">
		<p>category developing...</p>
		<div class="cate_container">
			<ul class="wrapper">
				<li v-for="(item, $index) in listNum" :class="{ on: state.selIdx == $index }">
					<span>{{ $index }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Category',
	data() {
		return {
			listNum: 8,
			anchor: {
				container: null,
				wrapper: null,
				list: null,
			},
			space: {
				containerWidth: 0,
				itemsWidth: 0,
			},
			state: {
				idx: 0,
				selIdx: 0,
				posX: 0,
			},
		};
	},
	methods: {
		init(el) {
			this.anchor = { ...el };
			this.setSpace();
			this.addEvent();
		},
		addEvent() {
			const { anchor } = this;
			anchor.list.forEach((e, i) => {
				e.addEventListener('click', event => {
					event.stopPropagation();
					this.work(e, i);
				});
			});
		},
		setSpace() {
			const { anchor, space } = this;
			space.containerWidth = anchor.container.clientWidth;
			let num = 0;
			anchor.list.forEach(e => {
				num += e.clientWidth;
			});
			space.itemsWidth = num;
		},
		work(e, i) {
			const { anchor, space, state } = this;
			state.selIdx = i;
			state.posX = anchor.list[state.selIdx].offsetLeft;

			let value = 0,
				itemSize = anchor.list[state.selIdx].clientWidth / 2;
			value = space.containerWidth / 2 - itemSize - state.posX;

			if (space.itemsWidth < space.containerWidth) return;
			if (value > 0) value = 0;
			if (value < -(space.itemsWidth - space.containerWidth))
				value = -(space.itemsWidth - space.containerWidth);

			Object.assign(anchor.wrapper.style, {
				transition: `transform 400ms cubic-bezier(0.65, 0.05, 0.36, 1)`,
				transform: `translate(${value}px,0)`,
			});
		},
	},
	mounted() {
		const base = this.$refs.xcate;
		const config = {
			container: base.querySelector('.cate_container'),
			wrapper: base.querySelector('.wrapper'),
			list: base.querySelectorAll('.wrapper li'),
		};
		this.init(config);
	},
};
</script>

<style scoped>
.cate_container {
	overflow-x: scroll;
	text-align: center;
	margin-bottom: 40px;
	scroll-behavior: smooth;
}
.cate_container::-webkit-scrollbar {
	display: none;
}
.cate_container ul {
	white-space: nowrap;
}
.cate_container ul li {
	display: inline-block;
	text-align: center;
	width: 60px;
	height: 30px;
	padding: 0 15px;
}
.cate_container ul li.on {
	background: #01630b;
}
.cate_container ul li:nth-child(1) {
	width: 100px;
}
.cate_container ul li:nth-child(3) {
	width: 50px;
}
.cate_container ul li:nth-child(5) {
	width: 70px;
}
.cate_container ul li span {
	display: inline-block;
	height: 100%;
	line-height: 30px;
}
</style>
