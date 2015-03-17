function Node(context, centerX, centerY, number){
	this.centerX = centerX;
	this.centerY = centerY;
	this.context = context;
	this.hidden = false;
	this.isMonitor = false;
	this.number = (typeof number == 'undefined') ? 1 : number;
}

Node.prototype.draw = function(){
	this.context.beginPath();
	this.context.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
	this.context.fillStyle = this.getCurrentFillStyle();
	this.context.fill();
	this.context.lineWidth = this.lineWidth;
	this.context.strokeStyle = this.strokeStyle;
	this.context.stroke();

	this.context.beginPath();
	this.context.font = this.font;
	this.context.fillStyle = this.fontColor;
	var nodeText = this.number + (this.hidden ? 'h' : '');
	var textBounds = { width: this.context.measureText(nodeText).width, height: this.fontSize };
	this.context.fillText(nodeText, this.centerX - textBounds.width / 2, this.centerY + textBounds.height / 2);
};

Node.prototype.toggleMonitor = function(){
	this.isMonitor = !this.isMonitor;
};

Node.prototype.getCurrentFillStyle = function(){
	return (this.isMonitor == true) ? this.monitorColor  : this.fillStyle;
};

Node.prototype.clone = function(){
	var nodeClone = new Node(this.context, this.centerX, this.centerY, this.number);
	nodeClone.hidden = this.hidden;
	nodeClone.isMonitor = this.isMonitor;
	return nodeClone;
}

function Edge(node1, node2){
	this.node1 = node1;
	this.node2 = node2;
}
