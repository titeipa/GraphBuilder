var graphBuilder = new GraphBuilder();

var pageBounds = getPageBounds();
graphBuilder.addWorkspace(1, document.body.clientWidth / 2, pageBounds.height);
graphBuilder.addWorkspace(2, document.body.clientWidth / 2, pageBounds.height);
graphBuilder.findWorkspace(1).graph.erase();
graphBuilder.findWorkspace(2).graph.erase();
graphBuilder.findWorkspace(1).graph.draw();
graphBuilder.findWorkspace(2).graph.draw();