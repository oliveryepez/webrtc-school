$(document).ready(function(){
	/*************** Kandy Setup ****************/
		KandyAPI.Phone.setup({
			listeners: {
				setupsuccess: onSetupSuccess,
	            setupfailed: onSetupFailed,
	            loginsuccess: onLoginSuccess,
	            loginfailed: onLoginFailed,
	            callinitiated: onCallInitiate,
	            callinitiatefailed: onCallInitiateFail,
	            callrejected: onCallRejected,
	            callrejectfailed: onCallRejectFailed,
	            callignored: onCallIgnored,
	            callignorefailed: onCallIgnoreFailed,
	            callincoming: onCallIncoming,
	            callanswered: onCallAnswer,
	            callansweredFailed: onCallAnsweredFailed,
	            oncall: onCall,
	            callended: onCallTerminate,
	            callendedfailed: onCallEndedFailed,
	            presencenotification: onPresenceNotification
			}
		});


	$("#frm_login").submit(function(e){

	e.preventDefault();

	var projectAPIkey = "DAK00068abf414f4e6fa818a123a1f3fd4d";
	var username = $('#txt_username').val();
	var password = $('#txt_password').val();
/**************** Kandy Login & Logout ****************/	
		alert("username: " + username + " password: "  + password);
		KandyAPI.Phone.login(projectAPIkey, username, password);

	});

	KandyAPI.Phone.logout(function(){

		});

/**************** Login Functions *********************/		
		function onLoginSuccess(){
			$("#login_form").addClass('hide-form');
		}

		function onLoginFailed(){
			alert("No se conecto");
		}
});