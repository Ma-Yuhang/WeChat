
import Vue from 'vue'
import App from './App'
import store from './store/index.js'
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'
uni.$http = $http
$http.baseUrl = "https://api-hmugo-web.itheima.net"
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中'
	})
	if(options.url.includes('/my/')) {
		options.header = {
			Authorization: store.state.user.token
		}
	}
}

$http.afterRequest = function(options) {
	uni.hideLoading()
}

// 封装弹出框
uni.$showMsg = function(options = {}) {
	const {title = "数据请求失败！",duration = 1500,icon = "none"} = options
	return uni.showToast({
		title,
		duration,
		icon
	})
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	 store
})
app.$mount()


