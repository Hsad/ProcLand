
//variables
	var scene; 
	var camera; 
	var camControls;
	var renderer;
	var geometry;
	var material;
	var plane;
	var planeWidth = 1;
	var planeHeight = 1;
	var planeSubDiv = 100;
	var planeVertQuant = planeSubDiv+1;
	var lastTime = Date.now();
	var currentTime = 0;
	var deltaTime = 0;
	var PI = 3.14159;
	var mouseVec;
	//var projector;
	var raycaster; //?
	var directionalLight;
	var pointLight;
	
	var vertIndex = 0;
	var verts;
	var gui = new dat.GUI();
	var savedInt = 0;
	var GradientGrid;

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	camControls = new THREE.OrbitControls(camera);
	camControls.addEventListener( 'change', render);
	
	geometry = new THREE.PlaneGeometry(planeWidth,planeHeight,planeSubDiv,planeSubDiv);  //range is 0 to 10200 or x0-100 y0-100
	material = new THREE.MeshLambertMaterial( { color: 0x19A81E , wireframe:true} );
	plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	
	//scene.remove(plane);  //////////////////////IM THE REASON THE PLANE ISN"T SHOWING///////
	var geom = new THREE.Geometry(); 
	geom.vertices.push(
		new THREE.Vector3( -1,  -.866, 0 ),
		new THREE.Vector3( 0, .866, 0 ),
		new THREE.Vector3(  1, -.866, 0 )
	);
	geom.faces.push( new THREE.Face3( 2,1,0));

	var mat = new THREE.MeshBasicMaterial( { color: 0xffA81E , wireframe:true} );

	var triPlane = new THREE.Mesh(geom, mat);
	scene.add(triPlane);
	


	directionalLight = new THREE.DirectionalLight( 0xf0000f, 100 );
	directionalLight.position.set( 1, 10,1 );
	directionalLight.rotation.x = 0.8;
	scene.add( directionalLight );
	
	pointLight = new THREE.PointLight( 0xff0000, 1, 5 );
	pointLight.position.set( 0, 0, 2 );
	scene.add( pointLight );
	
	//projector = new THREE.Projector();

	camera.position.z = 2;
	camera.position.y = -1; //lil hight boost, lil less
	camera.position.x = 0; 
	camera.rotation.x = 0.5;

	document.addEventListener("keydown",onDocumentKeyDown,false);
	//if (mode == 2){	document.addEventListener("mousedown",onDocumentMouseDown,false);}
	window.addEventListener("resize", onWindowResize, false);
	
	
	verts = plane.geometry.vertices;
	/*
	for (var vert = 0; vert < verts.length; vert++){
		verts[vert].z = Math.random() / planeVertQuant;  //random terrain noise
		//console.log(verts[vert]);
	}
	plane.verticesNeedUpdate;
	*/
	//cycleVerts();
	Math.seedrandom(2)
	//console.log(Math.random());
	
	
	options = {
		randomSeed: 10
	};
	
	gui.add(options, "randomSeed", 0, 30);




	noise.seed(10);
	//randomMovement();
	//createGradientGrid(11,11);
	//oldPerlin();
	//newPerlin(1);
	newPerlin(5);
	newPerlin(10);
	newPerlin(20);
	water(0);
	//plane.geometry.computeFaceNormals();
	//drawFaceNormal();
	console.log(triPlane.geometry.faces[0]);
	triangleSubDivide(triPlane);
	triangleSubDivide(triPlane);
	triangleSubDivide(triPlane);
	//triangleSubDivide(triPlane);
	//triangleSubDivide(triPlane);
	//triangleSubDivide(triPlane);
	//sine();
	//linear();  //Debug champ Function
}

function linear(){
	for (var y = 0; y < planeVertQuant; y++){
		for (var x = 0; x<planeVertQuant; x++){
			console.log("X");
			console.log(x);
			console.log("Y");
			console.log(y);
			console.log("Index");
			console.log((y*planeVertQuant) + x);
			console.log("OutValue");
			console.log((y));
			console.log("planeVertQuant");
			console.log(planeVertQuant);
			console.log("y*planeVertQuant");			
			console.log(y*planeVertQuant);
			console.log("y*planeVertQuant + x");
			console.log(y*planeVertQuant + x);
			verts[(y*planeVertQuant) + x].z = (y)/20;
			//console.log(verts[vert]);
		}		
	}
}

