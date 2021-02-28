setCookie = function (name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

getCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
    return null;
};

Experigen.clearCookies = function() {
	setCookie(Experigen.settings.cookieprefix + "blocks","",-1);
	setCookie(Experigen.settings.cookieprefix + "fail","",-1);
}

Experigen.trainingAnswer = function(given,cr) {
	//map responses from right/wrong to 1/0 (right = 1)
	var userResponse = given //== 'Right' ? 1 : 0;
	//increment total responses
	Experigen.accuracyTotal++;
	//increment accuracy if correct 
	Experigen.accuracy+=(userResponse==cr);
	if(userResponse==cr)
		return 'Correct.';
	else
		return 'Incorrect.';
}

Experigen.calculateCatches = function () {
	var resp = [];
	var intend = [];
	for(var i = 0; i < Experigen.catches.length; i++) {
		resp.push(Experigen.catches[i].judgment);
		intend.push(Experigen.catches[i].intended);
	}
	var prompt;
	var correct = 0;
	for(var i = 0; i < resp.length; i++)
		if(intend[i] == resp[i]) correct++;
	if(correct / resp.length >= .8){
		prompt = "You have met the minimum accuracy criterion on our attention trials. Your responses are recorded.<br>";
	}
	else {
		prompt = "We are sorry, you did not meet the minimum accuracy criterion on our attention trials. Your responses to this set will be rejected. <br>";
	}
	prompt += "<br> correct percentage = " + (correct/resp.length*100).toFixed(1);
	return prompt;
}

Experigen.rewind = function (bookmark) {
	this.position = bookmark - 1;
	Experigen.advance();
}

Experigen.setBookmark = function () {
	return (this._screens.length);
}

var btrMatch = window.location.pathname.toString().match(/TGF([0-9]*)\./);
if(btrMatch.length < 2 || btrMatch[1].length < 1) {
	this.blockToRun = 1;
	console.error("Could not derive block to run based on URL! Defaulting to 1.");
}
else{
	this.blockToRun = parseInt(btrMatch[1],10);
}
if(Experigen.getBlocksDone().indexOf(this.blockToRun) !== -1){
Experigen.addStaticScreen("blockalreadydone.ejs");
return;
}
else {
Experigen.addBlockDone("1");
}

Experigen.getBlocksDone = function () {
	
	var rv = [];
	var blocks = getCookie(Experigen.settings.cookieprefix + "blocks");
	if (blocks) {
		rv = blocks.split('.');
	}
	
	return rv;
}


Experigen.initialize = function () {
	var nTrial = 4;
	var nMain = 20;
	var nExperiment = 10;
	var nCatch = 20;
	var bDone;
	var runMain = 1;
	var maxBlock = 50;
	var items  = this.resource("items");
	var practice_items = this.resource("practice_items");
	var test_items = this.resource("test_items");
	var catch_items = this.resource("catch_items");
	this.blockToRun = -1;
	Experigen.catches = [];
	var trainingBlock = []
						.concat(practice_items.subset("Exists","1")) //.chooseRandom(nTrial))
						.pairWith("view","identtraining.ejs")
						.shuffle();		
	//var mainBlock = []
	//					.concat(test_items)  //.chooseRandom(nMain)) 
	//					.pairWith("view","catgood.ejs")
	//					.shuffle();
	//Added the below and commented out the above in effort to add block-based selection
	var mainBlock = items.subset("Block",this.blockToRun+"")//.chooseRandom(nMain)
    	.pairWith("view","catgood.ejs").shuffle();
	bDone = Experigen.getBlocksDone();
	if(bDone.length == maxBlock-1){ // subject has done it all
		bDone.length = 0;
		bDone == [];
		Experigen.clearCookies();
	}
	if(bDone.length % 5 != 0){
		runMain = 0;
	}
	do{
		this.blockToRun=Math.floor(Math.random()*(maxBlock)+1);
	} while ($.inArray(this.blockToRun.toString(),bDone)  > -1);
	
	this.attemptNumber = bDone.length + 1;
	this.accuracyTotal = 0;
	this.accuracy = 0;
	Experigen.total = 0;  
	this.eligResponses = [];
	var prop;
	this.sectionStart = 0;
	this.addStaticScreen("getinfocatgood.ejs");
	this.addStaticScreen("introcatgood.ejs");
	this.sectionEnd = this.setBookmark();
	if(runMain){
		this.preTrainingBookmark = this.setBookmark();
		this.trainingEndBookmark = this.setBookmark();
		this.bookmark = this.setBookmark()
		this.addBlock(mainBlock);
		this.eligEndBookmark = this.setBookmark();

	}
	
	this.addStaticScreen("finalthankscatgood.ejs");
}