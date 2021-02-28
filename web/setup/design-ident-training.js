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
}

Experigen.clearCookies = function() {
	setCookie(Experigen.settings.cookieprefix + "blocks","",-1);
	setCookie(Experigen.settings.cookieprefix + "fail","",-1);
}

Experigen.trainingAnswer = function(given,cr) {
	//map responses from rake/wake to 1/0 (rake = 1)
	var userResponse = given == 'rake' ? 1 : 0;
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
			prompt = "We are sorry, you did not meet the minimum accuracy criterion on our attention trials. <br>";
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
	var oneCycle = items.pairWith("view", "identtrainingtask.ejs");
	var mainBlock = []
		NCYCLES = 2; 
		for(var i = 1; i <= NCYCLES; i++){
		currentCycle = oneCycle
			.shuffle()
			.pairWith("cycle", i);
		mainBlock = mainBlock.concat(currentCycle);
		}	
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
	this.mainResponses = [];
	var prop;
	this.sectionStart = 0;
	this.addStaticScreen("getinfoidenttraining.ejs");
	this.addStaticScreen("introidenttraining.ejs");
	this.sectionEnd = this.setBookmark();
	if(runMain){
	//	Training task with option to repeat
		this.preTrainingBookmark = this.setBookmark();
		this.addBlock(trainingBlock);
		this.addStaticScreen("trainingendident.ejs");
		this.trainingEndBookmark = this.setBookmark();
		//this.bookmark = this.setBookmark()
	// Main task - four times with breaks
		this.addStaticScreen("identmainintro.ejs");
		this.addBlock(mainBlock);
		this.addStaticScreen("break.ejs");
		this.addBlock(mainBlock);
    	this.addStaticScreen("break.ejs");	
    	this.addBlock(mainBlock);
    	this.addStaticScreen("break.ejs");	
    	this.addBlock(mainBlock);
		this.mainEndBookmark = this.setBookmark();

	}
	
	this.addStaticScreen("finalthanksident.ejs");

}