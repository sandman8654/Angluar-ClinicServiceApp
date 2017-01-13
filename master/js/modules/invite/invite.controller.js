(function () {
	'use strict';

	angular
		.module('app.invite')
		.controller('InviteController', InviteController);

		InviteController.$inject = ['$http', '$state', '$cookies', '$stateParams', 'EnvironmentConfig'];
		
		function InviteController($http, $state, $cookies, $stateParams, EnvironmentConfig) {

			var guid = $stateParams.guid;

			if (guid) {
				$cookies.put('guid', guid);

				$http
					.post(EnvironmentConfig.api + 'api/v1/auth/invite', { guid: guid })
					.then (function (response) {

						$state.go('page.register');

					}, function () {

						$state.go('page.register');

					});	
			}
		};
})();