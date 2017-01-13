(function () {
    'use strict';

    angular
        .module('app.patientDetails')
        .controller('PatientFilesController', PatientFilesController);

    PatientFilesController.$inject = [
        '$cookies',
        '$uibModal',
        '$rootScope',
        '$scope',
        'PatientDetailsService',
        'getAccessToken'
    ];
    function PatientFilesController(
        $cookies,
        $uibModal,
        $rootScope,
        $scope,
        PatientDetailsService,
        getAccessToken
    ) {
		
        var vm = this;
        vm.is_loading = false;
        vm.accessToken = getAccessToken.data.accessToken;
		vm.dicomFolderId = getAccessToken.data.dicomFolderId;
    }
})();
