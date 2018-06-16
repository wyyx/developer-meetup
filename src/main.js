// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import colors from 'vuetify/es5/util/colors'
import './filters'
import * as firebase from 'firebase'
import './style/style.scss'

Vue.use(Vuetify, {
	theme: {
		primary: colors.lightBlue.accent4,
		secondary: colors.lightBlue.accent2,
		accent: colors.pink.lighten1,
		error: colors.red.base,
		warning: colors.yellow.base,
		info: colors.blue.base,
		success: colors.green.base
	}
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>',
	created() {
		firebase.initializeApp({
			apiKey: 'AIzaSyAAMWutg3ft0qIAte5kC7dtBaU-BaJY0K4',
			authDomain: 'jzwdyx-300.firebaseapp.com',
			databaseURL: 'https://jzwdyx-300.firebaseio.com',
			projectId: 'jzwdyx-300',
			storageBucket: 'jzwdyx-300.appspot.com',
			messagingSenderId: '481484878561'
		})

		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				this.$store.dispatch('autoSignin', user)
			}
		})
		this.$store.dispatch('loadMeetups')
	}
})
