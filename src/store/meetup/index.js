import * as firebase from 'firebase'
import * as moment from 'moment'
export default {
	state: {
		loadedMeetups: []
	},
	mutations: {
		addMeetup(state, payload) {
			state.loadedMeetups.push(payload)
		},
		updateMeetup(state, payload) {
			let meetup = state.loadedMeetups.find(m => m.id === payload.id)

			// update fields
			for (const key in payload) {
				if (payload.hasOwnProperty(key)) {
					if (payload[key]) {
						meetup[key] = payload[key]
					}
				}
			}
		},
		setloadedMeetups(state, payload) {
			state.loadedMeetups = payload
		}
	},
	actions: {
		loadMeetups(state) {
			state.commit('setLoading', true)
			state.commit('clearError')
			firebase
				.database()
				.ref('meetups')
				.once('value')
				.then(data => {
					let meetups = []
					const obj = data.val()
					for (const key in obj) {
						meetups.push({ ...obj[key], id: key })
					}
					state.commit('setloadedMeetups', meetups)
					state.commit('setLoading', false)
				})
				.catch(error => {
					console.log(error)
					state.commit('setError', error)
					state.commit('setLoading', false)
				})
		},
		createMeetup(state, payload) {
			let meetup = { ...payload }

			if (meetup.imageUrl) {
				delete meetup.image

				firebase
					.database()
					.ref('meetups')
					.push(meetup)
					.then(data => {
						const key = data.key
						state.commit('addMeetup', { ...meetup, id: key })
					})
					.catch(error => {
						console.log(error)
					})
			} else {
				delete meetup.image
				delete meetup.imageUrl

				let key
				let imageUrl
				firebase
					.database()
					.ref('meetups')
					.push(meetup)
					.then(data => {
						// get firebase meetup key
						key = data.key
						return key
					})
					.then(key => {
						// save image to firebase storage with name set to key
						const fileName = payload.image.name
						const ext = fileName.slice(fileName.lastIndexOf('.'))
						return firebase
							.storage()
							.ref('meetups/' + key + ext)
							.put(payload.image)
					})
					.then(fileData => {
						// get image download url
						return firebase
							.storage()
							.ref()
							.child(fileData.ref.fullPath)
							.getDownloadURL()
					})
					.then(url => {
						// add imageUrl filed to meetup
						imageUrl = url

						return firebase
							.database()
							.ref('meetups')
							.child(key)
							.update({ imageUrl: imageUrl })
					})
					.then(() => {
						// save to local state
						state.commit('addMeetup', {
							...meetup,
							id: key,
							imageUrl
						})
					})
					.catch(error => {
						console.log(error)
					})
			}
		},
		updateMeetup(state, payload) {
			state.commit('setLoading', true)
			state.commit('clearError')

			let updateMeetupData = { ...payload }
			delete updateMeetupData.id

			firebase
				.database()
				.ref(`meetups`)
				.child(payload.id)
				.update(updateMeetupData)
				.then(() => {
					state.commit('setLoading', false)
					state.commit('updateMeetup', payload)
				})
				.catch(error => {
					state.commit('setLoading', false)
					state.commit('setError', error)
					console.log(error)
				})
		}
	},
	getters: {
		loadedMeetups(state) {
			return state.loadedMeetups.sort((m1, m2) => {
				return moment(m1.date) > moment(m2.date)
			})
		},
		featuredMeetups(state) {
			return state.loadedMeetups.slice(0, 5)
		},
		loadedMeetup(state) {
			return id => {
				return state.loadedMeetups.find(meetup => meetup.id === id)
			}
		}
	}
}
