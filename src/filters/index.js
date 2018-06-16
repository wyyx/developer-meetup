import Vue from 'vue'
import * as moment from 'moment'

Vue.filter('date', (value, style) => {
	if (!value) return ''
	let style1 = 'MMMM Do YYYY HH:mm'

	if (style) {
		return moment(value).format(style)
	}
	return moment(value).format(style1)
})
