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

Experigen.recordDemographicsResponse = function(that){
	if(Experigen.settings.version!="es"){
		var yob = parseInt($("select[name=yearofbirth]").val());
		var enga = parseInt($("input[name=englishacquired]").val());
		var cont = 1;
		//if(yob>=1998) cont = 0;
		if($("select[name=onlyenglish]").val()!="yes"){
			if(isNaN(enga)) enga = 10;
			if(enga > 6) cont = 0;
		}
		
		if($("select[name=englishvariety]").val()!="Am") cont = 0;

    if($("select[name=speechimpairment]").val()!="no" || $("select[name=heairingimpairment]").val()!="no") cont = 0;
		
		if($("input[name=headphones]").val()=="" || $("input[name=headphones]").val()=="none") cont = 0;
		
		if(!cont){
			this.addStaticScreen("goodbyedemo.ejs");
			this.rewind(this._screens.length-1);
		}
	}
	Experigen.recordResponse(that);
}

Experigen.finalThanksStr = function(){
	var blocks = Experigen.getBlocksDone();
	var remain = 5 - (blocks.length % 5);
	var out = "";
	if(remain == 5){
		out = "";
	}
	else if (remain == 1){
		out = "You may come back and complete another block without taking the eligibility test again, if you use the same browser on the same computer. After that block, your pass will expire. ";
	}
	else {
		out = "You may come back and complete another " + remain + " blocks without taking the eligibility test again, if you use the same browser on the same computer. After those " + remain + " blocks your pass will expire. ";
	}
	return out;
}


