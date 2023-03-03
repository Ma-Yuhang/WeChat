<template>
	<view>
		<view class="search-box">
			<my-search @myClick="gotoSearch"></my-search>
		</view>
		<!-- 轮播图 -->
		<swiper indicator-dots :autoplay="true" :interval="3000" :duration="1000" circular>
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
					<img :src="item.image_src">
				</navigator>
			</swiper-item>
		</swiper>
		<!-- nav导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层的标题 -->
				<image :src="item.floor_title.image_src" class="floor-img"></image>
				<!-- 楼层的主体 -->
				<view class="floor-img-box">
					<!-- 左侧的大图片 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 
							'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧的四张图片 -->
					<view class="right-img-box">
						<navigator :url="item2.url" class="right-img-item" v-for="(item2,i2) in item.product_list" 
						:key="i2" v-if="i2 !== 0">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix">
								</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMixin from '@/mixins/tabbar-badge.js'
	export default {
		// 数字徽标
		mixins: [badgeMixin],
		data() {
			return {
				// 轮播图数据
				swiperList: [],
				// 存放中间导航的数据
				navList: [],
				// 楼层的数据
				floorList: []
			};
		},
		onLoad() {
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},

		methods: {
			// 请求轮播图的数据
			async getSwiperList() {
				const res = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 如果请求数据失败 弹框提示
				if (res.data.meta.status !== 200) return uni.$showMsg()
				// 否则将数据存放到swiperList
				this.swiperList = res.data.message
			},
			// 请求navList的数据
			async getNavList() {
				const res = await uni.$http.get('/api/public/v1/home/catitems')
				// 如果请求数据失败 弹框提示
				if (res.data.meta.status !== 200) return uni.$showMsg()
				// 否则将数据存放到swiperList
				this.navList = res.data.message
			},
			// navList的点击事件
			navClickHandler(item) {
				if(item.name == '分类') {
					uni.switchTab({
						url: "/pages/cate/cate"
					})
				}
			},
			// 请求楼层的数据
			async getFloorList() {
				const res = await uni.$http.get('/api/public/v1/home/floordata')
				// 如果请求数据失败 弹框提示
				if (res.data.meta.status !== 200) return uni.$showMsg()
				// 否则将数据存放到swiperList
				res.data.message.forEach(item => {
					item.product_list.forEach(prod => {
						prod.url = "/subpkg/goods_list/goods_list?" + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.data.message
			},
			// 去搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
swiper {
	height: 330rpx;
	
		.swiper-item,img {
			width: 100%;
			height: 100%;
		}
}
.nav-list {
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	
		.nav-img{
			width: 128rpx;
			height: 140rpx;
		}
}
.floor-img {
	width: 100%;
	height: 60rpx;
}
.floor-img-box {
	display: flex;
	padding-left: 10rpx;
	
		.right-img-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
}
.search-box {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 11;
}
</style>
