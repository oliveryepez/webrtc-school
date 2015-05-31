<!--
// Copyright 2013-2015 Digital Codex LLC
// You may use this code for your own education.  If you use it
// largely intact, or develop something from it, don't claim that
// your code came first.  You are using this code completely at
// your own risk.  If you rely on it to work in any particular
// way, you're an idiot and we won't be held responsible.
-->

// This candidate filtering code:
// modifies SDP in modifySdpCandidates, and 
// determines if trickle candidate should be sent in filterCandidate

function modifySdpCandidates(desc) {		// filter candidates
  var candidateString, replacedString,
      patternForCandidate = /a=candidate:.{1,}\r\n/g;
  var patternForCandidateType = /(\S{1,} ){7}(\S{1,}) /; 
		
  replacedString = desc.sdp;			
  while ((candidateString = patternForCandidate.exec(desc.sdp)) !== null) {
    candidateType = patternForCandidateType.exec(candidateString)[2];
//    console.log("Found candidate with candidate type " + candidateType);

    if (!candidateMatches(candidateType)) {	// remove candidate
      replacedString = replacedString.replace(candidateString,"");
//      console.log("Removing");		
    }
  }
  desc.sdp = replacedString;	
  return(desc);
}

function filterCandidate(cand) {
  var candidate = cand,
      result = false,
      candidateType = null;
  var patternForCandidateType = /(\S{1,} ){7}(\S{1,}) /; 	
  var candidateTypeList = patternForCandidateType.exec(candidate);

  if (candidateTypeList != null) {
    candidateType = candidateTypeList[2];
  }
  if (candidateMatches(candidateType)) {
//    console.log("Sending candidate with candidate type " + candidateType);
    result = true;
  } else {
//    console.log("Filtering out candidate type " + candidateType);
    result = false;
  }
  return(result);    		
}

function modifySdpDirection(desc) {  // Change directionality of all streams
  var desc;

  desc.sdp = desc.sdp.replace("a=sendrecv", "a=sendonly");	// audio hold
  desc.sdp = desc.sdp.replace("a=sendrecv", "a=sendonly");	// video hold
  return(desc);			
}

function candidateMatches(candType) {
  var candType;

  return (((candType == "host") && hostc) ||
	  ((candType == "srflx") && srflxc) ||
	  ((candType == "relay") && relayc));
}

function  filterCandidate64(cand) {
  var candidate = cand,
      result = false,
      candidateType = null,
      patternForCandidateAddress = /2002/; 	
  var candidateTypeList = patternForCandidateAddress.exec(candidate);

  if (candidateTypeList !== null) {
    candidateType = candidateTypeList[0];
  }
  if (candidateType !== null) {
    console.log("Sending candidate with candidate type " + candidateType);
    result = true;
  } else {
    console.log("Filtering out candidate type " + candidateType);
    result = false;
  }
  return(result);    		
}
