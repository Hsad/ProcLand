function Edge(lV,rV){
	this.leftVert = lV;
	this.rightVert = rV;
	this.face; //int?
	this.leftAdjEdge = null;
	this.opposite = null;
	this.subDivLeft = null;
	this.subDivRight = null;
}

function c(p){
	console.log(p);
}

Edge.prototype.divideEdge = function(Geo){
	//c("divideEdge");
	//jconsole.log("divideing edges");
	//if there is no opposite edge, or the opposite edge has not been divided
	if(this.opposite == null || 
			(this.opposite.subDivLeft == null && this.opposite.subDivRight == null)){
		//make a new vert in the middle of the initial two verts
		var newVert = new THREE.Vector3(0,0,0);
		newVert.addVectors(Geo.vertices[this.leftVert], Geo.vertices[this.rightVert]);
		//middle of the two verts
		newVert.divideScalar(2); 
		//get its future index location
		var newVertIndex = Geo.vertices.length; 
		//c("++++++++++adding vertex to Geo");
		//add it to the vert array
		Geo.vertices.push(newVert);
		this.createNewSubEdge(newVertIndex);
	} 
	//there is an opposite edge, and is could be divided
	else{ 	
		//assert my right vec is your left
		if (this.leftVert != this.opposite.rightVert || this.rightVert != this.opposite.leftVert){
			console.log("OPPOSITE VERTICES ARE NOT MATCHING xxxFAILURExxx");
		}
		//check that the opposite divisions are pointing to the correct vert
		if (this.opposite.subDivRight.leftVert != this.opposite.subDivLeft.rightVert){
			console.log("SUB DIVISONS NOT MATCHING UP");
		}

		//create new edges with indices
		this.createNewSubEdge(this.opposite.subDivRight.leftVert);
	}
}

Edge.prototype.createNewSubEdge = function(middleVert){
	//c("createNewSubEdge");
	var subEdgeLeft = new Edge(this.leftVert, middleVert);
	var subEdgeright = new Edge(middleVert, this.rightVert);
	this.subDivLeft = subEdgeLeft;  //create reference to those
	this.subDivRight = subEdgeright;
}

Edge.prototype.create4FacesFromSubdivision = function(){
	//c("create4FacesFromSubdivision");
	if (this.leftAdjEdge == null || this.leftAdjEdge.leftAdjEdge == null){
		console.log("DONT HAVE AN ADJACENT EDGE");
	}


	//for each edge get its 3 verts
	//then build the 4 faces from it
	//return those four faces in a list; list of THREE.Face obj 
	
	//        2 
	//       / \
	//      /   \
	//     1     3
	//    /       \
	//   /         \
	//  0 ----5---- 4
	var v0 = this.rightVert;
	var v1 = this.subDivLeft.rightVert;
	var v2 = this.leftVert;
	var v3 = this.leftAdjEdge.subDivLeft.rightVert;
	var v4 = this.leftAdjEdge.leftVert;
	var v5 = this.leftAdjEdge.leftAdjEdge.subDivLeft.rightVert;

	//       / \
	//      / 1 \
	//     /-----\
	//    / \ 3 / \
	//   / 0 \ / 2 \
	//   ----------- 
	var face0 = new THREE.Face3(v0, v1, v5);
	var face1 = new THREE.Face3(v1, v2, v3);
	var face2 = new THREE.Face3(v5, v3, v4);
	var face3 = new THREE.Face3(v1, v3, v5);

	this.createAndConnectEdges();
	//console.log("Sub div after connection");
	//console.log(this.subDivRight);
	//console.log( [face0, face1, face2, face3]);
	return [face0, face1, face2, face3];

}

Edge.prototype.createAndConnectEdges = function(){
	//c("createAndConnectEdges");
	//needs to make 6 new edge nodes and with the existing 6
	//link those 12 together in the proper way
	//
	//        old                  new
	//        / \         |        / \         |
	//       1   2        |       /   \        |
	//      /     \       |      /  1  \       |
	//     /-------\      |     /-------\      |
	//    / \     / \     |    / \  3  / \     |
	//   0   \   /   3    |   /  0\5 4/2  \    |
	//  /     \ /     \   |  /     \ /     \   |
	//  ---5-------4---   |  ---------------   |
	//
	var o0 = this.subDivRight;
	var o1 = this.subDivLeft;
	var o2 = this.leftAdjEdge.subDivRight;
	var o3 = this.leftAdjEdge.subDivLeft;
	var o4 = this.leftAdjEdge.leftAdjEdge.subDivRight;
	var o5 = this.leftAdjEdge.leftAdjEdge.subDivLeft;

	var n0 = new Edge(o5.rightVert, o0.leftVert);
	var n1 = new Edge(o1.rightVert, o2.leftVert);
	var n2 = new Edge(o3.rightVert, o4.leftVert);
                                              
	var n3 = new Edge(n1.rightVert, n1.leftVert);
	var n4 = new Edge(n2.rightVert, n2.leftVert);
	var n5 = new Edge(n0.rightVert, n0.leftVert);

	this.linkAdjEdges(o0, n0, o5);
	this.linkAdjEdges(o1, o2, n1);
	this.linkAdjEdges(n2, o3, o4);
	this.linkAdjEdges(n3, n4, n5);

	this.linkOppEdges(n0, n5);
	this.linkOppEdges(n1, n3);
	this.linkOppEdges(n2, n4);


	//console.log("Printing new edges");
	//console.log(o0);
	//console.log(n3);
	//console.log(n4);
	//console.log(n5);
}

