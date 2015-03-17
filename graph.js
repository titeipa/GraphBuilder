function Graph(workspace, canvas){
	this.nodes = new Array();
	this.edges = new Array();
	this.workspace = workspace;
	this.canvas = canvas;
	this.context = this.canvas.getContext("2d");
	this.canvas.graph = this;
	this.heldNode = null;
	this.heldButton = null;
	this.mouseMoved = false;
	this.showHiddenEdges = false;
	this.operationList = new Array();
	this.lastMinRand = 1;
	this.lastMaxRand = 10;

	this.canvas.onmousedown = this.mouseDownCanvas;
	this.canvas.onmouseup = this.mouseUpCanvas;
	this.canvas.onmousemove = this.mouseMoveCanvas;
	this.canvas.ondblclick = this.mouseDoubleClickCanvas;
	this.canvas.onkeypress = this.keyPressCanvas;
	this.canvas.oncontextmenu = function(){ return false; };
	this.erase();
}

Graph.prototype.mouseDownCanvas = function(e){
	var canvas = e.currentTarget, graph = canvas.graph;
	graph.workspace.select();
	var x, y, releasedNode;
	
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;

	graph.heldNode = graph.getNodeAt(x, y);
	graph.heldButton = e.button;
	return false;
}

Graph.prototype.mouseUpCanvas = function(e){
	var canvas = e.currentTarget, graph = canvas.graph, heldNode = graph.heldNode, heldButton = graph.heldButton;
	var x, y, releasedNode;
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;
	releasedNode = graph.getNodeAt(x, y);

	if (heldButton == RIGHT_CLICK){
		if (heldNode != null && releasedNode != null){
			if (releasedNode == heldNode){
				heldNode.toggleMonitor();
			}
			else {
				if (!graph.edgeExists(releasedNode, heldNode)){
					graph.addEdge(new Edge(heldNode, releasedNode));
				} 
				else if(graph.edgeExists(releasedNode, heldNode)){
					graph.removeEdge(releasedNode, heldNode);
				}
				heldNode.hidden = (releasedNode.hidden = false);
			}
		}
		else if (heldNode != null && releasedNode == null){
			newNode = graph.addNewNode(x, y);
			graph.addEdge(new Edge(heldNode, newNode));
		}
	}
	else if (heldButton == MIDDLE_CLICK) {
		if (heldNode != null && releasedNode != null){
			if (releasedNode == heldNode){
				graph.removeNode(heldNode);
			}
		}
	}
	else if (heldButton == LEFT_CLICK) {
		if (releasedNode != null && !graph.mouseMoved){
			releasedNode.hidden = !releasedNode.hidden;
		}
	}

	graph.erase();
	graph.draw();
	graph.heldNode = null;
	graph.heldButton = null;
	graph.mouseMoved = false;
	return false;
}

Graph.prototype.mouseDoubleClickCanvas = function(e){
	var canvas = e.currentTarget, x, y;
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;

	canvas.graph.addNewNode(x, y);
	canvas.graph.erase();
	canvas.graph.draw();
	return false;
}

Graph.prototype.mouseMoveCanvas = function(e){
	var canvas = e.currentTarget, graph = canvas.graph, heldNode = graph.heldNode, x, y;
	if(heldNode == null) 
		return;
	x = e.pageX - canvas.offsetLeft;
	y = e.pageY - canvas.offsetTop;
	
	graph.erase();
	if (graph.heldButton == LEFT_CLICK){ // reposition node
		heldNode.centerX = x;
		heldNode.centerY = y;
	} 
	else if (graph.heldButton == RIGHT_CLICK){ // draw line
		drawLine(graph.context, heldNode.centerX, heldNode.centerY, x, y, graph.edgeColor, graph.edgeWidth);
	}
	graph.draw();
	graph.mouseMoved = true;
	return false;
}

