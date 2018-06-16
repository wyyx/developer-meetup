import * as moment from 'moment'

export default {
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
	},
	user(state) {
		return state.user
	},
	loading(state) {
		return state.loading
	},
	error(state) {
		return state.error
	}
}
