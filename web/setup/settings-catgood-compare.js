var Experigen =  {
    settings: {

	experimentName: "testcatgoodcompare", // use only A-Z, a-z, 0-9
	
	databaseServer: "http://db.phonologist.org/",
	sourceHtml: "https://s3.amazonaws.com/experigendata/testexperigen/web/catgoodcompareindex.html",
	version: "ns",
	
	
	cookieprefix: "EXPBYR",
	//mean_raters_difference: 712.465,
	mean_raters_difference: 845.6579,

	online: true, // make sure you know what you're doing before changing this
	
	strings: {
	    windowTitle:     "Rating Speech",
	    connecting:		 "Connecting...<p><p>If you cannot proceed from this screen, please check whether your browser blocks the script that this experiment runs on. On Google Chrome, you should see a shield on the right edge of the address bar, which you should click and tell Chrome to <i>Load unsafe script</i>. We ensure you that this script is not unsafe, but Chrome is cautious with scripts that record responses of a user to another server, and this script works that way.",
	    loading:         "Loading...",
	    soundButton:     "    ►    ",
	    continueButton:  "   continue   ",
	    errorMessage:    "An error occurred. We apologize for the inconvenience.",
	    emptyBoxMessage: "Please supply your answer in the text box."
	},
	
	audio: true,
	
	progressbar: {
	    visible: true, 
	    adjustWidth: 2,
	    percentage: true
	},
	
	items: "resources/items_catgood_compare.txt",
	
	otherresources: {
	    practice_items: "resources/items_catgood_compare.txt",
	    catch_items: "resources/items_catgood_compare.txt",
	},

	
		folders: {
			views: "views/catgood_compare/",
			practice_sounds: "resources/Sounds_Catgood/",
			sounds: "resources/Sounds_Catgood/",
			test_sounds: "resources/Sounds_Catgood/",
			plugins: "plugins/"
		},
	

		plugins: ["wavhtml5","reportsounderror","vas_pointer","expanded_usercode","accesscontrol","html5test"],

		pluginsettings: {
			accesscontrol: {cookieprefix: "EXPBYRIRT"}
		},
        footer: "views/footer.html",
	missingview: "views/missingview.ejs"
    }	
};


