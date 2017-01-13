/**=========================================================
 * Module: access-register.js
 * Demo for register account api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('RegisterFormController', RegisterFormController);

    RegisterFormController.$inject = ['$rootScope', '$http', '$state', '$cookies', 'EnvironmentConfig'];
    function RegisterFormController($rootScope, $http, $state, $cookies, EnvironmentConfig) {
        var vm = this;

        // if ($rootScope.app.token != "") {
        //   in this case we need to go to dashboard directly...
        // } else {
        //   in this case we need to go to register page...
        // }

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          var provider = {};
          // place the message if something goes wrong
          vm.authMsg = '';

          var guid = $cookies.get('guid');
            
          vm.register = function() {
            vm.authMsg = '';

            if(vm.registerForm.$valid) {

              provider.firstname = vm.account.firstname;
              provider.lastname = vm.account.lastname;
              provider.email = vm.account.email;
              provider.password = vm.account.password;
              provider.invite_code = vm.account.invitation_code;
              provider.user_type = "provider";
              provider.guid = guid;

              $http
                .post(EnvironmentConfig.api + 'api/v1/auth/register', {provider: provider})
                .then(function(response) {
                  // assumes if ok, response is an object with some data, if not, a string with error
                  // customize according to your api

                  if (response.data.type == "error" ) {
                    vm.authMsg = response.data.message;
                  }else{
                    // $rootScope.app.token = response.data.token;
                    $cookies.put('logged_in_user', response.data.logged_in_user);
                    $cookies.put('token', response.data.token);
                    $cookies.put('user_type', response.data.user_type);
                    $cookies.put('logged_in_user', response.data.logged_in_user);
                    $state.go('app.dashboard_v2');
                  }
                }, function() {
                  vm.authMsg = 'Server Request Error';
                });
            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.registerForm.account_firstname.$dirty = true;
              vm.registerForm.account_lastname.$dirty = true;
              vm.registerForm.account_email.$dirty = true;
              vm.registerForm.account_password.$dirty = true;
              vm.registerForm.account_agreed.$dirty = true;
              vm.registerForm.account_invitation_code.$dirty = true;
              
            }
          };
        }
    }
})();
