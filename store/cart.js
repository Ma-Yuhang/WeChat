export default {
	namespaced: true,
	
	state: {
		// 购物车的数组
		// 每件商品的信息对象,都包含如下6个属性
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart: JSON.parse(uni.getStorageSync('cart')  || '[]')
	},
	
	mutations: {
		// 将商品添加到购物车
		addToCart(state, goods) {
			const findRes = state.cart.find(x => x.goods_id === goods.goods_id)
			if(!findRes) {
				// 没有这件商品
				state.cart.push(goods)
			} else {
				// 有这件商品 只需要数量加1
				findRes.goods_count++
			}
			// 将购物车的数据持久化存储到本地
			this.commit('cart/saveToStorage')
		},
	
		// 改变radio的勾选状态
		radioChange(state, goodsObj) {
			const findres = state.cart.find(x => x.goods_id === goodsObj.goods_id)
			
			findres.goods_state = goodsObj.goods_state
			// 将购物车的数据持久化存储到本地
			this.commit('cart/saveToStorage')
		},
		// 购买商品数量变化
		numChange(state, goodsObj) {
			const findres = state.cart.find(x => x.goods_id === goodsObj.goods_id)
			
			findres.goods_count = goodsObj.goods_count
			// 将购物车的数据持久化存储到本地
			this.commit('cart/saveToStorage')
		},
		// 删除某件商品
		deleteGoods(state, goods) {
			const index = state.cart.findIndex(x => x.goods_id === goods.goods_id)
			
			state.cart.splice(index, 1)
			// 将购物车的数据持久化存储到本地
			this.commit('cart/saveToStorage')
		},
		// 改变每个商品的选中状态
		changeAllCheck(state, check) {
			state.cart.forEach(x => x.goods_state = check)
			// 持久化
			this.commit('cart/saveToStorage')
		},
		// 数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
	},
	
	getters: {
		// 统计所有商品的数量
		total(state) {
			return state.cart.reduce((total, item) => total += item.goods_count, 0)
		},
		// 计算勾选商品的总数量
		checkedCount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total,item) => {
				return total += item.goods_count
			}, 0)
		},
		// 计算勾选商品的总价
		checkedAllPrice(state) {
			const sum = state.cart.filter(x => x.goods_state).reduce((total, item) => {
				return total += item.goods_count * item.goods_price
			}, 0)
			return sum.toFixed(2)
		}
	}
}