var margin = {top: 0, right: 20, bottom: 0, left: 10},
	widtha = parseInt(d3.select('#vizmap').style('width'), 10);

var width = (widtha * 1) - margin.left - margin.right;
var height = (width * 0.72) - margin.top - margin.bottom;

var projection = d3.geo.mercator()
		.center([-102,23.7])
		.scale(width * 1.7)
		//.translate([0, 0]);
		.translate([width / 2, height / 2]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("#vizmap").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("id","mapa")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cs = d3.scale.linear()
		.range([0.1,1]);

 d3.json("mexpolem.json",function(error,datas){

	estados = topojson.feature(datas, datas.objects.estados);

	municipios = topojson.feature(datas, datas.objects.muns);

	 d3.json("data.json",function(error,datos){

	 	datm = datos;

		d3.json("cultivos.json",function(error,cults){

		 	cultivos = cults;

		 	cult = 1;

		 	var munar = datm.map(function(arr){return arr[cult]});

		 	cs.domain([0,d3.max(munar)]);
		

			mun = d3.select("#mapa")
					.append("g")
					.attr("class","polis")
					.selectAll(".muni")
					.data(municipios.features)
					.enter().append("path")
					.attr("class","muni")
					.attr("d", path)
					.style("opacity",function(d,i){if(munar[i] === 0) {return 0} else {return cs(munar[i])};})
					.style("fill","#922935");

			d3.select("#viz")
				.append("div")
				.attr("class","btn-group contro")
				.append("button")
				.attr("type","button")
				.attr("class","btn btn-default dropdown-toggle culti")
				.attr("data-toggle","dropdown")
				.text("Cultivos")
				.append("span")
				.attr("class","caret");

			d3.select(".btn-group")
				.append("ul")
				.attr("class","dropdown-menu")
				.attr("role","menu")
				.selectAll(".opc")
				.data(cultivos).enter()
				.append("li")
				.append("a")
				.attr("href","#")
				.text(function(d){return d})
				.on("click",clk);

			//yrbt = d3.selectAll(".yrbt").on("click",btclkd);

		})

	})

})

function clk(p,j){

	munar = datm.map(function(arr){return arr[j + 1]});

	cs.domain([0,d3.max(munar)]);

	mun.transition().duration(750).style("opacity",function(d,i){if(munar[i] === 0) {return 0} else {return cs(munar[i])};})

}