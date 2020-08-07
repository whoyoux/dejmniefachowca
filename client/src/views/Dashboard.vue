<template>
  <b-container fluid>
      <h4>Witamy <b>{{user.first_name}}</b></h4>
      <h5>Swój profil możesz sprawdzić klikając <router-link :to="`/profile/${user._id}`">tutaj</router-link></h5>
      <router-link to="/changeAvatar"><h5>Zmień swoje zdjęcie profilowe</h5></router-link>
      <b-button variant="danger" @click="logOutUser">Wyloguj się</b-button>
  </b-container>
</template>

<script>
import VueJwtDecode from 'vue-jwt-decode';
import {mapMutations} from 'vuex';
export default {
    name: 'Dashboard',
    data() {
        return {
            user: {}
        }
    },
    methods: {
        ...mapMutations(['resetUser']),
        logOutUser() {
            this.resetUser();
            localStorage.removeItem("jwt");
            localStorage.removeItem("id");
            this.$router.push("/");
        },
        getUserDetails() {
            let token = localStorage.getItem("jwt");
            let decoded = VueJwtDecode.decode(token);
            this.user = decoded;
        }
    },
    created() {
        this.getUserDetails();
    }
}
</script>

<style>

</style>