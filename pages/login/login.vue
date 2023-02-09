<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录</view>
			<u--form labelPosition="left" ref="form1">
				<u-form-item>
					<u-input v-model="userName" placeholder="请输入邮箱或手机号" />
				</u-form-item>
				<u-gap height="20"></u-gap>
				<u-form-item>
					<u-input type="password" v-model="password" placeholder="请输入密码" />
				</u-form-item>
				<u-gap height="80"></u-gap>
				<button @click="submit" class="getSmsCode">登录</button>
			</u--form>
			<view class="alternative">
				<!-- <view class="password" @click="passwordLogin()">忘记密码</view> -->
				<view class="issue" @click="loginBy()">注册账号</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userName: '',
				password: '',
				token: ""
			}
		},
		computed: {

		},
		onLoad() {
			this.getToken();
			// #ifdef MP-WEIXIN
			getApp().globalData.token=this.token;
			// #endif
			
		},
		methods: {
			submit() {
				uni.$u.http.post(
					'/user/login', {
						username: this.userName,
						password: this.password,
					}
				).then(res => {
					console.log(res.data)
					if (res.data.code == 1) {
						// 登录成功,写token,跳转个人中心
						// #ifdef H5
						uni.setStorage({
							key: 'auth-token',
							data: res.data.data.token,
						});
						uni.setStorage({
							key: 'uid',
							data: res.data.data.uid,
						});
						// #endif

						//微信使用全局变量
						// #ifdef MP-WEIXIN
						getApp().globalData.token = res.data.data.token
						getApp().globalData.uid = res.data.data.uid
						// #endif
						
						this.$u.route({
							type: 'switchTab',
							url: '/pages/me/me'
						})
					} else {
						//失败显示错误信息
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						})
					};
					// uni.setStorage({
					// 	key: 'user',
					// 	data: JSON.stringify(res.data.ok.data),
					// });
				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: '用户名或密码错误异常！',
						icon: 'none',
					})
				})
			},
			loginBy() {
				
				// this.$u.toast('开发中，敬请期待');
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/signup/signup'
				})

			},
			goPage(url) {
				this.$u.route({
					url: url
				})
			},
			getToken() {
				const that = this;
				// #ifdef H5
				uni.getStorage({
					key: "auth-token",
					success(res) {
						that.token = res.data
					}
				})
				// #endif

			},

		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 0 auto;
			padding-top: 80rpx;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: azure;
				font-size: 20rpx;
				margin-bottom: 60rpx;
				margin-top: 30rpx;
			}

			.getSmsCode {
				background-color: rgb(253, 243, 208);
				// color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.bottom {
			.loginType {
				display: flex;
				padding: 260rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $uni-color-warning;
				}
			}
		}
	}
</style>
