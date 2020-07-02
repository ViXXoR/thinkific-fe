<template>
  <div id="app">

    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <!--<a class="navbar-item">
          <img src="images/neomo-logo-resize.jpeg"  height="32">
        </a>-->

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="ii-navbar" v-on:click="toggleNavHamburger()">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="ii-navbar" class="navbar-menu">
        <div class="navbar-start">

          <a v-if="$userData.token == ''" class="navbar-item">
            <router-link to='/'>Incrementing Integers</router-link>
          </a>
          <a v-if="$userData.token == ''" class="navbar-item">
            <router-link to='/login'>Login</router-link>
          </a>

          <a v-if="$userData.token != ''" class="navbar-item">
            <router-link to='/'>Manage My Integer</router-link>
          </a>
          
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a v-if="$userData.token != ''" class="button is-light" v-on:click="logout()">
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
/*
 * Copyright (C) 2020, Matthew Livingstone
 * All rights reserved.
 */

export default {
    mounted() {
      var result = this.$checkCredentials();

      if (result == true) {
        // Force digest to update navbar
        this.doUpdate();
      }
    },
    watch: {
      '$route' (to, from) {
        if(to && from) {
          console.debug("route transition");
        }
        this.closeNavHamburger();
      }
    },
    methods: {
        logout: function() {
            localStorage.userData = null;

            this.$router.push('login');
        },
        doUpdate: function() {
          this.$forceUpdate();
        },
        toggleNavHamburger: function() {
          document.querySelector('.navbar-menu').classList.toggle('is-active');
        },
        closeNavHamburger: function() {
          var menu = document.querySelector('.navbar-menu');
          if (menu.classList.contains("is-active")) {
            menu.classList.remove("is-active");
          }
        }
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
