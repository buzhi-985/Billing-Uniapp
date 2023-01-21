<script>
	export default {
		// 设置全局变量
		globalData: {
			token: uni.getStorageSync("auth-token"),
			uid: uni.getStorageSync("uid")
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//刷新Token
			refreshToken(res) {
				uni.setStorage({
					key: 'auth-token',
					data: res.data.data.token,
				});
				// #ifdef MP-WEIXIN
				getApp().globalData.token = res.data.data.token;
				// #endif
				
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
