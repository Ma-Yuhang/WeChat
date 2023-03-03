<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods.goods_id)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求数据的参数列表
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				// 得到的数据列表
				goodsList: [],
				total: 0,
				// 是否在请求数据
				isLoading: false
			}
		},
		onLoad(options) {
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 请求商品列表的数据
			this.getGoodsList()
		},
		methods: {
			// 请求商品列表的数据
			async getGoodsList(str) {
				// 如果正在请求数据 就不在发起请求
				if (this.isLoading) return
				// 设置isLoading为true 代表正在请求数据中
				this.isLoading = true
				const res = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 如果是下拉刷新 需要自动上滑
				if (str == '刷新') uni.stopPullDownRefresh();
				if (res.data.meta.status !== 200) return uni.$showMsg()
				// 设置isLoading为false 代表请求数据结束
				this.isLoading = false
				this.goodsList = [...this.goodsList, ...res.data.message.goods]
				this.total = res.data.message.total
			},
			// 点击每个商品去商品详情页
			gotoDetail(goods_id) {
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${goods_id}`
				})
			}
		},
		// 上拉加载更多
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
				return uni.$showMsg({
					title: '没有更多了'
				})
			}
			this.queryObj.pagenum++
			// 请求商品列表的数据
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.goodsList = []
			this.total = 0
			this.queryObj.pagenum = 1
			// 请求商品列表的数据
			this.getGoodsList('刷新')
		}
	}
</script>

<style lang="scss">
	.goods-list {
		background-color: #fff;
	}
</style>
