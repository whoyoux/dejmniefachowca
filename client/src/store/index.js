import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      first_name: "",
      last_name: "",
      email: "",
      city: "",
      street: "",
      voivodeship: "",
      phone_number: "",
      reviews: [],
      rates: "",
      created_date: "",
      isVerified: "",
      role: "",
      profession: "",
    },
    PROFESSION: {
      plumber: "Hydraulik",
      handyman: "Złota rączka",
    },
    isLogged: false,
  },
  mutations: {
    setUser(state, data) {
      state.user.id = data.id;
      state.user.first_name = data.first_name;
      state.user.last_name = data.last_name;
      state.user.email = data.email;
      state.user.city = data.city;
      state.user.street = data.street;
      state.user.voivodeship = data.voivodeship;
      state.user.phone_number = data.phone_number;
      state.user.reviews = data.reviews;
      state.user.rates = data.rates;
      state.user.created_date = data.created_date;
      state.user.isVerified = data.isVerified;
      state.user.role = data.role;
      state.user.role = data.profession;
    },
    resetUser(state) {
      state.user.id = "";
      state.user.first_name = "";
      state.user.last_name = "";
      state.user.email = "";
      state.user.city = "";
      state.user.street = "";
      state.user.voivodeship = "";
      state.user.phone_number = "";
      state.user.reviews = [];
      state.user.rates = "";
      state.user.created_date = "";
      state.user.isVerified = "";
      state.user.role = "";
      state.user.role = "";
    },
    setLogged(state, bool) {
      state.isLogged = bool;
    },
  },
  actions: {},
  modules: {},
});
