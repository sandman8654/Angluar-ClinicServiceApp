(function () {
    'use strict';

    angular
        .module('app.specimatch')
        .controller('ProductDetailsController', ProductDetailsController);

    ProductDetailsController.$inject = ['SpecimatchService', 'productDetails', '$state', 'SweetAlert'];

    function ProductDetailsController(SpecimatchService, productDetails, $state, SweetAlert) {
		var pd = this;
		pd.productDetails = {};
		console.log("----->productDetails", productDetails);
		if(productDetails.type == "auth_error") {
			SweetAlert.swal({   
                title: 'Warning',   
                text: productDetails.message,   
                type: 'warning',   
                showCancelButton: false,   
                confirmButtonColor: '#DD6B55',   
                confirmButtonText: 'Login',
                closeOnConfirm: true
            },  function(){  
                $state.go('page.login');
            });
		}
		if(productDetails.status == 'success') {
			pd.details = productDetails.data;
		} else {
			$state.go('app.specimatch');
		}
    };
})();
