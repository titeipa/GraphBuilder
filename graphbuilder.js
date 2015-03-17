function GraphBuilder(){
	this.workspaces = new Array();
	this.copiedWorkspace = null;
}

GraphBuilder.prototype.addWorkspace = function(workspaceID, width, height) {
	for(var w = 0; w < this.workspaces.length; w++)
		if(this.workspaces[w].id == workspaceID) return;
	this.workspaces.push(new Workspace(workspaceID, width, height, this));
};

GraphBuilder.prototype.findWorkspace = function(workspaceID) {
	for(var w = 0; w < this.workspaces.length; w++)
		if(this.workspaces[w].id == workspaceID)
			return this.workspaces[w];
	return null;
};

GraphBuilder.prototype.setSelectedWorkspace = function(workspaceID){
	for(var i = 0; i < this.workspaces.length; i++){
		var workspace = this.workspaces[i];
		if(workspace.id != workspaceID)
			workspace.deselect();
	}
}

function Workspace(id, width, height, graphbuilder){
	var body = document.getElementById('body');
	var canvas = document.createElement('canvas');
	var tabIndexAttribute = document.createAttribute("tabindex");
	canvas.width = width;
	canvas.height = height;
  	tabIndexAttribute.nodeValue = '1';
  	canvas.setAttributeNode(tabIndexAttribute);
	body.appendChild(canvas);

	this.graph = new Graph(this, canvas);
	this.copiedGraph = null;
	this.id = id;
	this.graphbuilder = graphbuilder;
}

Workspace.prototype.select = function(){
	this.graph.setFocused(true);
	this.graphbuilder.setSelectedWorkspace(this.id);
}

Workspace.prototype.deselect = function(){
	this.graph.setFocused(false);
}

Workspace.prototype.copy = function(){
	this.graphbuilder.copiedWorkspace = this;
}

Workspace.prototype.paste = function(){
	if(this.graphbuilder.copiedWorkspace != null){
		this.graph.pasteFrom(this.graphbuilder.copiedWorkspace.graph);
	}
}
