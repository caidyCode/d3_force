(function($,undefined){
	function drawD3ReationGraph(graphParams){
		var width = 600;
		var height = 600;
		var img_w = 77;
		var img_h = 90;
		
		var svg = d3.select("body").append("svg")
								.attr("width",width)
								.attr("height",height);
		
		
			
			var force = d3.layout.force()
							.nodes(root.nodes)
							.links(root.edges)
							.size([width,height])
							.linkDistance(200)
							.charge(-1500)
							.start();
							
			var edges_line = svg.selectAll("line")
								.data(root.edges)
								.enter()
								.append("line")
								.style("stroke","#ccc")
								.style("stroke-width",1);
								
			var edges_text = svg.selectAll(".linetext")
								.data(root.edges)
								.enter()
								.append("text")
								.attr("class","linetext")
								.text(function(d){
									return d.relation;
								});
			
								
			var nodes_img = svg.selectAll("image")
								.data(root.nodes)
								.enter()
								.append("image")
								.attr("width",img_w)
								.attr("height",img_h)
								.attr("xlink:href",function(d){
									return d.image;
								})
								.on("mouseover",function(d,i){
									//显示连接线上的文字
									edges_text.style("fill-opacity",function(edge){
										if( edge.source === d || edge.target === d ){
											return 1.0;
										}
									});
								})
								.on("mouseout",function(d,i){
									//隐去连接线上的文字
									edges_text.style("fill-opacity",function(edge){
										if( edge.source === d || edge.target === d ){
											return 0.0;
										}
									});
								})
								.call(force.drag);
			
			var text_dx = -20;
			var text_dy = 20;
			
			var nodes_text = svg.selectAll(".nodetext")
								.data(root.nodes)
								.enter()
								.append("text")
								.attr("class","nodetext")
								.attr("dx",text_dx)
								.attr("dy",text_dy)
								.text(function(d){
									return d.name;
								});
			
								
			force.on("tick", function(){
				
				//限制结点的边界
				root.nodes.forEach(function(d,i){
					d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
					d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
					d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
					d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
				});
			
				//更新连接线的位置
				 edges_line.attr("x1",function(d){ return d.source.x; });
				 edges_line.attr("y1",function(d){ return d.source.y; });
				 edges_line.attr("x2",function(d){ return d.target.x; });
				 edges_line.attr("y2",function(d){ return d.target.y; });
				 
				 //更新连接线上文字的位置
				 edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
				 edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
				 
				 
				 //更新结点图片和文字
				 nodes_img.attr("x",function(d){ return d.x - img_w/2; });
				 nodes_img.attr("y",function(d){ return d.y - img_h/2; });
				 
				 nodes_text.attr("x",function(d){ return d.x });
				 nodes_text.attr("y",function(d){ return d.y + img_w/2; });
			});
	}




	$.fasthink = $.fasthink || {};
	$.fasthink.common = function(option,params){
		if (typeof option != "string") {
			option = option || {};
			$.extend($.fasthink.common.variables,option);
			$.fasthink.common.InitSelfGlobal.state = true;
			$.fasthink.common.InitSelfGlobal.init();
		}else if(params && typeof params == "string" && params == "FAST.G"){
			var variable = $.fasthink.common.variables[option];
			if(variable)
				return variable;
		}else{
			var method = $.fasthink.common.method[option];
			if(method)
				return method(params);
		}
	};
	$.fasthink.common.method = {
		drawD3ReationGraph:function(graphParams){
				return drawD3ReationGraph(graphParams);
		}
	}
	$.fasthink.common.variables = {
		appUrl:"/"
	}
	$.fasthink.common.InitSelfGlobal = (function(){
		function setGlobal(){
			//set global varibles
		}
		function init(){
			if(!this.state){
				setGlobal();
				this.state = false;
			}
		}
		return {init:init,state:true};
	})();
})(jQuery,undefined);