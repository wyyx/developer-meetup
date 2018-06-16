<template>
  <v-container>
    <v-layout v-if="isLoading">
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout justify-center row v-if="!isLoading">
      <v-flex xs12>
        <v-card>
          <v-card-title primary-title>
            <div>
              <div class="display-2">{{ meetup.title }}</div>
              <span class="grey--text">1,000 miles of wonder</span>
            </div>
            <template>
              <v-spacer></v-spacer>
              <AppEditMeetupDialog v-if="isCreator" :meetup="meetup"></AppEditMeetupDialog>
            </template>
          </v-card-title>
          <v-card-media :src="meetup.imageUrl" height="600px"></v-card-media>
          <v-card-text>
            <h3 class="primary--text">{{ meetup.date | date }} - {{ meetup.location }}</h3>
            <p>{{ meetup.description }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn large color="primary">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AppEditMeetupDialog from '@/components/Meetup/EditMeetupDialog'
export default {
  components: {
    AppEditMeetupDialog
  },
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetup(this.$route.params.id)
    },
    isLoading() {
      return this.$store.getters.loading
    },
    user() {
      return this.$store.getters.user
    },
    isCreator() {
      return !!this.user && this.user.id === this.meetup.creatorId
    }

  }
}
</script>

<style lang="scss" scoped>
.edit-btn .btn__content{
  line-height: 56px;
}
</style>
