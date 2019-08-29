var counter = 0;

var Senf = "";
var globalSenf = "";
var globalSenfTitle = "";

browser.browserAction.onClicked.addListener(function(tab) {
  //  console.log(Senf);
    if (Senf == "") {
    letsDoThis("Keep looking!", "Nothing to show yet!");    
    }
  else { browser.tabs.create({
        url: Senf
   }); }
})

 browser.runtime.onMessage.addListener(function(message) {SeparateUrls(message)})

function SeparateUrls(currentURL)  {
    if (currentURL.indexOf("ebay") != -1) {
  pos1 = currentURL.indexOf("/", 25) + 1;
  pos2 = currentURL.indexOf("?", pos1);
  ebayNr = currentURL.slice(pos1, pos2);
  Ajax(ebayNr);
}
if (currentURL.indexOf("altconsys.com/t/") != -1) {
  pos1 = currentURL.lastIndexOf("-") + 1;
  pos2 = currentURL.indexOf("/", pos1);
  pos3 = currentURL.indexOf("/t/") + 3;
  altconNr = currentURL.slice(pos1, pos2);
  if (isNaN(altconNr) == true) { return }
   slug = currentURL.slice(pos3, pos1);
  
 var senfURL = "http://www.ebay.com/itm/-/" + altconNr + "?";
 var senfTitle = slug;
 updateIcon(senfURL);
 letsDoThis(senfURL, senfTitle);
} 
  
}


 function Ajax(currentURL) {
        
    if (currentURL == Senf) {
        return;
    }
    
//     Assemble and Submit JSON here:



var items = []; 	
 items[0] = currentURL;

// console.log(currentURL);
//  console.log(JSON.stringify(urls));							
 doAjax();		
    
	function doAjax() {
			var array, ajax;
		
          array = JSON.stringify(items);
			//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theAjax(array);
		ajax.done(processData);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
}

function theAjax(arr) {
	return $.ajax({
      url: 'http://165.227.36.233/Senf/getnr.php',
 //  contentType: 'application/json',
 //  dataType: 'json',
    processData: false,
	 data: arr,
// data: JSON.stringify(urls),
//    data: { js_array: arr },
	  type: "POST",
	  cache: false,
      error: function(xhr, desc, err) {
 //     console.log(err);                                        ///////////////////////////////////////////////////
  //      console.log("Details: " + desc + "\nError:" + err);      ///////////////////////////////////////////////////
      },
	  success: function(msg) {
   // console.log("got it done!");
	  }
    }); // end $.ajax return call
}         // end of theAjax
}   //end of Ajax()
    
 // This takes care of data once returned from Server:
function processData(returnedstuff /*}textStatus, jqXHR*/) {
// console.log(returnedstuff);

var response = JSON.parse(returnedstuff);

var senfURL = response.data.senfURLData;
var senfTitle = response.data.senfTitleData;

// console.log(senfURL);
// console.log(senfTitle);

// console.log(senfURL);
   //     senfData = returnedstuff.data[0];
  if (senfURL) {
      
  //    console.log(senfURL);
     globalSenf=senfURL;
      globalSenfTitle=senfTitle;
  }
  if (Senf != globalSenf) {
      Senf = globalSenf;     
      updateIcon(Senf);
      letsDoThis(Senf, senfTitle);
     
  }  // end if/senfURL    
 }   // end ProcessData
 

 //////////////////////////////////////////////////////////////////////////////////////////////////////

var currentTab; 

function updateIcon(senfURL) {
	browser.browserAction.setIcon({
  path: senfURL ? {
      32: "icons/colorwheel-32.png",
      64: "icons/colorwheel-64.png"
    } : {
      32: "icons/colorwheel-32-empty.png",
      64: "icons/colorwheel-64-empty.png"
    },
    tabId: currentTab.id
  });
  browser.browserAction.setTitle({     
    // Screen readers can see the title
     title: senfURL ? Senf : globalSenfTitle,
    tabId: currentTab.id
  }); 
}    ////////////////////////////// end updateIcon

function letsDoThis(Senf, globalSenfTitle) {
	browser.notifications.create(Senf, {
        "type": "basic",
        "title": globalSenfTitle,
        "message": Senf,
        "iconUrl": "icons/colorwheel-64.png"
    }, function(Senf) { });
	
}

browser.notifications.onClicked.addListener(function(Senf)  {
	browser.tabs.create({url: Senf});
	})
/*

var list = document.querySelectorAll( "a" );
// console.log("I am here");
for ( var i = 0; i < list.length; i ++)
list.item(i).onmouseover = function() { console.log(this.href ) };
*/


var currentURL;
function retrieveVar1() {SeparateUrls(currentURL)}

function updateActiveTab(tabs) {

  function sitesOfInterest(urlString) {
    var domains = ["ebay.com/itm/", "ebay.de/itm/", "ebay.ca/itm/", "altconsys.com/t/"];
        
    return domains.indexOf(urlString);
  }
     var currentURL1;
 ////////////////////////////////////////////////////////////////////////////////////////
     
///////////////////////////////////////////////////////////////////////////////////////////   
      
 function retrieveVar() {currentURL = currentURL1; retrieveVar1(currentURL);}
 function updateTab(tabs) {   
    if (tabs[0]) {
      currentTab = tabs[0];
  //      console.log(currentTab.id);
   //      console.log(currentTab.index);  
     
      if (sitesOfInterest(currentTab.url)) {
  //  console.log("SENF works great with the " + currentTab.url + " URL.")
          currentURL1 = currentTab.url;
           var currentTitle = currentTab.title;  
          retrieveVar(currentURL1);
   updateIcon();
   
     }  else {
       // console.log("SENF does not support the " + currentTab.url + " URL.")
      }
    }
  }

  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then(updateTab);
}

// listen to tab URL changes
 browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
 browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window switching
  browser.windows.onFocusChanged.addListener(updateActiveTab);

// update when the extension loads initially
 updateActiveTab();
  // console.log(currentURL);  

