var file = document.createElement('script')
file.setAttribute("type","text/javascript")
file.setAttribute("src", "peer.min.js");
document.getElementsByTagName("head")[0].appendChild(file);


var myName = 'Oliver';
var contactName = 'Jorge';

function onConnect(){
	console.log('Connected');
	/*chrome.notifications.create("User is waiting", {
		type: 'basic',
		title: "Your contact is online",
		message: "He/She's waiting in webchat.",
		iconURL: 'http://www.google.com/favicon.ico'
	}, function(){});*/
	if (window.webkitNotifications) {
	  console.log("Notifications are supported!");
	}
	else {
	  console.log("Notifications are not supported for this Browser/OS version yet.");
	}
}

function init(){
	if(typeof Peer === 'function'){
		console.log('Init');
		var peer = new Peer(myName, {key: "44ya1n4kmlfvfgvi"});
		var conn =  peer.connect(contactName);
		peer.on('connection', function(externalConnection){
			console.log('Notification');
			onConnect();
		});
	}else{
		console.log('waiting...');
		setTimeout(init, 1000);
	}
}

init();