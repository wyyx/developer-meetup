<template>
  <v-container>
    <v-layout v-if="isLoading">
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout justify-center class="pt-4" v-if="!isLoading">
      <v-flex xs12 sm10 md8>
        <v-card>
          <v-card-title class="meetup-list-title grey lighten-3 subheading" primary-title>
            My Registered Meetup
          </v-card-title>
          <v-list two-line>
            <template v-for="(meetup, index) in registeredMeetups">
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{meetup.title}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{meetup.date | date}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn flat class="accent--text" :to="{name: 'Meetup' , params: {id: meetup.id } }">View</v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index < registeredMeetups.length -1 "></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    isLoading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.user
    },
    user() {
      return this.$store.getters.user
    },
    registeredMeetups() {
      let meetups = this.$store.getters.loadedMeetups
      let registeredMeetupIds = this.user.registeredMeetups
      let registeredMeetups = []

      registeredMeetups = meetups.filter(meetup =>
        registeredMeetupIds.find(id => id === meetup.id)
      )

      return registeredMeetups
    }
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.$router.push('/')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.meetup-list-title{
  box-shadow:0px -2px 2px -2px rgba(0,0,0,0.2) !important;
  border-bottom: 1px solid #d7d7d7 !important;
  font-weight: 500;
}
</style>
