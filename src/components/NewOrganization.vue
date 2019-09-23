<template>
  <div class="newOrganization">
    <b-container class="mt-5 d-flex justify-content-center">
      <b-col cols="5" >
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">

          <b-form-group id="input-group-2" label="Organization Name:" label-for="input-2">
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

export default {
  name: "newOrganization",
  data() {
    return {
      form: {
        name: "",
      },
      show: true
    };
  },
  beforeCreate: function () {
      Users.init()
    },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      let self = this
        if (typeof this.form.name !== 'undefined' && this.form.name !== '') {
          Users.create(this.form.name).then(tx => {
            self.$router.push('/')
          // this.$router.push({name: "dashboard"})
          }).catch(err => {
            console.log(err)
          })
        }
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>