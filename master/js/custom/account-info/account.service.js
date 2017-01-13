angular
    .module('app.account')
    .factory('AccountService', AccountService);

AccountService.$inject = ['$http', 'EnvironmentConfig'];

function AccountService($http, EnvironmentConfig) {

    return {
        getDetailInfo: getDetailInfo,
        addVendorID: addVendorID,
        addVendorBankInfo: addVendorBankInfo,
        chargePatient: chargePatient,
        addStripeAccount: addStripeAccount,
        addStripeBank: addStripeBank,
        payVendors: payVendors,
        chargeACH: chargeACH,
        addACH: addACH
    };

    function getDetailInfo() {
        return $http.get('server/cities.json')
            .then(getDataComplete)
            .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }
    
    function addVendorID(params) {
        // var auth_token = $cookies.get('token');
        return $http.post(EnvironmentConfig.api + 'api/v1/provider/addVendorID', {
                // auth_token: auth_token,
                params: params
            })
            .then(getDataComplete)
            .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }
    
    function addVendorBankInfo(params, auth_token, email) {
        return $http.post(EnvironmentConfig.api + 'api/v1/provider/addBankAccount', {
                params: params,
                auth_token: auth_token,
                vendor_email: email
            })
            .then(getDataComplete)
            .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }

    function chargePatient(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/payment/chargePatient', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }

    function addStripeAccount(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/provider/createManageAccount', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }

    function addStripeBank(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/provider/addStripeBank', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed);

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }

    function payVendors(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/payment/payout', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed)

        function getDataComplete(response) {
            console.log("Get data complete response is", response);
            return response.data;
        }

        function getDataFailed(error) {
            // body...
            logger.error('XHR Failed for getAvengers.' + error.data);
        }
    }

    function addACH(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/patient/verifyBankAccount', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed)

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            console.log('XHR Failed for getAvengers.' + error.data);
        }
    }

    function chargeACH(params) {
        return $http.post(EnvironmentConfig.api + 'api/v1/payment/chargeAchPayment', {
            params: params
        })
        .then(getDataComplete)
        .catch(getDataFailed)

        function getDataComplete(response) {
            return response.data;
        }

        function getDataFailed(error) {
            console.log('XHR Failed for getAvengers.' + error.data);
        }
    }
}

