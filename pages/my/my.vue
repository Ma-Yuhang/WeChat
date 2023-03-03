<template>
	<view class="my-container">
		<my-login v-if="!token"></my-login>
		<my-user v-else></my-user>
	</view>
</template>

<script>
	import badgeMixin from '@/mixins/tabbar-badge.js'
	import { mapState } from 'vuex'
	export default {
		mixins: [badgeMixin],
		data() {
			return {
				
			};
		},
		computed: {
			...mapState('user', ['token'])
		},
	}
</script>

<style lang="scss">
page,.my-container {
	height: 100%;
}
</style>
