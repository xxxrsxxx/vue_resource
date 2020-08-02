<template>
	<div class="flex_item">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'FlexItem',
	created() {},
};
</script>

<style scoped>
.flex_item {
	margin-top: 20px;
}
</style>
