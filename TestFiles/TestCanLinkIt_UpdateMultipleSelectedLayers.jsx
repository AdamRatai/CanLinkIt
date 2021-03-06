﻿/*********************************************
Copyright 2011 Aaron Powers
All Rights Reserved
*/
/******************
 * 
 * To run this test:
 * (1) Launch this file in ExtendScript Toolkit
 * (2) If your files are stored somewhere besides in our standard path, you may have to edit the file "DeveloperVariables.jsx".
 * (3) Press F5
 * (3) Look at ExtendScript's "Javascript Console" for a summary -- if all went well, it should say "Number of errors: 0" at the bottom.
 */

// Include the folder we keep all JSX files in:
#includepath "../LinkDox/JSX"
#include "CanLinkIt.jsx"
#include "UnitTestLib.jsxinc"
#include "TestFiles.jsxinc"

/*Because of the following line, it's no longer necessary to do change a dropdown in extenscript, by going to just above the top of this script, change the dropdown from 
	"ExtendScript Toolkit CS5" to one of the "Adobe Photoshop" selections*/
#target photoshop

// TEST TODO
// test multipleLayersSelected

function testUpdateMultipleSelectedLayersWithOpenFile(file, nameOfOneSmartlayer) {
	app.open(file);

	
	// =======================================================
	// Select all layers of the same type (this is a smart object, so it will select all smart objects in the file)
	var idselectSimilarLayers = stringIDToTypeID( "selectSimilarLayers" );
	var desc2 = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var ref1 = new ActionReference();
	var idLyr = charIDToTypeID( "Lyr " );
	ref1.putName( idLyr, nameOfOneSmartlayer );
	desc2.putReference( idnull, ref1 );
	executeAction( idselectSimilarLayers, desc2, DialogModes.NO );
	
	// Remember which ones are selected:
	var selectedLayers = PsdLib.prototype.getSelectedLayersIndex();
	
	canLinkIt.updateSelected();
	
	
	for (var i=0; i<selectedLayers.length; i++) {
		PsdLib.prototype.makeActiveByIndex(selectedLayers[i],false);
		//$.writeln("#"+i+": index="+selectedLayers[i]+", layer name ="+activeDocument.activeLayer.name);
		// Check if it's linked, and if it is, that it's up to date.
		var xml = canLinkIt.getActiveLayerInfo("1");
		if (xml.indexOf(convertToXML(true, "hasLink"))>-1)
			checkForActiveLayerIsUpToDate();			
	}

	app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function testUpdateMultipleSelectedLayers() {
	testUpdateMultipleSelectedLayersWithOpenFile(testFileWithLotsOfLayersAndLinks,"ButtonStyle copy 5");
	
	testUpdateMultipleSelectedLayersWithOpenFile(testAssembledFile2, "BorderImageExample2-b");
	
	
}



/**************************************
	* Run the unit tests below
	*/
closeAllDocuments();

testUpdateMultipleSelectedLayers();


$.writeln(errorMessages+"\n"+
"TestCanLinkIt_UpdateMultipleSelectedLayers.jsx tests are complete. Total errors: "+errorCount);