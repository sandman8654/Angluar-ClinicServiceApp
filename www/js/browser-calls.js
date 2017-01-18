/**
 * Twilio Client configuration for the browser-calls-rails
 * example application.
 */
 
// Store some selectors for elements we'll reuse
var callStatus = $("#conf-status");
var $my_request;
var $clear_interval;

var apiUrl = "http://52.87.207.32:8080/";

/* Helper function to update the call status bar */
//~ function updateCallStatus(status) {
    //~ $("#conf-status").text(status);
//~}

/* Get a Twilio Client token with an AJAX request */
  $(document)
      .ready(function () {
          $.post(apiUrl + "token/generate", {
              page: window.location.pathname,
              user_id: 'USER_' + Math.floor(Math.random() * 90000) + 10000
          }, function (data) {
  
            //~ // Set up the Twilio Client Device with the token
              $("#me")
                  .html('Your ID: ' + data.user_id);
              Twilio.Device.setup(data.token, {
                  debug: true,
                  region: "ie1"
              });
          });
      });

var chatUsers = [];

//~ Twilio.Device.presence(function (presenceEvent) {
    //~ console.log(presenceEvent.from + " available: " + presenceEvent.available);
    //~ var userIndex = chatUsers.indexOf(presenceEvent.from);
    //~ if (userIndex == -1 && presenceEvent.available == true) {
        //~ chatUsers.push(presenceEvent.from);
    //~ }
    //~ if (userIndex != -1 && presenceEvent.available == false) {
        //~ chatUsers.splice(userIndex, 1);
    //~ }
    //~ $("#user_list")
        //~ .html('');
    //~ if (chatUsers.length == 0) {
        //~ $("#user_list")
            //~ .html('<div class="well-sm">No user online.</div>');
    //~ } else {
        //~ var called_email;
        //~ $.each(chatUsers, function (index, value) {
            //~ called_email = "'" + value + "'";
            //~ $("#user_list")
                //~ .append('<div class="panel-body"><div class="pull-right"><button onclick="callSupport(' + called_email + ')" type="button" class="btn btn-primary btn-lg call-customer-button"><span aria-hidden="true" class="glyphicon glyphicon-earphone"></span> Call User </button></div>Online: ' + called_email + '</div>');
        //~ });
    //~ }
//~ });

//~ /* Callback to let us know Twilio Client is ready */
 Twilio.Device.ready(function (device) {
    //~ updateCallStatus("Ready");
 });

//~ /* Report any errors to the call status display */
 Twilio.Device.error(function (error) {
      updateCallStatus("ERROR: " + error.message);
 });

/* Callback to determine if "support_agent" is available or not */
 Twilio.Device.presence(function (presenceEvent) {
     console.log(presenceEvent.from);
 });

/* Callback for when Twilio Client initiates a new connection */
  Twilio.Device.connect(function (connection) {
    //  // Enable the hang up button and disable the call buttons
      $(".hangup-button").prop("disabled", false);
      $(".join-conf-btn").prop("disabled", true);
//  
    //  // If phoneNumber is part of the connection, this is a call from a
    //  // support agent to a customer's phone
     if ("phoneNumber" in connection.message) {
        //  updateCallStatus("In call with " + connection.message.phoneNumber);
    //  } else {
        //  // This is a call from a website user to a support agent
        //~ updateCallStatus("In call with user");
    //~ }
//~ });

/* Callback for when a call ends */
//~ Twilio.Device.disconnect(function (connection) {
    //~ // Disable the hangup button and enable the call buttons
    //~ $(".hangup-button").prop("disabled", true);
    //~ $(".join-conf-btn").prop("disabled", false);
//~ 
//~ 
    //~ if ($my_request) {
        //~ clearInterval($clear_interval);
        //~ $my_request.abort();
    //~ }
    //~ $("#conf_list")
        //~ .html('<div class="panel-body"><div class="pull-right"></div><div class="well-sm">No one has joined conference.</div></div>');
    //~ $('#conf_id')
        //~ .html('');
//~ 
    //~ updateCallStatus("Ready");
//~ });

/* conference call from the home page */
//~ function confCall() {
    //~ updateCallStatus("Conference call...");
//~ 
    //~ var conf_id = Math.floor(Math.random() * 90000) + 10000;
    //~ $("#conf_id")
        //~ .html('<span><b>' + random_conf + '</b></span><span class="share_this_id">(Share this id with other user to invite them to join conference.)</span>');
    //~ // Our backend will assume that no params means a call to support_agent
//~ 
    //~ checkConfusers(conf_id);
//~ 
    //~ var params = {
        //~ "conf_id": conf_id
    //~ };
//~ 
    //~ Twilio.Device.connect(params);
//~ 
//~ }

//~ function confJoin() {
//~ 
    //~ updateCallStatus("Conference call...");
    //~ var conf_id = $("#conf_join_id")
        //~ .val();
//~ 
    //~ checkConfusers(conf_id);
//~ 
    //~ // Our backend will assume that no params means a call to support_agent
    //~ var params = {
        //~ "random_conf": conf_id
    //~ };
    //~ //var params = {"joinCnfId": conf_id};
//~ 
    //~ Twilio.Device.connect(params);
//~ 
//~}

//~ function checkConfusers(cnf_id) {
//~ 
    //~ $clear_interval = setInterval(function () {
//~ 
        //~ $my_request = $.ajax({
            //~ type: "POST",
            //~ url: apiUrl + "token/user",
            //~ data: {
                //~ conf_id: cnf_id
            //~ },
            //~ dataType: "json",
            //~ timeout: 20 * 1000, // in milliseconds
            //~ success: function (res) {
//~ 
                //~ $("#conf_list")
                    //~ .html("");
                //~ if (res.type === 'error') {
                    //~ $("#conf_list")
                        //~ .html('No Record Found.');
                //~ } else {
//~ 
                    //~ $.each(res.data, function (index, value) {
                        //~ $("#conf_list")
                            //~ .append(' <img src="img/user/01.jpg" alt="Image" class="img-circle" id=' + value + '>');
                    //~ });
                //~ }
            //~ },
            //~ error: function (request, status, err) {
                //~ if (status == "timeout") {
                    //~ //do somthing here
                //~ }
            //~ }
        //~ });
//~ 
    //~ }, 5 * 1000);
//~ 
//~ }

/* End a call */
//~ function hangUp() {
    //~ Twilio.Device.disconnectAll();
//~ }
