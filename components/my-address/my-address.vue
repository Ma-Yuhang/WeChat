<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(userInfo) === '{}'">
			<button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">收货人：{{userInfo.userName}}</view>
				<view class="row1-right">
					<view class="phone">电话：{{userInfo.telNumber}}</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收获地址：</view>
				<view class="row2-right">{{address}}</view>
			</view>
		</view>
		
		<image src="../../static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { mapState, mapGetters } from 'vuex'
	export default {
		name: "my-address",
		data() {
			return {
				
			}
		},
		methods: {
			// 点击选择收货地址
			async chooseAddress() {
				try{
					const [err,success] = await uni.chooseAddress()
					if(err == null && success.errMsg == 'chooseAddress:ok') {

						this.$store.commit('user/updateUserInfo', success)
					}
				}catch(e){
					console.log(e);
				}
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
			...mapGetters('user', ['address'])
		}
	}
</script>

<style lang="scss">
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-choose-box {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.address-info-box {
		display: flex;
		height: 90px;
		flex-direction: column;
		justify-content: center;
		font-size: 12px;
		padding: 0 5px;
		.row1 {
			display: flex;
			justify-content: space-between;
			.row1-right {
				display: flex;
				justify-content: space-between;
			}
		}
		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;
			.row2-left {
				white-space: nowrap;
			}
		}
	}
</style>
