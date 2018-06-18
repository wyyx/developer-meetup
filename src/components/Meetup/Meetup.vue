<template>
  <v-container>
    <v-layout v-if="isLoading">
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout justify-center row>
      <v-flex xs12 sm10 md8>
        <v-alert v-model="isShowAlert" type="error">
          Not exist! This meetup maybe already have been deleted.
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout justify-center row v-if="!isLoading && meetup">
      <v-flex xs12 sm10>
        <v-card>
          <v-card-title primary-title>
            <div>
              <div class="display-2">{{ meetup.title }}
              </div>
              <span class="grey--text">1,000 miles of wonder</span>
            </div>
            <template>
              <v-spacer></v-spacer>
              <AppEditMeetupDialog v-if="isCreator" :meetup="meetup"></AppEditMeetupDialog>
            </template>
          </v-card-title>
          <v-card-media :src="meetup.imageUrl" height="400px"></v-card-media>
          <v-card-text>
            <h3 class="primary--text">{{ meetup.date | date }} - {{ meetup.location }}</h3>
            <v-layout class="pt-1 pb-1">
              <v-flex style="flex:0 0 auto">
                <AppEditMeetupDateDialog v-if="isCreator" :meetup="meetup"></AppEditMeetupDateDialog>
              </v-flex>
              <v-flex style="flex:0 0 auto">
                <AppEditMeetupTimeDialog v-if="isCreator" :meetup="meetup"></AppEditMeetupTimeDialog>
              </v-flex>
            </v-layout>
            <p>{{ meetup.description }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <AppConfirmRegisterDialog v-if="isAuthenticated" :meetup="meetup"></AppConfirmRegisterDialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AppEditMeetupDialog from '@/components/Meetup/EditMeetupDialog'
import AppEditMeetupDateDialog from '@/components/Meetup/EditMeetupDateDialog'
import AppEditMeetupTimeDialog from '@/components/Meetup/EditMeetupTimeDialog'
import AppConfirmRegisterDialog from '@/components/Meetup/ConfirmRegisterDialog'

export default {
  data() {
    return { isShowAlert: false }
  },
  components: {
    AppEditMeetupDialog,
    AppEditMeetupDateDialog,
    AppEditMeetupTimeDialog,
    AppConfirmRegisterDialog
  },
  computed: {
    meetup() {
      let meetup = this.$store.getters.loadedMeetup(this.$route.params.id)

      if (!this.isLoading && !meetup) {
        this.isShowAlert = true
      }
      return meetup
    },
    isLoading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.user
    },
    user() {
      return this.$store.getters.user
    },
    isCreator() {
      return this.user && this.user.id === this.meetup.creatorId
    },
    isRegistered() {
      return !!this.user.registeredMeetups.find(meetupId => meetupId === this.meetup.id)
    }
  },
  methods: {
    onResigter() {
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
.edit-btn .btn__content{
  line-height: 56px;
}


</style>
