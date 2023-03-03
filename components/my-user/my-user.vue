<template>
	<view class="my-user-container">
		<!-- 顶部的头像和名字 -->
		<view class="top-box">
			<image :src="loginUserInfo.avatarUrl" class="avatar"></image>
			<view class="nickname">{{loginUserInfo.nickName}}</view>
		</view>
		
		<!-- 面板区域 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<view class="panel-body">
					<view class="panel-item">
						<text>8</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>14</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>18</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>84</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="panel">
				<!-- 我的订单 -->
				<view class="panel-title">我的订单</view>
				<view class="panel-body">
					<view class="panel-item">
						<image src="/static/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panel-list-item">
					<text>收货地址</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<view class="panel-list-item">
					<text>联系客服</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
				<view class="panel-list-item" @click="quit">
					<text>退出登录</text>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		name:"my-user",
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('user', ['loginUserInfo'])
		},
		methods: {
			// 退出登录
			async quit() {
				const [err, succ] = await uni.showModal({
					title: "提示",
					content: "确认要退出登录吗？"
				}).catch(err => err)
				
				// 取消退出
				if(succ.cancel) return 
				// 确定退出
				if(succ.confirm) {
					this.$store.commit('user/updateUserInfo',{})
					this.$store.commit('user/loginUserInfo',{})
					this.$store.commit('user/getToken','')
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('loginUserInfo')
				}
			}
		}
	}
</script>

<style lang="scss">
.my-user-container {
	height: 100%;
	background-color: #f4f4f4;
	
	.top-box {
		height: 400rpx;
		background-color: #c00000;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
		.avatar {
			height: 90px;
			width: 90px;
			border-radius: 45px;
			border: 2px solid #fff;
			box-shadow: 0 1px 5px black;
		}
		.nickname {
			color: #fff;
			font-size: 14px;
			margin-top: 15px;
		}
	}
	
	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;
		.panel {
			background-color: #fff;
			margin-bottom: 8px;
			border-radius: 3px;
			
			.panel-title {
				line-height: 40px;
				font-size: 14px;
				padding-left: 10px;
				border-bottom: 1px solid #f4f4f4;
			}
			
			.panel-body {
				display: flex;
				justify-content: space-around;
				
				.panel-item{
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					padding: 10px 0;
					font-size: 12px;
					
					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
		}
		
		
	}
}
.panel-list-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
	height: 45px;
	font-size: 14px
}
</style>