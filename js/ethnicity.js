// Set up our chart
var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = 600;
var margin = { top: 30, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the data and convert all numeric values to integers
d3.csv("data/ethnicityData.csv")
  .then(function(ethnicityData) {
    ethnicityData.forEach(function(data) {
      data.totalPopulation = +data.totalPopulation;
      data.totalCitPop = +data.totalCitPop;
      data.regCount = +data.regCount;
      data.voteCount = +data.voteCount;
    });

// Start creating the graph: 1) Default Axes, Chart Itself, toolTip, Chart Update Rules
// =======================

// (1) Default Axes
// xScale and yScale need to be their own vars so they can be recalculated when the graph's axes are changed
var xScale = d3.scaleLinear().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);

// Axis functions to call xScale and yScale
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// Create variable Min and Max functions for recalcs
var xMin;
var xMax;
var yMin;
var yMax;

// Create function to find Min and Max values in ethnicityData
  
function minimaxX(ethnicityDataX) {
    xMin = d3.min(ethnicityData, function (d) { return d[ethnicityDataX] });
    xMax = d3.max(ethnicityData, function (d) { return d[ethnicityDataX] });
};

function minimaxY(ethnicityDataY) {
    yMin = d3.min(ethnicityData, function (d) { return d[ethnicityDataY] });
    yMax = d3.max(ethnicityData, function (d) { return d[ethnicityDataY] });
};

// Default x-axis
var defaultX = "totalPopulation";

// Default y-axis
var defaultY = "regCount";

// Initial default values
minimaxX(defaultX);
minimaxY(defaultY);

// Initial domains
xScale.domain([xMin, xMax]);
yScale.domain([yMin, yMax]);

// (2) Chart 
chartGroup.selectAll("circle")
.data(ethnicityData)
.enter()
.append("circle")
.attr("cx", function (d) {
    return xScale(d[defaultX]);
})
.attr("cy", function (d) {
    return yScale(d[defaultY]);
})
.attr("r", 25)
.attr("fill", "red")
.attr("opacity", 0.9)

    // Add abbr's to bubbles
    chartGroup.selectAll("text")
    .data(ethnicityData)
    .enter()
    .append("text")
    .text(function (d) {
        return d.ethnicity;
    })
    .attr("x", function (d) {
        return xScale(d[defaultX]);
    })
    .attr("y", function (d) {
        return yScale(d[defaultY]);
    })
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("class","stateText");

    // (3) Initialize tooltip
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .attr("fill", "white")
    .style("opacity", 80)
    .style("background-color", "yellow")
    .html(function (d) {  
    return (`<strong>Ethnicity:</strong> ${d.ethnicity}
    <br><strong>Total Population:</strong> ${d.totalPopulation}
    <br><strong>Total Eligible to Vote:</strong> ${d.totalCitPop}
    <br><strong>Percent Registered:</strong> ${d.pReg}%
    <br><strong>Percent Voted:</strong> ${d.pVoted}%`);
    });

    // Create tooltip
    chartGroup.call(toolTip);

    // Set mouseover and mouseout controls
    chartGroup.selectAll("circle")
    .on("mouseover", function (d) {
        return toolTip.show(d, this);
    })

    .on("mouseout", function (d, i) {
        return toolTip.hide(d);
    });



// (4) Chart Update Rules
// Create Axes
chartGroup.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

chartGroup.append("g")
    .attr("class", "y-axis")
    .call(yAxis)

  // Set Alternative X-Axis Titles
    povertyLabel=chartGroup.append("text")
        .attr("transform", `translate(${width / 2},${height + 60})`)
        .attr("class", "text-x active")
        .attr("data-axis-name", "totalPopulation")
        .text("Total Population in America");

    agelabel=chartGroup.append("text")
        .attr("transform", `translate(${width / 2},${height + 80})`)
        .attr("class", "text-x inactive")
        .attr("data-axis-name", "totalCitPop")
        .text("Total Citizen Count in America");

    // incomeLabel=chartGroup.append("text")
    //     .attr("transform", `translate(${width / 2},${height + 50})`)
    //     .attr("class", "text-x inactive")
    //     .attr("data-axis-name", "income")
    //     .text("Household Income (Median)");

  // Set Alternative X-Axis Titles
    chartGroup.append("text")
        .attr("transform", `translate(-60,${height / 2})rotate(270)`)
        .attr("class", "text-y active")
        .attr("data-axis-name", "regCount")
        .text("Total Registered to Vote in 2018");

    chartGroup.append("text")
        .attr("transform", `translate(-80,${height / 2})rotate(270)`)
        .attr("class", "text-y inactive")
        .attr("data-axis-name", "voteCount")
        .text("Total Voted in 2018");

    // chartGroup.append("text")
    //     .attr("transform", `translate(-70,${height / 2})rotate(270)`)
    //     .attr("class", "text-y active")
    //     .attr("data-axis-name", "healthcare")
    //     .text("Lacks Healthcare (%)");

    // Set Active/Inactive Rules
    function labelChangeX(clickedAxis) {
        d3.selectAll(".text-x")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
        clickedAxis.classed("inactive", false).classed("active", true);
    }

    function labelChangeY(clickedSelection) {
        d3.selectAll(".text-y")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
        clickedSelection.classed("inactive", false).classed("active", true);
    }

    d3.selectAll(".text-x").on("click", function () {

        var clickedSelection = d3.select(this);
        var isInactive = clickedSelection.classed("inactive");
        var clickedAxis = clickedSelection.attr("data-axis-name");

        if (isInactive) {
            newAxisX = clickedAxis;
            minimaxX(newAxisX);
            xScale.domain([xMin, xMax]);

            // Change the X-Axis
            svg.select(".x-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(xAxis);

            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.90)
                        .attr("r", 25)

                })
                .attr("cx", function (d) {
                    return xScale(d[newAxisX]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(1000)
                        .attr("r", 25)
                        .attr("fill", "red")
                        .attr("opacity", 0.90);
                })

            d3.selectAll(".stateText")
                    .transition()
                    .duration(1000)
                    .ease(d3.easeLinear)
                    .attr("x", function (d) {
                        return xScale(d[newAxisX]);
                    })            

            labelChangeX(clickedSelection);
        }
    });

    d3.selectAll(".text-y").on("click", function () {

        var clickedSelection= d3.select(this);
        var isInactive = clickedSelection.classed("inactive");
        var clickedAxis = clickedSelection.attr("data-axis-name");
        console.log("current axis: ", clickedAxis);

        if (isInactive) {
            newAxisY = clickedAxis;

            minimaxY(newAxisY);

            yScale.domain([yMin, yMax]);

            // New Y-Axis
            svg.select(".y-axis")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .call(yAxis);

            d3.selectAll("circle")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on("start", function () {
                    d3.select(this)
                        .attr("opacity", 0.90)
                        .attr("r", 25)

                })
                .attr("cy", function (data) {
                    return yScale(data[newAxisY]);
                })
                .on("end", function () {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr("r", 25)
                        .attr("fill", "blue")
                        .attr("opacity", 0.90);
                })

            d3.selectAll(".stateText")
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("y", function (d) {
                    return yScale(d[newAxisY]);
                })

            labelChangeY(clickedSelection);
        }
    });
  });