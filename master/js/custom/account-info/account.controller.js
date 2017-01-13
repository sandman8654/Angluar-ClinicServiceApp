(function () {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', AccountController);

    AccountController.$inject = [
    	'AccountService',
        'SweetAlert',
    	'$scope',
    	'$cookies', 
        '$state',
    	'$uibModal'
    ];

    function AccountController(
    	AccountService,
        SweetAlert,
    	$scope,
    	$cookies,
        $state, 
    	$uibModal
	) {
        var vm = this;
        // provider = {};

        vm.user_type = $cookies.get('user_type');
        vm.auth_token =  $cookies.get('token');
        vm.doctor = {};
        activate();

        //////

        function activate() {

            ////--------------------------------Modal instance for making add vendor modal for bill.com API integration... -----------------------/////

        	vm.addVendorID = function(size) {

        		var modalInstance = $uibModal.open({
                    templateUrl: '/addVendorModal.html',
                    controller: ModalInstanceCtrl,
                    size: size
                });

                var state = $('#modal-state');
                modalInstance.result.then(function () {
                    state.text('Modal dismissed with OK status');
                }, function () {
                    state.text('Modal dismissed with Cancel status');
                });

                ////--------------------------------Modal instance for making add vendor modal -----------------------/////

                ModalInstanceCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'AccountService'];
            	function ModalInstanceCtrl($scope, $cookies, $state, $uibModalInstance, AccountService) {
            		
            		var params = {};
            		// $scope.provider.email = $cookies.get('logged_in_user');

	                $scope.addVendorID = function (patient) {
	                    document.getElementById('add-vendor-btn').setAttribute("disabled","true");
                        console.log("------>addVendorID is calling...");
                        $scope.is_loading = true;
                        if ($scope.addVendorForm.$valid){

    	                    params.fullname = $scope.provider.first_name + $scope.provider.last_name;
    	                    params.email = $cookies.get('logged_in_user');
    	                    // params.auth_token = $cookies.get('token');

    	                    AccountService.addVendorID(params).then(function(response) {
    	                    	
    	                    	if (response.type == "auth_error") {
                                    $uibModalInstance.close('closed');
    	                    		$state.go('page.login');
    	                    	} 

                                if (response.type == "error") {
                                    document.getElementById('add-vendor-btn').removeAttribute("disabled");
                                    $scope.is_loading = false;
                                    $scope.authMsg = response.message;
                                } else if (response.type == "success")  {
                                    SweetAlert.swal("Success", response.message, "success");
                                    $uibModalInstance.close('closed');
                                }
    	                    });
                        } else {
                            // console.log("valid error");
                            document.getElementById('add-vendor-btn').removeAttribute("disabled");
                            $scope.is_loading = false;
                            $scope.addVendorForm.provider_first_name.$dirty = true;
                            $scope.addVendorForm.provider_last_name.$dirty = true;
                        }

	                    // $uibModalInstance.close('closed');
	                };

	                $scope.cancel = function () {
	                    $uibModalInstance.dismiss('cancel');
	                };
	            }
        	}


            ////--------------------------------Modal instance for making add bank modal for bill.com API integration... -----------------------/////

            vm.addBankID = function(size) {

                var modalInstance = $uibModal.open({
                    templateUrl: '/addVendorBankModal.html',
                    controller: BankModalInstanceCtrl,
                    size: size
                });

                var state = $('#modal-state');
                modalInstance.result.then(function () {
                    state.text('Modal dismissed with OK status');
                }, function () {
                    state.text('Modal dismissed with Cancel status');
                });

                BankModalInstanceCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'AccountService'];
                function BankModalInstanceCtrl($scope, $cookies, $state, $uibModalInstance, AccountService) {
                    
                    var bank_params = {};
                    // $scope.provider.email = $cookies.get('logged_in_user');

                    $scope.addBankID = function (patient) {
                        document.getElementById('add-bank-btn').setAttribute("disabled","true");
                        console.log("------>addBankID is calling...");
                        $scope.is_loading = true;
                        if ($scope.addBankAccountForm.$valid){

                            bank_params.accountNumber = $scope.bank.account_number;
                            bank_params.routingNumber = $scope.bank.routing_number;
                            var auth_token = $cookies.get('token');
                            var vendor_email = $cookies.get('logged_in_user');

                            AccountService.addVendorBankInfo(bank_params, auth_token, vendor_email)
                                .then(function(response) {
                                
                                    if (response.type == "auth_error") {
                                        $uibModalInstance.close('closed');
                                        $state.go('page.login');
                                    } 

                                    if (response.type == "error") {
                                        document.getElementById('add-bank-btn').removeAttribute("disabled");
                                        $scope.is_loading = false;
                                        // $scope.bankAuthMsg = response.message;
                                        SweetAlert.swal("Warning", response.message, "success");
                                        $uibModalInstance.close('closed');
                                    } else if(response.type == "success") {
                                        SweetAlert.swal("Success", response.message, "success");
                                        $uibModalInstance.close('closed');
                                    }
                                });

                        } else {
                            // console.log("valid error");
                            document.getElementById('add-bank-btn').removeAttribute("disabled");
                            $scope.is_loading = false;
                            $scope.addBankAccountForm.bank_name.$dirty = true;
                            $scope.addBankAccountForm.name_on_acct.$dirty = true;
                            $scope.addBankAccountForm.account_number.$dirty = true;
                            $scope.addBankAccountForm.routing_number.$dirty = true;
                        }

                        // $uibModalInstance.close('closed');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }


            ////-------------------------------Stripe Account Add ModalController for stripe API integration------------------------------////

            vm.addStripeAccountModal = function(size) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/addStripeAccountModal.html',
                    controller: StripeAccountCtrl,
                    size: size
                });   
                var state = $('#modal-state');
                modalInstance.result.then(function () {
                    state.text('Modal dismissed with OK status');
                }, function () {
                    state.text('Modal dismissed with Cancel status');
                }); 


                StripeAccountCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'AccountService'];
                function StripeAccountCtrl($scope, $cookies, $state, $uibModalInstance, AccountService) {
                    var stripe_account_params = {};
                    $scope.is_loading = false;
                    // var vm = this;
                    $scope.addStripeAccount = function() {
                        $scope.is_loading = true;
                        var account_number = document.getElementById("stripe_account_number").value;
                        var routing_number = document.getElementById("stripe_routing_number").value;

                        console.log("Account number is ...", account_number);

                        if ($scope.addStripeAccountForm.$valid) {

                            stripe_account_params.account_email = $scope.stripe_account.email;
                            // stripe_account_params.auth_token = $cookies.get('token');
                            stripe_account_params.account_number = account_number;
                            stripe_account_params.routing_number = routing_number;
                            stripe_account_params.first_name = $scope.stripe_account.firstname;
                            stripe_account_params.last_name  = $scope.stripe_account.lastname;

                            AccountService.addStripeAccount(stripe_account_params)
                                .then(function(resp) {
                                    if (resp.type == "auth_error") {
                                        $uibModalInstance.close('closed');
                                        $state.go('page.login');
                                    } else {
                                        if (resp.type == "error") {
                                            $scope.is_loading = false;
                                            $scope.stripeAccountMsg = resp.message;
                                        } else {
                                            SweetAlert.swal("Success", resp.message, "success");
                                            $uibModalInstance.close('closed');
                                        }
                                    }
                                });

                        } else {
                            $scope.is_loading = false;
                            $scope.addStripeAccountForm.email.$dirty = true;
                            $scope.addStripeAccountForm.account_number.$dirty = true;
                            $scope.addStripeAccountForm.routing_number.$dirty = true;
                            $scope.addStripeAccountForm.agreed_tos.$dirty = true;
                        }                        
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }    
            }


            ////-------------------------------Stripe Add Bank info ModalController for stripe api integration------------------------------////

            vm.addStripeBankModal = function(size) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/addStripeBankModal.html',
                    controller: StripeBankCtrl,
                    size: size
                });

                StripeBankCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'AccountService'];
                function StripeBankCtrl($scope, $cookies, $state, $uibModalInstance, AccountService) {
                    var stripe_bank_params = {};
                    $scope.is_loading = false;

                    $scope.addStripeBankInfo = function() {
                        $scope.is_loading = true;

                        if($scope.addStripeBankForm.$valid) {

                            // stripe_bank_params.auth_token = $cookies.get('token');
                            stripe_bank_params.account_email = $scope.stripe_bank.account_email;
                            stripe_bank_params.account_number = $scope.stripe_bank.account_number;
                            stripe_bank_params.account_routing_number = $scope.stripe_bank.account_routing_number;
                            stripe_bank_params.account_holder_name = $scope.stripe_bank.account_holder_name;

                            AccountService.addStripeBank(stripe_bank_params)
                                .then(function(resp) {
                                    if (resp.type == "auth_error") {
                                        $state.go('page.login');
                                        $uibModalInstance.close('closed');
                                    } else {
                                        if (resp.type == "error") {
                                            $scope.is_loading = false;
                                            $scope.stripeBankMsg = resp.message;
                                        } else {
                                            SweetAlert.swal("Success", resp.message, "success");
                                            $uibModalInstance.close('closed');
                                        }
                                    }
                                });

                        } else {
                            $scope.is_loading = false;
                            $scope.addStripeBankForm.account_holder_name.$dirty = true;
                            $scope.addStripeBankForm.account_email.$dirty = true;
                            $scope.addStripeBankForm.account_number.$dirty = true;
                            $scope.addStripeBankForm.account_routing_number.$dirty = true;
                        }
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            }

            ///////<------------------------------ Pay vendors ------------------------------->///////

            vm.payVendorsModal = function(size) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/payVendorsModal.html',
                    controller: PayVendorCtrl,
                    size: size
                });

                PayVendorCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'AccountService'];
                function PayVendorCtrl($scope, $cookies, $state, $uibModalInstance, AccountService) {
                    var pay_vendor_params = {};
                    $scope.is_loading = false;

                    $scope.payVendors = function() {
                        $scope.is_loading = true;

                        if($scope.payVendorForm.$valid) {

                            // pay_vendor_params.auth_token = $cookies.get('token');
                            pay_vendor_params.account_email = $scope.email;
                            // stripe_bank_params.account_number = $scope.stripe_bank.account_number;
                            // stripe_bank_params.account_routing_number = $scope.stripe_bank.account_routing_number;
                            // stripe_bank_params.account_holder_name = $scope.stripe_bank.account_holder_name;

                            AccountService.payVendors(pay_vendor_params)
                                .then(function(resp) {
                                    if (resp.type == "auth_error") {
                                        $state.go('page.login');
                                        $uibModalInstance.close('closed');
                                    } else {
                                        if (resp.type == "error") {
                                            $scope.is_loading = false;
                                            $scope.payErrorMsg = resp.message;
                                        } else {
                                            SweetAlert.swal("Success", resp.message, "success");
                                            $uibModalInstance.close('closed');
                                        }
                                    }
                                });

                        } else {
                            $scope.is_loading = false;
                            $scope.payVendorForm.email.$dirty = true;
                        }
                    };

                    $scope.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            }


            ///////<------------------------------ Charge Patient -------------------------------/////////

            vm.chargePatient = function() {
                var params = {};
                var handler = StripeCheckout.configure({
                    key: 'pk_test_6HAWdQv3CSITTJRvmxu3YvOA',
                    image: '/img/documentation/checkout/marketplace.png',
                    locale: 'auto',
                    token: function(token) {
                      // Use the token to create the charge with a server-side script.
                      // You can access the token ID with `token.id`
                      // console.log(token);
                        // params.auth_token = $cookies.get('token');
                        params.email = $cookies.get('logged_in_user');
                        params.stripeToken = token.id;
                        AccountService.chargePatient(params).then(function(resp) {
                            if(resp.type == "auth_error") {
                                $state.go('page.login');
                                handler.close();
                            } else {
                                console.log(resp);
                                if (resp.type == "success") {
                                    SweetAlert.swal("Success", resp.message, "success");
                                    handler.close();
                                } else {
                                    SweetAlert.swal("Warning", resp.message, "success");
                                    handler.close();
                                }
                            }
                        });
                    }
                });

                handler.open({
                    name: 'B4CC, Inc.',
                    description: '2 widgets'
                });
            }


            ///////<------------------------------ Getting Verified bank info using plaid integration -------->/////////

            vm.addACH = function() {
                var params = {};
                var linkHandler = Plaid.create({
                    env: "tartan",
                    clientName: "B4CC",
                    key: "c120f60b808c7d87355c6e435af68c",
                    product: "auth",
                    selectAccount: true,
                    onSuccess: function(public_token, metadata) {
                        // params.auth_token = $cookies.get('token');
                        params.public_token = public_token;
                        params.account_id = metadata.account_id;
                        // params.logged_in_user = $cookies.get('logged_in_user');
                        params.logged_in_patient = "test@patientYM.com";
                        AccountService.addACH(params).then(function(resp) {
                            console.log("ACH response is ...", resp);
                            if (resp.type == "auth_error") {
                                SweetAlert.swal({   
                                    title: 'Warning',   
                                    text: resp.message,   
                                    type: 'warning',   
                                    showCancelButton: false,   
                                    confirmButtonColor: '#DD6B55',   
                                    confirmButtonText: 'Login',
                                    closeOnConfirm: true
                                },  function(){  
                                    $state.go('page.login');
                                });
                            } else {
                                console.log(resp);
                                if (resp.type == "success") {
                                    SweetAlert.swal("Success", resp.message, "success");
                                } else {
                                    SweetAlert.swal("Warning", resp.message, "warning");
                                }
                            }
                        });
                    }
                });

                linkHandler.open();
            }
            
            ///////<------------------------------ Charging ACH Payment -------------------------------->////////

            vm.chargeACH = function() {
                var params = {};
                // params.auth_token = $cookies.get('token');
                params.logged_in_patient = "test@patientYM.com";

                AccountService.chargeACH(params).then(function(resp) {
                    console.log("ACH charge response from server...", resp);
                    if (resp.type == "auth_error") {
                        SweetAlert.swal({   
                            title: 'Warning',   
                            text: resp.message,   
                            type: 'warning',   
                            showCancelButton: false,   
                            confirmButtonColor: '#DD6B55',   
                            confirmButtonText: 'Login',
                            closeOnConfirm: true
                        },  function(){  
                            $state.go('page.login');
                        });
                    } else {
                        if (resp.type == "success") {
                            SweetAlert.swal("Success", resp.message, "success");
                        } else {
                            SweetAlert.swal("Warning", resp.message, "warning");
                        }
                    }
                });
            }

            ///////<------------------------------ Getting Detail info for logged in user--------------------->/////////

            vm.getDetailInfo = function() {
                console.log("------>initialize the controller ...", $cookies.get('logged_in_user'));
                vm.doctor.fullname = "Atlanta. GA. US";
                vm.doctor.email = $cookies.get('logged_in_user');
            }
        }   
    };
})();
