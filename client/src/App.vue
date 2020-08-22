<template>
  <div id="app">
    <div id="nav">
      <div id="items">
        <router-link to="/">Strona główna</router-link>
        <router-link to="/login" v-if="!isLogged">Logowanie</router-link>
        <router-link to="/register">Rejestracja</router-link>
        <router-link to="/dashboard" v-if="isLogged">
          <b-icon icon="person" class="mr-2"></b-icon>Mój profil
        </router-link>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import VueJwtDecode from "vue-jwt-decode";
import { mapMutations, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      user: "",
    };
  },
  computed: {
    ...mapState(["isLogged"]),
  },
  methods: {
    ...mapMutations(["setLogged"]),
  },
  mounted() {
    if (localStorage.getItem("jwt")) {
      let token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(token);
      this.user = decoded;
      this.setLogged(true);
    } else {
      this.setLogged(false);
    }
  },
};
</script>
<style>
#app {
  text-align: center;
}

#nav {
  background: linear-gradient(0.25turn, var(--yellow), var(--orange));
  box-shadow: 0px 5px 20px -5px var(--orange);
  margin-bottom: 25px;
}
#items {
  padding: 30px;
  font-size: 22px;
}

#items a {
  color: rgb(255, 255, 255);
  font-weight: bold;
  /*color: #2c3e50; */
  margin-right: 15px;
}

#items a:hover {
  color: var(--gray-dark);
}

#nav a.router-link-exact-active {
  /*color: #42b983; */
  color: #ffee00;
}
</style>
