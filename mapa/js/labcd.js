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

 d3.json("./datos/mexpolem.json",function(error,datas){

	estados = topojson.feature(datas, datas.objects.estados);

	municipios = topojson.feature(datas, datas.objects.muns);

	 d3.json("./datos/data.json",function(error,datos){

	 	datm = datos;

		d3.json("./datos/cultivos.json",function(error,cults){

			cultivos = cults;

			d3.json("./datos/pobreza.json",function(error,pobr){

			pobres = pobr.map(function(arr){return arr[1]});

			ricos = pobr.map(function(arr){return arr[2]});

			d3.json("./datos/nomun.json",function(error,noms){

			munom = noms;

		 	cult = 1;

		 	munar = datm.map(function(arr){return arr[cult]});

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

			mun2 = d3.select("#mapa")
					.append("g")
					.attr("class","polis2")
					.selectAll(".muni")
					.data(municipios.features)
					.enter().append("path")
					.attr("class","muni2")
					.attr("d", path);

			mun3 = d3.select("#mapa")
					.append("g")
					.attr("class","polis3")
					.selectAll(".muni")
					.data(municipios.features)
					.enter().append("path")
					.attr("class","muni3")
					.attr("d", path);

			mun3.on("mouseover",overed)
			mun3.on("mouseout",outed);

			console.log(pobres[4][1]);

			mun2.classed("pobre",function(p,j){return pobres[j] > 50 });
			mun2.classed("rico",function(p,j){return pobres[j] < 3 });

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

	})

})

function clk(p,j){

	d3.select("g.mlabel").remove();

	munar = datm.map(function(arr){return arr[j + 1]});

	var k = j;

	cs.domain([0,d3.max(munar)]);

	mun.transition().duration(750).style("opacity",function(d,i){if(munar[i] === 0) {return 0} else {return cs(munar[i])};})

	mlabel = d3.select("#mapa")
			.append("g")
			.attr("class","mlabel")
			.append("text")
			.attr("class","textmlab")
			.attr("x",width / 2)
			.attr("y",50)
			.text(function(d,i){
				return cultivos[k]})
			.style("font-size",width/55 + "px")
			.style("text-anchor","middle");

}

function overed(d,i){

	var format = d3.format(",.0f")

	var k = i;

	label = d3.select("#mapa")
			.append("g")
			.attr("class","label")
			.append("text")
			.attr("class","textlab")
			.attr("x",50)
			.attr("y",height - 100)
			.text(function(d,i){
				return munom[k] + " recibío " +  format(munar[k]) + " pesos"})
			.style("font-size",width/55 + "px");
}

function outed(d,i){
	d3.select("g.label").remove();
}