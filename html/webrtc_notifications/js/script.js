$(document).ready(function(){
  var peer, conn, connected = false;

  $("#saveName").click(function(){
    $('.waiting').show();
    $("#saveName").prop('disabled', true);

    peer = new Peer($('#myName').val(), {key: 'l1tpajr4hvdeu3di'});
    conn = peer.connect($('#userName').val());
    conn.on('open', onConnect);
    conn.on('data', function(data){

      addMessage($('#userName').val(), data);

    });
    peer.on('connection', function(externalConnection){
      
      if(!connected){
        conn = peer.connect($('#userName').val());
        onConnect();
      }

      externalConnection.on('data', function(data){
        addMessage($('#userName').val(), data);
      });

    });
  });


  function onConnect(){
    connected = true;
    $('.waiting').hide();
    $('#myName, #userName').prop('disabled', true);
    $('.onready').slideDown();
  }

  function addMessage(author, message){
    $('#log').text( $('#log').text() + author + ": " + message + "\n");
  }

  $('#send').click(function(){
    conn.send($('#input-text').val());
    addMessage('You', $('#input-text').val());
    $('#input-text').val('');
  });

});