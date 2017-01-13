/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider', '$httpProvider'];

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper, $httpProvider) {

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/page/login');
		
		
		// Interceptor to intercept each request to server
		
		$httpProvider.interceptors.push(['$cookies','$injector','EnvironmentConfig','$q', function ($cookies, $injector, EnvironmentConfig, $q) {
			   return {
				   'request': function (config) {
					   config.headers = config.headers || {};
					   var token = $cookies.get('token');
					   if (token) {
						   config.headers.auth_token = token;
					   }
					   return config;
				   },
				   'responseError': function (res) {
					   
					   // Unauthorized error
					   if (res.status === 401) {
						  
						  // refresh auth_token
						  var $http = $injector.get("$http");
						  var $state = $injector.get("$state");
						  
						  $http({
								url: EnvironmentConfig.api + 'api/v1/auth/refreshToken',
								method: "GET"
							})
							.then(function(result) {
								if(result.data.type == 'success') {
									$cookies.put('token', result.data.token);
									console.log('token refreshed successfully');
								 } else {
									/* logout user if after unauthorization some error comes from server */
									$cookies.remove('token');
									$state.transitionTo('page.login', '', {reload: true,inherit: false,notify: true});
								}
							});
					   }
					   
					   return $q.reject(res);
				   }
			   };
			}]);
		
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull')
            })
            .state('app.singleview', {
                url: '/singleview',
                title: 'Single View',
                templateUrl: helper.basepath('singleview.html')
            })
            .state('app.submenu', {
                url: '/submenu',
                title: 'Submenu',
                templateUrl: helper.basepath('submenu.html')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html'),
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons')
            })
            .state('app.dashboard_v2', {
                url: '/dashboard_v2',
                title: 'Dashboard v2',
                templateUrl: helper.basepath('dashboard_v2.html'),
                controller: 'DashboardV2Controller',
                controllerAs: 'dash2',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins')
            })
            .state('app.form-standard', {
                url: '/form-standard',
                title: 'Form Standard',
                templateUrl: helper.basepath('form-standard.html')
            })
            .state('app.my-tasks', {
                url: '/my-tasks',
                title: 'My Tasks',
                templateUrl: helper.basepath('my-tasks.html')
            })
            .state('app.latest-files', {
                url: '/latest-files',
                title: 'Latest Files',
                templateUrl: helper.basepath('latest-files.html')
            })
            .state('app.case-messages', {
                url: '/case-messages',
                title: 'Case Messages',
                templateUrl: helper.basepath('case-messages.html')
            })
            .state('app.patient-records', {
                url: '/patient-records',
                title: 'Latest Files',
                templateUrl: helper.basepath('patient-records.html')
            })
            .state('app.form-extended', {
                url: '/form-extended',
                title: 'Form Extended',
                templateUrl: helper.basepath('form-extended.html'),
                resolve: helper.resolveFor('colorpicker.module', 'codemirror', 'moment', 'taginput', 'inputmask', 'localytics.directives', 'ui.bootstrap-slider', 'ngWig', 'filestyle', 'textAngular')
            })
            .state('app.form-validation', {
                url: '/form-validation',
                title: 'Form Validation',
                templateUrl: helper.basepath('form-validation.html'),
                resolve: helper.resolveFor('ui.select', 'taginput', 'inputmask', 'localytics.directives')
            })
            .state('app.form-parsley', {
                url: '/form-parsley',
                title: 'Form Validation - Parsley',
                templateUrl: helper.basepath('form-parsley.html'),
                resolve: helper.resolveFor('parsley')
            })
            .state('app.form-wizard', {
                url: '/form-wizard',
                title: 'Form Wizard',
                templateUrl: helper.basepath('form-wizard.html'),
                resolve: helper.resolveFor('parsley', 'filestyle', 'datatables'),
                controller: ['$rootScope', '$timeout', function($rootScope, $timeout) {
                    $rootScope.$on('$stateChangeSuccess',
                        function(event, toState, toParams, fromState, fromParams) {
                            console.log(fromState.name);
                            if (fromState.name === "app.billing") {
                                $timeout(function() {
                                    angular.element('#payment-tab').triggerHandler('click');
                                }, 100);
                            }
                        })
                }]
            })
            .state('app.form-upload', {
                url: '/form-upload',
                title: 'Form upload',
                templateUrl: helper.basepath('form-upload.html'),
                resolve: helper.resolveFor('angularFileUpload', 'filestyle')
            })
            .state('app.form-xeditable', {
                url: '/form-xeditable',
                templateUrl: helper.basepath('form-xeditable.html'),
                resolve: helper.resolveFor('xeditable')
            })
            .state('app.form-imagecrop', {
                url: '/form-imagecrop',
                templateUrl: helper.basepath('form-imagecrop.html'),
                resolve: helper.resolveFor('ngImgCrop', 'filestyle')
            })
            .state('app.form-uiselect', {
                url: '/form-uiselect',
                templateUrl: helper.basepath('form-uiselect.html'),
                controller: 'uiSelectController',
                controllerAs: 'uisel',
                resolve: helper.resolveFor('ui.select')
            })
            .state('app.specimatch', {
                url: '/specimatch',
                title: 'Search',
                templateUrl: helper.basepath('specimatch.html'),
                resolve: helper.resolveFor('moment', 'localytics.directives', 'ui.bootstrap-slider', 'oitozero.ngSweetAlert')
            })
            .state('page', {
                url: '/page',
                templateUrl: 'pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons'),
                controller: ['$rootScope', function($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.access', {
                url: '/invite/:guid',
                controller: 'InviteController'
            })
            .state('page.login', {
                url: '/login',
                title: 'Login',
                templateUrl: 'pages/login.html'
            })
            .state('page.register', {
                url: '/register',
                title: 'Register',
                templateUrl: 'pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: 'Recover',
                templateUrl: 'pages/recover.html'
            })
            .state('page.lock', {
                url: '/lock',
                title: 'Lock',
                templateUrl: 'pages/lock.html'
            })
            .state('app.specimatch-results', {
                url: '/specimatch-results/:p_type/:p_id',
                title: 'Specimatch results',
                templateUrl: helper.basepath('specimatch-results.html'),
                controller: 'ProductDetailsController',
                controllerAs: 'productDetails',
                resolve: angular.extend(
                    helper.resolveFor('oitozero.ngSweetAlert'), {
                        productDetails: ['$stateParams', 'SpecimatchService', function($stateParams, SpecimatchService) {
                            var params = {
                                p_type: $stateParams.p_type,
                                p_id: $stateParams.p_id
                            };
                            return SpecimatchService.productDetails(params);
                        }]
                    }
                )
            })
            .state('app.patient-list', {
                url: '/patient-list',
                title: 'Patient list',
                templateUrl: helper.basepath('patient-list.html'),
                resolve: helper.resolveFor('datatables', 'ngDialog', 'inputmask', 'oitozero.ngSweetAlert')
            })
            .state('app.patient-details', {
                url: '/patient-details/:patient_id',
                title: 'Patient details',
                controller: 'PatientDetailsController',
                templateUrl: helper.basepath('patient-details.html'),
                resolve: angular.extend(
                    helper.resolveFor('oitozero.ngSweetAlert'), {
                        getPatientFiles: ['PatientDetailsService', '$stateParams', '$rootScope', function(PatientDetailsService, $stateParams, $rootScope) {
							var patient_id = $stateParams.patient_id;
                            return PatientDetailsService.getPatientFiles({patient_id:patient_id});
                        }],
                        getBoxKeys: ['PatientDetailsService', function(PatientDetailsService) {
                            return PatientDetailsService.getBoxKeys();
                        }]
                    }
                )
            })
            .state('dicom-viewer', {
                url: '/dicom-viewer/:dicom_id',
                title: 'Patient File',
                controller: 'DicomViewController',
                templateUrl: helper.basepath('file-dicom-viewer.html'),
                resolve: angular.extend(
                    helper.resolveFor(), {
                        getBoxKeys: ['PatientDetailsService', function(PatientDetailsService) {
							return PatientDetailsService.getBoxKeys();
                        }]
                    }
                )
            })
            .state('app.search-results', {
                url: '/search-results',
                title: 'Search results',
                templateUrl: helper.basepath('search-results.html')
            })
            .state('app.search-treatments', {
                url: '/search-treatments',
                title: 'Search treatments',
                templateUrl: helper.basepath('search-treatments.html'),
            })
            .state('app.search-trials', {
                url: '/search-trials',
                title: 'Search trials',
                templateUrl: helper.basepath('search-trials.html'),
            })
            .state('app.specimatch-drugs', {
                url: '/specimatch-drugs',
                title: 'Specimatch drugs',
                templateUrl: helper.basepath('specimatch-drugs.html'),
            })
            .state('app.specimatch-content', {
                url: '/specimatch-content',
                title: 'Specimatch content',
                templateUrl: helper.basepath('specimatch-content.html'),
            })
            .state('app.billing', {
                url: '/billing',
                title: 'Patient billing',
                templateUrl: helper.basepath('billing.html'),
                controller: 'BillingController',
                controllerAs: 'billing',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins')
            })
            .state('app.account-info', {
                url: '/account-info',
                title: 'Account Info',
                templateUrl: helper.basepath('account-info.html'),
                resolve: helper.resolveFor('oitozero.ngSweetAlert')
            })
            .state('whiteBoard', {
                url: '/whiteBoard/:whiteBoardUrl',
                title: 'WhiteBoard',
                controller: 'WhiteBoardController',
                templateUrl: helper.basepath('white-board.html')
            })
            //
            // CUSTOM RESOLVES
            //   Add your own resolves properties
            //   following this object extend
            //   method
            // -----------------------------------
            // .state('app.someroute', {
            //   url: '/some_url',
            //   templateUrl: 'path_to_template.html',
            //   controller: 'someController',
            //   resolve: angular.extend(
            //     helper.resolveFor(), {
            //     // YOUR RESOLVES GO HERE
            //     }
            //   )
            // })
        ;

    } // routesConfig

})();
