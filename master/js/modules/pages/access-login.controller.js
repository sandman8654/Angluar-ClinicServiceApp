/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$rootScope', '$http', '$state', '$cookies', 'EnvironmentConfig'];
    function LoginFormController($rootScope, $http, $state, $cookies, EnvironmentConfig) {
        var vm = this;

        // if ($rootScope.app.token != "") {
        //   in this case we need to go to dashboard directly...
        // } else {
        //   in this case we need to go to login page...
        // }

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          vm.account = {};
          // place the message if something goes wrong
          vm.authMsg = '';

          vm.login = function() {
            vm.authMsg = '';

            if(vm.loginForm.$valid) {
    
              $http
                .post(EnvironmentConfig.api + 'api/v1/auth/login', {email: vm.account.email, password: vm.account.password})
                .then(function(response) {
					
                  if ( response.data.type == 'error' ) {
                     vm.authMsg = response.data.message;
                  } else {
                    
                    $cookies.put('token', response.data.token);
                    $cookies.put('user_type', response.data.user_type);
                    $cookies.put('logged_in_user', response.data.logged_in_user);
                    
                    console.log("------->logged in user is", response.data.logged_in_user);

                    $state.go('app.dashboard_v2');
                  }
                }, function() {
                  vm.authMsg = 'Server Request Error';
                });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.loginForm.account_email.$dirty = true;
              vm.loginForm.account_password.$dirty = true;
            }
          };
        }
    }
})();
