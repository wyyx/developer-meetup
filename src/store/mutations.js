export default {
	addMeetup(state, payload) {
		state.loadedMeetups.push(payload)
	},
	updateMeetup(state, payload) {
		let meetup = state.loadedMeetups.find(m => m.id === payload.id)

		meetup.title = payload.title
		meetup.location = payload.location
		meetup.description = payload.description
	},
	setloadedMeetups(state, payload) {
		state.loadedMeetups = payload
	},
	setUser(state, payload) {
		state.user = payload
	},
	setLoading(state, payload) {
		state.loading = payload
	},
	setError(state, payload) {
		state.error = payload
	},
	clearError(state) {
		state.error = null
	}
}
