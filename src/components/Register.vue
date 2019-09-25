<template>
  <div class="register">
    <b-container class="mt-5 d-flex justify-content-center">
      <b-col cols="5">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
            <b-form-input id="input-2" v-model="form.name" required placeholder="Enter name"></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </b-col>
    </b-container>
  </div>
</template>

<script>
import Users from '@/js/users'
import userService from '@/services/userService'

export default {
  name: "register",
  data() {
    return {
      form: {
        name: "",
      },
      show: true
    };
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      if (typeof this.form.name !== 'undefined' && this.form.name !== '') {
           await userService.createUser(this.form.name);
            this.$router.push('/');
      }
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.name = "";
    }
  }
};
</script>