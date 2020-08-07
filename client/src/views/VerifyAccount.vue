<template>
    <b-container>
        <h2>Weryfikacja konta.</h2>
        <h3>Proszę wpisać kod, który został wysłany na podany email</h3>
        <h4 style="color:red" v-if='error'>{{error}}</h4>
        <b-form-input type="number" v-model="verify_code" id="input_verify" placeholder="np. 997997"/>
        <b-button type="button" variant="success" class="mt-2" @click="verifyAccount">Zweryfikuj mnie!</b-button>
    </b-container>
</template>

<script>
import {mapState} from 'vuex';
import axios from 'axios';
export default {
    name: 'VerifyAccount',
    computed: {
        ...mapState(['user'])
    },
    data() {
        return {
            verify_code: '',
            error: ''
        }
    },
    methods: {
        async verifyAccount() {
            try {
                if(this.verify_code.trim() === ''|| this.verify_code.length < 6 || this.verify_code.length > 6) {
                    this.error = 'Błędny kod, albo konto zostało wcześniej aktywowane!'
                    return;
                }
                if(localStorage.getItem('jwt')) {
                    const axios_config = {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`
                        }
                    }
                    let response = await axios.post('http://localhost:3000/api/user/verify', {id: localStorage.getItem('id'), verify_code: this.verify_code}, axios_config);
                    this.$router.push('/dashboard');
                    console.log(response.data);
                    
                } else {
                    console.log('Nie udalo sie wyslac! Brak tokenu!')
                }
                
                
            } catch(err) {
                console.log(err);
                this.error = 'Błędny kod, albo konto zostało wcześniej aktywowane!'
            }
        }
    }
}
</script>

<style>

</style>