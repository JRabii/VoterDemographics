// from data.js
var tableData = data;

var tbody = d3.select("tbody");

data.forEach((voterow) => {
    var row = tbody.append("tr");
    Object.entries(voterow).forEach(([key,value]) =>{
        var cell = row.append("td");
        cell.text(value);
    });
});

var button = d3.select("#filter-btn");

button.on("click", () => {
    var inputState = d3.select("#State").property("value");
    var inputEthnicity = d3.select("#Ethnicity").property("value");
    // var inputState = d3.select("#state").property("value");
    // var inputCountry = d3.select("#country").property("value");
    // var inputShape = d3.select("#shape").property("value");
    
    var dataFiltered = data

    if(inputState){
        dataFiltered = dataFiltered.
        filter(data => 
            data.State === inputState);
    }

    if(inputEthnicity){
        dataFiltered = dataFiltered.
        filter(data => 
            data.Ethnicity === inputEthnicity);
    }
    

    tbody.html("")


    dataFiltered.forEach((voterow) => {
        var row = tbody.append("tr");
        Object.entries(voterow).forEach(([key, value]) => {
            var cell = row.append("td");
            cell.text(value);
        })
    })

});
