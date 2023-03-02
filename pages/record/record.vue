<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">记录账单</view>
			<u--form labelPosition="left" ref="form1">
				<u-form-item>
					物品：
					<u-input placeholder="请输入物品名" v-model="billmodel.goods" />
				</u-form-item>
				<u-form-item @click="cateshow=true">
					类别：
					<u-input placeholder="请选择分类" :value="getCateName(billmodel.category)" disabled
						disabledColor="#ffffff" />

					<u-picker :show="cateshow" :columns="cateList" keyName="name" @cancel="cateshow=false"
						@confirm="cateChange"></u-picker>
				</u-form-item>
				<u-form-item @click="timeshow=true">
					时间：<u-input placeholder="请选择时间" :value="formatDate(billmodel.consumeDate)" disabled
						disabledColor="#ffffff"></u-input>
					<u-datetime-picker :show="timeshow" v-model="billmodel.consumeDate" mode="date"
						@cancel="timeshow=false" @confirm="timeshow=false"></u-datetime-picker>
				</u-form-item>
				<u-form-item>
					金额：
					<u-input placeholder="请输入金额" v-model="billmodel.money" />
				</u-form-item>
				<u-form-item>
					照片：
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="5" :previewFullImage="true"></u-upload>
				</u-form-item>
				<button @click="submit" :class="'changeType'">提交</button>
				
			</u--form>
			<button v-if="editFlag" @click="back" :class="'changeType'">取消编辑</button>
		</view>
	</view>



</template>

<script>
	export default {
		data() {
			return {
				billmodel: {
					goods: "",
					category: "",
					consumeDate: Number(new Date()),
					money: 0,
					photos: []
				},
				cateList: [
					[]
				],
				timeshow: false,
				cateshow: false,
				//是否为修改
				editFlag: false,
				editModel: "",
				//后端图片上床地址
				action: uni.$u.http.config.baseURL + "file/up1",
				listImg: [], // 显示的图片列表，数组元素为对象，必须提供url属性
				fileList1: [], // 上传的图片列表(图片选择或者上传成功后，会保存在组件内部的lists数组中，数组元素为对象)
			}
		},
		onShow() {
			if (uni.getStorageSync("auth-token") != "") {
				this.getCategory()

			} else {
				uni.showToast({
					title: "请登录",
					icon: 'none',
				})
				this.$u.route({
					type: 'navigateTo',
					url: '/pages/login/login',

					complete() {
						console.log("完成")
					}
				})
			}

			// console.log(this.action)

		},
		onLoad(option) {
			console.log(option.item)
			if(option.item!=null){
				// 接收传递的参数
				const item = JSON.parse(decodeURIComponent(option.item? option.item : '{}'));
				this.editModel = item
				// console.log(item)
				this.billmodel.goods = item.goods
				this.billmodel.category = item.category
				this.billmodel.consumeDate = item.consumeDate
				this.billmodel.money = item.money

				if(item.photos !=null){
					let phList = item.photos.split(",")
					for(let i=0;i< phList.length;i++){
						if(phList[i]!=""){
							this.fileList1.push({"url":phList[i]})
						}
						
					}
				}else{
					item.photos = ''
				}
				this.billmodel.photos = item.photos
				this.editFlag = true
				console.log('上一个页面传递过来的参数', item);
			}
		},
		methods: {
			//取消编辑
			back(){
				
				this.ResetModel();
			},
			// 删除图片
			deletePic(event) {
				//splice() 方法向/从数组指定位置添加/删除项目，然后返回被删除的项目。
				// index 必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
				// howmany 必需。要删除的项目数量。
				this[`fileList${event.name}`].splice(event.index, 1)
				this.billmodel.photos.splice(event.index, 1)
				// console.log(event)
				// console.log(this.billmodel)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				// console.log("上传")
				return new Promise((resolve, reject) => {
					let that = this.billmodel
					console.log(that)
					let a = uni.uploadFile({
						url: this.action, // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							// user: 'test'
						},
						success: (res) => {
							console.log(JSON.parse(res.data).data)
							if(that.photos==null){
								let li = []
								li.push(JSON.parse(res.data).data)
								that.photos = li
							}else{
								that.photos.push(JSON.parse(res.data).data)
							}
							
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			getCateName(id) {
				// console.log(id)
				for (let item of this.cateList[0]) {
					if (item.id === id) {
						// console.log(item.id === id)
						// console.log(item.name)
						return item.name.toString();
					}
				}
			},
			formatDate(date) {
				// console.log(date)
				let newDate = new Date(date);
				let year = newDate.getFullYear();
				//month和day都是从0开始的所以需要加1
				//.padStart(2, 0)是没有两位补0
				let month = (newDate.getMonth() + 1).toString().padStart(2, 0);
				let day = newDate.getDate().toString().padStart(2, 0);
				return year + '-' + month + '-' + day;
			},
			//类别选择确认
			cateChange(e) {
				// console.log(e.value[0].id)
				this.billmodel.category = e.value[0].id
				this.cateshow = false
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
					// console.log(res.data)
					for (let item of res.data.data) {
						// console.log(item.id + item.name)
						this.cateList[0].push({
							"id": item.id,
							"name": item.name
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			submit() {
				// console.log(this.billmodel)
				// this.billmodel.photos.join(";")
				if(this.editFlag){
					uni.$u.http.post(
						'bill/update/' + this.editModel.id, this.billmodel, {
							/* 会加在url上 */
							header: {
								token: uni.getStorageSync("auth-token"),
							},
							/* 会与全局header合并，如有同名属性，局部覆盖全局 */
							dataType: 'json',
						}).then(res => {
						// console.log(res.data)
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
				}else{
					uni.$u.http.post(
						'bill/add/' + uni.getStorageSync("uid"), this.billmodel, {
							/* 会加在url上 */
							header: {
								token: uni.getStorageSync("auth-token"),
							},
							/* 会与全局header合并，如有同名属性，局部覆盖全局 */
							dataType: 'json',
						}).then(res => {
						// console.log(res.data)
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
				}
				
				//清除所有的信息
				this.ResetModel()
			},
			ResetModel() {
				this.billmodel = {
					goods: "",
					category: "",
					consumeDate: Number(new Date()),
					money: 0,
					photos: []
				}
				this.fileList1=[];
				this.editFlag = false;
			}

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

			.changeType {
				background-color: rgb(255, 215, 124);
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
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
