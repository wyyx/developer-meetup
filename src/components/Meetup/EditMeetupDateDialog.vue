<template>
  <v-layout row>
    <v-flex>
      <v-dialog v-model="dialog" persistent max-width="322px">
        <v-btn slot="activator">Change Date</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Edit Meetup Date</span>
          </v-card-title>
          <v-card-text>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" @click="saveDate" flat>Save</v-btn>
            </v-date-picker>
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
      date: moment(this.meetup.date).format('YYYY-MM-D'),
      time: moment(this.meetup.date)
    }
  },
  methods: {
    saveDate() {
      this.dialog = false
      let updatedDate = moment(this.date)
      updatedDate.hours(this.time.hours())
      updatedDate.minutes(this.time.minutes())

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
