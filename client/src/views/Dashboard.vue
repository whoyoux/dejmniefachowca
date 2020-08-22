<template>
  <b-container fluid>
    <h4>
      Witamy
      <b>{{user.first_name}}</b>
    </h4>
    <h5>
      Swój profil możesz sprawdzić klikając
      <router-link :to="`/profile/${user._id}`">tutaj</router-link>
    </h5>
    <router-link to="/changeAvatar">
      <h5>Zmień swoje zdjęcie profilowe</h5>
    </router-link>
    <b-button variant="danger" @click="logOutUser">Wyloguj się</b-button>
  </b-container>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import Swal from "sweetalert2";
import { mapMutations } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      user: {},
    };
  },
  methods: {
    ...mapMutations(["resetUser", "setLogged"]),
    logOutUser() {
      this.resetUser();
      localStorage.removeItem("jwt");
      localStorage.removeItem("id");
      this.setLogged(false);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "warning",
        title: "Udało się wylogować!",
      });
      this.$router.push("/");
    },
    getUserDetails() {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
    },
  },
  created() {
    this.getUserDetails();
  },
};
</script>

<style>
</style>