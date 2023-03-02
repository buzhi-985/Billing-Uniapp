<template>
	<view>
		<view class="top" @click="show = true">
			<u-row justify="space-between" gutter="2">
				<u-col span="4">
					<u-text text="时间：" size="18" block type="primary"></u-text>
				</u-col>
				<u-datetime-picker :show="show" :formatter="formatter" v-model="time" mode="year-month"
					@cancel="show = false" @confirm="confirm" @change="change">
				</u-datetime-picker>
				<u-col span="8">
					<u-input :value="formatDate(time)" shape="circle" disabled disabledColor="#defbff"></u-input>
				</u-col>
			</u-row>
			<u-row justify="space-between" gutter="2" v-for="item in data" index="index" >	
			{{item.name}} : {{ item.value}}元
			</u-row>
			总消费： {{sum}}元
		</view>
		<echarts :option="option" id="myChart" style="height: 80vw;margin-left: 0vw;width: 100%;padding: 4vw 0 0 0;">
		</echarts>
	</view>
</template>

<script>
	import echarts from "@/pages/test/test.vue";
	export default {
		// 注册组件
		components: {
			echarts
		},
		onShow() {
			// console.log("路过")
			this.getCategory()
			this.getSum()
			// console.log(this.cateList2)
			this.logstatrt()

		},
		data() {
			return {
				show: false,
				option: {},
				time: Number(new Date()),
				cateList: [],
				data: [],
				//只存放类别名字
				cateList2: [],
				sum: 0
			}
		},
		methods: {
			async getSum() {
				//在请求加同步，不然还是异步
				await uni.$u.http.post("/sum/get/", {
					uid: uni.getStorageSync("uid"),
					consumeDate: this.formatDate(this.time)
				}, {
					/* 会加在url上 */
					header: {
						token: uni.getStorageSync("auth-token"),
					},
					/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
					dataType: 'json',
				}).then(res => {
					console.log(res.data.data)
					this.data = res.data.data
					for(let item of this.data){
						this.sum+=item.value;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取分类
			getCategory() {
				uni.$u.http.post(
					'cate/get/' + uni.getStorageSync("uid"), {}, {
						/* 会加在url上 */
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
						dataType: 'json',
					}).then(res => {
					// console.log("分类"+res.data)
					for (let item of res.data.data) {
						// console.log(item.id + item.name)
						this.cateList.push({
							"id": item.id,
							"name": item.name
						})
						this.cateList2.push(item.name.toString())
					}
				}).catch(err => {
					console.log(err)
				})
			},
			async confirm() {
				this.show = false;
				this.sum =0;
				// this.getCategory()
				//确定之后才会更改，所以要在
				await this.getSum()
				// console.log("渲染")
				// console.log(this.data)
				this.logstatrt()
				// this.logstatrt()
			},
			change(e) {
				this.time = e.value
				// console.log(this.formatDate(e.value))
			},
			formatDate(date) {
				// console.log(date)
				let newDate = new Date(date);
				let year = newDate.getFullYear();
				//month和day都是从0开始的所以需要加1
				//.padStart(2, 0)是没有两位补0
				let month = (newDate.getMonth() + 1).toString().padStart(2, 0);
				let day = newDate.getDay().toString().padStart(2, 0);
				return year + '-' + month;
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				return value
			},
			async logstatrt() {
				console.log('初次调用'+this.data);
				// 指定图表的配置项和数据
				this.option = {
					legend: {
						orient: 'vertical',
						x: 'left',
						data: this.cateList2
					},
					series: [{
						type: 'pie',
						radius: ['50%', '70%'], //圆环大小
						avoidLabelOverlap: true, //是否启用防止标签重叠策略
						label: {
						    show: true,
						    position: 'center'
						},
						label: {
							formatter: '{b}\n{d}%', // 显示百分比，
							show: true,
						},
						emphasis: {
							label: {
								show: true,
								fontSize: '30',
								fontWeight: 'bold'
							}
						},
						data: this.data,
					}]
				};
			},
		}
	}
</script>

<style>

</style>
