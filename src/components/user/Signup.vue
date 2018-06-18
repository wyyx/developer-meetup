<template>
  <v-container>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-alert v-model="isShowAlert" type="error" dismissible>
          {{ error? error.message : '' }}
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout justify-center>
      <v-flex xs12 sm8 md6 lg4>
        <v-card class="elevation-12">
          <v-card-title>
            <h1 class="headline">Sign up</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field prepend-icon="person" v-model="email" :rules="emailRules" label="Email" name="email" required></v-text-field>
              <v-text-field prepend-icon="lock" type="password" v-model="password" :rules="passwordRules" label="Password" name="password" required></v-text-field>
              <v-text-field prepend-icon="lock" type="password" v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm Password" name="confirmPassword" required></v-text-field>
              <div class="text-xs-center">
                <v-btn large :disabled="!valid" color="primary" @click="submit" :loading="isLoading">
                  Submit
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => {
          let regex = RegExp(/^([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]+.[a-zA-Z0-9-]{2,}){1,255}){1,320}$/)
          if (v && !regex.test(v)) {
            return 'Email address is not valid'
          }
          return true
        }
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be greater than 6 characters'
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        v => (v && v === this.password) || 'Confirm password is not equal to password'
      ],
      isShowAlert: false,
    }
  },
  computed: {
    isLoading() {
      return this.$store.getters.loading
    },
    error() {
      let error = this.$store.getters.error
      error ? this.isShowAlert = true : this.isShowAlert = false

      return error
    },
    isAuthenticated() {
      return this.$store.getters.user
    }
  },
  watch: {
    isAuthenticated(value) {
      if (value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let newUser = {
          email: this.email,
          password: this.password,
        }
        console.log(newUser)
        this.$store.dispatch('createUser', newUser)

      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

