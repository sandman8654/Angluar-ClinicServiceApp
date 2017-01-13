angular
    .module('app.conference')
    .factory('ConferenceService', ConferenceService);

ConferenceService.$inject = ['$http', 'EnvironmentConfig'];

function ConferenceService($http, EnvironmentConfig) {

    return {
        getTwilioToken: getTwilioToken,
        getConfUsers: getConfUsers,
        upcomingConferences:upcomingConferences,
        generateConference:generateConference,
        getConferencesParticipants:getConferencesParticipants,
        disconnectConferences:disconnectConferences
    };
    
    function getTwilioToken(params) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/generateToken',
				method: "POST",
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
    
    function getConfUsers(params) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/getConfUsers',
				method: "POST",
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
    
    function upcomingConferences() {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/upcomingConferences',
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
    
    function generateConference(params) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/generateConference',
				method: "POST",
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
    
    function disconnectConferences(params) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/disconnectConferences',
				method: "POST",
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
    
    function getConferencesParticipants(params) {
        return $http({
				url: EnvironmentConfig.api + 'api/v1/twilio/getConferencesParticipants',
				method: "POST",
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
}
