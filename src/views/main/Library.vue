<template>
	<div>
		<Category></Category>
		<flex-column-layout>
			<flex-item style="margin:0">
				<xswipe
					:sdata="respLib.swiper"
					:indicator="true"
					:controlBtn="true"
					:spaceMax="768"
					:spacePercent="10"
				>
				</xswipe>
			</flex-item>
			<flex-item>
				<xvideo :data="respLib.video.items[0]"></xvideo>
			</flex-item>
			<flex-item>
				<xvideo :data="respLib.video.items[1]"></xvideo>
			</flex-item>
		</flex-column-layout>
	</div>
</template>

<script>
import FlexColumnLayout from '@/components/layout/flexColumn/FlexColumnLayout';
import FlexItem from '@/components/layout/flexColumn/FlexItem';
import Category from '@/components/resource/category/Category';
import Xvideo from '@/components/resource/video/Video';
import Xswipe from '@/components/resource/swipe/Swipe';
import bus from '@/common/bus/bus';
export default {
	name: 'library',
	components: {
		FlexColumnLayout,
		FlexItem,
		Category,
		Xvideo,
		Xswipe,
	},
	computed: {
		respLib() {
			try {
				return this.$store.state.API.library.data;
			} catch (e) {
				console.log('e');
			}
		},
	},
	mounted() {
		bus.$emit('appEvent', { handle: 'load', value: false });
	},
};
</script>

<style scoped></style>
