<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title is-1">My Integer</h1>

        <a v-if="isLoading" class="button is-info is-loading is-fullwidth"></a>

        <div class="columns is-vcentered">
          <div class="column is-one-fifth">
            <p class="" style="font-size: 8rem;">{{ currentInteger }}</p>
          </div>
          <div class="column is-one-third">
            <div class="field">
              <a class="button is-primary is-fullwidth" id="" v-on:click="fetchNextInteger()">Next Integer</a>
            </div>
            <div class="field has-addons">
              <div class="control is-expanded">
                <input class="input" type="number" min="0" step="1" placeholder="Reset integer" v-model="resetValue">
              </div>
              <div class="control">
                <a class="button is-primary" v-on:click="fetchCurrentWithReset()">
                    Reset
                </a>
              </div>
            </div>
            <article class="message is-danger is-hidden" id="reset-response-message">
              <div class="message-body" id="reset-response-errors"></div>
            </article>
          </div>
          <div class="column">
          </div>
        </div>
      </div>
    </section>
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

    if (result != true) {
      this.$router.push("login");
    }

    this.fetchCurrentInteger();
  },
  data: function() {
    return {
      currentInteger: 0,
      resetValue: null,
      isLoading: false,
      isUpdating: false
    };
  },
  methods: {
    resetErrorMessage: function() {
      var resetResponseMessage = document.getElementById('reset-response-message');
      if (!resetResponseMessage.classList.contains("is-hidden")) {
        resetResponseMessage.classList.add("is-hidden");
      }
    },
    fetchCurrentInteger: function() {
      let vm = this;

      vm.resetErrorMessage();

      vm.$http
        .get("/v1/current", {
          headers: { Authorization: "Bearer " + vm.$userData.token }
        })
        .then(response => {
          vm.currentInteger = response.data.data.current_integer;
        })
        .catch(error => {
          console.debug("Failed to fetch current integer");
          console.debug(error.status);
          console.debug(error.statusText);
          console.debug(error.response.data);
        });
    },
    fetchNextInteger: function() {
      let vm = this;

      vm.resetErrorMessage();

      vm.$http
        .get("/v1/next", {
          headers: { Authorization: "Bearer " + vm.$userData.token }
        })
        .then(response => {
          vm.currentInteger = response.data.data.current_integer;
        })
        .catch(error => {
          console.debug("Failed to fetch net integer");
          console.debug(error.status);
          console.debug(error.statusText);
          console.debug(error.response.data);
        });
    },
    fetchCurrentWithReset: function() {
      let vm = this;

      vm.resetErrorMessage();

      if(vm.resetValue == null) {
        return;
      }

      vm.$http
        .put("/v1/current", {
            current: parseInt(vm.resetValue)
          }, {
          headers: { Authorization: "Bearer " + vm.$userData.token }
        })
        .then(response => {
          vm.currentInteger = response.data.data.current_integer;
        })
        .catch(error => {
          var resetResponseMessage = document.getElementById('reset-response-message');
          var resetErrors = document.getElementById("reset-response-errors");
          // Build list of errors
          var errors = "";
          if(typeof error.response.data.errors !== 'undefined' && error.response.data.errors !== null) {
            Object.keys(error.response.data.errors).forEach(function(k) {
              errors += error.response.data.errors[k] + "<br/>";
            });
          } else {
            errors += error.response.data.message + "<br/>";
          }
          if(errors.length > 0) {
            resetErrors.innerHTML = errors;
            if (resetResponseMessage.classList.contains("is-hidden")) {
              resetResponseMessage.classList.remove("is-hidden");
            }
          } else {
            if (!resetResponseMessage.classList.contains("is-hidden")) {
              resetResponseMessage.classList.add("is-hidden");
            }
          }
        });
    }
  }
};
</script>