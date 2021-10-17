// Initialize the page with a default plot.
function charts(CurrentSubject) {
  d3.json("samples.json").then((data) => {
    var SubjectPool = data.samples;
    var individual = SubjectPool.filter(
      (sampleobject) => sampleobject.id == CurrentSubject
    )[0];

  // create variables for pulled otu data  
    console.log(individual);
    var cases = individual.otu_ids;
    var microbes = individual.otu_labels;
    var values = individual.sample_values;

      // Bubble Chart
      var trace2 = {
        x: cases,
        y: values,
        text: microbes,
        mode: "markers",
        marker: {
          color: cases,
          size: values,
          colorscale: "dense",
        },
      };
  
      var data = [trace2];
  
      var layout = {
        margin: { t: 0 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        width: 1200,
      };
  
      Plotly.newPlot("bubble", data, layout);
   
    // Horizontal Bar Char
    var trace1 = {
      x: values.slice(0, 10).reverse(),
      y: cases
        .slice(0, 10)
        .map((otuID) => `OTU ${otuID}`)
        .reverse(),
      text: microbes.slice(0, 10).reverse(),
      orientation: "h",
      type: "bar",
    };

    var data2 = [trace1];

    var layout = {
      title: "Test Subject's Top 10",
      xaxis: { autorange: true },
      yaxis: { autorange: true },
      width: 600,
      height: 800,
    };

    Plotly.newPlot("bar", data2, layout);
  });
}

// Demographic Info
function demo(CurrentSubject) {
  d3.json("samples.json").then((data2) => {
    var MetaData = data2.metadata;
    var individual = MetaData.filter(
      (sampleobject) => sampleobject.id == CurrentSubject
    )[0];
    var demographicInfoBox = d3.select("#sample-metadata");
    demographicInfoBox.html("");
    Object.entries(individual).forEach(([key, value]) => {
      demographicInfoBox.append("h5").text(`${key}: ${value}`);
    });

    

// Gauge - inside the Demographic function because it utilizes the metadata.)
// part of data to input
    var traceGauge = {
      type: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      values: [ 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
      text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['#F8F3EC','#F4F1E5','#E9E6CA','#E2E4B1','#D5E49D','#B7CC92','#8CBF88','#8ABB8F','#85B48A','white'],
        
        hovermode: !1,
      }
    }
    // needle dot
    var dot = {
      type: 'scatter',
      showlegend:false,
      textinfo: 'none',
      x: [0],
      y: [0],
      marker: {
        size: 14,
        color:'#850000'
        
      }}

    // needle
    // add weights to the degrees to correct needle
    var weight = 0;
    if (individual.wfreq == 2 || individual.wfreq == 3){
      weight = -3;
    } else if (individual.wfreq == 4){
      weight = 1;
    } else if (individual.wfreq == 5){
      weight = -.5;
    } else if (individual.wfreq == 6){
      weight = -2;
    } else if (individual.wfreq == 7){
      weight = -3;
    }

    var degrees = 180-(20 * individual.wfreq + weight); // 20 degrees for each of the 9 gauge sections
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var aX = 0.025 * Math.cos((radians) * Math.PI / 180);
    var aY = 0.025 * Math.sin((radians) * Math.PI / 180);
    var bX = -0.025 * Math.cos((radians) * Math.PI / 180);
    var bY = -0.025 * Math.sin((radians) * Math.PI / 180);
    var cX = radius * Math.cos(radians);
    var cY = radius * Math.sin(radians);

    // draw the triangle (or gauge needle)
    var path = 'M ' + aX + ' ' + aY +
    ' L ' + bX + ' ' + bY +
    ' L ' + cX + ' ' + cY +
    ' Z';

    // Set layout for gauge plot
    var gaugeLayout = {
      title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      width: 600,
      height: 600,
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '#850000',
          line: {
            color: '#850000'
          }
        }],
      xaxis: {zeroline:false, 
              showticklabels:false,
              showgrid: false, 
              range: [-1, 1],
              fixedrange: true
            },
      yaxis: {zeroline:false, 
              showticklabels:false,
              showgrid: false, 
              range: [-1, 1],
              fixedrange: true
            }
    };
    
    Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
  }
  );
}


// Call the data into the inspector console. 
function init() {
  d3.json("samples.json").then(function (data) {
    console.log("samples.json:", data);
    // Set up the DropDown:
    let DropDown = d3.select(`#selDataset`);

    data.names.forEach((name) => {
      DropDown.append(`option`).text(name).property(`value`, name);
    });
    // Reset demographic info and visuals to first subject when page is refreshed.
    const firstSample = data.names[0];
    charts(firstSample);
    demo(firstSample);
  });
}
// Pull data for new subject into demo and visuals. 
function optionChanged(newSample) {
  charts(newSample);
  demo(newSample);
}

init();