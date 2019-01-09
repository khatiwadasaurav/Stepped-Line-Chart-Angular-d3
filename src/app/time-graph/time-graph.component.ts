import { Component, OnInit } from "@angular/core";
import * as d3 from "d3";
declare var $: any;

@Component({
  selector: "app-time-graph",
  templateUrl: "./time-graph.component.html",
  styleUrls: ["./time-graph.component.css"]
})
export class TimeGraphComponent implements OnInit {
  title = "app";

  helpers = {
    getDimensions: function(id) {
      var el: any = document.getElementById(id);
      var w = 1,
        h = 1;
      if (el) {
        var dimensions = el.getBBox();
        w = dimensions.width;
        h = dimensions.height;
      } else {
        console.log("error: getDimensions() " + id + " not found.");
      }
      return {
        w: w,
        h: h
      };
    }
  };

  constructor() {}

  ngOnInit() {

  }

  ngAfterContentInit() {
    let data = [
      {
        start_date: "2017-09-04 07:00:00",
        end_date: "2017-09-08 5:00:00",
        stopType: "OFF",
        duration: "01: 00: 00"
      },
      {
        start_date: "2017-09-08 5:00:00",
        end_date: "2017-09-15 6:00:00",
        stopType: "Driving",
        duration: "05: 00: 00"
      },
      {
        start_date: "2017-09-15 6:00:00",
        end_date: "2017-09-20 7:00:00",
        stopType: "Resting",
        duration: "02: 00: 00"
      },
      {
        start_date: "2017-09-20 7:00:00",
        end_date: "2017-09-24 8:00:00",
        stopType: "Break",
        duration: "01: 00: 00"
      },
      {
        start_date: "2017-09-24 8:00:00",
        end_date: "2017-09-28 9:00:00",
        stopType: "OFF",
        duration: "00: 30: 00"
      },
      {
        start_date: "2017-09-28 9:00:00",
        end_date: "2017-10-07 10:00:00",
        stopType: "Driving",
        duration: "06: 00: 00"
      },
      {
        start_date: "2017-10-07 10:00:00",
        end_date: "2017-10-12 11:00:00",
        stopType: "Resting",
        duration: "00: 45: 00"
      }
    ];

    $("#chart").empty();
    var chartConfig = {
      mainDiv: "#chart",
      data: data,
      lineColor: " #3880aa",
      upLineValue: ["Driving"],
      typeFields: "stopType",
      minValueField: "start_date",
      maxValueField: "end_date",
      duration: "duration"
    };
    var lineStepCharts = this.lineStepChart(chartConfig);
  }

  lineStepChart(config) {
    function setReSizeEvent(data) {
      var resizeTimer;
      var interval = 500;
      window.removeEventListener("resize", function() {});
    }

    this.drawLineStepsChart(config);
    setReSizeEvent(config);
  }

  drawLineStepsChart(config) {
    var data = config.data;
    var lineColor = config.lineColor;
    var upLineValue = config.upLineValue;
    var typeFields = config.typeFields;
    var mainDiv = config.mainDiv;
    var minValueField = config.minValueField;
    var maxValueField = config.maxValueField;
    var duration = config.duration;
    var mainDivName = mainDiv.substr(1, mainDiv.length);
    var z = d3.scaleOrdinal();

    // var legendData = new Set(
    //   data.map(function(d) {
    //     return d[typeFields];
    //   })
    // );
    // this.createLineStepChartLegend(mainDiv, legendData);
    var mainDivWidth = $(mainDiv).width();
    var mainDivHeight = $(mainDiv).height();
    d3.select(mainDiv)
      .append("svg")
      .attr("width", mainDivWidth)
      .attr("height", mainDivHeight+50)
      .append("defs")
      .append("pattern")
      .attr("id", "smallGrid")
      .attr("width", "10")
      .attr("height", "19")
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 10 0 L 0 0 0 10")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5");

    d3.select("defs")
      .append("pattern")
      .attr("id", "grid")
      .attr("width", "80")
      .attr("height", "1000")
      .attr("patternUnits", "userSpaceOnUse")
      .append("rect")
      .attr("width", "80")
      .attr("height", "1000")
      .attr("fill", "url(#smallGrid")
      .append("path")
      .attr("d", "M 10 0 L 0 0 0 10")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", "1");

    d3.select("svg")
      .append("rect")
      .attr("x","40")
      .attr("y","10")
      .attr("width", "1080")
      .attr("height", "230")
      .attr("fill", "url(#grid)");


