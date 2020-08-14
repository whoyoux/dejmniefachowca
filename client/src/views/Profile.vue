<template>
  <b-container fluid>
    <!--<b-container v-if="!profile">
        <b-spinner variant="primary" label="Spinning" style="width: 5rem; height: 5rem;"></b-spinner>
    </b-container>-->

    <b-container>
      <b-container v-if="profile.message">
        <h3 style="color:red">{{profile.message}}</h3>
      </b-container>
      <b-badge v-if="profile.role === 'Admin' && !profile.message" variant="danger">Admin</b-badge>
      <b-container
        v-if="!profile.message"
        id="profile"
        :class="profile.role === 'Admin' ? 'admin_border' : 'member_border'"
      >
        <b-row>
          <b-col md="4" sm="12">
            <b-avatar size="4rem"></b-avatar>
          </b-col>
          <b-col md="4" sm="12">
            <h3>{{profile.first_name}} {{profile.last_name}}</h3>
          </b-col>
          <b-col md="4" sm="12"></b-col>
        </b-row>
        <h3>{{profile.isProfessional ? 'Fachowiec' : 'Użytkownik'}}</h3>
        <div>
          <h4>Ocena:</h4>
          <b-form-rating
            id="rating-10"
            readonly
            precision="2"
            v-model="profile.rates"
            stars="5"
            color="#ff8800"
            class="w-50 mx-auto"
          ></b-form-rating>
        </div>
        <h3>{{profile.city}}</h3>
        <h3 style="color: green" v-if="profile.isVerified">Zweryfikowany</h3>
        <h3 style="color: red" v-else>Niezweryfikowany</h3>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
export default {
  name: "Profile",
  data() {
    return {
      profile: {},
    };
  },
  beforeCreate() {
    axios
      .get(`http://localhost:3000/api/user/${this.$route.params.id}`)
      .then((data) => (this.profile = data.data))
      .catch((err) => console.log(err));
  },
  methods: {
    async reportUser() {
      const { value: formValues } = await Swal.fire({
        title: "Multiple inputs",
        html:
          '<input id="swal-input1" class="swal2-input">' +
          '<input id="swal-input2" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
          ];
        },
      });

      if (formValues) {
        Swal.fire(JSON.stringify(formValues));
      }
    },
  },
};
</script>

<style>
#profile {
  padding: 15px;
  border-radius: 13px;
}

.admin_border {
  border: 1px solid red;
}
.member_border {
  border: 1px solid #ccc;
}
</style>