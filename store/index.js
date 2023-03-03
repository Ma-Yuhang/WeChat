import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import cart from './cart.js'
import user from './user.js'

const store = new Vuex.Store({
	modules:{
		cart,
		user
	}
})

export default store