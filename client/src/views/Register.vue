<template>
  <b-container fluid>
    <b-container v-if="show">
        <h1>Rejestracja</h1>
        <b-form @submit.prevent="registerUser">
            <h4 style="color: red" v-if="error">{{error}}</h4>
            
            <b-form-group
                id="input-group-firstname"
                label="Imię:"
                label-for="input-firstname"
            >
                <b-form-input
                    id="input-firstname"
                    v-model="form.first_name"
                    type="text"
                    required
                    placeholder="Imię"
            ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-lastname"
                label="Nazwisko:"
                label-for="input-lastname"
            >
                <b-form-input
                    id="input-lastname"
                    v-model="form.last_name"
                    type="text"
                    required
                    placeholder="Nazwisko"
            ></b-form-input>
            </b-form-group>

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
                    :state="pass_validation"
            ></b-form-input>
            <b-form-invalid-feedback :state="pass_validation">
                Hasło musi mieć od 5 do 15 znaków i muszą się zgadzać!
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="pass_validation">
                Hasło jest w porządku!
            </b-form-valid-feedback>
            </b-form-group>

            <b-form-group
                id="input-group-pass2"
                label="Potwierdź hasło:"
                label-for="input-pass2"
            >
                <b-form-input
                    id="input-pass2"
                    v-model="password2"
                    type="password"
                    required
                    placeholder="Potwierdź hasło"
                    :state="pass_validation"
            ></b-form-input>
            <b-form-invalid-feedback :state="pass_validation">
                Hasło musi mieć od 5 do 15 znaków i muszą się zgadzać!
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="pass_validation">
                Hasło jest w porządku!
            </b-form-valid-feedback>
            </b-form-group>

            <b-form-group
                id="input-group-phone-number"
                label="Numer telefonu:"
                label-for="input-phone-number"
            >
                <b-form-input
                    id="input-phone-number"
                    v-model="form.phone_number"
                    type="number"
                    required
                    placeholder="997997997"
            ></b-form-input>
            </b-form-group>

            <b-form-group label="Typ użytkownika">
                <b-form-radio-group
                    v-model="form.isProfessional"
                    :options="professional_options"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                ></b-form-radio-group>
            </b-form-group>

            

            <b-form-group id="input-group-profession" label="Profesja:" label-for="input-profession" v-if="form.isProfessional">
                <b-form-select
                    id="input-profession"
                    v-model="form.profession"
                    :options="PROFESSION"
                    required
                ></b-form-select>
            </b-form-group>

            <b-form-group
                id="input-group-city"
                label="Miejscowość:"
                label-for="input-city"
            >
                <b-form-input
                    id="input-city"
                    v-model="form.city"
                    type="text"
                    required
                    placeholder="Miejscowość"
            ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-street"
                label="Ulica z numerem domu/mieszkania:"
                label-for="input-street"
            >
                <b-form-input
                    id="input-street"
                    v-model="form.street"
                    type="text"
                    required
                    placeholder="Ulica z numerem domu/mieszkania"
            ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-voivodeship"
                label="Województwo:"
                label-for="input-voivodeship"
            >
                <b-form-input
                    id="input-voivodeship"
                    v-model="form.voivodeship"
                    type="text"
                    required
                    placeholder="np. mazowieckie"
            ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-date-birth"
                label="Podaj datę urodzenia:"
                label-for="input-date-birth"
            >
                <b-form-datepicker id="input-date-birth" v-model="form.date_birth" class="mb-2" :min="minDate" :max="maxDate"></b-form-datepicker>
            </b-form-group>

            <b-form-checkbox class="mt-3 mb-3" v-model="accept">Akceptuje regulamin</b-form-checkbox>

            <b-button type="submit" variant="success">Utwórz konto!</b-button>
        </b-form>
    </b-container>
      
  </b-container>
</template>

<script>
import axios from 'axios';
import {mapMutations, mapState} from 'vuex';
export default {
    name: 'Register',
    data() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const minDate = new Date(today);
        minDate.setFullYear(minDate.getFullYear() - 70);

        const maxDate = new Date(today);
        maxDate.setFullYear(maxDate.getFullYear() - 18);


        return {
            form: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                isProfessional: false,
                profession: 'none',
                city: '',
                street: '',
                voivodeship: '',
                date_birth: '',
                phone_number: ''
            },
            password2: '',
            minDate: minDate,
            maxDate: maxDate,
            show: true,
            professional: '',
            professional_options: [
                {item: false, name: 'Użytkownik'},
                {item: true, name: 'Fachowiec'}
            ],
            accept: false,
            error: ''
        }
    },
    computed: {
        ...mapState(['PROFESSION']),
        pass_validation() {
            return this.form.password.length >= 5 && this.form.password.length < 15 && this.form.password === this.password2
        }
    },
    mounted() {
        this.resetForm();
        this.error = '';
    },
    methods: {
        ...mapMutations(['setUser']),
        async registerUser() {
            if(this.accept == false) {
                this.error = "Proszę zaakceptować regulamin";
                return;
            }
            if(isNaN(this.form.isProfessional)) {
                this.error = 'Proszę wybrać typ użytkownika.';
                return;
            }
            try {
                let response = await axios.post("http://localhost:3000/api/user/register", this.form);
                let token = response.data.token;
                if(token) {
                    localStorage.setItem("jwt", token);
                    this.$router.push("/");
                    // Swal.fire Udane logowanie!
                    // mozna tez uzyc vue notify czy cos takiego
                    //console.log('Udana rejestracja!');
                    //this.setUser(response.data);
                } else {
                    //Swal.fire Nieudane logowanie!
                    console.log('Nieudana rejestracja!');
                }
            } catch(err) {
                console.log('Error! ' + err);
                
            }
        },
        resetForm() {
            this.first_name = '';
            this.last_name = '';
            this.email = '';
            this.password = '';
            this.password2 = '';
            this.isProfessional = false;
            this.city = '';
            this.street = '';
            this.voivodeship = '';
            this.date_birth = '';
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            })
        }
    }
}
</script>

<style>

</style>