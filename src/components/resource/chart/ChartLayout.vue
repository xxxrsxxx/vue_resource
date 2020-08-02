<template>
	<div class="chart_wrap">
		<line-chart :chart-data="datacollection" :options="option"> </line-chart>
	</div>
</template>

<script>
import LineChart from './LineChart.js';

export default {
	components: {
		LineChart,
	},
	props: ['chartData'],
	data() {
		return {
			datacollection: null,
			option: null,
		};
	},
	methods: {
		//https://www.chartjs.org/samples/latest/scales/logarithmic/line.html
		fillData() {
			this.datacollection = this.chartData.datacollection;
			this.option = this.chartData.option;
		},
	},
	mounted() {
		this.fillData();
	},
};
</script>

<style>
.chart_wrap {
	min-width: 300px;
	max-width: 520px;
	margin: 50px auto 0;
}
</style>
