<template>
  <div>
    <form @submit.prevent="uploadPhoto" enctype="multipart/form-data">
      <h4>Zmiana avatara</h4>
      <input type="file" @change="onFileSelected" />
      <b-button variant="success" @click="uploadPhoto">Zmień zdjęcie profilowe!</b-button>
    </form>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import axios from "axios";
export default {
  name: "ChangeAvatar",
  data() {
    return {
      user: {},
      avatar: null,
    };
  },
  created() {
    let token = localStorage.getItem("jwt");
    let decoded = VueJwtDecode.decode(token);
    this.user = decoded;
  },
  methods: {
    onFileSelected(event) {
      this.avatar = event.target.files[0];
    },
    async uploadPhoto() {
      if (this.avatar === null) return;
      const fd = new FormData();
      fd.append("avatar", this.avatar);
      console.log(fd);
      try {
        let response = await axios.post(
          "http://localhost:3000/api/user/uploadAvatar",
          fd,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
</style>