Experigen.trainingAnswer = function(given,cr) {
	var userResponse = given == 'rake' ? 1 : 0;
	Experigen.accuracyTotal++;
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

ttest = function(vals){
	var tcrits = [12.7065, 4.3026, 3.1824, 2.7764, 2.5706, 2.4469, 2.3646, 2.306, 2.2621, 2.2282, 2.201, 2.1788, 2.1604, 2.1448, 2.1314, 2.1199, 2.1098, 2.1009, 2.093, 2.086, 2.0796, 2.0739, 2.0686, 2.0639, 2.0596, 2.0555, 2.0518, 2.0484, 2.0452, 2.0423, 2.0395, 2.0369, 2.0345, 2.0322, 2.0301, 2.0281,2.0262, 2.0244, 2.0227, 2.0211, 2.0196, 2.0181, 2.0167, 2.0154, 2.0141, 2.0129, 2.0117, 2.0106, 2.0096, 2.0086, 2.0076, 2.0066, 2.0057, 2.0049, 2.0041, 2.0032, 2.0025, 2.0017, 2.001, 2.0003, 1.9996, 1.999, 1.9983, 1.9977, 1.9971, 1.9966, 1.996, 1.9955, 1.995, 1.9944, 1.9939, 1.9935, 1.993, 1.9925, 1.9921,1.9917, 1.9913, 1.9909, 1.9904, 1.9901, 1.9897, 1.9893, 1.9889, 1.9886, 1.9883, 1.9879, 1.9876, 1.9873, 1.987, 1.9867, 1.9864, 1.9861, 1.9858, 1.9855,1.9852, 1.985, 1.9847, 1.9845, 1.9842, 1.984];
	if(vals.length != 2) throw "Two sets needed for t-test";
	var params = [{},{}];
	for(var i = 0; i < 2; i++){
		var s = 0, ss=0;
		for(var j = 0; j < vals[i].length; j++){
			s+= vals[i][j];
			ss+= vals[i][j]*vals[i][j];
		}
		params[i].mean = s/vals[i].length;
		params[i].n = vals[i].length;
		params[i].variance = (ss - ((s*s)/params[i].n))/(params[i].n-1);
		params[i].spn = params[i].variance/params[i].n;
	}
	var df = ((params[0].spn + params[1].spn)*(params[0].spn + params[1].spn)) / 
	         ((params[0].spn * params[0].spn)/(params[0].n-1) + (params[1].spn * params[1].spn)/(params[1].n-1));
	var tcrit = tcrits[Math.floor(df)-1];
	var se = Math.sqrt(params[0].spn + params[1].spn);
	return {lower_bound: (params[0].mean - params[1].mean - se*tcrit), upper_bound: (params[0].mean - params[1].mean + se*tcrit)};
}

Experigen.recordEligibility = function (userResponse){
	var prompt = 'Press the button to get to the next file.';
	/* for raw 80% eligibility
	 * Experigen.accuracyTotal++;
	 * Experigen.accuracy+=(userResponse==Experigen.screen().correct);
	 */
	this.f3f2.push(parseFloat(Experigen._screens[Experigen.position-1].F3_F2));
	this.eligResponses.push(userResponse);
	$('.dynamicText1').html(prompt);
}


Experigen.calculateEligibility = function () {
	/*var prop = Experigen.accuracy/Experigen.accuracyTotal;
	var prop100 = prop * 100;
	var eligibilityC = "";
	*/
	var prompt = "";
	var totest = [[],[]];
	for(var i = 0; i < this.f3f2.length; i++)
		totest[this.eligResponses[i]].push(this.f3f2[i]);
	
	var bounds = ttest(totest);
	
	var fail = getCookie(Experigen.settings.cookieprefix+"fail");
	
	
	if(isNaN(bounds.lower_bound) || isNaN(bounds.upper_bound)){
		prompt = "You have only marked one or no item as correct or incorrect.";
		if(fail!="yes"){
			prompt += " You have to rerun the test again.";
			Experigen.eligibilityC = false;
			setCookie(Experigen.settings.cookieprefix+"fail","yes");	
		}
		else{
			Experigen.ban = true;
			setCookie(Experigen.settings.cookieprefix+"fail","ban");
		}
	}
	else{
		if( (bounds.upper_bound > Experigen.settings.mean_raters_difference) && (bounds.lower_bound > 0)){
			prompt = "Congratulations! You are eligible to rate <span class='emphasizedr'>r</span> sounds as part of our study. You will be able to skip the eligibility testing for up to five blocks of stimuli if you use the same browser on the same computer. After five blocks, you will have to take the test again: if you want to continue rating <span class='emphasizedr'>r</span> sounds, you can re-take the training and eligibility test and become eligible for another five blocks. ";
			Experigen.eligibilityC = true;
			setCookie(Experigen.settings.cookieprefix+"fail","no");
		}
		else{
			prompt = "We are sorry, you did not meet the accuracy criterion.";
			if(fail!="yes"){			
				prompt += " You may attempt the rating task one more time. If you do not pass on your second try, you will not be able to rate <span class='emphasizedr'>r</span> sounds as part of our study.";
			
				Experigen.eligibilityC = false;
				setCookie(Experigen.settings.cookieprefix+"fail","yes");
			}
			else{
				Experigen.ban = true;
				setCookie(Experigen.settings.cookieprefix+"fail","ban");	
			}
		}
		prompt += "<br> lower bound = " + bounds.lower_bound.toFixed(2) + ", upper bound = " + bounds.upper_bound.toFixed(2);
	}
	

	
	return { prompt: prompt, 
			 contBText: Experigen.ban ? "    quit    " : Experigen.settings.strings.continueButton, 
			 lower_bound: bounds.lower_bound.toFixed(2),
			 upper_bound: bounds.upper_bound.toFixed(2),
			 cont: Experigen.eligibilityC };
			 

	}

Experigen.calculateEligibilityButton = function(that) {
  if(Experigen.ban){
		this.addStaticScreen("goodbye.ejs");
		this.rewind(this._screens.length-1);
  }
  else {
	if(!Experigen.eligibilityC){
		//Experigen.accuracy=0;
		//Experigen.accuracyTotal=0;
		this.f3f2 = [];
		this.eligResponses = [];
		this.rewind(this.bookmark);
	}
	else{
		this.screen().continueButtonClick(that);
	}
  }
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

Experigen.addBlockDone = function(block) {
	var blocks = Experigen.getBlocksDone();
	var out = blocks.concat(block).join('.');
	setCookie(Experigen.settings.cookieprefix + "blocks",out,30);
}

Experigen.clearCookies = function() {
	setCookie(Experigen.settings.cookieprefix + "blocks","",-1);
	setCookie(Experigen.settings.cookieprefix + "fail","",-1);
}

Experigen.initialize = function () {
	var ban = getCookie(Experigen.settings.cookieprefix+"fail");
	if(ban == "ban"){
		this.addStaticScreen("goodbye.ejs");
		return;
	}
	
	var nTrial = 4;
	var nEligibility = 20;
	var nExperiment = 10;
	var nCatch = 20;
	var bDone;
	var runEligibility = 1;
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
			
						
	var eligibilityBlock = []
						.concat(test_items)  //.chooseRandom(nEligibility)) 
						.pairWith("view","catgood.ejs")
						.shuffle();



					
	bDone = Experigen.getBlocksDone();
	if(bDone.length == maxBlock-1){ // subject has done it all
		bDone.length = 0;
		bDone == [];
		Experigen.clearCookies();
	}
	if(bDone.length % 5 != 0){
		runEligibility = 0;
	}
	do{
		this.blockToRun=Math.floor(Math.random()*(maxBlock)+1);
	} while ($.inArray(this.blockToRun.toString(),bDone)  > -1);
	
	this.attemptNumber = bDone.length + 1;
	var experimentBlock = []
						//.concat(items.subset("Block",this.blockToRun.toString()))
						.concat(test_items)  //.chooseRandom(nEligibility)) 
						.pairWith("view","stimulus.ejs")						 
						.concat(catch_items.chooseRandom(nCatch) // 20
						  .pairWith("view","catch.ejs"))
						.shuffle();
	
 //   while(experimentBlock[0].view=="catch.ejs"){
	//  toEnd = experimentBlock.shift();
	//  experimentBlock.concat(toEnd);
  //  }
	
	
	
	this.accuracyTotal = 0;
	this.accuracy = 0;
	Experigen.total = 0;  
	this.f3f2 = [];
	this.eligResponses = [];
	var prop;

	//wp.init();
	//wp.appendFlash();
	this.sectionStart = 0;
	this.addStaticScreen("consentform.ejs");
	this.addStaticScreen("newdemographic.ejs");
	this.addStaticScreen("introcatgood.ejs");

	this.sectionEnd = this.setBookmark();
	if(runEligibility){
	//	this.addStaticScreen("trainingintro.ejs");
		this.preTrainingBookmark = this.setBookmark();
//		this.addBlock(trainingBlock);
//		this.addStaticScreen("trainingendident.ejs");
		this.trainingEndBookmark = this.setBookmark();
		this.bookmark = this.setBookmark()
//		this.addStaticScreen("identeligibilityintro.ejs");
//		this.addBlock(eligibilityBlock);
		this.addBlock(experimentBlock);
//		this.addStaticScreen("breakcatgood.ejs");

//		this.addStaticScreen("eligibilitydecision.ejs");
		this.eligEndBookmark = this.setBookmark();

	}
	
	this.addStaticScreen("finalthanks.ejs");
//	this.addStaticScreen("goodbyesucc.ejs");
//	this.addStaticScreen("ratingintro.ejs");
//	this.addBlock(experimentBlock);
//	this.stimEndBookmark = this.setBookmark();	
//	this.addStaticScreen("finalthanks.ejs");
	
}