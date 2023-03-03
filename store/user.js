export default {
	namespaced: true,
	
	state: {
		// 收件人信息
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		token: uni.getStorageSync('token') || '',
		// 登录用户信息
		loginUserInfo: JSON.parse(uni.getStorageSync('loginUserInfo') || '{}'),
		// 重定向到cart页面
		redirect: ''
	},
	
	mutations: {
		// 更新收件人的信息
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo
			this.commit('user/saveUserInfo')
		},
		// 存储用户信息
		loginUserInfo(state, loginUserInfo) {
			state.loginUserInfo = loginUserInfo
			this.commit('user/saveLoginUserInfo')
		},
		// 存储token
		getToken(state, token) {
			state.token = token
			this.commit('user/saveToken')
		},
		
		// 重定向
		redirect(state, strUrl) {
			state.redirect = strUrl
		},
		
		// 将收件人信息持久化到本地
		saveUserInfo(state) {
			uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
		},
		
		// 将用户信息持久化到本地
		saveLoginUserInfo(state) {
			uni.setStorageSync('loginUserInfo', JSON.stringify(state.loginUserInfo))
		},
		
		// 将token持久化到本地
		saveToken(state) {
			uni.setStorageSync('token', JSON.stringify(state.token))
		}
	},
	
	getters: {
		// 收件人地址
		address(state) {
			return state.userInfo.provinceName + state.userInfo.cityName + state.userInfo.countyName + state.userInfo.detailInfo
		}
	}
}