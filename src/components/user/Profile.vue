<template>
  <v-container>
    <v-layout>
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap :justify-center="true" v-if="!isLoading">
      <v-flex xs12 sm10 md8>
        <v-card class="pa-4 main-card">
          <v-layout row wrap>
            <v-flex xs12 class="text-xs-center">
              <v-icon class="user-icon">account_circle</v-icon>
            </v-flex>
            <v-flex xs12 class="text-xs-center pt-3">
              <span class="headline pl-2">{{ user.email }}</span>
            </v-flex>
          </v-layout>
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
    meetups() {
      return this.$store.getters.loadedMeetups
    }
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-icon{
  font-size: 200px;
}

.main-card{
  height: 600px !important;
}
</style>

