<template>
  <div class="home">
    <b-container v-if="!isLogged">
      <h1 style="color:red">Proszę się zalogować, aby zobaczyć zawartość!</h1>
    </b-container>
    <!--<h3 style="color: var(--warning)">{{this.isLogged ? 'Zalogowany' : 'Nie zalogowany'}}</h3> -->
    <b-container fluid v-else>
      <h1>Home</h1>
    <b-container fluid>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
      <h1>jakas zawartosc</h1>
    </b-container>
    </b-container>
    
  </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
      return {
        isLogged: false
      }
    },
    mounted() {
      if(localStorage.getItem('jwt')) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    }
}
</script>
