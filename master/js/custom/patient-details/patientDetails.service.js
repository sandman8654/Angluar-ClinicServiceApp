angular
    .module('app.patientDetails')
    .factory('PatientDetailsService', PatientDetailsService);

PatientDetailsService.$inject = ['$http', 'EnvironmentConfig', 'Upload'];

function PatientDetailsService($http, EnvironmentConfig, Upload) {

    return {
        getBoxKeys: getBoxKeys,
        getPatientFiles: getPatientFiles,
        uploadFilesToBox: uploadFilesToBox,
        saveBoxFiles: saveBoxFiles,
        getPatient: getPatient
    };
    
    function getBoxKeys() {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/dicom/getBoxKeys',
				method: "POST"
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
    
    function getPatientFiles(data) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/dicom/files',
				method: "POST",
				data: data
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
	
    function saveBoxFiles(data) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/dicom/saveFile',
				method: "POST",
				data: data
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
	
	function uploadFilesToBox(file, accessToken, attributes) {
		
		$http.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        
        return Upload.upload({
				url: EnvironmentConfig.boxFileUploadApi + 'files/content',
				data: {
					file: file,
					attributes: JSON.stringify(attributes)
				}
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

    function getPatient(params) {
        return $http({
            url: EnvironmentConfig.api + 'api/v1/patient?patient_id=' + params.patient_id,
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
}
