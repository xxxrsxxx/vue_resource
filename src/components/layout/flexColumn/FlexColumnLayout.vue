<template>
	<div class="flex_container">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'FlexColumn',
};
</script>

<style scoped lang="scss">
.flex_container {
	display: flex;
	display: -ms-flex;
	flex-direction: column;
	-ms-flex-direction: column;
	align-items: center;
	.flex_item {
		width: 100%;
		flex: 1;
		-ms-flex: 1;
		-webkit-flex: 1;
		flex-flow: 1;
	}
}
</style>
