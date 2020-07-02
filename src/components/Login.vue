<template>
    <section class="section">
        <div class="container" id="login-container">
            <h1 class="title">
                Welcome to the Incrementing API
            </h1>

            <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input" id="login-user" type="text" placeholder="" value="">
                    <span class="icon is-small is-left">
                        <font-awesome-icon icon="user" />
                    </span>
                </div>
                <p class="help is-danger is-hidden" id="login-user-help">
                    
                </p>
            </div>

            <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input" id="login-pass" type="password" placeholder="" value="">
                    <span class="icon is-small is-left">
                        <font-awesome-icon icon="lock" />
                    </span>
                </div>
                <p class="help is-danger is-hidden" id="login-pass-help">
                    
                </p>
            </div>

            <article class="message is-danger is-hidden" id="login-response-message">
                <div class="message-body" id="login-response-errors">
                    <!--Email and password do not match-->
                </div>
            </article>
            <a class="button is-primary is-fullwidth" id="login-button" v-on:click="attemptLogin()">Login</a>
            <div class="has-text-centered py-4">OR</div>
            <a class="button is-primary is-fullwidth" id="register-button" v-on:click="attemptLogin(true)">Register</a>
        </div>
    </section>
</template>
<script>

/*
 * Copyright (C) 2020, Matthew Livingstone
 * All rights reserved.
 */

export default {
  data: function() {
    return {
      iemail: '',
      ipassword: '',
    }
  },
  mounted() {
    var result = this.$checkCredentials();

    if(result == true) {
      console.debug("Credentials found");
      console.debug(this.$userData);
      this.$router.push({name: 'results'});
    } else {
      console.debug("No credentials found");
    }
  },
  methods: {
    LoginApiRequest: function(email, password, isRegistering) {
      let vm = this;
      let url = '';
      if(isRegistering) {
        url = '/v1/register';
      } else {
        url = '/v1/authenticate';
      }

      var loginButton = document.getElementById('login-button');
      var registerButton = document.getElementById('register-button');

      if(!loginButton.classList.contains('is-loading')) {
        loginButton.classList.add('is-loading');
      }
      if(!registerButton.classList.contains('is-loading')) {
        registerButton.classList.add('is-loading');
      }

      this.$http.post(url, {
        email: email,
        password: password
      })
      .then(response => {
        if(loginButton.classList.contains('is-loading')) {
          loginButton.classList.remove('is-loading');
        }
        if(registerButton.classList.contains('is-loading')) {
          registerButton.classList.remove('is-loading');
        }

        vm.$userData.token = response.data.data.auth_token;

        localStorage.userData = JSON.stringify(vm.$userData);

        this.$router.push({name: 'my-integer'});
      })
      .catch(error => {
        var loginResponseMessage = document.getElementById('login-response-message');

        if(loginButton.classList.contains('is-loading')) {
          loginButton.classList.remove('is-loading');
        }
        if(registerButton.classList.contains('is-loading')) {
          registerButton.classList.remove('is-loading');
        }

        var submitErrors = document.getElementById("login-response-errors");
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
          submitErrors.innerHTML = errors;
          if (loginResponseMessage.classList.contains("is-hidden")) {
            loginResponseMessage.classList.remove("is-hidden");
          }
        } else {
          if (!loginResponseMessage.classList.contains("is-hidden")) {
            loginResponseMessage.classList.add("is-hidden");
          }
        }
      });
    },
    attemptLogin: function(isRegistering = false) {
      var userHelp = document.getElementById('login-user-help');
      var passHelp = document.getElementById('login-pass-help');

      var emailElement = document.getElementById('login-user');
      var passwordElement = document.getElementById('login-pass');
      var loginResponseMessage = document.getElementById('login-response-message');

      // Reset visual state
      if (!userHelp.classList.contains('is-hidden')) {
        userHelp.classList.add('is-hidden');
      }
      if(emailElement.classList.contains('is-danger')) {
        emailElement.classList.remove('is-danger');
      }
      if (!passHelp.classList.contains('is-hidden')) {
        passHelp.classList.add('is-hidden');
      }
      if(passwordElement.classList.contains('is-danger')) {
        passwordElement.classList.remove('is-danger');
      }
      if(!loginResponseMessage.classList.contains('is-hidden')) {
        loginResponseMessage.classList.add('is-hidden');
      }


      // Get credentials
      var email = emailElement.value;
      var password = passwordElement.value;

      // Validation
      var emailError = "";
      var passwordError = "";
      if(email.length <= 0) {
        emailError = "Email is required";
      }

      if(password.length <= 0) {
        passwordError = "Password is required";
      }

      // Show errors
      if(emailError.length > 0) {
        document.getElementById('login-user-help').innerHTML = emailError;

        // Show error message
        if (userHelp.classList.contains('is-hidden')) {
          userHelp.classList.remove('is-hidden');
        }

        // Highlight email box
        if(!emailElement.classList.contains('is-danger')) {
          emailElement.classList.add('is-danger');
        }
      }

      if(passwordError.length > 0) {
        document.getElementById('login-pass-help').innerHTML = passwordError;

        // Show error message
        if (passHelp.classList.contains('is-hidden')) {
          passHelp.classList.remove('is-hidden');
        }

        // Highlight password box
        if(!passwordElement.classList.contains('is-danger')) {
          passwordElement.classList.add('is-danger');
        }
      }

      // No errors, make request
      if(emailError.length <= 0 && passwordError.length <= 0) {
        this.LoginApiRequest(email, password, isRegistering);
      }
    }
  }
}
</script>