<template>
	<div>
		<Test></Test>
	</div>
</template>
<script>
import Test from '@/components/resource/test/Test';
import bus from '@/common/bus/bus';
export default {
	name: 'test',
	components: { Test },
	data() {
		return {
			key: 'value',
		};
	},
	mounted() {
		let t = document.querySelector('.header');
		let c = document.querySelector('.container_wrap');
		t.style.display = 'none';
		c.style.padding = 0;
		bus.$emit('appEvent', { handle: 'load', value: false });
	},
};
</script>

<style scoped></style>
