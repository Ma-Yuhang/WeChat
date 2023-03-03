<template>
	<view class="goods-item">
		<!-- 左侧的盒子 -->
		<view class="goods-item-left">
			<radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="redioClick(goods)"></radio>
			<image :src="goods.goods_small_logo || defaultImg" class="goods-pic"></image>
		</view>
		<!-- 右侧的盒子 -->
		<view class="goods-item-right">
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
				<uni-number-box :min="1" :value="goods.goods_count" v-if="showRadio" @change="changeHandler"></uni-number-box>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			// 商品的属性
			goods: {
				type: Object,
				default: {}
			},
			// 是否显示radio及number-box
			showRadio: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			tofixed(num) {
				return Number(num).toFixed(2)
			}
		},
		data() {
			return {
				// 如果图片找不到 显示默认图片
				defaultImg: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqna.smzdm.com%2F202107%2F06%2F60e43812c46394533.jpg_e1080.jpg&refer=http%3A%2F%2Fqna.smzdm.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1667834114&t=4510b4d7a34b1101bd6badb96cc6d642"
			};
		},
		methods: {
			redioClick(goods) {
				this.$emit('radio-change',{
					goods_id: goods.goods_id,
					goods_state: !goods.goods_state
				})
			},
			changeHandler(num) {
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: num
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		width: 750rpx;
		box-sizing: border-box;
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 10px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}
			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				
				.goods-price {
					color: #c00000;
					font-size: 16px;
				}
			}
			
		}
	}
</style>
