angular
    .module('app.specimatch')
    .factory('SpecimatchService', SpecimatchService);

SpecimatchService.$inject = ['$http','EnvironmentConfig'];

function SpecimatchService($http, EnvironmentConfig) {
    return {
        getProducts: getProducts,
        productDetails: productDetails
    };
    
    function getProducts(params) {
		
        return $http.post(EnvironmentConfig.api + 'api/v1/product/search', {
                params: params
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


    function productDetails(params) {
        return $http({
                url: EnvironmentConfig.api + 'api/v1/product/details',
                method: "POST",
                params: params
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
