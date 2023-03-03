<template>
	<view v-if="goods_Info.goods_name">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,i) in goods_Info.pics" :key="i">
				<image :src="item.pics_big_url" @click="preview(i)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品的价格 -->
			<view class="goods-price">￥{{goods_Info.goods_price}}</view>
			<!-- 商品的主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_Info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>
		<!-- 商品图文数据 -->
		<!-- <view v-html="goods_Info.goods_introduce"></view> -->
		<rich-text :nodes="goods_Info.goods_introduce"></rich-text>
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters('cart', ['total'])
		},
		watch: {
			total: {
				immediate: true,
				handler(newVal) {
					const res = this.options.find(x => x.text === '购物车')
					res.info = newVal
				}
			}
		},
		data() {
			return {
				// 商品的信息
				goods_Info: {},
				// goods_nav中左侧的数据
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				// goods_nav中右侧的数据
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		onLoad(options) {
			const goods_id = options.goods_id
			// 请求数据
			this.getGoodsDetail(goods_id)
		},
		methods: {
			// 请求数据
			async getGoodsDetail(goods_id) {
				const res = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id
				})
				if (res.data.meta.status !== 200) return uni.$showMsg()
				res.data.message.goods_introduce = res.data.message.goods_introduce.replace(/<img /g,
					'<img style="display: block"').replace(/webp/g, 'jpg')
				this.goods_Info = res.data.message
			},

			// 点击预览图片
			preview(i) {
				uni.previewImage({
					// 所有图片的url数组
					urls: this.goods_Info.pics.map(item => item.pics_big_url),
					// 从那张图片开始预览
					current: i
				})
			},
			// 左侧点击事件
			onClick(e) {
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: "/pages/cart/cart"
					})
				} else{
					uni.$showMsg({title: e.content.text === '客服' ? '客服下班了呦...' : '店铺已关门!'})
				}
			},
			// 右侧点击事件
			buttonClick(e) {
				if(e.content.text === '加入购物车') {
					const goods = {
						goods_id: this.goods_Info.goods_id,
						goods_name: this.goods_Info.goods_name,
						goods_price: this.goods_Info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_Info.goods_small_logo,
						goods_state: true,
					}
					this.$store.commit('cart/addToCart', goods)
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.goods-price {
			color: #c00000;
			margin: 10px 0;
			font-size: 18px;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				margin-right: 10px;
				font-size: 13px;
			}

			.favi {
				font-size: 12px;
				width: 120px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}
	
	.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}
	.goods-nav {
		position: sticky;
		bottom: 0;
	}
</style>
