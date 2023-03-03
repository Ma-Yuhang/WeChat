// 数字徽标的mixins
import { mapGetters } from 'vuex'
export default {
	computed: {
		...mapGetters('cart', ['total'])
	},
	watch: {
		total() {
			this.setBadge()
		}
	},
	onShow() {
		this.setBadge()
	},
	methods: {
		setBadge() {
			// if(this.total === 0){
			// 	uni.removeTabBarBadge({index:2})
			// }
			uni.setTabBarBadge({
				index: 2,
				text: this.total + ''
			})
		}
	}
}