(function() {
    'use strict';

    angular
        .module('app.conference')
        .controller('ConferenceController', ConferenceController);

    ConferenceController.$inject = [
        '$scope',
        '$rootScope',
        '$cookies',
        'ConferenceService',
        '$interval',
        '$state',
        'EnvironmentConfig'
    ];

    function ConferenceController($scope, $rootScope, $cookies, ConferenceService, $interval, $state, EnvironmentConfig) {

        var params = {};
        $scope.confUsers = [];
        $scope.startConfCall = startConfCall;
        $scope.joinConference = joinConference;
        $scope.leaveConference = leaveConference;
        $scope.getConferenceUsers = getConferenceUsers;
        $scope.startConfCall = startConfCall;
        $scope.auth_token = $cookies.get('token');
        $scope.conferenceId = '';
        $scope.joinDisable = false;
        $scope.leaveDisable = true;
        $scope.activeConferenceId = '';
        $scope.upCommingConferences = [];
        $scope.shareWhiteBoard = shareWhiteBoard;
        $scope.JoinDiv = true;
        $scope.whiteBoardDisable = true;
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        $scope.convertDate = function(value) {
            var date = new Date(value);
            return (monthNames[date.getMonth()] + ' ' + date.getDate());
        }

        $scope.convertTime = function(value, flag) {
            var d = new Date(value);
            var hr = d.getHours();
            var min = d.getMinutes();
            if (min < 10) {
                min = "0" + min;
            }
            var ampm = hr < 12 ? "am" : "pm";

            if (flag) {
                var data = {
                    time: hr + ':' + min,
                    ampm: ampm
                }
                return data;
            } else {
                return hr + ':' + min + ' ' + ampm;
            }
        }

        $scope.currentTime = $scope.convertTime(new Date(), true).time;
        $scope.amPm = $scope.convertTime(new Date(), true).ampm;
        $scope.currentDate = $scope.convertDate(new Date());

        params.auth_token = 'randy.arrowood@b4cc.com';

        if (params.auth_token) {
			// get twilio token from server to use twilio service
            ConferenceService.getTwilioToken(params).then(
                function(res) {
                    if (res.type == 'success') {
                        Twilio.Device.setup(res.data.token, {
                            debug: true,
                            region: "ie1"
                        });
                    } else {
                        console.log(res.message);
                    }
                }
            );
        }

        function updateConfStatus(status) {
            console.log(status);
        }

        // Start a conference call (conference generator)
        function startConfCall() {
            $scope.conferenceId = Math.floor(Math.random() * 90000) + 10000;
            console.log($scope.conferenceId + 'is the current conference id');

            var params = {
                    conference_id: $scope.conferenceId
                }
                // generate the conference call
            ConferenceService.generateConference(params).then(
                function(res) {
                    if (res.type == 'success') {
                        var params = {
                            conf_id: $scope.conferenceId
                        }
                        Twilio.Device.connect(params);
                        $scope.activeConferenceId = $scope.conferenceId;
                        $scope.getConferenceUsers();
                        $scope.joinDisable = true;
                        $scope.leaveDisable = false;
                        $scope.whiteBoardDisable = false;
                    } else {
						console.log('Error while generating conference call');
                    }
                }
            );
        }


        // Join conference as a new participant
        function joinConference(conferenceId) {

            if (conferenceId != '') {
                var params = {
                    conf_id: conferenceId
                }

                $scope.activeConferenceId = conferenceId;
                $scope.getConferenceUsers();
                Twilio.Device.connect(params);
                $scope.joinDisable = true;
                $scope.leaveDisable = false;
                $scope.whiteBoardDisable = false;
            } else {
                console.log('Please add conf id');
                return;
            }
        }

        // get participants in conference
        function getConferenceUsers() {
            $interval(function() {
                if ($scope.activeConferenceId) {
                    var params = {
                        conference_id: $scope.activeConferenceId
                    }
                    ConferenceService.getConferencesParticipants(params).then(
                        function(res) {
                            if (res.type = 'success') {
                                $scope.confUsers = res.data[0].participants;
                            }
                        }
                    );
                } else {
                    $scope.confUsers = [];
                }
            }, 10000);
        }

        // function to leave conference call
        function leaveConference() {
            if ($scope.activeConferenceId) {
                $scope.JoinDiv = true;
                var params = {
                    conference_id: $scope.activeConferenceId
                }
                ConferenceService.disconnectConferences(params).then(
                    function(res) {
                        if (res.type = 'success') {
							console.log('call disconnected successfully');
                        }
                    }
                );
                $scope.activeConferenceId = '';
                // Disconnect call from Twilio
                Twilio.Device.disconnectAll();
            }
        }
		
		
		// get all upcoming conferences
        function getUpcomingConferences() {
            ConferenceService.upcomingConferences(params).then(
                function(res) {
                    if (res.type = 'success') {
                        $scope.upCommingConferences = res.data;
                    }
                }
            );
        }
		
        getUpcomingConferences();
        $interval(function() {
            getUpcomingConferences();
        }, 9000);

        $scope.activateMic = function() {
            console.log("clicked mic");
            $rootScope.activeMic = !$rootScope.activeMic;
        };

        /* Callback to let us know Twilio Client is ready */
        Twilio.Device.ready(function(device) {
            updateConfStatus("Ready");
        });
		
		
		// Open share whiteboard of the current conference session
        function shareWhiteBoard() {
            if ($scope.activeConferenceId) {
                var uri = EnvironmentConfig.whiteBoardUri + $scope.activeConferenceId + '/randy@appalope.com';
                uri = encodeURIComponent(uri);
                var url = $state.href('whiteBoard', {
                    whiteBoardUrl: uri
                });
                
                window.open(url, '_blank');
            }
        }

        Twilio.Device.connect(function(connection) {
            console.log('contconnect');
            // Enable the hang up button and disable the call buttons
            $scope.joinDisable = true;
            $scope.leaveDisable = false;

            // If phoneNumber is part of the connection, this is a call from a
            // support agent to a customer's phone
            if ("phoneNumber" in connection.message) {
                updateConfStatus("In call with " + connection.message.phoneNumber);
            } else {
                // This is a call from a website user to a support agent
                updateConfStatus("In call with user");
            }
        });
		
		// Event when user disconnects from the conference
        Twilio.Device.disconnect(function(connection) {
            console.log('contdisconnect');
            // Disable the hangup button and enable the call buttons
            $scope.joinDisable = false;
            $scope.leaveDisable = true;
            $scope.whiteBoardDisable = true;
            $scope.confUsers = [];
            updateConfStatus("Ready");
        });

        /* Report any errors to the call status display */
        Twilio.Device.error(function(error) {
            updateConfStatus("ERROR: " + error.message);
        });
		
		/* refresh main conference panel by selecting some ongoing conference */ 
        $scope.makeConferenceActive = function(conference_id, date, time) {
            $scope.JoinDiv = false;
            $scope.joinConfId = conference_id;
            $scope.currentDate = date;
            var t = time.split(' ');
            $scope.second_currentTime = t[0];
            $scope.second_amPm = t[1];
        }
    };
})();
