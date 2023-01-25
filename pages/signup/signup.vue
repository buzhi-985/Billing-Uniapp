<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">注册账号</view>
			<u--form labelPosition="left" ref="form1">
				<u-form-item>
					用户名：
					<u-input v-model="username" placeholder="请输入用户名" />
				</u-form-item>
				<u-form-item>
					手机号：
					<u-input v-model="phone" placeholder="请输入手机号" />
				</u-form-item>
				<u-form-item @click="show=true">
					性别：<u-input v-model="sex" placeholder="请选择性别" disabled disabledColor="#ffffff"></u-input>
					<u-picker :show="show" :columns="columns" @cancel="show=false" @confirm="confirm"></u-picker>
				</u-form-item>
				<u-form-item>
					邮箱：
					<u-input v-model="email" placeholder="请输入邮箱" />
				</u-form-item>
				<u-form-item>
					密码：
					<u-input type="password" v-model="password" placeholder="请输入密码" />
				</u-form-item>
				<u-form-item>
					密码：
					<u-input type="password" v-model="password2" placeholder="再次输入密码" />
				</u-form-item>
				<button @click="submit" :class="!change?'getSmsCode':'changeType'">注册</button>
			</u--form>
			<view class="alternative">
				<view class="issue" @click="gologin()">已有账号，去登录</view>
			</view>
		</view>
	</view>
</template>

<script>
import { ReactiveFlags } from "vue"
	export default {
		data() {
			return {
				show: false,
				columns: [
					['男', '女']
				],
				change: false,
				username: '',
				password: '',
				password2: '',
				phone: '',
				email: '',
				sex: '',
			}
		},
		methods: {
			gologin() {
				this.$u.route({
					type: 'redirectTo',
					url: '/pages/login/login'
				})
			},
			submit() {
				uni.$u.http.post('/user/reg', {
					username: this.username,
					password: this.password,
					phone: this.phone,
					email: this.email,
					sex: this.sex
				}).then(res => {
					console.log(res.data)
					if (res.data.code == 1) {
						//显示成功信息
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						})
						//跳转到登录页
						this.gologin()
						// this.$u.route({
						// 	type: 'navigateTo',
						// 	url: '/pages/login/login'
						// })
					}else{
						//显示错误信息
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
						})
					}
					
				}).catch(err => {
					uni.showToast({
						title: "未知错误",
						icon: 'none',
					})
					console.log(err)
				})
				this.focu()
			},
			confirm(e) {
				console.log(e.value[0])
				this.show = false
				this.sex = e.value[0]
			},
			focu(){
				this.change = true;
				
			},
			blu(){
				this.change = false;
				
			}
			
		}
	}
</script>

<style lang="scss" >
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 0 auto;
			padding-top: 80rpx;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 600;
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
			
			.changeType{
				background-color: rgb(255,215,124);
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
