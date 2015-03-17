function VertexCoverBKAlgorithm(graph){
	this.graph = graph;
}

VertexCoverBKAlgorithm.prototype.execute = function() {
	this.minimumVertexCover = this.graph.nodes;
	for(var i = 0; i < this.graph.nodes.length; i++){
		this.graph.nodes[i].isMonitor = false;
	}

	var algoLogString = "";
	if(this.graph.edges.length > 0){
		var startTime = new Date();
		console.log("Algorithm started at: " + startTime.toTimeString());

		do{
			this.updateMinimumVertexCover();
		} while(this.nextPossibility());
		for(var i = 0; i < this.graph.nodes.length; i++){
			var node = this.graph.nodes[i];
			node.isMonitor = (this.minimumVertexCover.indexOf(node) != -1);
		}

		var endTime = new Date();
		var algoDurationMillis = endTime - startTime;
		var algoDurationString;
		if(algoDurationMillis < 1000)
			algoDurationString = algoDurationMillis + " millis";
		else if(algoDurationMillis < 60 * 1000)
			algoDurationString = (algoDurationMillis / 1000) + " seconds";
		else algoDurationString = (algoDurationMillis / (60 * 1000)) + " minutes";
		algoLogString += "Finished: " + endTime.toTimeString() + ", took about " + algoDurationString + "\n";
		algoLogString += "There are " + this.graph.nodes.length + " nodes => " + Math.pow(2, this.graph.nodes.length) + " possibilities tested...\n";
	}
	else this.minimumVertexCover = new Array();

	// Redraw the graph
	this.graph.erase();
	this.graph.draw();
	algoLogString += "Minimum vertex cover found, minimum monitors count is: " + this.minimumVertexCover.length;
	console.log(algoLogString);
};

VertexCoverBKAlgorithm.prototype.isVertexCover = function() {
	for (var i = 0; i < this.graph.edges.length; i++){
		var edge = this.graph.edges[i];
		if (!edge.node1.isMonitor && !edge.node2.isMonitor)
			return false;
	}
	return (this.graph.edges.length != 0);
}

VertexCoverBKAlgorithm.prototype.updateMinimumVertexCover = function() {
	if(this.isVertexCover()){
		var monitorsCount = 0;
		for(var i = 0; i < this.graph.nodes.length; i++)
			if(this.graph.nodes[i].isMonitor)
				monitorsCount++;
		if(monitorsCount < this.minimumVertexCover.length){
			this.minimumVertexCover = new Array();
			for(var i = 0; i < this.graph.nodes.length; i++)
				if(this.graph.nodes[i].isMonitor)
					this.minimumVertexCover.push(this.graph.nodes[i]);
		}
	}
}

VertexCoverBKAlgorithm.prototype.nextPossibility = function() {
	var i;
	for(i = 0; i < this.graph.nodes.length && this.graph.nodes[i].isMonitor; i++) ;
	if(i == this.graph.nodes.length)
		return false;
	this.graph.nodes[i].isMonitor = true;
	for(var j = i - 1; j >= 0; j--){
		this.graph.nodes[j].isMonitor = false;
	}
	return true;
}