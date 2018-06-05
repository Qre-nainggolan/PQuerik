// Code Reuse Pattern has on using pattern #3 , #4 Continually .. (Implemented in Cross Browsing Object Part)
// #3 - Combining Rent Constructor & Default Pattern (Set Prototype)
// #4 - Share the Prototype ( This gives you short & fast prototype chain lookups because all objects actually share the same prototype
// 	    also a drawback if one child or grandchild somwehere down the inheritance chain modifies the prototype, it affects all parents and grandparents
//		also children object doesn't inherit caller property

// ************************ Thanks God, FINALLY WELL ORGANIZED ON 2018/02/10 ************************
// *********** Going forward with building table format data and user graphical interface ***********

/*
	Status until March 23 2018
	---> Still missing data flow communication between data.Store object and data.HttpProxy object (SOLVED ;)
		 Request to remote url had been succeeded... (SOLVED ;)
	Status until March 24 2018		 
	---> Still missing data transfer communication between PQuerik.form.Grid and PQuerik.data.Store
*/


/*
	Status untul April 21 2018
	---> Handling AJAX and also for asynchronous event is really difficult.. 
		 The state change must be organized at the final process, 
		 PQuerik still simulating solution above with static identity location, Later the target location should be flexible in array
*/

/* 
	Src: https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop
	Basically, the setTimeout needs to wait for all the codes to complete even 
	though you specified a particular time limit for your setTimeout.
*/


////=========================== PQuerik, Here we go =========================== \\\\

// Start Creating Cross Browsing Object
function inherit(C,P){
	var F = function() {};
	F.prototype = P.prototype;
	C.prototype = new F();
	C.uber = P.prototype;
	C.prototype.constructor = C;
}

function PQuerikCrossBrowser(caller){
	this.caller = caller || "Default PQuerik Event";
}

PQuerikCrossBrowser.prototype.getTarget = function(e){
	return (e.target) ? e.target : e.srcElement;
}

PQuerikCrossBrowser.prototype.getCaller = function(){
	return this.caller;
}

function PQuerikMouseEvent(caller){
	PQuerikCrossBrowser.apply(this,arguments);
}

inherit(PQuerikMouseEvent,PQuerikCrossBrowser);
// Stop Creating Cross Browsing Object

