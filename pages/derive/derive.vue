<template>
	<view>
		<view class="top" @click="show = true">
			<u-row justify="space-between" gutter="2">
				<u-col span="4">
					<u-text text="起始时间：" size="18" block type="primary"></u-text>
				</u-col>
				<u-datetime-picker :show="show" :formatter="formatter" v-model="time" mode="date"
					@cancel="show = false" @confirm="confirm" @change="change">
				</u-datetime-picker>
				<u-col span="8">
					<u-input :value="formatDate(time)" shape="circle" disabled disabledColor="#defbff"></u-input>
				</u-col>
			</u-row>
		</view>
		<view class="top2" @click="show2 = true">
			<u-row justify="space-between" gutter="2">
				<u-col span="4">
					<u-text text="结束时间：" size="18" block type="primary"></u-text>
				</u-col>
				<u-datetime-picker :show="show2" :formatter="formatter" v-model="time2" mode="date"
					@cancel="show2 = false" @confirm="confirm" @change="change2">
				</u-datetime-picker>
				<u-col span="8">
					<u-input :value="formatDate(time2)" shape="circle" disabled disabledColor="#defbff"></u-input>
				</u-col>
			</u-row>

		</view>
		<u-button type="primary" @click="submit" class="getSmsCode" shape="circle">提交</u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				show2: false,
				time: Number(new Date()),
				time2: Number(new Date()),
			}
		},
		methods: {
			change(e) {
				this.time = e.value;
				// console.log(this.formatDate(e.value))
			},
			change2(e) {
				this.time2 = e.value;
			},
			formatDate(date) {
				// console.log(date)
				let newDate = new Date(date);
				let year = newDate.getFullYear();
				//month和day都是从0开始的所以需要加1
				//.padStart(2, 0)是没有两位补0
				let month = (newDate.getMonth() + 1).toString().padStart(2, 0);
				let day = newDate.getDate().toString().padStart(2, 0);
				return year + '-' + month + '-' +day;
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
				    return `${value}日`
				}
				return value
			},
			confirm() {
				this.show = false;
				//确定之后才会更改，所以要在
				this.show2 = false;
			},
			submit() {
				uni.$u.http.post("/file/down",{
						uid: uni.getStorageSync("uid"),
						startTime: this.time,
						endTime: this.time2
					}, {
					headers: {
						token: uni.getStorageSync("auth-token"),
						responseType: 'blob' //一定要记得加这行，设置服务器响应的数据类型为blob类型
					}
				}).then(res => {
					//将base64编码还原出来
					var bstr = atob(res.data),n=bstr.length,u8arr = new Uint8Array(n);
					while(n--){
						u8arr[n] = bstr.charCodeAt(n);
					}
					let blob = new Blob([u8arr]); // res就是接口返回的文件流了
					let objectUrl = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.download = 'download.xlsx' //后缀名一定要写对，不然会导致文件损坏，打不开
					a.href = objectUrl;
					a.click();
					a.remove();
					// console.log(res)
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
	.getSmsCode {
		// background-color: rgb(213, 255, 252);
		// color: $u-tips-color;
		border: none;
		font-size: 30rpx;
		// padding: 20rpx 20rpx 10rpx 10rpx;

		&::after {
			border: none;
		}
	}
</style>
