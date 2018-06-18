<template>
  <v-app>
    <v-navigation-drawer :disable-resize-watcher="true" v-model="sideNav" app>
      <v-list>
        <v-list-tile :to="item.link" @click="" v-for="(item, i) in menuItems" :key="i">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="onSignOut" v-if="isAuthenticated">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app dark class="primary">
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer;">Developer Meetup</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn :to="item.link" flat v-for="(item, i) in menuItems" :key="i">
          <v-icon class="pr-1">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-menu offset-y v-if="isAuthenticated" min-width="200">
          <v-btn slot="activator" flat style="text-transform: none;">
            <v-icon class="pr-1">account_circle</v-icon> {{ user.email }}
          </v-btn>
          <v-list>
            <v-list-tile to="/profile">
              Profile
            </v-list-tile>
            <v-list-tile to="/registered-meetups">
              My Registered Meetups
            </v-list-tile>
            <v-list-tile @click="onSignOut">
              <v-icon>power_settings_new</v-icon>
              <span class="pl-2">Sign Out</span>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-layout>
        <v-flex color="pink">
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import * as firebase from 'firebase'

export default {
  data() {
    return {
      sideNav: false,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.user
    },
    user() {
      return this.$store.getters.user
    },
    menuItems() {
      if (this.isAuthenticated) {
        return [
          { icon: 'supervisor_account', title: 'View meetups', link: '/meetups' },
          { icon: 'room', title: 'Organize meetup', link: '/meetups/new' },
          // { icon: 'person', title: 'Profile', link: '/profile' },
        ]
      } else {
        return [
          { icon: 'face', title: 'Sign up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign in', link: '/signin' },
        ]
      }

    }
  },
  methods: {
    onSignOut() {
      firebase.auth().signOut()
      this.$store.dispatch('signOut')
    }
  },
  name: 'App'
}
</script>
<style lang="scss" scoped>

</style>
