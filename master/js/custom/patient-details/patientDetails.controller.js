(function () {
    'use strict';

    angular
        .module('app.patientDetails')
        .controller('PatientDetailsController', PatientDetailsController);

    PatientDetailsController.$inject = [
        '$cookies',
        '$state',
        '$stateParams',
        '$uibModal',
        '$rootScope',
        '$scope',
        'SweetAlert',
        'PatientDetailsService',
        'getPatientFiles',
        'getBoxKeys',
        'EnvironmentConfig'
    ];

    function PatientDetailsController(
        $cookies,
        $state,
        $stateParams,
        $uibModal,
        $rootScope,
        $scope,
        SweetAlert,
        PatientDetailsService,
        getPatientFiles,
        getBoxKeys,
        EnvironmentConfig
    ) {
		// var vm = this;
        $scope.is_loading = false;
        $scope.patientFiles = [];
        $scope.apiUrl = EnvironmentConfig.api;
        $scope.currentPatientId = $stateParams.patient_id;
		$scope.accessToken = '';
		$scope.boxFolderId = '';
		
		$scope.pageNumber = 1;
        $scope.filesPerPage = 10;
        $scope.maxSize = 3;
        $scope.filesCount = 0;
		var pageNo = 1;
		var params = {};
		
		
        if (getPatientFiles.type == 'success') {
            $scope.patientFiles = getPatientFiles.files;
            $scope.filesCount = getPatientFiles.filesCount;
        }
        
        if (getBoxKeys.type == 'success') {
            $scope.accessToken = getBoxKeys.data.box_access_token;
			$scope.boxFolderId = getBoxKeys.data.dicom_folder_id;
        }
		
		function patientsFiles () {
			
			var params = {
				filesPerPage: $scope.filesPerPage,
				pageNo: pageNo,
				patient_id:$scope.currentPatientId
			}
			
			PatientDetailsService.getPatientFiles( params )
                .then(function (res) {
                    if (res.type == 'success') {
                        $scope.patientFiles = res.files;
                        $scope.filesCount = getPatientFiles.filesCount;
                    }
                }
            );
		}

        $scope.getPatientDetail = function() {
            // params.auth_token = $cookies.get('token');
            params.patient_id = $scope.currentPatientId;

            PatientDetailsService.getPatient(params)
                .then(function(resp) {
                    if (resp.type == "auth_error") {
                        console.log("This is the auth error case...");
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
                        if(resp.type == "error") {
                            SweetAlert.swal("Fail", resp.message, "success");
                        } else {
                            $scope.patient = resp.data.patient_info;
                            $scope.diagnosises = resp.data.patient_diagnosis.results;
                            var latest_index = resp.data.patient_diagnosis.count - 1;
                            $scope.latestDiagnosis = $scope.diagnosises[latest_index];
                            var dob = new Date($scope.patient.date_of_birth);
                            var now = new Date();
                            $scope.age = now.getFullYear() - dob.getFullYear();
                        }
                    }
                });
        }

        $scope.filesPagination = function (page) {
			pageNo = page;
			patientsFiles();
        }
        
        $scope.refreshPatientFiles = function () {
			$rootScope.$broadcast('closePopup');
			patientsFiles();
		}
        
        $scope.addProblem = function() {

        }
        //Modal to confirm type of file to be uploaded
        $scope.fileTypeConfirm = function () {
			if( $scope.accessToken == '' || $scope.boxFolderId == '' ) {
				// some error message to display
				SweetAlert.swal("Fail", "Please add the access token from box.com", "warning");
				return false;
			}
			
            var modalInstance = $uibModal.open({
                templateUrl: '/fileTypeModal.html',
                controller: ModalInstanceCtrl,
                resolve:{
					getBoxKeys: function(){
					   var params = {
						   accessToken: $scope.accessToken,
						   boxFolderId: $scope.boxFolderId,
						   currentPatientId: $scope.currentPatientId
						};
						return params;	
					}
				}
            });

            var state = $('#modal-state');
            modalInstance.result.then(function () {
                state.text('Modal dismissed with OK status');
            }, function () {
                state.text('Modal dismissed with Cancel status');
            });


            ModalInstanceCtrl.$inject = ['$scope','$uibModalInstance', 'getBoxKeys'];

            function ModalInstanceCtrl($scope, $uibModalInstance, getBoxKeys) {
                
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.$on('closePopup', function () {
					$scope.cancel();
				});
				
				$scope.uploadFilesPopup = function () {
					$scope.cancel();
					if( $scope.accessToken == '' || $scope.boxFolderId == '' ) {
						// some error message to display
						SweetAlert.swal("Fail", "Please add the access token from box.com", "warning");
						return false;
					}
					
					var dicomModalInstance = $uibModal.open({
						templateUrl: '/uploadDicomModal.html',
						controller: DicomModalInstanceCtrl
					});

					var state = $('#modal-state');
					dicomModalInstance.result.then(function () {
						state.text('Modal dismissed with OK status');
					}, function () {
						state.text('Modal dismissed with Cancel status');
					});


					DicomModalInstanceCtrl.$inject = ['$scope','$uibModalInstance'];

					function DicomModalInstanceCtrl($scope, $uibModalInstance) {
						
						$scope.cancel = function () {
							$uibModalInstance.dismiss('cancel');
						};

						$scope.$on('closePopup', function () {
							$scope.cancel();
						});
					}
				}
				
			   // upload files to box
				$scope.uploadFilesToBox = function (file) {
					if(file) {
						$scope.cancel();
						if( $scope.accessToken == '' || $scope.boxFolderId == '' ) {
							// some error message to display
							SweetAlert.swal("Fail", "Please add the access token from box.com", "warning");
							return false;
						}
						
						var ext = file['name'].split('.').pop();
						var attributes = {
							name: 'box_'+ Math.random() + '.' + ext,
							parent: {
								id: getBoxKeys.boxFolderId
							}
						};
						
						PatientDetailsService.uploadFilesToBox(file, getBoxKeys.accessToken, attributes).then(
							function(res) {
								if(undefined === res.status) {
									
									var data = {};
									data.dicom_id = res.entries[0].id;
									data.file_id = res.entries[0].file_version.id;
									data.file_name = res.entries[0].name;
									data.patient_id = getBoxKeys.currentPatientId;
									data.file_type = ext;
									
									PatientDetailsService.saveBoxFiles(data).then(
										function(res) {
											if(res.type == 'success') {
												patientsFiles();
											}
										}
									);
								}
							}
						);
					}
				};
            }
        }
    }
})();
