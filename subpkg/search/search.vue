<template>
	<view>
		<view class="search-view-box">
			<uni-search-bar @input="input" ref="search" v-model="kw" cancelButton="none" :radius="100" placeholder="请输入搜索内容">
			</uni-search-bar>
			
			<!-- 搜索建议列表 -->
			<view class="sugg-list" v-if="searchList.length !== 0">
				<view class="sugg-list-item" v-for="goods in searchList" :key="goods.goods_id" 
				@click="toDetail(goods.goods_id)">
					<view class="goods-name">{{goods.goods_name}}</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>
			</view>
			
			<!-- 搜索历史记录 -->
			<view class="history-box" v-else>
				<view class="history-title">
					<text>搜索历史</text>
					<uni-icons type="trash" @click="clear"></uni-icons>
				</view>
				<view class="history-list">
					<view class="history-list-item"  v-for="(item,i) in historyList" :key="i" 
						@click="gotoGoodsList(item)">{{item}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: '',
				// 搜索的列表数据
				searchList: [],
				// 搜索历史的数据
				// historyList: 
				historyList: []
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw')) || []
		},
		methods: {
			input() {
				if(this.timer) clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.getSearchList()
				},500)
			},
			// 获得搜索列表的数据
			async getSearchList() {
				if(this.kw.trim() === '') {
					this.searchList = []
					return
				}
				const res = await uni.$http.get(`/api/public/v1/goods/qsearch?query=${this.kw}`)
				if(res.data.meta.status !== 200) return uni.$showMsg()
				this.searchList = res.data.message
			},
			// 点击每个建议去详情页
			toDetail(id) {
				// 如果之前搜索过,先删除之前的记录,再将新搜索的放在最前面
				if(this.historyList.includes(this.kw)) {
					let index = this.historyList.findIndex(item => item == this.kw)
					this.historyList.splice(index, 1)
				}
				// 将最新搜索的放在最前面
				this.historyList.unshift(this.kw)
				// 将搜索历史本地存储
				uni.setStorageSync('kw',JSON.stringify(this.historyList))
				uni.navigateTo({
					url: `/subpkg/goods_detail/goods_detail?goods_id=${id}`
				})
			   this.kw = ''
			},
			// 清空本地存储
			clear() {
				this.historyList = []
				uni.clearStorageSync()
			},
			// 点击每个搜索历史
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?query=${kw}`
				})
			}
		}
	}
</script>

<style lang="scss">
.sugg-list {
	padding: 0 5px;
	.sugg-list-item {
		padding: 13px 0;
		display: flex;
		justify-content: space-between;
		border: 1px solid #efefef;
		.goods-name {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 12px;
		}
	}
}
.history-box {
	padding: 0 5px;
	.history-title {
		height: 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #ccc;
	}
	.history-list {
		display: flex;
		flex-wrap: wrap;
		.history-list-item {
			padding: 5px 10px;
			border-radius: 5px;
			background-color: #e6e6e6;
			margin: 10px 10px 0 0;
			font-size: 12px;
		}
	}
}
</style>
