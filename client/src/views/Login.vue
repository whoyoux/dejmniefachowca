<template>
  <b-container fluid>
    <b-container v-if="!logged">
        <h1>Login</h1>
        <b-form @submit.prevent="loginUser">

            <!--<h4 style="color: red" v-if="error">{{error}}</h4> -->

            <b-form-group
                id="input-group-email"
                label="Adres email:"
                label-for="input-email"
                description="Spokojnie, nikomu nie pokażemy twojego adresu email."
            >
                <b-form-input
                    id="input-email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Adres email"
            ></b-form-input>

            </b-form-group>

            <b-form-group
                id="input-group-pass"
                label="Hasło:"
                label-for="input-pass"
            >
                <b-form-input
                    id="input-pass"
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="Hasło"
            ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="success">Zaloguj się!</b-button>
            <b-button type="button" variant="danger" to="/register" class="ml-2">Utwórz konto!</b-button>
        </b-form>
    </b-container>
      
  </b-container>
</template>

<script>
import axios from 'axios';
import {mapMutations} from 'vuex';
export default {
    name: 'Login',
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            error: '',
            logged: false
        }
    },
    created() {
        this.error = "";
        if(localStorage.getItem("jwt")) {
            this.logged = true;
        } else {
            this.logged = false;
        }
    },
    methods: {
        ...mapMutations(['setUser']),
        async loginUser() {
            
            try {
                let response = await axios.post("http://localhost:3000/api/user/login", this.form);
                let token = response.data.token;
                localStorage.setItem("jwt", token);
                if(token) {
                    // Swal
                    //console.log('Udane logowanie!')
                    //await this.setUser(response.data);
                    localStorage.setItem("id", response.data.user._id);
                    await this.setUser(response.data);
                        this.$bvToast.toast('Logowanie udane! /Przechodze na stronę główną/', {
                        title: 'Logowanie',
                        variant: 'success',
                        autoHideDelay: 5000,
                        appendToast: false
                    })
                    this.$router.push('/dashboard');
                }
            } catch(err) {
                console.log("Error! " + err);
                this.error = "Błędne dane do logowania!"
                this.$bvToast.toast('Błędny email lub hasło!', {
                    title: 'Logowanie',
                    variant: 'danger',
                    autoHideDelay: 5000,
                    appendToast: false
                })
            }
        }
    }
}
</script>

<style>

</style>