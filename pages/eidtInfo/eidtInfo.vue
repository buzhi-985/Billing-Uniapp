<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">更新信息</view>
			<u--form labelPosition="left" ref="form1">
				<u-form-item>
					用户名：
					<u-input v-model="userinfo.username" placeholder="请输入用户名" />
				</u-form-item>
				<u-form-item>
					手机号：
					<u-input v-model="userinfo.phone" placeholder="请输入手机号" />
				</u-form-item>
				<u-form-item @click="show=true">
					性别：<u-input v-model="userinfo.sex" placeholder="请选择性别" disabled disabledColor="#ffffff"></u-input>
					<u-picker :show="show" :columns="columns" @cancel="show=false" @confirm="confirm"></u-picker>
				</u-form-item>
				<u-form-item>
					邮箱：
					<u-input v-model="userinfo.email" placeholder="请输入邮箱" />
				</u-form-item>
				<button @click="submit" :class="'changeType'">提交</button>
			</u--form>
		</view>
	</view>
</template>

<script>
	import {
		ReactiveFlags
	} from "vue"
	export default {
		data() {
			return {
				show: false,
				columns: [
					['男', '女']
				],
				change: false,
				userinfo: {
					id: uni.getStorageSync("uid"),
					username: '',
					phone: '',
					email: '',
					sex: '',
					svg: ""
				}

			}
		},
		onShow() {
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
					this.userinfo = res.data.data
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
		methods: {
			submit() {
				uni.$u.http.post("user/update", this.userinfo, {
					header: {
						token: uni.getStorageSync("auth-token"),
					},
					/* 会与全局header合并，如有同名属性，局部覆盖全局 */
					dataType: 'json',
				}).then(res => {
					console.log(res.data)
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
					})
				}).catch(err => {
					uni.showToast({
						title: "异常，添加失败",
						icon: 'none',
					})
					console.log(err)
				})
		},
		confirm(e) {
			console.log(e.value[0])
			this.show = false
			this.userinfo.sex = e.value[0]
		},


	}
	}
</script>

<style lang="scss">
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


			.changeType {
				background-color: rgb(255, 215, 124);
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
