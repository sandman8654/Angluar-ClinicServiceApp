angular
    .module('app.patient')
    .factory('PatientService', PatientService);

PatientService.$inject = ['$http', 'EnvironmentConfig'];

function PatientService($http, EnvironmentConfig) {

    return {
        addPatient: addPatient,
        invitePatient: invitePatient,
        getPatients: getPatients,
        removePatient: removePatient
    };

    function getPatients(params) {

        return $http({
            url: EnvironmentConfig.api + 'api/v1/patients?logged_in_user=' + params.logged_in_user,
            method: "GET"
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }

    }

    function invitePatient(params) {

        return $http.post(EnvironmentConfig.api + 'api/v1/provider/invitePatient', {
            data: params
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }

    function addPatient(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/patient', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            console.log("Getting response from server", response);
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }

    function removePatient(params) {
        return $http({
            url: EnvironmentConfig.api + 'api/v1/patient?patient_id=' + params.patient_id,
            method: "DELETE"
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            return error.data;
        }
    }
}
