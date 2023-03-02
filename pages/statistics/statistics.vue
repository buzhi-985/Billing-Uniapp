<template>
	<view>
		<!-- 最近一年的月消费及平均值 -->
		<echarts :option="option" id="myChart" style="height: 110vw;margin-left: 2vw;width: 100%;padding: 4vw 0 0 0;">
		</echarts>
		<view class="body1">
			近6个月的总消费:
			<u--text mode="price" :text="sum"></u--text>
			近6个月的消费平均值:
			<u--text mode="price" :text="monthMean[0]"></u--text>
		</view>
	</view>
</template>

<script>
	import echarts from '@/pages/test/test.vue';
	export default {
		// 注册组件
		components: {
			echarts
		},
		onShow() {
			this.getMonthsSum()
			this.logstatrt()
		},
		data() {
			return {
				option: {},
				month: [],
				monthSum: [],
				monthMean: [],
				date: Number(new Date()),
				sum: 0
			}
		},
		methods: {
			formatDate(date) {
				// console.log(date)
				let newDate = new Date(date);
				let year = newDate.getFullYear();
				//month和day都是从0开始的所以需要加1
				//.padStart(2, 0)是没有两位补0
				let month = (newDate.getMonth() + 1).toString().padStart(2, 0);
				
				return year + '-' + month;
			},
			async getMonthsSum(){
				await uni.$u.http.post("/sum/get/months",
				{
					uid: uni.getStorageSync("uid"),
					date: this.formatDate(this.date)
				},{
					/* 会加在url上 */
					header: {
						token: uni.getStorageSync("auth-token"),
					},
					/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
					dataType: 'json',
				}).then(res=>{
					// console.log(res.data.data)
					let dta = res.data.data
					let sum = 0
					for(var key in dta){
						this.month.push(key)
						this.monthSum.push(dta[key])
						sum+=parseInt(dta[key])
						// console.log(key+"---"+dta[key])
					}
					this.sum= sum
					for(var i=0;i<6;i++){
						this.monthMean.push(sum/6)
					}
					uni.showToast({
						title:"数据获取成功",
						icon:'none'
					})
					console.log(this.month)
					console.log(this.monthSum)
					console.log(this.monthMean)
				}).catch(err=>{
					uni.showToast({
						title:"异常",
						icon:'none'
					})
					console.log(err)
				})
			},
			logstatrt() {
				// console.log('初次调用');
				this.option = {
					notMerge: true,
					backgroundColor: "#F8FAFF",
					tooltip: {
						trigger: 'axis',
						showContent: this.showContent,
						axisPointer: {
							type: 'shadow',
							label: {
								show: true
							},
						},
					},
					toolbox: {
						padding: [200, 0, 0, 0],
						show: true,
						feature: { //工具配置项
							mark: {
								show: true
							},
							dataView: { //数据视图工具，可以展现当前图表所用数据
								show: true, //是否显示该工具
								readOnly: false //是否不可编辑
							},
							magicType: {
								show: true, //是否显示该工具
								type: ['line', 'bar'] //启用的动态类型
							},
							restore: {
								show: true //是否显示该工具
							},
							saveAsImage: {
								show: true //是否显示该工具
							}
						}
					},
					calculable: false, //是否显示拖拽的手柄
					// itemHeight: 0,
					legend: { //图例组件
						data: [{
							name: '月平均数',
						}, {
							name: '月总消费数'
						}],
						itemGap: 24,
						padding: [16, 0, 0, 0],
						// y: 'bottom',
						itemHeight: 8, //高
						itemWidth: 8, //宽
						icon: 'circle' //设置为圆
					},
					grid: {
						top: '15%',
						left: '4%',
						right: '4%',
						bottom: '6%',
						containLabel: true
					},
					xAxis: [{
						show: true,
						type: 'category', //坐标轴类型
						// boundaryGap:false, //解决数据与线不对应问题
						data: this.month,
						// offset:50,
						//['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9', '7.10','7.11', ], //this.xList, //obama_budget_2012.names
						axisLabel: {
							color: '#7F84B5',
							fontWeight: 300,
							interval: 0,
						},
						axisTick: {
							show: false //刻度线
						},
						axisLine: {
							show: false, //不显示坐标轴线
						},
					}, ],
					yAxis: [{
						show: true,
						boundaryGap: false, //解决数据与线不对应问题
						type: 'value',
						// name: 'Budget (million USD)',
						// data: this.yList,
						minInterval: 1,
						axisLabel: {
							interval: 0,
						},
						splitLine: {
							show: true,
							lineStyle: { //背景网格线
								type: 'dashed'
							}
						},
						axisTick: {
							show: false //刻度线
						},
						axisLine: {
							show: false, //不显示坐标轴线
						},
					}],
					dataZoom: [{
							show: false,
							start: 0,
							end: 100,
							handleSize: 8
						},
						{
							type: 'inside',
							start: 0,
							end: 50,
						},
						{
							show: false,
							yAxisIndex: 0,
							filterMode: 'empty',
							width: 12,
							height: '80%',
							showDataShadow: false,
							left: '93%',
							handleSize: 8
						}
					],
					series: [{
							name: '月平均数',
							type: 'bar',
							data: this.monthMean,
							//['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110','120'], // this.inNum, //obama_budget_2012.budget2011List
							color: "#00B1FF"
						},
						{
							name: '月总消费数',
							type: 'bar',
							data: this.monthSum,
							//['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110','120'], //this.outNum, //obama_budget_2012.budget2012List
							color: "#FF6C00"
						}
					]
				};
			},
		}
	}
</script>

<style>

</style>
