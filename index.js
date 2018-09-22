<<<<<<< HEAD
PQuerik.onReady(function(){ // Start PQuerik Scope
	var DropDown = new PQuerik.form.DropDown({
		target:"DropDownContainer",
		items:[
			{
				header:'About Us',
				href:'/aboutus',
				width:200,
				items:[
					{header:'Contact',href:'/contact'},
					{header:'Profile',href:'/profile'}
				]
			},{
				header:'Products',
				href:'/products',
				width:150,
				items:[
					{header:'Advertising',href:'/advertising'},
					{header:'Display',href:'/display'}
				]
			},{
				header:'Contact Us',
				href:'/aboutus',
				width:150,
				items:[
					{header:'Message',href:'/message'},
					{header:'Find Us',href:'/findUs'}
				]
			}
		],
		height:80,
		width:800,
		name:"MainDropDown"
	});

	var store = new PQuerik.data.Store({
		baseParams:{limit:50,query:''},
		proxy: new PQuerik.data.HttpProxy({url:'request.aspx',method:'POST'}),
		autoLoad:false,
		reader:new PQuerik.data.JsonReader({
			root:'result',
			total:'total'
		})
	});

	var Grid = new PQuerik.form.Grid({
		target:"GridContainer",
		store:store,
		items:[
			{header:"Erik",item:"erik",width:200},
			{header:"Anita",item:"yeni",width:200},
			{header:"Erik & Yeni",item:"erikyeni",width:200}
		],
		height:200,
		width:800,
		name:"MainGrid"
	});
=======
PQuerik.onReady(function(){ // Start PQuerik Scope
	var DropDown = new PQuerik.form.DropDown({
		target:"DropDownContainer",
		items:[
			{
				header:'About Us',
				href:'/aboutus',
				width:200,
				items:[
					{header:'Contact',href:'/contact'},
					{header:'Profile',href:'/profile'}
				]
			},{
				header:'Products',
				href:'/products',
				width:150,
				items:[
					{header:'Advertising',href:'/advertising'},
					{header:'Display',href:'/display'}
				]
			},{
				header:'Contact Us',
				href:'/aboutus',
				width:150,
				items:[
					{header:'Message',href:'/message'},
					{header:'Find Us',href:'/findUs'}
				]
			}
		],
		height:80,
		width:800,
		name:"MainDropDown"
	});

	var store = new PQuerik.data.Store({
		baseParams:{limit:50,query:''},
		proxy: new PQuerik.data.HttpProxy({url:'request.aspx',method:'POST'}),
		autoLoad:false,
		reader:new PQuerik.data.JsonReader({
			root:'result',
			total:'total'
		})
	});

	var Grid = new PQuerik.form.Grid({
		target:"GridContainer",
		store:store,
		items:[
			{header:"Check1",item:"Check1",width:200},
			{header:"Check2",item:"Check2",width:200}
		],
		height:40,
		width:500,
		name:"MainGrid"
	});
}); // End of PQuerik Scope