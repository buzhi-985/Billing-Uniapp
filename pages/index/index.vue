<template>
	<view class="page">
		<view class="top" @click="show = true">
			<u-row justify="space-between" gutter="2">
				<u-col span="4">
					<u-text text="时间：" size="18" block type="primary"></u-text>
				</u-col>
				<u-datetime-picker :show="show" :formatter="formatter" v-model="value1" mode="year-month"
					@cancel="show = false" @confirm="confirm" @change="change">
				</u-datetime-picker>
				<u-col span="8">
					<u-input :value="formatDate(value1)" shape="circle" disabled disabledColor="#defbff"></u-input>
				</u-col>
			</u-row>
		</view>
		<view class="u-demo-block__content">
			<view class="album" v-for="item in dta">
				<view class="album__avatar">
					<!-- 头像 -->
					<image :src="logo" mode="" style="width: 32px;height: 32px;"></image>
				</view>
				<view class="album__content">
					<!-- 用户名 -->
					<u--text :text="username" type="primary" bold size="17"></u--text>

					物品：<u--text margin="0 0 8px 0" :text="item.goods"></u--text>
					类别：<u--text margin="0 0 8px 0" :text="ToCate(item.category)"></u--text>
					消费时间：<u--text margin="0 0 8px 0" :text="item.consumeDate"></u--text>
					金额：<u--text margin="0 0 8px 0" :text="item.money"></u--text>
					<!-- <u--text margin="0 0 8px 0" :text="item.photos"></u--text> -->
					<u-album :urls="toList(item.photos)"></u-album>
				</view>
				<u-button @click="eidtBill(item)" class="btn1">编辑</u-button>
				<u-button @click="delBill(item)" class="btn1">删除</u-button>
			</view>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
			<u-popup :show="delshow" :round="8" mode="center">
				<view class="tan">
					<u--text text="是否删除?" size="20"></u--text>
					<u-button @click='doDel()' type="error" text="提交" shape="circle"></u-button>
					<u-gap height="20"></u-gap>
					<u-button @click="delshow=false" type="primary" text="取消" shape="circle"></u-button>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				delshow: false,
				delId: "",
				value1: Number(new Date()),
				dta: [],
				do: false,
				pageNum: 1,
				username: "",
				logo: "",
				cateList: [],
				billmodel: {
					goods: "",
					category: "",
					consumeDate: Number(new Date()),
					money: 0,
					photos: []
				},
				scrollTop: 0
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {

		},
		async onReachBottom() {
			console.log("onReachBottom");
			this.pageNum+=1;
			console.log(this.pageNum)
			this.getBill()
		},
		async onShow() {
			// /*开发暂时注释
			if (uni.getStorageSync("auth-token") != "") {
				//清除原有数据，清除之后看图片数据会没有
				// this.dta = [];
				if(this.dta==null){
					await this.getInfo();
					await this.getBill();
					await this.getCategory();
				}
				

				// for (var i = 0; i < this.dta.length; i++) {
				// 	console.log(this.dta[i].photos)
				// }

			} else {
				uni.showToast({
					title: "未登录，请登录",
					icon: 'none',
				})
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/login/login'
				})
			}
			// */
		},
		methods: {
			timeToTimestamp(time) {
				return new Date(time).getTime();
			},
			eidtBill(item) {
				// this.editshow =true
				console.log(item)
				item.consumeDate = this.timeToTimestamp(item.consumeDate);
				// uni.$u.route({
				// 	url: 'pages/record/record',
				// 	type: "switchTab",
				// 	params: {
				// 		name: 'lisa'
				// 	}
				// })
				uni.reLaunch({
					url: `/pages/record/record?item=${encodeURIComponent(JSON.stringify(item))}`
				})

			},
			async del(){
				
				uni.$u.http.post("bill/del/"+this.delId,{},{
					header: {
						token: uni.getStorageSync("auth-token"),
					},
					/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
					dataType: 'json',
				}).then(res => {
					console.log(res.data)
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
					})
				}).catch(err => {
					console.log(err)
					// this.showError()
					uni.showToast({
						title: "异常",
						icon: "none"
					})
				})
				console.log("删除")
			},
			async doDel() {
				await this.del()
				this.delshow = false;
				this.delId = "";
				//刷新界面
				console.log("刷新")
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			delBill(item) {
				console.log(item)
				this.delshow = true;
				this.delId = item.id;
			},
			//获取分类
			async getCategory() {
				await uni.$u.http.post(
					'cate/get/' + uni.getStorageSync("uid"), {}, {
						/* 会加在url上 */
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
						dataType: 'json',
					}).then(res => {
					// console.log(res.data)
					for (let item of res.data.data) {
						// console.log(item.id + item.name)
						this.cateList.push({
							"uid": item.uid,
							"id": item.id,
							"name": item.name
						})
					}
				}).catch(err => {
					console.log(err)
					// this.showError()
				})

			},
			//判断自定义分类
			ToCate(item) {
				// console.log(item.uid)
				for (let i = 0; i < this.cateList.length; i++) {
					if (item == this.cateList[i].id) {
						return this.cateList[i].name
					}
				}
			},
			//字符串转数组
			toList(item) {
				if(item !=null){
					let list = [];
					list = item.split(",")
					return list
				}

			},
			async getInfo() {
				await uni.$u.http.get(
					'/user/info', {
						params: {},
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有同名属性，局部覆盖全局 */
						dataType: 'json',
					}
				).then(res => {
					console.log(res.data)
					if (res.data.code == 1) {
						this.logo = res.data.data.svg;
						this.username = res.data.data.username;
					} else {
						uni.showToast({
							title: "获取用户信息失败",
							icon: 'none',
						})
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: "获取用户信息错误",
						icon: 'none',
					})
				})
			},
			change(e) {
				this.value1 = e.value
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
			confirm() {
				this.show = false;
				//先清除原有数据
				this.dta = [];
				this.pageNum=1;
				//确定之后才会更改，所以要在
				this.getBill();
				this.getInfo()
				// console.log(this.logo)
			},
			async getBill() {
				await uni.$u.http.post(
					'/bill/get', {
						uid: uni.getStorageSync("uid"),
						consumeDate: this.formatDate(this.value1),
						page: this.pageNum
					}, {
						/* 会加在url上 */
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
						dataType: 'json',
					}
				).then(res => {
					console.log(res.data)
					//合并数组
					this.dta=[...this.dta,...res.data.data]
					// this.dta.concat(res.data.data)
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.top {
		display: flex;
		align-items: center;
	}

	.page {
		background-color: #fdffe7;
	}

	.body {}

	.tan {
		padding: 50rpx 50rpx 50rpx 50rpx;
		height: 200rpx;
		width: 400rpx;
	}

	.album {

		@include flex;
		align-items: flex-start;

		&__avatar {
			background-color: $u-bg-color;
			padding: 5px;
			border-radius: 3px;
		}

		&__content {
			margin-left: 10px;
			flex: 1;


		}

		.btn1 {
			// display: flex;
			padding: 0 0 0 10;
			background-color: #ffffff;
			height: 80rpx;
			width: 100rpx;
		}

	}
</style>
