var Experigen =  {
	settings: {

		experimentName: "Default", // use only A-Z, a-z, 0-9
		
		databaseServer: "http://db.phonologist.org/",
		
		strings: {
			windowTitle:     "Awesomeness",
			loading:         "Loading...",
			soundButton:     "    ►    ",
			continueButton:  "   continue   ",
			errorMessage:    "An error occurred. We apologize for the inconvenience.",
			emptyBoxMessage: "Please supply your answer in the text box."
		},
		
		audio: true,
		
		progressbar: {
			visible: true, 
			adjustWidth: 6,
			percentage: true
		},
		
		tabdelimitedfiles: {
			items: "data/items.txt",
			frames: "data/frames.txt",
			pictures: "data/pictures.txt"	
		},

		folders: {
			sounds: "data/sounds",
			pictures: "data/pictures"
		},
	
		footer: "app/templates/footer.html",
		missingview: "app/templates/missingview.ejs"
	}	
};


