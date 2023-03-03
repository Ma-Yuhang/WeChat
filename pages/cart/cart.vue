<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收件人信息 -->
		<my-address></my-address>
		<!-- 购物车标题 -->
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 购物车中商品 -->
		<view class="cart-goods">
			<uni-swipe-action>
				<view v-for="(goods,i) in cart" :key="i">
					<uni-swipe-action-item :right-options="options" @click="deleteGoods(goods)">
						<my-goods :goods="goods" :showRadio="true" @radio-change="radioChange" 
							@num-change="numChange"></my-goods>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		
		<!-- 结算 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车模块 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip">空空如也~</text>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import badgeMixin from '@/mixins/tabbar-badge.js'
	export default {
		// 数字徽标
		mixins: [badgeMixin],
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#c00000'
					}
				}]
			}
		},

		computed: {
			...mapState('cart', ['cart']),
		},
		methods: {
			// 勾选状态的变化 goodsObj:{goods_id,goods_state}
			radioChange(goodsObj) {
				this.$store.commit('cart/radioChange', goodsObj)
			},
			// 购买的数量变化 goodsObj:{goods_id,goods_count}
			numChange(goodsObj) {
				this.$store.commit('cart/numChange', goodsObj)
			},
			// 删除某件商品
			deleteGoods(goods) {
				this.$store.commit('cart/deleteGoods', goods)
			},
			// 点击某个商品去详情页
			// gotoDetail(goods_id) {
			// 	uni.navigateTo({
			// 		url: `/subpkg/goods_detail/goods_detail?goods_id=${goods_id}`
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #efefef;
		padding-left: 5px;

		.cart-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.cart-container {
		padding-bottom: 50px;
	}
	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 180px;
		.empty-img {
			width: 90px;
			height: 90px;
		}
		.tip {
			font-size: 12px;
			color: gray;
			margin-top: 10px;
		}
	}
</style>
