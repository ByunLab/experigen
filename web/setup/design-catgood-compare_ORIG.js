var setCookie = function (name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
};

var getCookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
    return null;
};

var listscreens = function() {
	var ret = [];
	for(var i = Experigen.position; i < Experigen._screens.length; i++){
	    ret.push({n: i, view: Experigen._screens[i].view});
		console.log("n: " + i, ", view: " + Experigen._screens[i].view);
	}
	return ret;
};

Experigen.recordDemographicsResponse = function(that){
	if(Experigen.settings.version!="es"){
		var yob = parseInt($("select[name=yearofbirth]").val());
		var enga = parseInt($("input[name=englishacquired]").val());
		var cont = 1;
		if(yob>=1998) cont = 0;
		if($("select[name=onlyenglish]").val()!="yes"){
			if(isNaN(enga)) enga = 10;
			if(enga > 6) cont = 0;
		}
		
		if($("select[name=speechimpairment]").val()!="no" || $("select[name=heairingimpairment]").val()!="no") cont = 0;

		if($("input[name=headphones]").val()==="" || $("input[name=headphones]").val()=="none") cont = 0;
		
		if(!cont){
			this.addStaticScreen("goodbyedemo.ejs");
			this.rewind(this._screens.length-1);
		}
	}
	Experigen.recordResponse(that);
};


Experigen.trainingAnswer = function(userResponse,cr) {
    userResponse = userResponse == "Word 1" ? "File1" : "File2";
    console.log(userResponse,cr);
    Experigen.accuracyTotal++;
    Experigen.accuracy+=(userResponse==cr);
    if(userResponse==cr)
	return 'Your answer is right.';
    else
	return 'Not quite.';;
};

Experigen.calculateCatches = function () {
	var resp = [];
	var intend = [];
	for(var i = 0; i < Experigen.catches.length; i++) {
		resp.push(Experigen.catches[i].judgment);
		intend.push(parseInt(Experigen.catches[i].intended));
	}

	var prompt;
	var correct = 0;
	for(i = 0; i < resp.length; i++)
		if(intend[i] == resp[i]) correct++;
	

	if(correct / resp.length >= 0.8){
		prompt = "You have met the minimum accuracy criterion on our attention trials. Your responses are recorded.<br>";
	}
	else {
		prompt = "We are sorry, you did not meet the minimum accuracy criterion on our attention trials. Your responses will be subject to further review. <br>";
	
		prompt += "<br> correct percentage = " + (correct/resp.length*100).toFixed(1);
		prompt += ("<br> correct = " + correct + ", resp.length = " + resp.length + ", resp[0] = " + resp[0] + ", intend[0] = " + intend[0]);
		prompt += (", resp[1] = " + resp[1] + ", intend[1] = " + intend[1] + ", resp[2] = " + resp[2] + ", intend[2] = " + intend[2] + ",");
		prompt += (", Experigen.catches: " + Experigen.catches.toString() + " +.");
	}
	
	return prompt;
};

Experigen.rewind = function (bookmark) {
	this.position = bookmark - 1;
	Experigen.advance();
};

Experigen.setBookmark = function () {
	return (this._screens.length);
};

Experigen.getBlocksDone = function () {
	
	var rv = [];
	var blocks = getCookie(Experigen.settings.cookieprefix + "blocks");
	if (blocks) {
		rv = blocks.split('.');
	}
	
	return rv;
};

Experigen.addBlockDone = function(block) {
	var blocks = Experigen.getBlocksDone();
	var out = blocks.concat(block).join('.');
	setCookie(Experigen.settings.cookieprefix + "blocks",out,30);
};

Experigen.clearCookies = function() {
	setCookie(Experigen.settings.cookieprefix + "blocks","",-1);
	setCookie(Experigen.settings.cookieprefix + "fail","",-1);
};

Experigen.initialize = function () {
    if(!Experigen.settings.version) Experigen.settings.version = "full";
    if(Experigen.settings.version=="full" || Experigen.settings.version=="ns"){
	var ban = getCookie(Experigen.settings.cookieprefix+"fail");
	if(ban == "ban"){
	    this.addStaticScreen("goodbyeban.ejs");
	    return;
	}
    }
    
    var nTrial = 4;
    var nEligibility = 20;
    var nExperiment = 10;
    var nCatch = 20;
    var bDone;
    var runEligibility = 1;
    var maxBlock = Experigen.settings.version=="generw" ? 3 : 1;
    var items  = this.resource("items");
    var practice_items = this.resource("practice_items");
    var test_items;
    if(Experigen.settings.version=="full")
	test_items = this.resource("test_items");
    var catch_items = this.resource("catch_items");
    this.blockToRun = -1;
    Experigen.catches = [];
    var eligibilityBlock;

    var trainingBlock = []
	.concat(practice_items.subset("Exists","1")) 
        .chooseRandom(10)
	.pairWith("view","training_CN.ejs")
	.shuffle();
    
    if(Experigen.settings.version=="full"){					
	eligibilityBlock = []
	    .concat(test_items)  //.chooseRandom(nEligibility)) 
	    .pairWith("view","eligibility.ejs")
	    .shuffle();
    }

  // if you want blocks:
    //	.concat(items.subset("Block",this.blockToRun.toString()))
    experimentBlock = items
	.pairWith("view","stimulus_catgoodcompare.ejs")						 
	.concat(catch_items.chooseRandom(nCatch) // 20
	//TM temporarily set view to be same for catch and main items; need to fix
		.pairWith("view","stimulus_catgoodcompare.ejs"))
    .shuffle();
		
	while(experimentBlock[0].view=="catch_CN.ejs"){
	toEnd = experimentBlock.shift()
	experimentBlock = experimentBlock.concat(toEnd);
    }
    
    
    this.accuracyTotal = 0;
    this.accuracy = 0;
    this.eligResponses = [];
    var prop;

    
    if(!Experigen.settings.plugins)
	wp.init();
    else if (Experigen.settings.plugins.indexOf("wavplayer") != -1)
	wp.init();

    
    //wp.appendFlash();

	this.sectionStart = 0;
	this.addStaticScreen("getinfocatgoodcompare.ejs");
	this.addStaticScreen("introcatgoodcompare.ejs");
    //}
    //	this.addStaticScreen("toexperiment.ejs");
    this.sectionEnd = this.setBookmark();
    this.progressbar.addSectionBreak();
    //if(runEligibility && Experigen.settings.version != "generw" && Experigen.settings.version != "geners" && Experigen.settings.version != "epg"){
	//this.addStaticScreen("trainingintro_CN.ejs");
	//this.preTrainingBookmark = this.setBookmark();
	//this.addBlock(trainingBlock);
	//this.addStaticScreen("trainingend.ejs");
	//this.trainingEndBookmark = this.setBookmark();
	this.progressbar.addSectionBreak();
	if(Experigen.settings.version=="full"){
	    this.bookmark = this.setBookmark();
	    this.addStaticScreen("eligibilityintro.ejs");
	    this.addBlock(eligibilityBlock);
	    
	    
	    this.addStaticScreen("eligibilitydecision.ejs");
	    this.progressbar.addSectionBreak();
	    this.eligEndBookmark = this.setBookmark();
	}
    //}
    
    if(Experigen.settings.version == "ns") this.bookmark = this.setBookmark();
    //this.addStaticScreen("ratingintro.ejs");
    this.addBlock(experimentBlock);

    this.progressbar.addSectionBreak();
    this.stimEndBookmark = this.setBookmark();	
	this.addStaticScreen("finalthankscatgoodcompare.ejs");
    
};
