var svg = d3.select("#piechart"),
    pieWidth = +svg.attr("width"),
    pieHeight = +svg.attr("height"),
    radius = Math.min(pieWidth, pieHeight) / 2,
    pieG = svg.append("g").attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

var pie = d3.pie()
    .sort(function(a,b) { return a.index - b.index; })
    .value(function(d) { return d.entrances; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

function visUpdated(groupsData) {
    var arc = pieG.selectAll(".arc")
        .data(pie(groupsData), function (d) {
            return d.data.id;
        });

    var arcEnterG = arc.enter().append("g");

    arcEnterG
        .attr("class", "arc")
        .append("path")
        .attr("d", path)
        .attr("fill", function (d) {
            return '#' + d.data.color;
        });

    arcEnterG.append("title")
        .text(function (d) {
            return d.data.name;
        });

    arc.select("path")
        .attr("d", path);

    arc.exit().remove();
}


d3.json("stations.json", function(error, stations)
{
    var data = {};
    data.nodes = stations.nodes;
    data.links = stations.links;

    for(var i = 0; i < data.nodes.length; i++)
    {
        var links = stations.links.filter(function(link)
        {
            return link.source === i || link.target === i;
        });

        var linksColors = links.map(function(link) { return link.color; });
        var allEqual = linksColors.filter(function(color) { return color !== linksColors[0]; }).length === 0;

        data.nodes[i].color = allEqual ? linksColors[0] : '000';
    }

    if (error) throw error;
    else
    {
        d3.json("turnstile-gtfs-mapping.json", function(error, mapping)
        {
            if (error) throw error;
            else
            {
                d3.json("turnstile-heatmap.json", function(error, entrances)
                {
                    if (error) throw error;
                    else
                    {
                        entrances.stops.forEach(function(stop)
                        {
                            var stationId = mapping[stop.name];

                            data.nodes.filter(function(station)
                            {
                                return station.id === stationId;
                            })[0]['entrances'] = stop.entrancesByType.all;
                        });

                        visUpdated(data.nodes);
                    }
                });
            }
        });
    }
});

