(function () {
    'use strict';

    angular
        .module('app.patient')
        .controller('PatientListController', PatientListController);

    PatientListController.$inject = [
        '$cookies',
        '$state',
        '$uibModal',
        '$rootScope',
        '$scope',
        'PatientService',
        'ngDialog',
        'SweetAlert',
        'DTOptionsBuilder',
        'DTColumnDefBuilder'];
    function PatientListController(
        $cookies,
        $state,
        $uibModal,
        $rootScope,
        $scope,
        PatientService,
        ngDialog,
        SweetAlert,
        DTOptionsBuilder,
        DTColumnDefBuilder) {

        var vm = this;
        $scope.is_loading = false;
        // vm.patients = [];
        $rootScope.patients = [];
        vm.patient = {};
        vm.user_type = $cookies.get('user_type');

        var logged_in_user = $cookies.get('logged_in_user');

        activate();

        ////////////////

        function activate() {

            vm.getPatients = function () {
                $scope.is_loading = true;
                var params = {};
                // params.auth_token = $cookies.get('token');
                params.logged_in_user = $cookies.get('logged_in_user');

                PatientService.getPatients(params).then(function (response) {
                    if (response.type == "auth_error") {
                        $scope.is_loading = false;
                        SweetAlert.swal({   
                            title: 'Warning',   
                            text: response.message,   
                            type: 'warning',   
                            showCancelButton: false,   
                            confirmButtonColor: '#DD6B55',   
                            confirmButtonText: 'Login',
                            closeOnConfirm: true
                        },  function(){  
                            $state.go('page.login');
                        });
                    } else {
                        $scope.is_loading = false;
                        if (response.type == "error") {
                            SweetAlert.swal("Warning", response.message, "success");
                        } else {
                            console.log("--->Getting patients is...", response.data);
                            $rootScope.patients = response.data;    
                        }                
                    }
                });
            };

            vm.goToDetail = function(patient_id, index) {
                console.log(patient_id);
                $state.go('app.patient-details', {patient_id: patient_id});
            };

            vm.removePatient = function(patient_id) {
                var params = {};
                // params.auth_token = $cookies.get('token');
                params.patient_id = patient_id;
                SweetAlert.swal({   
                    title: 'Warning',   
                    text: "Do you want to remove Patient?",   
                    type: 'warning',   
                    showCancelButton: true,   
                    confirmButtonColor: '#DD6B55',   
                    confirmButtonText: 'Yes',
                    closeOnConfirm: false
                },  function(){  
                    PatientService.removePatient(params)
                        .then(function(response) {
                            if (response.type == "auth_error") {
                                SweetAlert.swal({   
                                    title: 'Warning',   
                                    text: response.message,   
                                    type: 'warning',   
                                    showCancelButton: false,   
                                    confirmButtonColor: '#DD6B55',   
                                    confirmButtonText: 'Login',
                                    closeOnConfirm: true
                                },  function(){  
                                    $state.go('page.login');
                                });
                            } else {
                                if (response.type == "error") {
                                    SweetAlert.swal("Fail", response.message, "success");
                                } else {
                                    SweetAlert.swal("Success", response.message, "success");
                                    for (var index = 0; index < $rootScope.patients.length; index ++) {
                                        if ($rootScope.patients[index].id == patient_id) {
                                            $rootScope.patients.splice(index, 1);
                                        }
                                    }
                                }
                            }
                        });    
                });
            }

            vm.invitePatientModal = function(size) {
                console.log("Invite Patient button is clicked now !");
                var modalInstance = $uibModal.open({
                    templateUrl: '/invitePatientModal.html',
                    controller: InvitePatientCtrl,
                    size: size
                });

                var state = $('#modal-state');
                modalInstance.result.then(function () {
                    state.text('Modal dismissed with OK status');
                }, function () {
                    state.text('Modal dismissed with Cancel status');
                });

                ////--------------------------------Modal instance for making invite Patient Modal -----------------------/////

                InvitePatientCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'PatientService'];
                function InvitePatientCtrl($scope, $cookies, $state, $uibModalInstance, PatientService) {
                    
                    var params = {};
                    // $scope.provider.email = $cookies.get('logged_in_user');

                    $scope.invitePatientNew = function () {
                        console.log("------>addVendorID is calling...");
                        $scope.is_loading = true;
                        if ($scope.invitePatientForm.$valid){

                            params.first_name = $scope.patient.first_name;
                            params.last_name =  $scope.patient.last_name;
                            params.email = $scope.patient.email;
                            params.logged_in_user = $cookies.get('logged_in_user');

                            PatientService.invitePatient(params).then(function(response) {
                                
                                if (response.type == "auth_error") {
                                    SweetAlert.swal({   
                                        title: 'Warning',   
                                        text: response.message,   
                                        type: 'warning',   
                                        showCancelButton: false,   
                                        confirmButtonColor: '#DD6B55',   
                                        confirmButtonText: 'Login',
                                        closeOnConfirm: true
                                    },  function(){  
                                        $uibModalInstance.close('closed');
                                        $state.go('page.login');
                                    });
                                } 

                                if (response.type == "error") {
                                    $scope.is_loading = false;
                                    $scope.patientAuthMsg = response.message;
                                } else if (response.type == "success")  {
                                    SweetAlert.swal("Success", response.message, "success");
                                    $uibModalInstance.close('closed');
                                }
                            });
                        } else {
                            
                            $scope.is_loading = false;
                            $scope.invitePatientForm.first_name.$dirty = true;
                            $scope.invitePatientForm.last_name.$dirty = true;
                            $scope.invitePatientForm.email.$dirty = true;
                        }

                        // $uibModalInstance.close('closed');
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            vm.addPatientModal = function(size) {
                var modalInstance = $uibModal.open({
                    templateUrl: '/addPatientModal.html',
                    controller: AddPatientCtrl,
                    size: size
                });

                var state = $('#modal-state');
                modalInstance.result.then(function () {
                    state.text('Modal dismissed with OK status');
                }, function () {
                    state.text('Modal dismissed with Cancel status');
                });

                ////--------------------------------Modal instance for making add Patient Modal -----------------------/////

                AddPatientCtrl.$inject = ['$scope', '$cookies', '$state', '$uibModalInstance', 'PatientService'];
                function AddPatientCtrl($scope, $cookies, $state, $uibModalInstance, PatientService) {
                    
                    var params = {};
                    $scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS','MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
                    // $scope.provider.email = $cookies.get('logged_in_user');

                    function formatDate(date) {
                        var d = new Date(date),
                            month = '' + (d.getMonth() + 1),
                            day = '' + d.getDate(),
                            year = d.getFullYear();
                        if (month.length < 2) month = '0' + month;
                        if (day.length < 2) day = '0' + day;
                        return [year,  month, day].join('-');
                    }

                    $scope.addPatient = function () {
                        $scope.is_loading = true;
                        if ($scope.addPatientForm.$valid){
                            
                            var dob = formatDate($scope.patient.date);
                            params.first_name = $scope.patient.first_name;
                            params.last_name =  $scope.patient.last_name;
                            params.email = $scope.patient.email;
                            params.city = $scope.patient.city;
                            params.state = $scope.patient.state;
                            params.address = $scope.patient.address;
                            params.dob = dob;
                            params.home_phone = $scope.patient.phonenumber;
                            params.gender = $scope.patient.gender;
                            // params.auth_token = $cookies.get('token');
                            params.logged_in_user = $cookies.get('logged_in_user');

                            PatientService.addPatient(params).then(function(response) {
                                
                                if (response.type == "auth_error") {
                                    SweetAlert.swal({   
                                        title: 'Warning',   
                                        text: response.message,   
                                        type: 'warning',   
                                        showCancelButton: false,   
                                        confirmButtonColor: '#DD6B55',   
                                        confirmButtonText: 'Login',
                                        closeOnConfirm: true
                                    },  function(){  
                                        $uibModalInstance.close('closed');
                                        $state.go('page.login');
                                    });
                                } 

                                if (response.type == "error") {
                                    console.log("-->Error");
                                    $scope.is_loading = false;
                                    $scope.patientAuthMsg = response.message;
                                } else if (response.type == "success")  {
                                    console.log("Adding patient response...", response.data);
                                    $rootScope.patients.push(response.data);
                                    SweetAlert.swal("Success", response.message, "success");
                                    $uibModalInstance.close('closed');
                                }
                            });
                        } else {
                            
                            $scope.is_loading = false;
                            $scope.addPatientForm.first_name.$dirty = true;
                            $scope.addPatientForm.last_name.$dirty = true;
                            $scope.addPatientForm.email.$dirty = true;
                            // $scope.addPatientForm.zipcode.$dirty = true;
                        }

                    };

                    $scope.toggleMin = function() {
                        $scope.pickerMinDate = $scope.pickerMinDate ? null : new Date();
                    };
                    $scope.toggleMin();

                    $scope.calenderOpen = function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope.pickerOpened = true;
                    };

                    $scope.pickerDateOptions = {
                        formatYear: 'yy',
                        startingDay: 1
                    };

                    // vm.initDate = new Date('2019-10-20');
                    var formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                    $scope.pickerFormat = formats[0];

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }
        }        
    }
})();
