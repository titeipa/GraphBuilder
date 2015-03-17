function distance(x1, y1, x2, y2){
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function pointInCircle(xc, yc, r, x, y){
	return (distance(x, y, xc, yc) <=  r);
}

function drawLine(context, x1, y1, x2, y2, color, width){
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = width;
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

Array.prototype.remove = function(from, to) {
	if(typeof to == 'undefined')
		to = from;
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.clone = function() {
	return this.slice(0);
};

function getRandom(min, max){
	if(typeof max == 'undefined'){
		max = min;
		min = 0;
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPageBounds() {
	var positionXY = { width: 0, height: 0 };
	var db = document.body;
	var dde = document.documentElement;
	positionXY.width = Math.max(db.scrollTop, dde.scrollTop, db.offsetWidth, db.clientWidth); 
	positionXY.height = Math.max(db.scrollHeight, dde.scrollHeight, db.offsetHeight, dde.offsetHeight, db.clientHeight, dde.clientHeight);
	return positionXY;
};

function isKey(e, key, ctrl, shift){
	if(typeof ctrl != 'undefined' && ctrl != e.ctrlKey)
		return false;
	if(typeof shift != 'undefined' && shift != e.shiftKey)
		return false;
	if(ctrl)
		return (e.keyCode == key.toLowerCase().charCodeAt(0) - "a".charCodeAt(0) + 1);
	return (e.keyCode == key.toLowerCase().charCodeAt(0) || e.keyCode == key.toUpperCase().charCodeAt(0));
}

const LEFT_CLICK = 0, MIDDLE_CLICK = 1, RIGHT_CLICK = 2;

Node.prototype.fillStyle = '#fff';
Node.prototype.monitorColor = '#f00';
Node.prototype.radius = 21;
Node.prototype.font = "16pt Arial";
Node.prototype.fontSize = 16;
Node.prototype.fontColor = "#000";
Node.prototype.lineWidth = 3;
Node.prototype.strokeStyle = '#000';

const GRAPH_NOTFOCUSED_CLEARCOLOR = "#ccc", GRAPH_FOCUSED_CLEARCOLOR = "#999";

Graph.prototype.edgeWidth = 3;
Graph.prototype.edgeMonitorWidth = 5;
Graph.prototype.edgeColor = '#000';
Graph.prototype.borderColor = '#000';
Graph.prototype.borderWidth = 5;
Graph.prototype.eraseColor = GRAPH_NOTFOCUSED_CLEARCOLOR;