function sine(){
	for (var y = 0; y < planeVertQuant; y++){
		for (var x = 0; x<planeVertQuant; x++){
			verts[(y*planeVertQuant) + x].z += Math.sin(x) / 40;
			//console.log(verts[vert]);
		}		
	}
}

function dot(vect){
	var Dot = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 6, 6 ), new THREE.MeshBasicMaterial( {color: 0xffff00}));
	Dot.geometry.translate(vect.x, vect.y, vect.z);
	scene.add(Dot);
}

function triangleSubDivide(mesh){
	//for every face
	//get verts of the face
	//find new middle verts
	//create 4 faces from those verts
	//add those faces to the mesh, maybe remove old face, or just readjust verts
	var faces = mesh.geometry.faces;
	var verts = mesh.geometry.vertices;
	var numFaces = faces.length;
	
	for (var f = 0; f<numFaces; f++){
		//sub divide edges, create new vertices
		var vert1 = verts[faces[f].a];
		var vert2 = verts[faces[f].b];
		var vert3 = verts[faces[f].c];
		var vert4 = new THREE.Vector3();
		var vert5 = new THREE.Vector3();
		var vert6 = new THREE.Vector3();
		vert4.addVectors(vert1, vert2);
		vert5.addVectors(vert2, vert3);
		vert6.addVectors(vert3, vert1);
		vert4.divideScalar(2);
		vert5.divideScalar(2);
		vert6.divideScalar(2);
		//need to find the twin vertices of the inside triangle
		//also need to detect when the current face is one of the inside triangles
		//
		
		
		//Modify New vert heights
		vert4.setZ(vert4.z + (Math.random()-0.5)/numFaces);
		vert5.setZ(vert5.z + (Math.random()-0.5)/numFaces);
		vert6.setZ(vert6.z + (Math.random()-0.5)/numFaces);
		
		//track vertex index
		var ind1 = faces[f].a;
		var ind2 = faces[f].b;
		var ind3 = faces[f].c;
		var ind4 = mesh.geometry.vertices.length;   //////////////////
		mesh.geometry.vertices.push(vert4);
		var ind5 = mesh.geometry.vertices.length;   //Dont organize this
		mesh.geometry.vertices.push(vert5);           //ya dingus
		var ind6 = mesh.geometry.vertices.length;		
		mesh.geometry.vertices.push(vert6);        /////////////////
		
		mesh.geometry.verticesNeedUpdate = true;
		//set new faces
		faces[f].a = ind1;
		faces[f].b = ind4;
		faces[f].c = ind6;
		//var face1 = new THREE.Face3(ind1, ind4, ind6);
		var face2 = new THREE.Face3(ind4, ind2, ind5);
		var face3 = new THREE.Face3(ind6, ind5, ind3);
		var face4 = new THREE.Face3(ind5, ind6, ind4);
		mesh.geometry.faces.push(face2);
		mesh.geometry.faces.push(face3);
		mesh.geometry.faces.push(face4);
		
		
		
		//update
		mesh.geometry.elementsNeedUpdate = true;
	}
}
//might want to look into using geo.computeFaceNormals()
function drawFaceNormal(){
	var faces = plane.geometry.faces;
	var verts = plane.geometry.vertices;
	for (var f = 0; f<faces.length; f++){
		var centerx = (verts[ faces[f].a ].x + verts[ faces[f].b ].x + verts[ faces[f].c ].x) / 3;
		var centery = (verts[ faces[f].a ].y + verts[ faces[f].b ].y + verts[ faces[f].c ].y) / 3;
		var centerz = (verts[ faces[f].a ].z + verts[ faces[f].b ].z + verts[ faces[f].c ].z) / 3;
		var center = new THREE.Vector3(centerx, centery, centerz);
		
		var ba = new THREE.Vector3();
		ba.subVectors(verts[faces[f].a], verts[faces[f].b]);
		var bc = new THREE.Vector3();
		bc.subVectors(verts[faces[f].c], verts[faces[f].b]);
		var cross = new THREE.Vector3();
		cross.crossVectors(ba,bc);
		cross.multiplyScalar(10);
		cross.add(center);
		
		var lineGeo = new THREE.Geometry();
		lineGeo.vertices.push(center, cross);
		var line = new THREE.Line(lineGeo);
		scene.add(line);
	}
}