Graph.prototype.keyPressCanvas = function(e){
	var canvas = e.currentTarget, graph = canvas.graph;

	// Ctrl+Z
	if (isKey(e, "z", true, false)){
		graph.undo();
	}
	// H
	else if (isKey(e, "h", false, false)){
		for(var i = 0; i < graph.nodes.length; i++){
			if(graph.nodes[i].isMonitor)
				graph.nodes[i].hidden = true;
		}
		graph.showHiddenEdges = !graph.showHiddenEdges;
	}
	// Shift+H
	else if (isKey(e, "h", false, true)){
		graph.showHiddenEdges = !graph.showHiddenEdges;
	}
	// Ctrl+B
	else if(isKey(e, "b", true, false)){
		var vcBkAlgo = new VertexCoverBKAlgorithm(graph);
		vcBkAlgo.execute();
	}
	// M
	else if(isKey(e, "m", false, false)){
		for(var i = 0; i < graph.nodes.length; i++)
			graph.nodes[i].isMonitor = false;
	}
	// Shift+M
	else if(isKey(e, "m", false, true)){
		for(var i = 0; i < graph.nodes.length; i++){
			graph.nodes[i].isMonitor = !graph.nodes[i].isMonitor;
		}
	}
	// C
	else if(isKey(e, "c", false, false)){
		graph.workspace.copy();
	}
	// P
	else if(isKey(e, "p", false, false)){
		graph.workspace.paste();
	}
	// D
	else if(isKey(e, "d", false, false)){
		graph.removeMultipleNodes(graph.nodes.clone());
	}
	// R
	else if(isKey(e, "r", false, false)){
		graph.randomize(graph.lastMinRand, graph.lastMaxRand);
	}
	// Shift+R
	else if(isKey(e, "r", false, true)){
		var minNodes = parseInt(prompt("Please input the minimum number of nodes: ", ""));
		var maxNodes = parseInt(prompt("Please input the maximum number of nodes: ", ""));
		graph.lastMinRand = minNodes; graph.lastMaxRand = maxNodes;
		graph.randomize(minNodes, maxNodes);
	}

	graph.erase();
	graph.draw();
	return false;
}

Graph.prototype.drawEdges = function(){
	for (var i = 0; i < this.edges.length; i++){
		var node1 = this.edges[i].node1,
			node2 = this.edges[i].node2;
		if (!this.showHiddenEdges && (node1.hidden || node2.hidden)) continue;
		var edgeColor = this.edgeColor,
			edgeWidth = this.edgeWidth;
		
		if (node1.isMonitor || node2.isMonitor){
			if (node1.isMonitor)
				edgeColor = node1.monitorColor;
			else if (node2.isMonitor)
				edgeColor = node2.monitorColor;
			edgeWidth = this.edgeMonitorWidth;
		}

		this.edges[i].width = edgeWidth;
		drawLine(this.context, node1.centerX, node1.centerY, node2.centerX, node2.centerY, edgeColor, this.edges[i].width);
	}
};

Graph.prototype.drawBorder = function(){
	this.context.beginPath();
	this.context.lineWidth = this.borderWidth;
	this.context.strokeStyle = this.borderColor;
	this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
}

Graph.prototype.draw = function(){
	this.drawEdges();
	for(var i = 0; i < this.nodes.length; i++)
		this.nodes[i].draw();
	this.drawBorder();
};

