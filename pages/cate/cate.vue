<template>
	<view>
		<my-search @myClick="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<scroll-view scroll-y class="left-scroll-view" :style="{height: windowHeight + 'px'}">
				<view class="left-scroll-view-item" :class="{active: i === active}" v-for="(item1,i) in cateList" 
					:key="i" @click="activeChanged(i)">{{item1.cat_name}}</view>
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view scroll-y class="right-scroll-view" :style="{height: windowHeight + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类的数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3.cat_id)">
							<image :src="item3.cat_icon" mode=""></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMixin from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badgeMixin],
		data() {
			return {
				// 当前设备屏幕的可使用高度
				windowHeight: 0,
				// 分类列表的数据
				cateList: [],
				active: 0,
				// 二级分类的数据
				cateLevel2: [],
				scrollTop : 0
			};
		},
		onLoad() {
			// 获得当前设备的信息
			const sysInfo = uni.getSystemInfoSync()
			this.windowHeight = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			// 获得分类列表的数据
			async getCateList() {
				const res = await uni.$http.get('/api/public/v1/categories')
				if(res.data.meta.status !== 200) return uni.$showMsg()
				this.cateList = res.data.message
				this.cateLevel2 = res.data.message[0].children
			},
			// 点击左侧的一级列表
			activeChanged(i) {
				this.active = i
				this.cateLevel2 = this.cateList[i].children
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 点击每一个商品去商品列表页
			gotoGoodsList(id) {
				uni.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${id}`
				})
			},
			// 点击搜索框 去搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container {
	display: flex;
	
		.left-scroll-view{
			width: 120px;
			
			 .left-scroll-view-item {
				 background-color: #f7f7f7;
				 line-height: 60px;
				 text-align: center;
				 font-size: 12px;
				  
				  &.active {
					  background-color: #fff;
					  position: relative;
					  
					   &::before {
							content: '';
							display: block;
							width: 2px;
							height: 30px;
							background-color: #c00000;
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
						}
				  }
			 }
		}

		.right-scroll-view {
			background-color: #fff;
			
			.cate-lv2-title {
				font-size: 12px;
				font-weight: 700;
				text-align: center;
				padding: 15px 0;
			}
			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;
				
					.cate-lv3-item {
						flex: 33.33%;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						margin-bottom: 10px;
						
							image {
								width: 60px;
								height: 60px;
							}
							
							text {
								font-size: 12px;
							}
					}
			}
		}
}

</style>