function water(height){
	for (var y = 0; y < planeVertQuant; y++){
		for (var x = 0; x<planeVertQuant; x++){
			if (verts[(y*planeVertQuant) + x].z < height){
				verts[(y*planeVertQuant) + x].z = height;
			}
		}		
	}
}

function newPerlin(oct){
	if(oct>0){
		for (var y = 0; y < planeVertQuant; y++){
			for (var x = 0; x<planeVertQuant; x++){
				verts[(y*planeVertQuant) + x].z += noise.simplex2(x/(planeVertQuant/oct), y/(planeVertQuant/oct)) / (oct*5);  //random terrain noise
				//console.log(verts[vert]);
			}		
		}
	}
	plane.geometry.verticesNeedUpdate = true;
}

function oldPerlin(){
	for (var y = 0; y < planeVertQuant; y++){
		for (var x = 0; x<planeVertQuant; x++){
			verts[(y*planeVertQuant) + x].z = perlin(x/(planeVertQuant/10),y/(planeVertQuant/10)) / 10;  //random terrain noise
			//console.log(verts[vert]);
		}		
	}
	plane.geometry.verticesNeedUpdate = true;
}


function lerp(a0, a1, w) {
     return (1.0 - w)*a0 + w*a1;  //lerp two values 
 }
 
 function dotGridGradient(ix, iy, x, y) {
 
     // Precomputed (or otherwise) gradient vectors at each grid point X,Y
     //Uhhh Done?
	 
     // Compute the distance vector
	 console.log(x);
	 console.log(ix);
     var dx = x - ix;
     var dy = y - iy;
 
     // Compute the dot-product
     return (dx*GradientGrid[iy][ix][0] + dy*GradientGrid[iy][ix][1]);
 }
 
 //need function to create grid of random unit vectors
 function createGradientGrid(X,Y){
	 var grid = [];
	 for (var y = 0; y<Y; y++){
		 grid.push([]);
		 for(var x = 0; x<X; x++){
			 var randAngle = Math.random() * 6.28;
			 grid[y].push([Math.cos(randAngle),Math.sin(randAngle)]);
		 }
	 }
	 console.log(grid);
	 GradientGrid = grid;
 }
 
 
 // Compute Perlin noise at coordinates x, y
 function perlin(x, y) {
 
     // Determine grid cell coordinates
     var x0 = ((x >= 0.0) ? parseInt(x) : parseInt(x) - 1);
     var x1 = x0 + 1;
     var y0 = ((y >= 0.0) ? parseInt(y) : parseInt(y) - 1);
     var y1 = y0 + 1;
 
     // Determine interpolation weights
     // Could also use higher order polynomial/s-curve here
     var sx = x - x0;
     var sy = y - y0;
 
     // Interpolate between grid point gradients
     var n0, n1, ix0, ix1, value;
	 console.log(x);
	 console.log(x0);
     n0 = dotGridGradient(x0, y0, x, y);
     n1 = dotGridGradient(x1, y0, x, y);
     ix0 = lerp(n0, n1, sx);
     n0 = dotGridGradient(x0, y1, x, y);
     n1 = dotGridGradient(x1, y1, x, y);
     ix1 = lerp(n0, n1, sx);
     value = lerp(ix0, ix1, sy);
 
     return value;
 }

function randomMovement(){
	Math.seedrandom(options.randomSeed);
	for (var vert = 0; vert < verts.length; vert++){
		verts[vert].z = Math.random() / planeVertQuant;  //random terrain noise
		//console.log(verts[vert]);
	}
	plane.geometry.verticesNeedUpdate = true;
}

