<!--
// Copyright 2013-2015 Digital Codex LLC
// You may use this code for your own education.  If you use it
// largely intact, or develop something from it, don't claim that
// your code came first.  You are using this code completely at
// your own risk.  If you rely on it to work in any particular
// way, you're an idiot and we won't be held responsible.
-->

// This SDP modification code makes a number of assumptions:
// 1. There is at most one audio, one video, and one data m= line in any order
// 2. Every codec payload has an rtpmap attribute
// 3. In an SDP offer, if the desired codec isn't present, all codecs are left
// 4. In an SDP answer, if the desired codec isn't present, the media stream is declined

function modifySdpCodec(localDesc, mCodec, media) {
  var localDesc;  // SDP description object
  var codec = mCodec;		// media codec
  var mediaType = media;	// media type

  var NOT_FOUND = -1, payloadType = NOT_FOUND,
      codecPattern, codecLine, startMLine, endMLine,
      position, replacedString, mLineString, startOfMLine,
      newMLine, patternForRtpMap, RtpMap, portString;
		
  var desc = localDesc;
		
  if (localDesc.type == "offer") {   // SDP is an offer
  
    // First find codec in SDP and extract payload type
    if (codec != null) {
      codecPattern = new RegExp("a=rtpmap:([0-9]{1,3}) " + codec, "i");
      codecLine = codecPattern.exec(desc.sdp);
      if (codecLine != null) {
        payloadType = codecLine[1];
      }
      console.log("Payload for " + mediaType +
                  " codec " + codec + " is " + payloadType);
    }	
    if (payloadType != NOT_FOUND) {		

      // Find start and stop of media attributes
      startMLine = desc.sdp.search("m=" + mediaType);
      if (startMLine == NOT_FOUND) {                // no m= line exists
        startMLine = desc.sdp.length - 1;				
        endMLine = desc.sdp.length - 1;		
      } else {  			            // m= line exists
        endMLine = desc.sdp.indexOf("m=", startMLine + 2);
        if (endMLine == NOT_FOUND) { // This m= line is last in SDP
          endMLine = desc.sdp.length - 1;
        }
        
        // Remove all other payload types from the m= line	
        position = desc.sdp.search(codecPattern);  // find position of codec
        if ((position > startMLine) && (position < endMLine)) {
          mLinePattern = new RegExp("m=" + mediaType + ".{1,}\r\n", ""); 
          mLineString = mLinePattern.exec(desc.sdp)[0]; 
          startOfMLine = /\S{1,} \S{1,} \S{1,}/.exec(mLineString)[0];
          newMLine = startOfMLine + " " + payloadType + "\r\n";
          console.log("Resulting " + mediaType +
                      " media line is " + newMLine);	
          desc.sdp = desc.sdp.replace(mLineString,newMLine);	
        } else {
          payloadType = NOT_FOUND; // payload is not in m= line
          console.log(mediaType + " codec " + codec + " is not in m= line");
        }	
      }
      console.log(mediaType + " media line is from " +
                  startMLine + " to " + endMLine);
    }		
    if (payloadType != NOT_FOUND) {
      // Find all a=rtpmap lines for this m= line and remove if not
      // desired codec					 
      patternForRtpMap = /a=(rtpmap|fmtp|rtcp-fb):.{1,}\r\n/g;
      // Create temporary copy for repeated removal of RTPMAPs
      replacedString = desc.sdp;
      while ((RtpMap = patternForRtpMap.exec(desc.sdp)) != null) {
        RtpMapPayload = /[0-9]{1,3}/.exec(RtpMap);
        if ((payloadType != NOT_FOUND)
            && (RtpMapPayload != payloadType) 
            && (patternForRtpMap.lastIndex > startMLine) 
	    && (patternForRtpMap.lastIndex < endMLine))	{
          replacedString = replacedString.replace(RtpMap[0], "");
//	    console.log("Removing"); 
        } else {
//	    console.log("Not removing"); 	
	}
      }
      desc.sdp = replacedString;	
    }
  } else {  // sdp is answer
    if (codec != null) {  
      // Find if codec is present in answer
      codecPattern = new RegExp(codec, "i");  
      position = desc.sdp.search(codecPattern);
      if (position != NOT_FOUND) {
        // codec present, so remove all others from m= line
        console.log("Do nothing to remove other codecs from SDP answer");
      } else {
        // codec is not present, so decline m= line by setting port to 0
        mLinePattern = new RegExp("m=" + mediaType + ".{1,}\r\n", "");
        mLineString = mLinePattern.exec(desc.sdp)[0]; // get m= line
        portString = /[0-9]{1,5}/.exec(mLineString)[0]; // get port in m=
        newMLine = mLineString.replace(portString, "0"); // decline m=
        console.log("Found port: " + portString + " Declining " +
                    mediaType + " media with " + newMLine);		
	desc.sdp = desc.sdp.replace(mLineString, newMLine);		
      }
    }
  }
  //  console.log("Resulting SDP \n" + desc.sdp);
  return(desc);
}

function sdpChangeFingerprint(localDesc)	{
  var desc = localDesc;	

  desc.sdp = desc.sdp.replace(/a=fingerprint:sha-256 ..:../,
                              "a=fingerprint:sha-256 FF:00");
  console.log("Changing a=fingerprint"); 
  return(desc);
}

function sdpError(e)	{
  console.log("SDP Error " + e);
  send("Remote SDP Error ");
  send(e);
}


