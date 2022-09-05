console.log("charts.js")
x = {}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");


  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log("data")
    console.log(data)
    x = data
    var sampleNames = data.names;

    // Commnet 
    // for (var i=0; i < sampleNames.length; i++){
    //         selector
    //         .append("option")
    //         .text(sampleNames[i])
    //         .property("value", sampleNames[i]);
    // };
    //
    sampleNames.forEach((sample) => {
      console.log("sample")
      console.log(sample)

      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log("resultArray")
    console.log(resultArray)

    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var washFrequency = metadataArray.wfreq

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var xticks_text = otu_labels.slice(0, 10)
    var xtext = xticks_text.reverse()

    var xticks_slice = sample_values.slice(0, 10)
    var xticks = xticks_slice.reverse()

    var yticks_slice = otu_ids.slice(0, 10)
    var yticks_map = yticks_slice.map(otu_id => `OTU ${otu_id}`)
    var yticks = yticks_map.reverse()

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: xticks,
      y: yticks,
      text: xtext,
      type: "bar",
      orientation: 'h'
    };
    var barData = [trace];
    var layout = {
      title: "'Top 10 Bacteria Cultures Found",
      xaxis: { title: "" },
      yaxis: { title: "" }
    };
    console.log("barData")
    console.log(barData)
    Plotly.newPlot("bar", barData, layout);

    // Create bubble chart 
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      }
    }];


    // Define plot layout
    var layout = {
      title: "Bacteria Cultures Per Samples",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "" }
    };

    // Display plot
    Plotly.newPlot('bubble', bubbleData, layout)

    // Gauge Chart

    // Create the trace
    var title = "Belly Button Washing Frequencies Scrubs per Week"
    var gauge_data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: { text: title },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          bar: { color: 'black' },
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: 'red' },
            { range: [2, 4], color: 'orange' },
            { range: [4, 6], color: 'yellow' },
            { range: [6, 8], color: 'green' },
            { range: [8, 10], color: 'blue' }
          ]
        }
      }
    ];

    // Define Plot layout
    //var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };
    var gauge_layout = { width: 600, height: 600 };
    console.log("washFrequency")
    console.log(metadataArray)
    // Display plot
    Plotly.newPlot('gauge', gauge_data, gauge_layout);
  });
}
