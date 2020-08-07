<template>
  <div id="app">
    <div id="nav">
      <div id="items">
        <router-link to="/">Strona główna</router-link> |
        <router-link to="/dashboard">Mój profil</router-link> |
        <router-link to="/login">Logowanie</router-link> |
        <router-link to="/register">Register</router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>
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
}

#items a:hover {
  color: var(--gray-dark);
}

#nav a.router-link-exact-active {
  /*color: #42b983; */
  color: var(--orange);
}
</style>