Edge.prototype.linkAdjEdges = function(a, b, c){
	//console.log("linkAdjEdges 4tri");
	a.leftAdjEdge = b;
	b.leftAdjEdge = c;
	c.leftAdjEdge = a;
	//abc[0].leftAdjEdge = abc[1];
	//abc[1].leftAdjEdge = abc[2];
	//abc[2].leftAdjEdge = abc[0];
}

Edge.prototype.linkOppEdges = function(a, b){
	//c("linkOppEdges 4tri");
	a.opposite = b;
	b.opposite = a;
}

//take in geo so new verticies can be added to it.
Edge.prototype.subDivideFace = function(geo){
	//console.log("Subdivideing faces");
	//console.log(geo);
	//asserts
	if ((this.subDivLeft == null && this.subDivRight != null) ||
			(this.subDivRight == null && this.subDivLeft != null)){
		console.log("SOMETHING IS WRONG, ONE SIDE OF THE EDGE IS NOT SUBDIVIDED, THE OTHER IS");
	}
	if (this.leftAdjEdge == null || this.leftAdjEdge.leftAdjEdge == null){
		console.log("DONT HAVE AN ADJACENT EDGE");
		//console.log(this);
	}

	
	//console.log("past first asserts");
	//the edge has already been divided, therefore its face has been divided
	//return empty list
	if (this.subDivLeft != null && this.subDivRight != null){
		console.log("left and right subdivisions are not null");
		return [];
	} //the edge has not been divided therefor the face needs dividing too
	else if(this.subDivLeft == null && this.subDivRight == null){
		this.divideEdge(geo);
		this.leftAdjEdge.divideEdge(geo);
		this.leftAdjEdge.leftAdjEdge.divideEdge(geo);
	}
	var triList = this.create4FacesFromSubdivision();
	//console.log("triList after face Division");
	//console.log(triList);
	triList = triList.concat(this.subDivFaceOfAdjOpposites(geo));
	//console.log("triList after recursive Division");
	//console.log(triList);
	//merge all the newly linked subdivisions sets with their opposite 
	//for each tri, link subdivisions, with opposite subdivisons
	//call that on all adjacent
	this.linkSubDivOfAdj();
	return triList;
}

Edge.prototype.linkSubDivOfAdj = function(){
	//console.log("Linkin adj");
	//can assume that the current edge has already been linked
	//check that the adjacent edge was not hooked up
	//c("printing this");
	//c(this);
	//c("printing this.leftAdjEdge");
	//c(this.leftAdjEdge);
	if (this.leftAdjEdge.linkSubDivOfOppo()){
		this.leftAdjEdge.opposite.linkSubDivOfAdj();
	}
	//c("printing this.leftAdjEdge.leftAdjEdge");
	//c(this.leftAdjEdge.leftAdjEdge);
	if (this.leftAdjEdge.leftAdjEdge.linkSubDivOfOppo()){
		this.leftAdjEdge.leftAdjEdge.opposite.linkSubDivOfAdj();
	}
}

Edge.prototype.linkSubDivOfOppo = function(){
	//console.log("Linkin oppo");
	//c("printing this after");
	//c(this);
	if ((this.opposite != null) && (this.opposite.subDivLeft != null) &&
			(this.subDivLeft.opposite == null || this.subDivRight.opposite == null)
			){
		//c("setting adjacent opposite to eachother");
		//var opR = this.opposite.subDivRight;
		//var opL = this.opposite.subDivLeft;
		//var R = this.subDivRight;
		//var L = this.subDivLeft;
		//this.subDivLeft.opposite = opR;
		//this.subDivRight.opposite = opL;
		//this.opposite.subDivLeft.opposite = R;
		//this.opposite.subDivRight.opposite = L;
		this.subDivLeft.opposite = this.opposite.subDivRight;
		this.subDivRight.opposite = this.opposite.subDivLeft;
		this.opposite.subDivLeft.opposite = this.subDivRight;
		this.opposite.subDivRight.opposite = this.subDivLeft;
		return true;
	} else{
		return false;
	}
}

Edge.prototype.subDivFaceOfAdjOpposites = function(geo){
	//c("subDivFaceOfAdjOpposites");
	//need to check if it even needs to be divided
	var triList1 = [];
	var triList2 = [];
	//console.log("printing adj opposite from inside subDivFaceOfAdjOpposites");
	//console.log(this.leftAdjEdge.opposite);
	//console.log(this.leftAdjEdge.leftAdjEdge.opposite);
	if (this.leftAdjEdge.opposite != null && this.leftAdjEdge.opposite.subDivLeft == null){
		triList1 = this.leftAdjEdge.opposite.subDivideFace(geo);
		//console.log("trilist 1");
		//console.log(triList1);
	}
	if (this.leftAdjEdge.leftAdjEdge.opposite != null
			&& this.leftAdjEdge.leftAdjEdge.opposite.subDivLeft == null){
		triList2 = this.leftAdjEdge.leftAdjEdge.opposite.subDivideFace(geo);
		//console.log("trilist 2");
		//console.log(triList2);
	}
	triList1 = triList1.concat(triList2);
	//console.log(triList1);
	return triList1;
}
