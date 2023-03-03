<template>
	<view class="my-search-container" :style="{'background-color': bgColor}">
		<view class="my-search-box" :style="{'border-radius': radius + 'px'}"  @click="searchBoxHandler">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props:{
			bgColor: {
				type: String,
				default: '#c00000'
			},
			radius: {
				type: Number,
				default: 18
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			searchBoxHandler() {
				this.$emit('myClick')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container {
	height: 50px;
	// background-color: #c00000;
	
	 .my-search-box {
		 height: 36px;
		 background-color: #fff;
		 line-height: 36px;
		 text-align: center;
		 // border-radius: 18px;
		 margin: 0 10px;
		 
		 .placeholder {
			 font-size: 15px;
			 margin-left: 5px;
		 }
	 }
}
</style>