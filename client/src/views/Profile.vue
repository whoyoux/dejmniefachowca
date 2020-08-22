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
        <a href="#">
          <h5 @click="reportUser">Zgłoś użytkownika</h5>
        </a>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
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
      Swal.mixin({
        input: "select",
        confirmButtonText: "Dalej &rarr;",
        showCancelButton: true,
        inputOptions: {
          Profil: {
            bad_name: "Niewłaściwa nazwa",
            fake_account: "Nieprawdziwe konto",
            cheat: "Oszukiwanie",
          },
        },
        progressSteps: ["1", "2"],
      })
        .queue([
          {
            title: "Zgłaszanie użytkownika",
            text: "Wybierz typ zgłoszenia",
          },
          {
            input: "textarea",
            title: "Zgłaszanie użytkownika",
            text: "Powiedz nam więcej o tej sprawie",
            confirmButtonText: "Wyślij zgłoszenie!",
          },
        ])
        .then((result) => {
          if (result.value) {
            axios
              .post("http://localhost:3000/api/report", {
                userTo: this.$route.params.id,
                userFrom: VueJwtDecode.decode(localStorage.getItem("jwt"))._id,
                title: result.value[0],
                desc: result.value[1],
              })
              .then(() => {
                Swal.fire({
                  icon: "success",
                  title: "Udało się!",
                  text: "Zgłoszenie zostało wysłane! Zaraz się tym zajmiemy!",
                });
              })
              .catch(() => {
                Swal.fire({
                  icon: "error",
                  title: "Nieudało się!",
                  text: "Coś poszło źle! Prosze spróbować ponownie poźniej!",
                });
              });
          }
        });
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