<template>
  <v-container>
    <v-layout wrap class="pb-2">
      <v-flex xs12 md6 class="text-xs-center text-md-right">
        <v-btn to="/meetups" large class="accent">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 md6 class="text-xs-center text-md-left">
        <v-btn to="/meetups/new" large class="accent">Organize Meetup</v-btn>
      </v-flex>
      <v-flex md6></v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout wrap v-if="!isLoading">
      <v-flex sm12>
        <v-carousel :hide-delimiters="true" style="cursor: pointer;">
          <v-carousel-item v-for="(item, i) in meetups" :src="item.imageUrl" :key="i">
            <v-container @click="toMeetup(item.id)">
              <v-layout>
                <v-flex>
                  <div class="carousel-title text-xs-center white--text">
                    <h1 class="display-3">
                      {{ item.title }}
                    </h1>
                    <h3 class="headline">Find Awesome People</h3>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    meetups() {
      return this.$store.getters.featuredMeetups
    },
    isLoading() {
      return this.$store.getters.loading
    }
  },
  methods: {
    toMeetup(id) {
      this.$router.push('/meetups/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-title{
    padding-top: 200px;
}
</style>