// Global object for PQuerik
var PQuerik = {
	message : "PQuerik has been initialized",
	elements:[],
	data:{ // Start Building PQuerik "data" Object
		Store:function(){ // Start Building PQuerik Store Object
			// Get the last counter of built element by the application
			this.PQuerikTagCounter = PQuerik.getBuiltElementCounter(); 

			this.params = PQuerik.parseArguments(arguments); // Get the parameter inside new PQuerik.data.Store({});

			this.getParamsLength = function(){
				return this.params.length;
			}

			this.paramsLength = this.getParamsLength();

			this.objects = new Array(this.paramsLength);

			this.statechange = function(response,PQuerikID){
				if(response.readyState == 4 && response.status == 200){
					var HttpProxyContent;
					HttpProxyContent = response.responseText;
					var data = JSON.parse(HttpProxyContent);
					var total = data.total;
					var resultsObject = data.results;
					var targetName = "";

					// Start trying populating the object
					// Start - While there is child item of object, keep creating them
					// " -- We are calling the parent of store defined in PQuerik.form.Grid with this line -- "
					//	this.objects[i].store = this.params[i].store;					
					// 	" -- "
					if(data.results){
						var parentGrid;
						for(var i = 0; i < PQuerik.elements.length; i++){
							for(var j = 0;j < PQuerik.elements[i].length; j++){
								if(PQuerik.elements[i][j].type == "Grid"){
									if(PQuerik.elements[i][j].store){
										if(PQuerik.elements[i][j].store.Element[0].PQuerikID == PQuerikID){
											targetName = PQuerik.elements[i][j].target;
											parentGrid = PQuerik.elements[i][j];
										}
									}
								}
							}
						}

						var bgColor = "";
						var width = "";
						var rowWidth = parseInt(parentGrid.style.width);
						for(var j = 0; j < data.results.length; j++)
						{
							// This is callback function - remember callback has scope
							var newObject = document.createElement("div");
							var value = "<div style='width:" + rowWidth + "px'>";
							
							for(var key in parentGrid.items){
								width = parentGrid.items[key]["width"];
								for(var key2 in parentGrid.items[key]){
									if(key2 == "item"){
										// Coloring the row
										bgColor = ( j % 2 == 0) ? ";background-color:#d1feba" : ";background-color:#c3faa9";
										value += "<div style='width:" + width + "px;border:1px solid #000000;float:left" + bgColor + "'>" + data.results[j][parentGrid.items[key]["item"]] + "</div>";
									}
								}
							}
							// for(var key in data.results[j]){
								// bgColor = ( j % 2 == 0) ? ";background-color:#d1feba" : ";background-color:#c3faa9";
								// value += "<div style='width:200px;border:1px solid #000000;float:left" + bgColor + "'>" + data.results[j][key] + "</div>";
							// }
							value += "</div>";
							newObject.innerHTML = value ;
							// document.getElementById(targetName).appendChild(newObject); 
							parentGrid.appendChild(newObject); 
						}
					}
					// Stop - While there is child item of object, keep creating them
				}
			}

			this.buildElement = function()
			{
				var childElement;
				var response;
				// Looping very first object, normally containing only single main object
				for(var i=0; i < this.paramsLength; i++){

					this.objects[i] = {};
					this.objects[i].type = "Store";
					this.objects[i].PQuerikID = "PQuerikStore" + this.PQuerikTagCounter;
					this.objects[i].baseParams = (!this.params[i].baseParams) ? "nobaseparams" : this.params[i].baseParams;
					this.PQuerikTagCounter++;
					
					// why i can't call this.params[i].proxy.load() =.= // Should i use prototype "jreng jreng"
					if(this.params[i].proxy){
						var proxy = new PQuerik.data.HttpProxy({url:this.params[i].proxy.params[0].url,method:this.params[i].proxy.params[0].method});
						response = proxy.load();
						response.onreadystatechange = this.statechange.bind(PQuerik,response,this.objects[i].PQuerikID); // This is callback function so that we need to bind the global variable "this" 
					}
					// Stop - While there is value for proxy params
				}
				return this.objects;
			}

			// Command which executing the object creation process
			this.Element = this.buildElement(); 		
			
			PQuerik.elements.push(this.Element);
			PQuerik.setBuiltElementCounter(this.PQuerikTagCounter);
		}, // Stop Building PQuerik Store Object
		HttpProxy:function(){ // Start Building PQuerik HttpProxy Object

			this.params = PQuerik.parseArguments(arguments); // Get the parameter inside new PQuerik.data.Store({});

			this.getParamsLength = function(){
				return this.params.length;
			}

			this.paramsLength = this.getParamsLength();

			this.createXHR = function(){
				try{ return new XMLHttpRequest(); } catch(e){}
				try{ return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e){}
				try{ return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e){}
				try{ return new ActiveXObject("Msxml2.XMLHTTP"); } catch(e){}
				try{ return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e){}
				alert("Unfortunately, PQuerik can't run on your browser cause your browser doesn't support XMLHttpRequest");
				return null;
			}

			// <_Start_> Status for this object ==========
			// Object can be called nicely but isn't completely usable by superior object which implementing this
			// <_Stop_> Status for this object ==========
			var url = (!this.params[0].url) ? "" : this.params[0].url;
			var method = (!this.params[0].method) ? "" : this.params[0].method;
			
			this.load = function(){ // this is the triger and until now June 1st only callable from PQuerik.data.Store / or its parent 
				var xhr = this.createXHR();
				var response;
				if(xhr){
				
					var parameter = "check=ya";
					xhr.open("POST",url,true);
					xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
					// xhr.setRequestHeader("Content-length", parameter.length);  ! Attempt to set a forbidden header was denied: Content-length
					// xhr.setRequestHeader("Connection", "close"); ! Attempt to set a forbidden header was denied: Connection
					xhr.send(parameter);
				}

				return xhr;
			}
		}, // Stop Building PQuerik HttpProxy Object
		JsonReader:function(){ // Start Building PQuerik JsonReader Object
		
		}  // Stop Building PQuerik JsonReader Object
	}, // Stop Building PQuerik "data" object
	form:{ // Start Building PQuerik "form" Object
		DropDown:function(){ // Start Building DropDown Object 
		
			// Get the last counter of built element by the application
			this.PQuerikTagCounter = PQuerik.getBuiltElementCounter();
			
			this.params = PQuerik.parseArguments(arguments); // Get the parameter inside new PQuerik.form.DropDown({});

			this.getParamsLength = function(){
				return this.params.length;
			}

			this.paramsLength = this.getParamsLength();

			this.getTotalItemsContainer = function(){
				this.counter = 0;
				for(var i = 0; i < this.paramsLength; i++){
					// If the object has value of parameter "items" then add one to the counter
					this.counter = this.counter + ((this.params[i]["items"]) ? 1 : 0);
				}
				return this.counter;
			}

			this.totalItemsContainer = this.getTotalItemsContainer();
			
			// Start function of Iterating the object properties child deep number
			this.maxItemsChildCounter = 0;
			this.hasChild = function(obj,propertyName)
			{
				this.objLength = obj.length;
				for(var i=0; i < this.objLength; i++){
					if(obj[i][propertyName]){
						this.hasChild(obj[i][propertyName]);
						this.maxItemsChildCounter++;
					}else{
						return false;
					}
				}
				return this.maxItemsChildCounter;
			}
			// Stop function of Iterating the object properties child deep number			

			this.getMaxNumberOfItemsChildLevel = function(){
				this.maxNumber = 0;
				this.currentMaxNumber = 0;
				
				for(var i=0; i < this.paramsLength; i++){
					this.currentMaxNumber = 0;
					this.checkedObject = this.params[i]; // check all main objects
					if(this.params[i].items){
						this.currentMaxNumber = this.hasChild(this.params[i]["items"], "items");
					}
					this.maxNumber = (this.currentMaxNumber > this.maxNumber) ? this.currentMaxNumber : this.maxNumber;
				}
				return this.maxNumber;
			}

			this.totalMaxNumberOfItemsChildLevel = this.getMaxNumberOfItemsChildLevel();

			this.marginLeftChild = 0;
			this.marginTopChild = 0;
			this.timer;
			
			this.hideMenu = function(){
				var allObject = document.getElementsByName("DropDownItem");
				
				for(var i=0;i < allObject.length; i++){
					allObject[i].style.display = "none";
				}
			}
						
			this.keepMenu = function(){
				clearTimeout(this.timer);
			}
			
			this.requestHide = function(objName){
				this.timer = setTimeout(this.hideMenu,1000);
			}

			this.toggleHighlight = function(e){
				e = (e) ? e : ((event) ? event : null);
				var EventObject = new PQuerikMouseEvent("ToggleHighlight");
				var elem  = EventObject.getTarget(e);
				if(e.type == "mouseover"){
					clearTimeout(this.timer);
				}else if(e.type == "mouseout"){
					this.requestHide("DropDownItem");
				}
				e.cancelBubble = true;
			}

			// Funny thing, where this event is owned by DIV element not by PQuerik.form.DropDown
			// This is because the DOM is usually implemented separately from the Javascript engine. 
			this.swap = function(e){
				var EventObject = new PQuerikMouseEvent("Swap"); // Calls the object which requested the event, argument is to indicate function name which is calling the class
				var elem  = EventObject.getTarget(e);
				// we are validating childNodes one since childNodes zero is the textnode 
				if(e.type == "mouseover"){
					if(elem.childNodes[1]){
						clearTimeout(this.timer); // ------------ THIS PART I MISSING FOR LONG TIME IS NEEDED ------------
						for(var i=0; i < document.getElementsByName("DropDownItem").length; i++){
							document.getElementsByName("DropDownItem").item(i).style.display = "none";
						}
						elem.childNodes[1].style.display = "";
					}
				}else if(e.type == "mouseout"){
					if(elem.childNodes[1])
					{
						if(elem.childNodes[1].name === "DropDownItem"){

						}else{
							this.requestHide("DropDownItem");
						}
					}else{
						this.requestHide("DropDownItem");
					}
				}
				e.cancelBubble = true;
			}

			this.buildChildElement = function(obj)
			{
				var childLength = obj.items.length; // Find out number of child of items
				var childObjects = new Array(childLength); // Initialize the array object
				
				this.childObjTemp; // Initialize child of the child items
				this.child;

				for(var i = 0; i < childLength; i++) // Iterate through the childs
				{
					// Pass the current items object as object for variable this.child
					this.child = obj.items[i];

					 // Get the header text
					this.textNode = document.createTextNode(this.child.header);

					// Count the built element from PQuerik and put the number as part of element id.
					this.PQuerikTagCounter++;

					// Build tag for array object of this.childObject
					childObjects[i] = PQuerik.buildTag("div","DropDownGroupBlock","DropDownGroupBlock_" + this.PQuerikTagCounter,"DropDownGroupBlock"); 

					// Define the style width property
					if(this.child.width){
						childObjects[i].style.width = this.child.width + "px";
					}
					childObjects[i].style.height = "15px";
					childObjects[i].appendChild(this.textNode); // Append text to the object

					// Check if object inside variable this.child has child
					if(this.child.items){
						this.PQuerikTagCounter++;
						var container = PQuerik.buildTag("div","DropDownItem","DropDownItem_" + this.PQuerikTagCounter,"DropDownItem");
						container.style.display = "none"; // We hide the container of children of the dropdown item
						container.style.height = "40px";

						container.style.width = parseInt(childObjects[i].style.width) + 2 + "px";
						container.onmouseover = this.toggleHighlight.bind(this); // This is callback function so that we need to bind the global variable "this"
						container.onmouseover = this.toggleHighlight.bind(this);

						var newObj = this.buildChildElement(this.child);
						this.childObjTemp = newObj;

						for(var j = 0; j < this.childObjTemp.length; j++){
							this.childObjTemp[j].style.width = "120px";
							this.childObjTemp[j].onmouseover = this.toggleHighlight.bind(this);
							this.childObjTemp[j].onmouseout = this.toggleHighlight.bind(this);
							container.appendChild(this.childObjTemp[j]);
						}
						childObjects[i].appendChild(container);
					}
				}
				return childObjects;
			}

			this.buildElement = function()
			{
				this.objects = new Array(this.paramsLength);
				var childElement;

				// Looping very first object, normally containing only single main object
				for(var i=0; i < this.paramsLength; i++){
					this.objects[i] = PQuerik.buildTag("div","DropDown","DropDown","DropDown");
					this.objects[i].style.width =  this.params[i].width + "px";
					this.objects[i].style.height =  this.params[i].height + "px";
					this.objects[i].name = this.params[i].name;
 
					if(this.params[i].target){
						this.objects[i].target = this.params[i].target;	
					}
 
					// Start - While there is child item of the dropdown, keep creating them
					if(this.params[i].items){
						childElement = this.buildChildElement(this.params[i]);
						for(var j = 0; j < childElement.length; j++)
						{
							// This is callback function - remember callback has scope
							childElement[j].onmouseover = this.swap.bind(this);
							childElement[j].onmouseout = this.swap.bind(this);
							this.objects[i].appendChild(childElement[j]);
						}
					}
					// Stop - While there is child item of the dropdown, keep creating them
				}
				return this.objects;
			}

			this.Element = this.buildElement(); // Command which executing the object creation process

			this.appendElement = function()
			{
				for(var i=0; i < this.paramsLength; i++){
					if(this.Element[i].target){
						document.getElementById(this.Element[i].target).appendChild(this.Element[i]);
					}
				}
			}

			// Final action, append the element
			this.appendElement();
			
			// Set the last counter of built element by the application
			PQuerik.setBuiltElementCounter(this.PQuerikTagCounter);

		}, // Stop Building PQuerik DropDown Object
		Grid:function(){ // Start Building PQuerik Grid Object

			// Get the last counter of built element by the application
			this.PQuerikTagCounter = PQuerik.getBuiltElementCounter();

			this.params = PQuerik.parseArguments(arguments); // Get the parameter inside new PQuerik.form.Grid({});

			this.getParamsLength = function(){
				return this.params.length;
			}

			this.paramsLength = this.getParamsLength();
			
			this.objects = new Array(this.paramsLength); // Initialize object that will be returned to the caller
			
			this.buildChildElement = function(obj)
			{
				var childLength = obj.items.length; // Find out number of child of items
				var childObjects = new Array(childLength); // Initialize the array object

				this.childObjTemp; // Initialize child of the child items
				this.child;

				for(var i = 0; i < childLength; i++) // Iterate through the childs
				{
					// Pass the current items object as object for variable this.child
					this.child = obj.items[i];

					 // Get the header text
					this.textNode = document.createTextNode(this.child.header);

					// Count the built element from PQuerik and put the number as part of element id.
					this.PQuerikTagCounter++;

					// Build tag for array object of this.childObject
					childObjects[i] = PQuerik.buildTag("div","GridGroupBlock","GridGroupBlock_" + this.PQuerikTagCounter,"GridGroupBlock");

					// Define the style width property
					if(this.child.width){
						childObjects[i].style.width = this.child.width + "px";
					}
					childObjects[i].style.height = "15px";
					childObjects[i].appendChild(this.textNode); // Append text to the object

					// Check if object inside variable this.child has child
					if(this.child.items){
						this.PQuerikTagCounter++;
						var container = PQuerik.buildTag("div","GridItem","GridItem_" + this.PQuerikTagCounter,"GridItem");
						container.style.display = "none"; // We hide the container of children of the dropdown item
						container.style.height = "40px";

						container.style.width = parseInt(childObjects[i].style.width) + 2 + "px";

						var newObj = this.buildChildElement(this.child);
						this.childObjTemp = newObj;

						for(var j = 0; j < this.childObjTemp.length; j++){
							this.childObjTemp[j].style.width = "120px";
							container.appendChild(this.childObjTemp[j]);
						}
						childObjects[i].appendChild(container);
					}
				}
				return childObjects;
			}

			this.buildElement = function()
			{
				var childElement;

				// Looping very first object, normally containing only single main object
				for(var i=0; i < this.paramsLength; i++){
					this.objects[i] = PQuerik.buildTag("div","PQuerikGrid","PQuerikGrid","PQuerikGrid"); 
					this.objects[i].style.width =  this.params[i].width + "px";
					this.objects[i].style.height =  this.params[i].height + "px";
					this.objects[i].name = this.params[i].name;
					this.objects[i].type = "Grid";
					this.objects[i].PQuerikID = "Grid" + this.PQuerikTagCounter;
					this.PQuerikTagCounter++;
 
					if(this.params[i].target){
						this.objects[i].target = this.params[i].target;	
					}
 
					// Start - While there is child item of object, keep creating them
					if(this.params[i].items){ 
						this.objects[i].items = this.params[i].items;
						childElement = this.buildChildElement(this.params[i]);
						for(var j = 0; j < childElement.length; j++)
						{
							// This is callback function - remember callback has scope
							this.objects[i].appendChild(childElement[j]);
						}
					}
					// Stop - While there is child item of object, keep creating them

					// Check if object inside variable has store , Be really careful with callback processing duration =.=
					if(this.params[i].store){
						this.objects[i].store = this.params[i].store;
					}
				}
				return this.objects;
			}

			this.Element = this.buildElement(); // Command which executing the object creation process
			PQuerik.elements.push(this.Element);

			this.appendElement = function()
			{
				for(var i=0; i < this.paramsLength; i++){
					if(this.Element[i].target){
						document.getElementById(this.Element[i].target).appendChild(this.Element[i]);
					}
				}
			}

			// Final action, append the element
			this.appendElement();

			// Set the last counter of built element by the application
			PQuerik.setBuiltElementCounter(this.PQuerikTagCounter);

		} // Stop Building PQuerik Grid Object
	}, // Stop Building PQuerik "form" Object
	setBuiltElementCounter : function(value){
		this.PQuerikTagCounter = value;
	},
	getBuiltElementCounter : function(){
		return (!this.PQuerikTagCounter) ? 0 : this.PQuerikTagCounter;
	},
	buildTag : function(objectType,objectClass,objID,objName){
		this.objectBuilt = document.createElement(objectType); 
		this.objectBuilt.id = objID;
		this.objectBuilt.className = objectClass;
		if(objName){
			this.objectBuilt.setAttribute("name",objName);
		}
		return this.objectBuilt;
	},
	getElementPosition: function(elemId){
		this.offsetLeft = 0;
		this.offsetTop = 0;
		this.offsetTrail = document.getElementById(elemId);

		while (this.offsetTrail)
		{
			this.offsetLeft += this.offsetTrail.offsetLeft;
			this.offsetTop += this.offsetTrail.offsetTop;
			this.offsetTrail = this.offsetTrail.offsetParent;
		}
		if(navigator.userAgent.indexOf('Mac') != -1 && typeof document.body.leftMargin != 'undefined')
		{
			this.offsetLeft += document.body.leftMargin;
			this.offsetTop += document.body.topMargin;
		}

		//It has been noticed that offsetTop if 69 pixels more for IE 6
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
		{
			this.ieversion=new Number(RegExp.$1)
			//if (ieversion=6 && ieversion<7)
			// {
				//if(offsetTop&gt;78) offsetTop -= 79;
			//}
		}
		return {left:this.offsetLeft,top:this.offsetTop};
	},
	parseArguments:function(args){
		var cachekey = JSON.stringify(Array.prototype.slice.call(args));
		var params = JSON.parse(cachekey);
		return params;
	},
	onReady:function(obj){
		if(document.getElementById && document.styleSheets){
			setTimeout(obj,5); 
			PQuerik.setBuiltElementCounter(0);
		}
	}
};