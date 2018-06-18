<template>
  <v-layout row>
    <v-flex class="text-xs-right">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-btn fab slot="activator">
          <v-layout>
            <v-flex>
              <v-icon dark>edit</v-icon>
            </v-flex>
          </v-layout>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Edit Meetup</span>
          </v-card-title>
          <v-form ref="form" v-model="valid">
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field v-model="title" :rules="titleRules" :counter="50" label="Title" name="title" required>
                  </v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field v-model="location" :rules="locationRules" label="Location" name="location" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field rows="3" :multi-line="true" v-model="description" :rules="descriptionRules" label="Description" name="description" required></v-text-field>
                </v-flex>
              </v-layout>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" :disabled="!valid" @click="submit" flat>Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['meetup'],
  data() {
    return {
      dialog: false,
      valid: true,
      title: this.meetup.title,
      titleRules: [
        v => !!v || 'Title is required',
        v => !!v && !!v.trim() || 'Title must not be white space',
        v => (v && v.length <= 50) || 'Title must be less than 50 characters'
      ],
      location: this.meetup.location,
      locationRules: [
        v => !!v || 'Location is required',
        v => !!v && !!v.trim() || 'Location must not be white space'
      ],
      description: this.meetup.description,
      descriptionRules: [
        v => !!v || 'Description is required',
        v => !!v && !!v.trim() || 'Location must not be white space'
      ]
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.dialog = false

        let updateMeetupData = {
          id: this.meetup.id,
          title: this.title.trim(),
          location: this.location.trim(),
          description: this.description.trim(),
        }
        this.$store.dispatch('updateMeetup', updateMeetupData)
      }
    },
    clear() {
      this.$refs.form.reset()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
