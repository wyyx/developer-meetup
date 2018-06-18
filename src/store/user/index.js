import * as firebase from 'firebase'

const USER_INITITAL_STATE = {
	id: null,
	email: null,
	registeredMeetups: [],
	firebaseKeys: {}
}

export default {
	state: {
		user: null
	},
	mutations: {
		setUser(state, payload) {
			state.user = payload
		},
		addFirebaseKey(state, { meetupId, firebaseKey }) {
			if (meetupId && firebaseKey) {
				state.user.firebaseKeys[meetupId] = firebaseKey
			}
		},
		removeFirebaseKey(state, meetupId) {
			delete state.user.firebaseKeys[meetupId]
		},
		addRegisteredMeetup(state, meetupId) {
			state.user.registeredMeetups.push(meetupId)
		},
		removeRegisteredMeetup(state, meetupId) {
			let index = state.user.registeredMeetups.findIndex(
				id => id === meetupId
			)
			state.user.registeredMeetups.splice(index, 1)
		}
	},
	actions: {
		createUser(state, payload) {
			state.commit('setLoading', true)
			state.commit('clearError')
			firebase
				.auth()
				.createUserWithEmailAndPassword(payload.email, payload.password)
				.then(res => {
					let newUser = {
						...USER_INITITAL_STATE,
						id: res.user.uid
					}
					state.commit('setUser', newUser)
					state.commit('setLoading', false)
				})
				.catch(error => {
					console.log(error)
					state.commit('setError', error)
					state.commit('setLoading', false)
				})
		},
		signIn(state, payload) {
			state.commit('setLoading', true)
			state.commit('clearError')

			firebase
				.auth()
				.signInWithEmailAndPassword(payload.email, payload.password)
				.then(res => {
					state.commit('setUser', {
						...USER_INITITAL_STATE,
						id: res.user.uid,
						email: res.user.email
					})
					state.commit('setLoading', false)
					state.dispatch('loadUserData', res.user.uid)
				})
				.catch(error => {
					console.log(error)
					state.commit('setError', error)
					state.commit('setLoading', false)
				})
		},
		autoSignin(state, payload) {
			state.commit('setUser', {
				...USER_INITITAL_STATE,
				id: payload.uid,
				email: payload.email
			})

			state.dispatch('loadUserData', payload)
		},
		signOut(state) {
			state.commit('setUser', null)
		},
		loadUserData(state, payload) {
			state.commit('setLoading', true)
			state.commit('clearError')
			let userId = payload.uid

			firebase
				.database()
				.ref('/users/' + userId + '/registeredMeetups/')
				.once('value')
				.then(data => {
					let registeredMeetups = []
					let firebaseKeys = {}

					const obj = data.val()
					for (const key in obj) {
						registeredMeetups.push(obj[key])
						firebaseKeys[obj[key]] = key
					}

					state.commit('setUser', {
						...state.getters.user,
						registeredMeetups,
						firebaseKeys
					})
					state.commit('setLoading', false)
				})
				.catch(error => {
					console.log(error)
					state.commit('setLoading', false)
					state.commit('setError', error)
				})
		},
		registerMeetup({ commit, getters }, payload) {
			let meetupId = payload.id
			commit('setLoading', true)
			commit('clearError')

			let userId = getters.user.id

			firebase
				.database()
				.ref('users/' + userId)
				.child('registeredMeetups')
				.push(meetupId)
				.then(res => {
					let firebaseKey = res.key

					commit('addRegisteredMeetup', meetupId)
					commit('addFirebaseKey', {
						meetupId: meetupId,
						firebaseKey: firebaseKey
					})
					commit('setLoading', false)
				})
				.catch(error => {
					commit('setError')
					commit('setLoading', false)
					console.log(error)
				})
		},
		unregisterMeetup({ commit, getters }, payload) {
			let meetupId = payload.id
			commit('setLoading', true)
			commit('clearError')

			let userId = getters.user.id
			let firebaseKey = getters.user.firebaseKeys[meetupId]

			firebase
				.database()
				.ref('users/' + userId + '/registeredMeetups/' + firebaseKey)
				.remove()
				.then(() => {
					commit('removeRegisteredMeetup', meetupId)
					commit('removeFirebaseKey', meetupId)
					commit('setLoading', false)
				})
				.catch(error => {
					commit('setError')
					commit('setLoading', false)
					console.log(error)
				})
		}
	},
	getters: {
		user(state) {
			return state.user
		}
	}
}