Graph.prototype.erase = function(){
	this.context.fillStyle = this.eraseColor;
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Graph.prototype.addNewNode = function(x, y){
	if(typeof y == 'undefined') {
		x = graph.canvas.width/2;
		y = graph.canvas.height/2;
	}

	node = new Node(this.context, x, y, this.getAvailableNumber());
	this.nodes.push(node);
	return node;
};

Graph.prototype.addNode = function(node){
	this.nodes.push(node);
}

Graph.prototype.getAvailableNumber = function(){
	for (var number = 0; number <= this.nodes.length; number++){
		var exists = false;
		for (var i = 0; i < this.nodes.length && !exists; i++){
			if (this.nodes[i].number == number)
				exists = true;
		}
		if (exists == false) 
			return number;
	}
}

Graph.prototype.removeNode = function(node){
	removeOp = new RemoveOperation(this, [node]);
	removeOp.execute();
	this.operationList.push(removeOp);
};

Graph.prototype.removeMultipleNodes = function(nodes){
	removeOp = new RemoveOperation(this, nodes);
	removeOp.execute();
	this.operationList.push(removeOp);
};

Graph.prototype.undo = function(){
	if (this.operationList.length > 0){
		this.operationList.pop().undo();
	}
}

Graph.prototype.setFocused = function(focused){
	if(focused){
		this.eraseColor = GRAPH_FOCUSED_CLEARCOLOR;
		this.canvas.focus();
	}
	else this.eraseColor = GRAPH_NOTFOCUSED_CLEARCOLOR;
	this.erase();
	this.draw();
}

Graph.prototype.addEdge = function(edge){
	if (!this.edgeExists(edge.node1, edge.node2))
		this.edges.push(edge);
};

Graph.prototype.removeEdge = function(node1, node2){
	if(node1 == null && node2 == null) return;
	if(node1 == null || node2 == null){
		var nodeToRemove = (node1 == null) ? node2 : node1;
		for(var i = 0; i < this.edges.length; i++){
			var edge = this.edges[i];
			if(edge.node1 == nodeToRemove || edge.node2 == nodeToRemove){
				this.edges.remove(i, i);
				i--;
			}
		}
	}
	else
		for(var i = 0; i < this.edges.length; i++){
			var edge = this.edges[i];
			if((edge.node1 == node1 && edge.node2 == node2) || (edge.node1 == node2 && edge.node2 == node1)){
				this.edges.remove(i, i);
				break;
			}
		}
};

Graph.prototype.edgeExists = function(node1, node2){
	for (var i = 0; i < this.edges.length; i++){
		var edge = this.edges[i];
		if ((edge.node1 == node1 && edge.node2 == node2) ||
			 (edge.node1 == node2 && edge.node2 == node1))
			return true;
	}
	return false;
}

Graph.prototype.getNodeAt = function(x, y){
	for (i = 0; i < this.nodes.length; i++)
		if (pointInCircle(this.nodes[i].centerX, this.nodes[i].centerY, this.nodes[i].radius, x, y))
			break;
	return (i < this.nodes.length) ? this.nodes[i] : null;
}

Graph.prototype.pasteFrom = function(sourceGraph){
	this.nodes = new Array();
	this.edges = new Array();
	for(var i = 0; i < sourceGraph.nodes.length; i++){
		var sourceNodeClone = sourceGraph.nodes[i].clone();
		sourceNodeClone.context = this.context;
		this.nodes.push(sourceNodeClone);
	}
	for(var i = 0; i < sourceGraph.edges.length; i++){
		var sourceEdge = sourceGraph.edges[i];
		var node1Index = sourceGraph.nodes.indexOf(sourceEdge.node1);
		var node2Index = sourceGraph.nodes.indexOf(sourceEdge.node2);
		this.edges.push(new Edge(this.nodes[node1Index], this.nodes[node2Index]));
	}
}

Graph.prototype.randomize = function(minNodes, maxNodes){
	removeOp = new RemoveOperation(this, this.nodes.clone(), true);
	removeOp.execute();
	this.operationList.push(removeOp);

	var nodesCount = getRandom(minNodes, maxNodes);
	for(var i = 0; i < nodesCount; i++){
		var nodeX = getRandom(0, this.canvas.width - 20);
		var nodeY = getRandom(0, this.canvas.height - 20);
		var node = new Node(this.context, nodeX, nodeY, i);
		this.nodes.push(node);
	}

	var edgesCount = getRandom(0, nodesCount);
	for(var i = 0; i < edgesCount; i++){
		var node1Index = getRandom(0, this.nodes.length - 1);
		var node2Index = getRandom(0, this.nodes.length - 2);
		if(node2Index >= node1Index) node2Index++;
		var edgeExists = false;
		for(var j = 0; j < this.edges.length; j++){
			var node1 = this.edges[j].node1;
			var node2 = this.edges[j].node2;
			if(this.nodes.indexOf(node1) == node1Index && this.nodes.indexOf(node2) == node2Index){
				edgeExists = true;
				break;
			}
		}
		if(!edgeExists)
			this.edges.push(new Edge(this.nodes[node1Index], this.nodes[node2Index]));
	}

	// Remove isolated nodes
	for(var i = 0; i < this.nodes.length; i++){
		var hasEdges = false;
		for(var j = 0; j < this.edges.length; j++){
			if(this.edges[j].node1 == this.nodes[i] || this.edges[j].node2 == this.nodes[i]){
				hasEdges = true;
				break;
			}
		}
		if(!hasEdges) this.nodes.remove(i--);
	}
}

function RemoveOperation(graph, nodes, clearBeforeUndo){
	this.graph = graph;
	this.nodes = nodes;
	this.clearBeforeUndo = (typeof clearBeforeUndo != 'undefined' && clearBeforeUndo);
	this.removedEdges = new Array();
}

RemoveOperation.prototype.execute = function(){
	for(var i = 0; i < this.nodes.length; i++){
		var currentNode = this.nodes[i];
		for (var j = 0; j < this.graph.edges.length; j++){
			var edge = this.graph.edges[j];
			if (edge.node1 == currentNode || edge.node2 == currentNode){
				this.removedEdges.push(edge);
				this.graph.edges.remove(j);
				j--;
			}
		}

		var nodeIndex = this.graph.nodes.indexOf(this.nodes[i]);
		if(nodeIndex != -1){
			this.graph.nodes.remove(nodeIndex);
		}
	}
}

RemoveOperation.prototype.undo = function(){
	if(this.clearBeforeUndo){
		this.graph.nodes = new Array();
		this.graph.edges = new Array();
	}

	var nodesCount = this.nodes.length;
	for(var i = 0; i < nodesCount; i++){
		var currentNode = this.nodes.pop();
		currentNode.number = this.graph.getAvailableNumber();
		this.graph.nodes.push(currentNode);
	}

	var edgesCount = this.removedEdges.length;
	for (var i = 0; i < edgesCount; i++){
		this.graph.edges.push(this.removedEdges.pop());
	}
}