(function () {
    'use strict';

    angular
        .module('app.specimatch')
        .controller('SpecimatchController', SpecimatchController);

    SpecimatchController.$inject = ['SpecimatchService', '$cookies', '$state', 'SweetAlert'];

    function SpecimatchController(SpecimatchService, $cookies, $state, SweetAlert) {
        var vm = this;
        vm.hasResults = false;
        vm.clinicalTrial = true;
        vm.drugs = true;
        vm.pageNumber = 1;
        vm.productsPerPage = 10;
        vm.maxSize = 3;
        vm.totalCount = 0;
        vm.products = [];
        vm.searchValue = '';
        vm.pagination = pagination;
        vm.searchProducts = searchProducts;
        var pageNo = 1;
        // var auth_token = $cookies.get('token');

        function getProducts(params) {
            SpecimatchService.getProducts(params)
                .then(function (res) {
                    vm.hasResults = true;

                    if (res.type == "auth_error") {
                        SweetAlert.swal({   
                            title: 'Warning',   
                            text: res.message,   
                            type: 'warning',   
                            showCancelButton: false,   
                            confirmButtonColor: '#DD6B55',   
                            confirmButtonText: 'Login',
                            closeOnConfirm: true
                        },  function(){  
                            $state.go('page.login');
                        });
                    }
                    if (res.status == 'success') {
                        vm.products = res.records;
                        vm.totalCount = res.totalCount;
                        vm.hasResults = vm.products.length > 0 ? true : false;
                        vm.hasResults = true;
                    }
                });
        };

        function searchProducts() {
            var params = { 
                data: {
                    productsPerPage: vm.productsPerPage,
                    search: vm.searchValue,
                    drugFlag: vm.drugs,
                    trialFlag: vm.clinicalTrial,
                    pageNo: pageNo
                },
                doctor: $cookies.get('logged_in_user')                                    
            };
            getProducts(params);
        };

        function pagination(page) {
            pageNo = page;
            vm.searchProducts();
        };
    };
})();
