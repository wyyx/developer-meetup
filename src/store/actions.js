import * as firebase from 'firebase'

export default {
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
					state.commit('addMeetup', { ...meetup, id: key, imageUrl })
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

		firebase
			.database()
			.ref('meetups')
			.child(updateMeetupData.id)
			.update(updateMeetupData)
			.then(() => {
				state.commit('setLoading', false)
				state.commit('updateMeetup', updateMeetupData)
			})
			.catch(error => {
				state.commit('setLoading', false)
				state.commit('setError', error)
				console.log(error)
			})
	},
	createUser(state, payload) {
		state.commit('setLoading', true)
		state.commit('clearError')
		firebase
			.auth()
			.createUserWithEmailAndPassword(payload.email, payload.password)
			.then(res => {
				let newUser = {
					id: res.user.uid,
					registeredMeetups: []
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
					id: res.user.uid,
					registeredMeetups: []
				})
				state.commit('setLoading', false)
			})
			.catch(error => {
				console.log(error)
				state.commit('setError', error)
				state.commit('setLoading', false)
			})
	},
	autoSignin(state, payload) {
		state.commit('setUser', {
			id: payload.uid,
			registeredMeetups: []
		})
	},
	signOut(state) {
		state.commit('setUser', null)
	}
}
