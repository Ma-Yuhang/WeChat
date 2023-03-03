<template>
	<view>
		<view class="settle-container">
			<label class="radio" @click="changeAllCheck">
				<radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
			</label>
			
			<!-- 合计 -->
			<view class="amount-box">
				合计: <text class="amount">￥{{checkedAllPrice}}</text>
			</view>
			
			<!-- 结算按钮 -->
			<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds: 3,
				timer: null
			}
		},
		methods:{
			// 点击全选按钮
			changeAllCheck() {
				this.$store.commit('cart/changeAllCheck', !this.isFullCheck)
			},
			// 点击结算按钮
			settlement(e) {
				if(!this.checkedCount) return uni.$showMsg({title: '请选择购买的商品'}) 
				if(!this.address) return uni.$showMsg({title: '请选择您的收货地址'}) 
				if(!this.token) return this.delayNavigate()
				
				// 进行微信支付
				this.payOrder()
			},
			// 微信支付
			async payOrder() {
				// 整理参数
				const orderInfo = {
					// 开发期间 设置订单总价为0.01
					// order_price: this.checkedGoodsAmount,
					order_price: 0.01,
					consignee_addr: this.address,
					goods: this.cart.filter(x => x.goods_state).map(x => {
						return {goods_id: x.goods_id,goods_number: x.goods_count,goods_price: x.goods_price}
					})
				}
				
				// 发请求创建订单
				const res = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
				
				if(res.data.meta.status !== 200) return uni.$showMsg({title: '创建订单失败！'})
				// 订单编号
				const orderNumber = res.data.message.order_number
				
				// 订单预支付
				const res2 = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})

				if(res2.data.meta.status !== 200) return uni.$showMsg({title: '订单预支付失败！'})
				const payInfo = {
					provider: "wxpay",
					orderInfo: res2.data.message.pay
				}

				console.log(payInfo);
				// 进行微信支付
				const [err,succ] = await uni.requestPayment(payInfo)
				if(err) return uni.$showMsg({title: '订单未支付!'})
				
				// 完成了支付,进行进一步查询支付的结果
				const res3 = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber})
				if(res.data.meta.status !== 200) return uni.$showMsg({title: '订单未支付!'})
				
				// 检测到支付成功
				uni.showToast({
					title: '支付成功!',
					icon: 'success'
				})
			},
			
			// 未登录时的提示效果
			showTips(seconds) {
				uni.showToast({
					icon: 'none',
					title: `请登录后在结算！${seconds}秒后跳转到登录页面`,
					mask: true
				})
			},
			// 延时跳转
			delayNavigate() {
				this.seconds = 3
				this.showTips(this.seconds)
				this.timer = setInterval(() => {
					this.seconds--
					if(this.seconds <= 0){
						// 清除定时器
						clearInterval(this.timer)
						// 跳转到登录页面
						uni.switchTab({
							url:"/pages/my/my",
							success:() => {
								// 存储redirect
								this.$store.commit('user/redirect', '/pages/cart/cart')
							}
						})
						return 
					}
					this.showTips(this.seconds)
				},1000)
			},
		},
		computed: {
			...mapGetters('cart', ['checkedCount','total','checkedAllPrice']),
			...mapGetters('user', ['address']),
			...mapState('user', ['token']),
			...mapState('cart', ['cart']),
			// 全选按钮的勾选状态
			isFullCheck() {
				return this.checkedCount === this.total
			}
		}
	}
</script>

<style lang="scss">
.settle-container {
	width: 100%;
	position: fixed;
	background-color: #fff;
	bottom: 0;
	left: 0;
	height: 50px;
	font-size: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 5px;
	.radio{
		display: flex;
		align-items: center;
	}
	.amount-box{
		.amount{
			color: #c00000;
			font-weight: 700;
		}
	}
	.btn-settle{
		height: 50px;
		min-width: 100px;
		background-color: #c00000;
		line-height: 50px;
		text-align: center;
		color: white;
	}
}
</style>