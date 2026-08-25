// Load the Google Charts library

google.charts.load("current", { packages: ["corechart"] });

google.charts.load("current", { packages: ["corechart"] });

google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "x");
  data.addColumn("number", "values");
  data.addColumn({ id: "i0", type: "number", role: "interval" });
  data.addColumn({ id: "i1", type: "number", role: "interval" });
  data.addColumn({ id: "i3", type: "number", role: "interval" });
  data.addColumn({ id: "i4", type: "number", role: "interval" });
  data.addColumn({ id: "i5", type: "number", role: "interval" });
  data.addColumn({ id: "i6", type: "number", role: "interval" });

  data.addRows([
    [1, 100, 90, 110, 85, 96, 104, 120],
    [2, 120, 95, 130, 90, 113, 124, 140],
    [3, 130, 105, 140, 100, 117, 133, 139],
    [4, 90, 85, 95, 85, 88, 92, 95],
    [5, 70, 74, 63, 67, 69, 70, 72],
    [6, 30, 39, 22, 21, 28, 34, 40],
    [7, 80, 77, 83, 70, 77, 85, 90],
    [8, 100, 90, 110, 85, 95, 102, 110],
  ]);

  var options_lines = {
    title: "Line intervals, default",
    curveType: "function",
    lineWidth: 4,
    intervals: { style: "line" },
    legend: "none",
  };

  var chart_lines = new google.visualization.LineChart(
    document.getElementById("chart_lines")
  );
  chart_lines.draw(data, options_lines);
}

// Set a callback function to draw the chart
google.charts.setOnLoadCallback(drawVisualization);

function drawVisualization() {
  // Some raw data (not necessarily accurate)
  var data = google.visualization.arrayToDataTable([
    [
      "Month",
      "Paracetamol",
      "Ibuprofen",
      "Amoxicillin",
      "Metformin",
      "Aspirin",
      "Average",
    ],
    ["2024/01", 150, 920, 510, 980, 430, 598],
    ["2024/02", 130, 1080, 590, 1240, 300, 668],
    ["2024/03", 145, 1150, 570, 790, 380, 607],
    ["2024/04", 135, 1090, 600, 950, 210, 597],
    ["2024/05", 140, 700, 620, 1000, 350, 562],
  ]);

  // Define chart options
  var options = {
    title: "Monthly Medication Sales",
    vAxis: { title: "Units Sold" },
    seriesType: "bars",
    series: { 5: { type: "line" } },
  };

  // Create and draw the chart in the specified div
  var chart = new google.visualization.ComboChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);
}
