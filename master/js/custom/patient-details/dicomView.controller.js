(function () {
    'use strict';

    angular
        .module('app.patientDetails')
        .controller('DicomViewController', DicomViewController);

    DicomViewController.$inject = [
        '$stateParams',
        'getBoxKeys',
        '$scope'
    ];
    function DicomViewController(
        $stateParams,
        getBoxKeys,
        $scope
    ) {
		$scope.accessToken = getBoxKeys.data.box_access_token;
		$scope.dicomFileId = $stateParams.dicom_id;
     }
})();
