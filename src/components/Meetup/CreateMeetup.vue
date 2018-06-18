<template>
  <v-container>
    <v-layout :justify-center="true">
      <v-flex xs12 md9 lg8 xl6>
        <h2>Create New Meetup</h2>
      </v-flex>
    </v-layout>
    <v-layout :justify-center="true">
      <v-flex xs12 md9 lg8 xl6>
        <v-form ref="form" v-model="valid">
          <v-text-field v-model="title" :rules="titleRules" :counter="30" label="Title" name="title" required>
          </v-text-field>
          <v-text-field v-model="location" :rules="locationRules" label="Location" name="location" required></v-text-field>
          <v-layout row wrap class="pb-2">
            <!-- date menu -->
            <v-flex class="pt-3">
              <v-menu ref="dateMenu" :close-on-content-click="false" v-model="dateMenu" transition="scale-transition" :nudge-right="40" :return-value.sync="date">
                <v-text-field slot="activator" :value="onlyDate" label="Picker a date" prepend-icon="event" readonly></v-text-field>
                <v-layout>
                  <v-flex xs12>
                    <v-date-picker v-model="date" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-flex>
                </v-layout>
              </v-menu>
            </v-flex>
            <v-flex class="pt-3">
              <!-- time menu -->
              <v-menu ref="timeMenu" :close-on-content-click="false" v-model="timeMenu" transition="scale-transition" :nudge-right="40" :return-value.sync="time">
                <v-text-field slot="activator" :value="onlyTime" label="Picker a time" prepend-icon="access_time" readonly></v-text-field>
                <v-card>
                  <v-layout>
                    <v-flex xs12>
                      <v-time-picker :format="'24hr'" v-model="time">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="timeMenu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.timeMenu.save(time)">OK</v-btn>
                      </v-time-picker>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-alert v-model="isShowAlert" type="error" dismissible>
                Please upload a image or input image url
              </v-alert>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-radio-group v-model="radios" row :mandatory="false">
                <v-radio label="Upload image" value="upload"></v-radio>
                <v-radio label="Image Url" value="url"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs12>
              <div class="url-upload-wrapper">
                <v-text-field v-if="radios === 'url'" v-model="imageUrl" :rules="imageUrlRules" label="Image URL" name="image-url" required></v-text-field>
                <div v-if="radios === 'upload'">
                  <v-btn color="accent" @click="onPickFile">
                    <v-icon class="pr-2">cloud_upload</v-icon>
                    Upload Image
                  </v-btn>
                  <input v-show="false" type="file" @change="onFilePicked" required ref="fileInput" accept=".png, .jpg, .jpeg, .gif">
                </div>
              </div>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12 sm6 style="height: 100px;">
              <v-icon v-if="!thumbnail" size="100px">crop_original</v-icon>
              <img :src="thumbnail" height="100px">
            </v-flex>
          </v-layout>
          <v-layout class="pt-2 pb-2">
            <v-flex>
              <hr>
            </v-flex>
          </v-layout>
          <v-text-field rows="3" :multi-line="true" v-model="description" :rules="descriptionRules" label="Description" name="description" required></v-text-field>
          <v-layout>
            <v-flex class="text-xs-right">
              <small>*indicates required field</small>
            </v-flex>
          </v-layout>
          <v-btn :disabled="!valid" color="primary" @click="submit">
            Create
          </v-btn>
          <v-btn @click="clear" class="error">Clear</v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as moment from 'moment'

export default {
  data() {
    return {
      valid: true,
      title: '',
      titleRules: [
        v => !!v || 'Title is required',
        v => !!v && !!v.trim() || 'Title must not be white space',
        v => (v && v.length <= 30) || 'Title must be less than 10 characters'
      ],
      location: '',
      locationRules: [
        v => !!v || 'Location is required',
        v => !!v && !!v.trim() || 'Location must not be white space',
      ],
      imageUrl: '',
      imageUrlRules: [
        v => !!v || 'Image URL is required',
        v => !!v && !!v.trim() || 'Image URL must not be white space'
      ],
      image: null,
      description: '',
      descriptionRules: [
        v => !!v || 'Description is required',
        v => !!v && !!v.trim() || 'Description must not be white space'
      ],
      date: moment().format('YYYY-MM-D'),
      time: '00:00',
      radios: 'upload',
      uploadedImageUrl: '',
      isShowAlert: false,
      dateMenu: false,
      timeMenu: false

    }
  },
  computed: {
    dateAndTime() {
      let date = moment(this.date)
      let hours = this.time.match(/^\d+/)
      let minutes = this.time.match(/:\d+/)[0].match(/\d+/)
      date.hours(hours)
      date.minutes(minutes)

      return date
    },
    onlyDate() {
      return moment(this.dateAndTime).format('YYYY-MM-D')
    },
    onlyTime() {
      return moment(this.dateAndTime).format('HH:mm')
    },
    isAuthenticated() {
      return this.$store.getters.user
    },
    user() {
      return this.$store.getters.user
    },
    thumbnail() {
      if (this.radios === 'upload') {
        return this.uploadedImageUrl
      }
      if (this.radios === 'url') {
        this.isShowAlert = false
        return this.imageUrl
      }
    }
  },
  watch: {
    isAuthenticated(value) {
      if (!value) {
        this.$router.push('/')
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let newMeetup = {
          title: this.title.trim(),
          location: this.location.trim(),
          image: this.image,
          imageUrl: this.imageUrl.trim(),
          description: this.description.trim(),
          date: this.dateAndTime.toISOString(),
          creatorId: this.user.id
        }

        if (this.radios === 'upload') {
          newMeetup.imageUrl = null
        }
        if (this.radios === 'url') {
          newMeetup.image = null
        }

        if (!this.image && !this.imageUrl) {
          this.isShowAlert = true
          return
        }

        this.$store.dispatch('createMeetup', newMeetup)

        this.$router.push('/meetups')
      }
    },
    clear() {
      this.uploadedImageUrl = null
      this.date = moment().format('YYYY-MM-D HH:mm:ss')
      this.time = '00:00'
      this.isShowAlert = false
      this.$refs.form.reset()
      this.radios = 'upload'
    },
    onPickFile() {
      this.isShowAlert = false
      this.$refs.fileInput.click()
    },
    onFilePicked(event) {
      const file = event.target.files[0]
      let fileName = file.name
      let fileExt = fileName.substring(fileName.lastIndexOf('.'))

      // check file extension
      if (!this.checkIfImageFile(fileExt)) {
        alert('Please add a valid file')
        return
      }

      // generate embeded image url
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => this.uploadedImageUrl = fileReader.result)
      fileReader.readAsDataURL(file)

      // set raw image file
      this.image = file
    },
    checkIfImageFile(fileExt) {
      let acceptedExts = ['.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG', '.gif', '.GIF']
      let isValidFile = false

      for (const ext of acceptedExts) {
        if (fileExt === ext) {
          isValidFile = true
        }
      }
      return isValidFile
    }
  }
}
</script>

<style lang="scss" scoped>
  .url-upload-wrapper {
    height: 74px;
  }
</style>

