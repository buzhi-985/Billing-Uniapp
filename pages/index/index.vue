<template>
	<view>
		<view class="top" @click="show = true">
			<u-row justify="space-between" gutter="2">
				<u-col span="4">
					<u-text text="时间：" size="18" block type="primary"></u-text>
				</u-col>
				<u-datetime-picker :show="show" :formatter="formatter" v-model="value1" mode="year-month"
					@cancel="cancel" @confirm="confirm" @change="change">
				</u-datetime-picker>
				<u-col span="8">
					<u-input :value="formatDate(value1)" shape="circle" disabled disabledColor="#defbff"></u-input>
				</u-col>
			</u-row>
		</view>
		<view class="u-demo-block__content">
			<view class="album">
				<view class="album__avatar">
					<!-- 头像 -->
					<image src="/static/uview/common/logo.png" mode="" style="width: 32px;height: 32px;"></image>
				</view>
				<view class="album__content">
					<!-- 用户名 -->
					<u--text text="uView UI" type="primary" bold size="17"></u--text>
					<u--text margin="0 0 8px 0" :text="wen"></u--text>
					<u-album :urls="urls2"></u-album>
				</view>
			</view>
		</view>
		<view class="body" v-for="item in dta">
			物品：<text>{{ item.goods}}</text>
			类别：<text>{{ item.category}}</text>
			时间：<text>{{ item.consumeDate}}</text>
			金额：<text>{{ item.money}}</text>
			照片：<text>{{ item.photos}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				value1: Number(new Date()),
				dta: {},
				do: false,
				wen: "这是材料",
				urls2: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
				],
			}
		},
		onLoad() {
			
		},
		onShow() {
			/*开发暂时注释
			if(uni.getStorageSync("auth-token") != ""){
				this.getBill()
			}else{
				uni.showToast({
					title: "未登录，请登录",
					icon: 'none',
				})
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/login/login'
				})
			}
			*/
		},
		methods: {
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
				//确定之后才会更改，所以要在
				this.getBill()
			},
			cancel() {
				this.show = false;
			},
			getBill() {
				uni.$u.http.post(
					'/bill/get', {
						uid: uni.getStorageSync("uid"),
						consumeDate: this.formatDate(this.value1)
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
					this.dta = res.data.data
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

	.body {}

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
	}
</style>
