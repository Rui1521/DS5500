
// Show Dropdown
function Display() {
    document.getElementById("myDropdown").classList.toggle("show");
}

var choice = "processing=none&"
//Functions for Scaler Button
function Normalization(){
	choice = "processing=normalization&"
}
function Standardization(){
	choice = "processing=standardization&"
}

// Visualization
// Line Chart
var margin = {top: 100, right: 100, bottom: 100, left: 100};
var width = 600 - margin.right - margin.left;
var height = 600 - margin.top - margin.bottom;
// Y scale
var y = d3.scaleLinear()
    .range([height, 0]);

// X scale
var x = d3.scaleLinear()
    .range([0, width]);

// Values for line plot
var values = d3.svg.line() 
    .x(function(d) { return x(d.fpr); })
    .y(function(d) { return y(d.tpr); });

// Define body
var line = d3.select("body")
    .append("svg")
    .attr('width', 600)
    .attr('height', 600)
    .append("g")
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var xAxis = d3.axisBottom(x)
var yAxis = d3.axisLeft(y);

function vis(data){ 
    // Specific Domain
    x.domain(d3.extent(data, function (d) {return d.fpr;}));
    y.domain(d3.extent(data, function (d) {return d.tpr;}));  
    
    // x axis
    line.append("g") 
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y.range()[0] + ")")
        .call(xAxis)
        
    // y axis
    line.append("g") 
        .attr("class", "y axis")
        .call(yAxis);
        
    // line
    line.append("path") 
         .attr("class","line")
         .attr("d",values(data));

    // Y Label
    line.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -160)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("True Positive Rate");  

    // X label
    line.append("text")             
        .attr("y", 450)
        .attr("x", 200)
        .attr("dx", "1em")
        .style("text-anchor", "middle")
        .text("False Positive Rate"); 

}

// Fetch Data and Visualize
function Visualization() { 
	var url = "http://localhost:5000/roc_curve/"
    var x = document.getElementById("C").value;
    url = url.concat(choice).concat("c=").concat(x)
    d3.json(url, function (data) {
        console.log(data)
        vis(data)
    });
}
// Update Visualization
function update() {
    var url = "http://localhost:5000/roc_curve/"
    var x = document.getElementById("C").value;
    url = url.concat(choice).concat("c=").concat(x)
    d3.json(url, function (data) {
    	change(data)        
    });
}

function change(data){ 
    x.domain([0, d3.max(data, function(d) { return d.fpr; })]);
    y.domain([0, d3.max(data, function(d) { return d.tpr; })]);   

    var line = d3.select("body").transition();
        line.select(".line")   // change the line
            .duration(750)
            .attr("d", values(data));
        line.select(".x.axis") // change the x axis
            .duration(750)
            .call(xAxis);
        line.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
}

// dropdown show and remove show
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }