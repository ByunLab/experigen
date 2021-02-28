Experigen.tools = {}

Experigen.tools.checkItems = function(fnfield, which, folder){
	var items = Experigen.resources[which ? which : "items"].table;
	var l = items.length, i;
	fnfield = fnfield || "Filename";
	for(i = 0; i < l; i++){
		$.ajax((folder?folder:Experigen.settings.folders.sounds) + items[i][fnfield], {type: "HEAD"})
			.success( function(){
				console.log("CHECK");
			})
			.error( function(){
				console.log("Could not load " + items[i][fnfield]);
			})
	}
}
