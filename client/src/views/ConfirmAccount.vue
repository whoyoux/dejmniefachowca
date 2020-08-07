<template>
  <b-container fluid>
        <h1>Potwiedzanie konta</h1>
        <h3 style="color:red" v-if="error">{{error}}</h3>
        <b-form-input
            id="input-email"
            v-model="form.email"
            type="email"
            required
            placeholder="np. jan@kowalski.pl"
        ></b-form-input>
        <b-button variant="success" @click="confirm()">Potwierdź konto!</b-button>
  </b-container>
</template>

<script>
import axios from 'axios';
export default {
    name: 'ConfirmAccount',
    data() {
        return {
            form: {
                email: '',
                confirmToken: this.$route.params.confirmToken
            },
            error: ''
        }
    },
    methods: {
        confirm() {
            axios.post('http://localhost:3000/api/user/confirmAccount/', this.form)
                .then(() => {
                    this.$router.push("/");
                })
                .catch((err) => {
                    console.log(err)
                    this.error="Konto zostało już wcześniej potwierdzone, albo token wygasł!"
                });
        }
    }
}
</script>

<style>

</style>