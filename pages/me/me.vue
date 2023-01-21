<template>
	<view class="root">
		<view class="head" @click="login()">
			<u-row justify="space-between" gutter="10">
				<!-- 头像 -->
				<view class="pic">
					<u-col span="4">
						<u--image :showLoading="true" :src="headimages" width="80px" shape="circle" height="80px"
							@click="click">
						</u--image>
					</u-col>
				</view>
				<!-- 用户名 -->
				<u-col span="8">
					<u-text :text="username" type="info" size="20"></u-text>
				</u-col>
			</u-row>
		</view>
		<view class="body">
			<u-row customStyle="margin-bottom: 10px">
				<u-col span="6">
					<view class="record">
						总记笔数：
						<u-text :text="record_num" type="primary" size="20"></u-text>
					</view>
				</u-col>
				<u-col span="6">
					<view class="record">
						总记账天数：
						<u-text :text="record_days" type="primary" size="20"></u-text>
					</view>
				</u-col>
			</u-row>
			<u-gap height="150"></u-gap>
			
			<u-button text="消费情况" @click="analyse()" class="btn1"></u-button>
			<u-button text="修改资料" @click="edit()" class="btn1"></u-button>
			<u-button v-if="token" text="退出登录" @click="logout()" class="btn1"></u-button>


		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				headimages: '',
				username: '未登录用户',
				record_num: 20,
				record_days: 10,
				token: uni.getStorageSync('auth-token')
			}
		},
		onShow() {
			 this.$forceUpdate() 
			//已登陆
			if (uni.getStorageSync("auth-token") != "") {
				this.token=uni.getStorageSync('auth-token')
				uni.$u.http.get(
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
						this.headimages = res.data.data.svg;
						this.username = res.data.data.username
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

			} else {
				console.log("未登录")
			}
		},
		methods: {
			login(){
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/login/login'
				})
			},
			edit(){
				
			},
			analyse(){
				
			},
			logout() {
				//删除Token,跳转到登录页
				// #ifdef MP-WEIXIN
				getApp().globalData.token = ''
				// #endif
				// #ifdef H5
				uni.setStorageSync("auth-token", "")
				// #endif
				this.$forceUpdate() 
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/login/login',
					
					complete(){
						console.log("完成")
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.root {


		.head {
			.pic {
				padding-left: 50rpx;
				padding-top: 20rpx;
			}

			background: blanchedalmond;
		}

		.body {
			.record {
				font-size: 18px;
				color: black;
			}
			
			.btn1{
				background-color: rgb(255,215,124);
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;
				
				&::after {
					border: none;
				}
			}

		}
	}
</style>
