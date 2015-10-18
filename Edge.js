function Edge(lV,rV){
	this.leftVert = lV;
	this.rightVert = rV;
	this.face;
	this.leftAdjEdge;
	this.opposite;
	this.subDivLeft;
	this.subDivRight;
}

Edge.prototype.DivideEdge = function(Geo){
	//if there is no opposite edge, or the opposite edge has not been divided
	if(this.opposite == null or 
			(this.opposite.subDivLeft == null && this.opposite.subDivRight == null)){
		var newVert = new THREE.Vector3();
		newVert.addVectors(Geo.vertices[this.leftVert], Geo.vertices[this.rightVert]);
		newVert.divideScalar(2); //middle of the two verts
		var newVertIndex = Geo.vertices.length(); //get its future index location
		Geo.vertices.push(newVert); //add it to the vert array
		var subEdgeLeft = new Edge(this.leftVert, newVertIndex); //create new edges with indices
		var subEdgeright = new Edge(newVertIndex, this.rightVert);
		this.subDivLeft = subEdgeLeft;  //create reference to those
		this.subDivRight = subEdgeright;
	} else{ //there is an opposite edge, and is divided
		//use those values

	}
}
