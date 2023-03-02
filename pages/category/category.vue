<template>
	<!-- 页面容器 -->
	<view class="page-wraper">
		<!-- 页面头部 -->
		<view class="page-header">
			<u-notice-bar text="默认分类无法删除噢!"></u-notice-bar>
		</view>

		<!-- 页面主体 -->
		<view class="page-main">
			<scroll-view class="page-main-scroll" style="height: 100%" :scroll-y="true" :scroll-with-animation="true">
				<view class="page-main-list" v-for="(item,index) in cateList" :key="index" :data="cateList">
					<u-row customStyle="margin-bottom: 10px">
						<u-col span="5">
							<u-cell :title="`${index + 1} ${item.name}-备注：${item.note}`">
							</u-cell>
						</u-col>
						<u-col span="2">
						</u-col>
						<u-button @click="editCate(item)" v-if="doIf(item)" type="primary" text="编辑" shape="circle">
						</u-button>
						<u-button @click="deleteCate(item)" v-if="doIf(item)" text="删除" type="error" shape="circle">
						</u-button>
					</u-row>

				</view>

			</scroll-view>
			<u-popup :show="cateshow" :round="8" mode="center">
				<view class="tan">
					<u--form labelPosition="left">
						<u-form-item>
							类名：
							<u-input v-model="cateModel.name" placeholder="请输入类名" />
						</u-form-item>
						<u-form-item>
							备注：
							<u-input v-model="cateModel.note" placeholder="请输入备注" />
						</u-form-item>
					</u--form>
					<u-button v-if="!flag" @click='doEdit()' type="primary" text="提交" shape="circle"></u-button>
					<u-button v-if="flag" @click='doEdit("new")' type="primary" text="提交" shape="circle"></u-button>
					<u-gap height="20"></u-gap>
					<u-button @click="cancelEdit()" type="primary" text="取消" shape="circle"></u-button>
				</view>
			</u-popup>
		</view>

		<!-- 页面底部 -->
		<view class="page-footer">
			<button type="primary" @click="newCate()">新建分类</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cateshow: false,
				cateList: [],
				cateModel: {
					name: "",
					note: "",
					id: ""
				},
				//新建为true ,编辑为false
				flag: false,
			}
		},
		onShow() {
			this.getCategory()
		},
		methods: {
			cancelEdit(){
				this.cateModel = {
					name: "",
					note: "",
					id: ""
				};
				this.cateshow=false;
			},
			showError() {
				uni.showToast({
					title: "异常",
					icon: 'none',
				})
			},
			//获取分类
			getCategory() {
				this.cateshow = false
				uni.$u.http.post(
					'cate/get/' + uni.getStorageSync("uid"), {}, {
						/* 会加在url上 */
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
						dataType: 'json',
					}).then(res => {
					console.log(res.data)
					for (let item of res.data.data) {
						// console.log(item.id + item.name)
						this.cateList.push({
							"uid": item.uid,
							"id": item.id,
							"name": item.name,
							"note": item.note==null?"":item.note
						})
					}
				}).catch(err => {
					console.log(err)
					this.showError()
				})

			},
			//判断自定义分类
			doIf(item) {
				// console.log(item.uid)
				if (item.uid != 1) {
					return true;
				} else {
					return false;
				}
			},
			//删除分类
			deleteCate(item) {
				let id = item.id;
				//删除
				uni.$u.http.post(
					'cate/del/' + id, {
						"uid": uni.getStorageSync("uid")
					}, {
						/* 会加在url上 */
						header: {
							token: uni.getStorageSync("auth-token"),
						},
						/* 会与全局header合并，如有9同名属性，局部覆盖全局 */
						dataType: 'json',
					}).then(res => {
					// console.log(res.data)
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
					})
				}).catch(err => {
					console.log(err)
					this.showError()
				})

				//刷新界面
				uni.redirectTo({
					url: '/pages/category/category'
				});

			},
			//编辑弹窗
			editCate(item) {
				this.cateshow = true
				this.cateModel.id = item.id;
				for(let it of this.cateList){
					if(it.id == this.cateModel.id){
						this.cateModel.name = item.name;
						break;
					}
				}
			},
			async doEdit(name) {
				// console.log(name)
				if (this.cateModel.name != "" && name != "new") {
					this.cateshow = false
					this.flag = false
					let id = this.cateModel.id;
					await this.send(id)
					// console.log("编辑")
					//刷新界面
					// console.log("tipazhuan")
					uni.redirectTo({
						url: '/pages/category/category'
					});
				} else if (this.cateModel.name != "" && name == "new") {
					this.cateshow = false
					this.flag = false
					await this.send()
					// console.log("新建")
					//刷新界面
					// console.log("tipazhuan")
					uni.redirectTo({
						url: '/pages/category/category'
					});
				} else {
					uni.showToast({
						title: "请填写类名",
						icon: 'none',
					})
				}


			},
			async send(id) {
				let url = "";
				if (id) url = "cate/update/" + id;
				else url = "cate/add/"+uni.getStorageSync("uid");
				await uni.$u.http.post(url, this.cateModel, {
					/* 会加在url上 */
					header: {
						token: uni.getStorageSync("auth-token"),
						uid: uni.getStorageSync("uid")
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
					this.showError()
				})


			},
			newCate() {
				this.flag = true;
				this.cateshow = true;
			}
		}
	}
</script>

<style>
	/* 设置页面背景色 */
	page {
		/* background-color: #ddd; */
		width: 100%;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.page-wraper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.page-header {
		// background: rgb(8, 117, 94);
		// color: #fff;
		line-height: 50rpx;
		/* 不放大不缩小固定100rpx */
		flex: 0 0 100rpx 0;
	}

	.page-main {
		flex: 1;
		position: relative;
	}

	.page-main-scroll {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.tan {
		padding: 50rpx 50rpx 50rpx 50rpx;
		height: 400rpx;
		width: 400rpx;
	}

	.page-main-list {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		// background: #e0e0e0;

	}

	.page-footer {
		// color: #fff;
		line-height: 100rpx;
		/* 不放大不缩小固定100rpx */
		flex: 0 0 100rpx 0;
		// background-color: #00AAFF;
	}
</style>
