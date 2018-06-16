<template>
  <v-container>
    <v-layout>
      <v-flex class="text-xs-center pt-4">
        <v-progress-circular v-if="isLoading" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap :justify-center="true" v-if="!isLoading">
      <v-flex xs10 v-for="(item, i) in meetups" mb-3 :key="i">
        <v-card>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 md4>
                <v-card-media :src="item.imageUrl" height="150px"></v-card-media>
              </v-flex>
              <v-flex xs12 md8>
                <v-card-title>
                  <div>
                    <h3 class="headline mb-0">{{ item.title }}</h3>
                    <h3 class="accent--text">{{ item.date | date }}</h3>
                    <div>{{ item.description }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn large flat color="primary" :to="{name: 'Meetup' , params: {id: item.id } }">
                    View Detail
                    <v-icon class="pl-2">arrow_forward</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
export default {
  computed: {
    meetups() {
      return this.$store.getters.loadedMeetups
    },
    isLoading() {
      return this.$store.getters.loading
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