function cycleVerts(){  //individualy moves one vertex to see the order of the vertexes.
	//console.log(vertIndex);
	//console.log(verts);
	verts[vertIndex].z = 0;
	vertIndex++;
	if (vertIndex >= verts.length){
		vertIndex = 0;
	}
	verts[vertIndex].z = 0.3;
	
	plane.geometry.verticesNeedUpdate = true;
}


function render() {
	//cycleVerts();
	currentTime = Date.now();
	deltaTime = (currentTime - lastTime) / 1000;
	lastTime = currentTime;
	//console.log(deltaTime);
	requestAnimationFrame(render);	
	renderer.render(scene, camera);
}



function onDocumentMouseDown(event){
	event.preventDefault();
	/* //the good one
	mouseVec = new THREE.Vector3(
			2* (event.clientX / window.innerWidth) - 1,
			1 - 2*(event.clientY / window.innerHeight),
			0 );
	*/
	mouseVec = new THREE.Vector3(
			2* (event.clientX / window.innerWidth) - 1,
			1 - 2*(event.clientY / window.innerHeight),
			0 );
/*
	raycaster = projector.pickingRay( mouseVec.clone(), camera);
	var intersects = raycaster.intersectObjects(arrayOfOnePlane);
	if (intersects.length > 0){
		//uhhhhhh
	}
	*/

	
}

function onWindowResize(){
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


function onDocumentKeyDown(event){
	//console.log("\n\n\nKEYY\n\n\n");
	var keyCode = event.which;
	//console.log(keyCode);
	var w=87;
	var s=83;
	var a=65;
	var d=68;
	var space=32;
	var q=81;
	var e=69;
	var z=90;
	var x=88;
	var c=67;
	var v=86;
	var f=70;
	var g=71;
	var comma=188;
	var period=190;
	/*
	if (cursorLead != undefined){
		if (keyCode == d){ 
			cursorLead.xLoc += 0.01;
		}
		else if (keyCode == a){
			cursorLead.xLoc -= 0.01;
		}
		else if (keyCode == w){
			cursorLead.yLoc += 0.01;
		}
		else if (keyCode == s){
			cursorLead.yLoc -= 0.01;
		}
		else if (keyCode == space){
			cubeAcc -= 0.5;
		}
		cursorLead.update();
	}
	else if(mode == 2 && (obstacles.length != 0 || keyCode == space)){
	//else if(obstacles.length != 0 || keyCode == space){
		if (keyCode == d){
			obstacles[obsIndex].move(0.01,0);
		}
		else if (keyCode == a){
			obstacles[obsIndex].move(-0.01,0);
		}
		else if (keyCode == w){
			obstacles[obsIndex].move(0,0.01);
		}
		else if (keyCode == s){
			obstacles[obsIndex].move(0,-0.01);
		}
		else if(keyCode == z){
			obstacles[obsIndex].expand(0.01,0);
		}
		else if(keyCode == x){
			obstacles[obsIndex].expand(-0.01,0);
		}
		else if(keyCode == c){
			obstacles[obsIndex].expand(0,0.01);
		}
		else if(keyCode == v){
			obstacles[obsIndex].expand(0,-0.01);
		}
		else if(keyCode == q){
			obstacles[obsIndex].rotate(0.01);
		}
		else if(keyCode == e){
			obstacles[obsIndex].rotate(-0.01);
		}
		else if(keyCode == f){ //<<<
			if (obsIndex == 0){	obsIndex = obstacles.length - 1;	}
			else{	obsIndex -= 1; }
		}
		else if(keyCode == g){ //>>>
			if (obsIndex == obstacles.length - 1){ obsIndex = 0; }
			else{	obsIndex += 1; }
		}
		else if (keyCode == space){
			obstacles[obstacles.length] = new Obstacle();
			obsIndex = obstacles.length - 1;
		}
	}
	if ( formation != 0 ){
		if (keyCode == comma){
			for (i=0; i<followers.length; i++){
				if (followers[i].inFormation == true){
					followers[i].leaveFormation();
					break;
				}
			}
		}
		else if (keyCode == period){
			formation.addSlot();
		}
	}
	*/
}




