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
<!-- 			<u-row customStyle="margin-bottom: 10px">
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
			</u-row> -->
			<u-gap height="200"></u-gap>
			<u-button text="管理类别" @click="goCategory()" class="btn1"></u-button>
			<u-button text="导出excel" @click="goDerive()" class="btn1"></u-button>
			<u-button text="月份消费情况" @click="analyse()" class="btn1"></u-button>
			<u-button text="消费统计" @click="goStatics()" class="btn1"></u-button>
			<u-button text="修改资料" @click="goEdit()" class="btn1"></u-button>
			<u-button text="更改密码" @click="show=true" class="btn1"></u-button>
			<u-button v-if="token" text="退出登录" @click="logout()" class="btn1"></u-button>
			<u-popup :show="show" :round="8" mode="center">
				<view class="tan">
					<u--form labelPosition="left">
						<u-form-item>
							原密码：
							<u-input type="password" v-model="usermodel.pwd" placeholder="请输入旧密码" />
						</u-form-item>
						<u-form-item>
							新密码：
							<u-input type="password" v-model="usermodel.newpwd" placeholder="请输入新密码" />
						</u-form-item>
					</u--form>
					<u-button @click='upPwd()' type="primary" text="提交" shape="circle"></u-button>
					<u-gap height="20"></u-gap>
					<u-button @click="show=false" type="primary" text="取消" shape="circle"></u-button>
				</view>
			</u-popup>
		</view>
		<view class="footer"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headimages: '',
				show: false,
				username: '未登录用户',
				record_num: 20,
				record_days: 10,
				token: uni.getStorageSync('auth-token'),
				usermodel: {
					id: uni.getStorageSync("uid"),
					newpwd: "",
					pwd: ""
				}
			}
		},
		onShow() {
			// this.$forceUpdate() 
			//已登陆
			if (uni.getStorageSync("auth-token") != "") {
				this.token = uni.getStorageSync('auth-token')
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
			async upPwd() {
				this.show =false;
				
				await uni.$u.http.post("/user/uppwd", this.usermodel, {
					/* 会加在url上 */
					header: {
						token: uni.getStorageSync("auth-token"),
					},
					/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
					dataType: 'json',
				}).then(res => {
					console.log(res.data);
					uni.showToast({
						icon:'none',
						title: res.data.msg
					})
				}).catch(err => {
					console.log(err)
				})
				
				this.usermodel= {
					id: uni.getStorageSync("uid"),
					newpwd: "",
					pwd: ""
				}
			},
			login() {
				if (uni.getStorageSync("auth-token") != "") {

				} else {
					this.$u.route({
						type: 'navigateTo',
						url: '/pages/login/login'
					})
				}

			},
			goDerive(){
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/derive/derive'
				})
			},
			goEdit() {
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/eidtInfo/eidtInfo'
				})
			},
			analyse() {
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/ec/ec'
				})
			},
			goStatics(){
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/statistics/statistics'
				})
			},
			goCategory() {
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/category/category'
				})
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

					complete() {
						console.log("完成")
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.root {
		background-color: #fdffe7;
		background: #efffc2;

		.head {
			.pic {
				padding-left: 50rpx;
				padding-top: 20rpx;
			}

			// background: blanchedalmond;
		}

		.footer {
			background: #efffc2;
		}

		.body {

			.record {
				font-size: 18px;
				color: black;
			}

			.tan {
				padding: 50rpx 50rpx 50rpx 50rpx;
				height: 400rpx;
				width: 400rpx;
			}

			.btn1 {
				// background-color: rgb(255,215,124);
				background-color: #efffc2;
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
