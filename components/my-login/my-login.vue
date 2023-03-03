<template>
	<view class="login-container">
		<uni-icons type="contact" size="100" color="gray"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
		<text class="tip">登录后尽享更多权益</text>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			}
		},
		methods: {
			// 获取用户信息
			async getUserInfo() {
				const [err,succ] = await uni.getUserProfile({
					desc: "登录授权"
				}).catch(err => err)
				if(err !== null && err.errMsg === 'getUserProfile:fail auth deny') {
					return uni.$showMsg({title: '您取消了授权登录'})
				}
				this.$store.commit('user/loginUserInfo', succ.userInfo)
				// console.log(succ);
				this.getToken(succ)
			},
			// 获取token
			async getToken(info) {
				const [err,succ] = await uni.login().catch(err => err)
				// console.log(succ);
				if(err || succ.errMsg !== "login:ok") return uni.$showMsg({title: '登录失败!'})
				
				// 准备参数对象
				const query = {
					code: succ.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				
				// 换取token 400意味着成功
				const res = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				if(res.statusCode !== 200) return uni.$showMsg({title: '登录失败!'})
				const msg = {
					token: res.data.message || "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
				}
				// 模拟token
				// for(let i = 1; i <= 32; i++) {
				// 	let token = Math.floor(Math.random() * 16.0).toString(16)
				// 	msg.token += token
				// }
				this.$store.commit('user/getToken', msg.token)
				
				// 判断是不是重定向
				if(this.redirect) {
					uni.switchTab({
						url: this.redirect,
						complete:() => {
							// 清空重定向 只有在cart页面没登录时才会重定向
							this.$store.commit('user/redirect','')
						}
					})
				}
				
			}
		},
		computed: {
			...mapState('user', ['redirect'])
		}
	}
</script>

<style lang="scss">
.login-container {
	height: 750rpx;
	background-color: #efefef;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		bottom: -20px;
		left: 0;
		height: 40px;
		width: 100%;
		background-color: #fff;
		border-radius: 100%;
	}
	
	.btn-login{
		width: 90%;
		background-color: #c00000;
		border-radius: 100px;
		margin: 15px 0;
	}
	
	.tip{
		font-size: 12px;
		color: gray;
	}
}
</style>