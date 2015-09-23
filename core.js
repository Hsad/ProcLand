
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
	

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	camControls = new THREE.OrbitControls(camera);
	camControls.addEventListener( 'change', render);
	
	geometry = new THREE.PlaneGeometry(planeWidth,planeHeight,planeSubDiv,planeSubDiv);  //range is 0 to 10200 or x0-100 y0-100
	material = new THREE.MeshBasicMaterial( { color: 0x19A81E } );
	plane = new THREE.Mesh( geometry, material );
	scene.add( plane );
	
	directionalLight = new THREE.DirectionalLight( 0xf0000f, 1 );
	directionalLight.position.set( 0, 1, 0 );
	directionalLight.rotation.y = 0.3;
	scene.add( directionalLight );
	
	pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
	pointLight.position.set( 0, 0, 2 );
	scene.add( pointLight );
	
	//projector = new THREE.Projector();

	camera.position.z = 2;
	camera.position.y = -1; //lil hight boost, lil less
	camera.position.x = 0; //lil hight boost, lil less
	camera.rotation.x = 0.5;

	document.addEventListener("keydown",onDocumentKeyDown,false);
	//if (mode == 2){	document.addEventListener("mousedown",onDocumentMouseDown,false);}
	window.addEventListener("resize", onWindowResize, false);
	
	
	verts = plane.geometry.vertices;
	/*
	for (var vert = 0; vert < verts.length; vert++){
		verts[vert].z = Math.random() / planeSubDiv;  //random terrain noise
		//console.log(verts[vert]);
	}
	plane.verticesNeedUpdate;
	*/
	//cycleVerts();
	
	verts[0].z = 0.1;
	//verts[10].z = 0.1;
	verts[100].z = 0.1;
	verts[10100].z = 0.1;
	verts[10200].z = 0.1;
	/*
	verts[150].z = 0.1;
	verts[200].z = 0.1;
	verts[500].z = 0.1;
	verts[550].z = 0.1;
	verts[640].z = 0.1;
	verts[650].z = 0.1;
	verts[660].z = 0.1;
	verts[830].z = 0.1;
	verts[999].z = 0.1;
	verts[9999].z = 0.1;
	verts[10200].z = 0.1;*/
	plane.verticesNeedUpdate;

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
	
	plane.verticesNeedUpdate;
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