    var svg = d3.select(mainDiv + " svg"),
      margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 20
      },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;


    var minDateLabelg = svg
      .append("g")
      .attr("transform", "translate(" + 40 + "," + 19 + ")");
    var maxDateLabelg = svg
      .append("g")
      .attr("transform", "translate(" + -20 + "," + 19 + ")");

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.map(function(d) {
      d[minValueField] = new Date(d[minValueField]);
      d[maxValueField] = new Date(d[maxValueField]);
    });
    var minValueDate = d3.min(data, function(d) {
      //here we get the start_date
      return d[minValueField];
    });

    var maxValueDate = d3.max(data, function(d) {
      //here we get the end_date
      return d[maxValueField];
    });

    var minValue = new Date(minValueDate).getTime() / (1000 * 60);
    var maxValue = new Date(maxValueDate).getTime() / (1000 * 60);
    var diffInMinutes = maxValue - minValue;
    var x = d3.scaleLinear().range([0, width]);
    x.domain([0, diffInMinutes]);

    var y = d3.scaleLinear().range([height, 0]);
    y.domain([0, height]);

    var xA = d3.scaleTime()
                .domain([minValueDate, maxValueDate])
                 .range([40, width+18]);

    const yA = d3.scaleOrdinal()
                  .domain(data.map(({stopType}) => stopType))
                  .range([0,height+58]);

    const xAxis = d3.axisBottom(xA);


    const yAxis = d3.axisLeft(yA);



    svg
      .append("g")
      .attr("class","x-axis")
      .attr("transform","translate(0,0)")
      .call(xAxis);


      //path d attributes changes on x axis
      svg
      .selectAll("g")
      .filter(".x-axis")
      .select("path")
      .filter(".domain")
      .attr("d","M 40.5 6 V 0.5 H 1118.5 V 1");

    var arrayData = [];
    var tickY = 48;

    svg
      .append("g")
      .attr("class","y-axis")
      .attr("transform","translate(40,0)")
      .call(yAxis)
      .selectAll(".tick")
      .each(function(data){
          var i = 0;
          arrayData.push(data);
          var tick = d3.select(this);
          for (i;i<arrayData.length;i++){
          if(data === "OFF"){
            tick.attr("transform","translate(" + 0 + "," + tickY + ")");
          }else if (data === "Driving"){
            tickY = 21 + tickY;
            tick.attr("transform","translate(" + 5 + "," + tickY + ")");
          }else if (data === "Resting"){
            tickY = 20 + tickY;
            tick.attr("transform","translate(" + 5 + "," + tickY + ")");
          }else {
            tickY = 11 + tickY;
            tick.attr("transform","translate(" + 5 + "," + tickY + ")");
          }
        }
      });
      //path d attributes changes on y axis
      svg
      .selectAll("g")
      .filter(".y-axis")
      .select("path")
      .filter(".domain")
      .attr("d","M 1 0.5 H 0.5 V 235.5 H 1");

    minDateLabelg
      .append("text")
      .attr("id", "textMinDateLabelg")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("font-size", "8px")
      .append("tspan")
      .attr("x", 0)
      .attr("y", height + margin.bottom)
      .text(d3.timeFormat("%Y-%m-%d %H:%M:%S")(minValueDate));
    $("#textMinDateLabelg").css({ "z-index": -1 });

    maxDateLabelg
      .append("text")
      .attr("id", "textmaxDateLabelg")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("font-size", "8px")
      .append("tspan")
      .attr("x", $(mainDiv).width())
      .attr("y", height + margin.bottom)
      .text(d3.timeFormat("%Y-%m-%d %H:%M:%S")(maxValueDate));

    var dims = this.helpers.getDimensions("textmaxDateLabelg");
    d3.selectAll("#textmaxDateLabelg tspan").attr(
      "x",
      $(mainDiv).width() - dims.w
    );

    var prevX = 0;
    var prevY = 0;
    var yPos = 1;
    var pathg: any;
    var rectg: any;

    data.map(function(d, i) {
      /*
      d contains
      start_date: "2017-10-12 11:00:00",
      end_date: "2017-10-15 12:00:00",
      stopType: "OFF",
      duration: "00: 00: 00"
      */
      if (upLineValue.indexOf(d[typeFields]) != -1) {
        //only typefields of driving have index value of not equal to -1
        yPos = height / 2;
      } else {
        yPos = height;
        // here the value of ypos is 140
      }

        if (d.stopType == "OFF") {
          var startDateValue =
            d[minValueField].getTime() / (1000 * 60) - minValue;
          var endDateValue =
            d[maxValueField].getTime() / (1000 * 60) - minValue;
          pathg = g
            .append("path")
            .attr("class", "line")
            .attr("stroke", "#788c99")
            .attr("stroke-width", "8px")
            .attr(
              "d",
              "M " +
                x(startDateValue) + 20 +
                " " +
                (yPos - 162) +
                " L " +
                x(endDateValue) +
                " " +
                (yPos - 162)
            );
          var width = x(endDateValue) - x(startDateValue);
          prevX = x(endDateValue);
          prevY = yPos;
          //yPos value is 140
        }


        var startDateValue =
        d[minValueField].getTime() / (1000 * 60) - minValue;
        var endDateValue = d[maxValueField].getTime() / (1000 * 60) - minValue;

        //here only driving and resting match the (prevY != ypos ) conditon so only they enter the if block below
        if (prevY != yPos) {
          if (d.stopType == "Driving") {

            pathg = g
              .append("path")
              .attr("class", "line")
              .attr("stroke", "#788c99")
              .attr("stroke-width", "8px")
              .attr(
                "d",
                "M " +
                  x(startDateValue + 40) +
                  " " +
                  (yPos-23) +
                  " L " +
                  x(endDateValue - 20) +
                  " " +
                  (yPos-23)
              );
          } else if ((d.stopType = "Resting")) {
            pathg = g
              .append("path")
              .attr("class", "line")
              .attr("stroke", "#788c99")
              .attr("stroke-width", "8px")
              .attr(
                "d",
                "M " +
                  x(startDateValue + 50) +
                  " " +
                  (yPos - 60) +
                  " L " +
                  x(endDateValue - 50) +
                  " " +
                  (yPos - 60)
              );
          }
        } else if (d.stopType == "Break") {
          pathg = g
            .append("path")
            .attr("class", "line")
            .attr("stroke", "#788c99")
            .attr("stroke-width", "8px")
            .attr(
              "d",
              "M " +
                x(startDateValue) +
                " " +
                (yPos - 15) +
                " L " +
                x(endDateValue) +
                " " +
                (yPos - 15)
            );
        }

        var rect2width = x(endDateValue) - x(startDateValue);
        rectg = g
          .append("rect")
          .attr("class", "rectBackground")
          .attr("x", x(startDateValue))
          .attr("y", "-20")
          .attr("width", rect2width)
          .attr("height", "235")
          .style("fill", "white")
          .style("opacity", "0.3");

        prevY = yPos;

      rectg
        .on("mouseover", () => {
          d3.select("#tooltipDiv").style("top", "20");
          d3.select("#tooltipDiv").style("display", null);
          d3.select("#tooltipDiv").style("left");
        })
        .on("mouseout", () => d3.select("#tooltipDiv").style("display", "none"))
        .on("mousemove", () => mousemove(this, d));
    });

    function mousemove(e, data) {
      if (d3.event) {
        $("#tooltipDiv").css({
          left: d3.event.pageX - 10,
          top: d3.event.pageY + 15
        });
        d3.select("#startDate").html(
          "Start Date:" +
            d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[minValueField])
        );
        d3.select("#endDate").html(
          "End Date:" + d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[maxValueField])
        );
        d3.select("#processType").html("Process Type:" + data[typeFields]);
        // d3.select("#duration").html("duration:" + data[duration]);
      }
    }
  }

  // createLineStepChartLegend(mainDiv, data) {
  //   var z = d3
  //     .scaleOrdinal()
  //     .domain(["OFF", "Driving", "Resting", "Break"])
  //     .range(["#3880aa", "#00e640", "#9933ff", "#ff0000"]);
  //   var mainDivName = mainDiv.substr(1, mainDiv.length);
  //   $(mainDiv).before(
  //     "<div id='Legend_" +
  //       mainDivName +
  //       "' class='pmd-card-body' style='margin-left:20px; margin-top:0; margin-bottom:0;'></div>"
  //   );
  //   data.forEach(function(d) {
  //     var cloloCode = z(d);
  //     $("#Legend_" + mainDivName).append(
  //       "<span class='team-graph team1' style='display: inline-block; margin-right:10px;'>\
  //                       <span style='background:" +
  //         cloloCode +
  //         ";width: 10px;height: 10px;display: inline-block;vertical-align: middle;opacity:1 '>&nbsp;</span>\
  //                       <span style='padding-top: 0;font-family:Source Sans Pro, sans-serif;font-size: 13px;display: inline;'>" +
  //         d +
  //         " </span>\
  //                       </span>"
  //     );
  //   });
  // }
}
