<template>
  <v-layout row>
    <v-flex>
      <v-dialog v-model="dialog" persistent max-width="322px">
        <v-btn slot="activator">Change Time</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Edit Meetup Time</span>
          </v-card-title>
          <v-card-text>
            <v-time-picker v-model="time" :format="'24hr'" scrollable>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" @click="saveTime" flat>Save</v-btn>
            </v-time-picker>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import * as moment from 'moment'
export default {
  props: ['meetup'],
  data() {
    return {
      dialog: false,
      date: moment(this.meetup.date),
      time: moment(this.meetup.date).format('HH:mm')
    }
  },
  methods: {
    saveTime() {
      this.dialog = false

      let updatedDate = this.date
      let hours = this.time.match(/^\d+/)
      let minutes = this.time.match(/:\d+/)[0].match(/\d+/)
      updatedDate.hours(hours)
      updatedDate.minutes(minutes)

      let updateMeetupData = {
        id: this.meetup.id,
        date: updatedDate.toISOString()
      }
      this.$store.dispatch('updateMeetup', updateMeetupData)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
