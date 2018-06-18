<template>
  <v-layout row justify-end>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-btn slot="activator" large :color="isRegistered ? '' : 'primary'">{{ isRegistered? 'Unregister' : 'Register' }}
        <v-icon v-if="isRegistered" small color="success" class="pl-2">check_circle</v-icon>
      </v-btn>
      <v-card>
        <v-card-title class="headline">
          <span v-if="!isRegistered">Are you sure to register?</span>
          <span v-if="isRegistered">Are you sure to remove register?</span>
        </v-card-title>
        <v-card-text>
          You can change you mind later.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" @click="onResigter" flat>OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  props: ['meetup'],
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.user
    },
    user() {
      return this.$store.getters.user
    },
    isRegistered() {
      return !!this.user.registeredMeetups.find(meetupId => meetupId === this.meetup.id)
    }
  },
  methods: {
    onResigter() {
      this.dialog = false

      if (this.isRegistered) {
        this.$store.dispatch('unregisterMeetup', { id: this.meetup.id })
      } else {
        this.$store.dispatch('registerMeetup', { id: this.meetup.id })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
