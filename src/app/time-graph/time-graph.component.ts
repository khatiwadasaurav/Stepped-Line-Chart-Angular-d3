import { Component, OnInit, Input } from "@angular/core";
import * as d3 from "d3";

declare var $: any;
@Component({
  selector: 'app-graph',
  templateUrl: "./time-graph.component.html",
  styles: []
})
export class TimeGraphComponent implements OnInit {

  data = [
    {
      "dimensionCheck": true,
      "endTime": "2019-08-29T22:16:03.000Z",
      "time": "2019-08-29T18:15:00.000Z",
      "stopstype": "resting",
      "duration": "04:01:03"
    },
    {
      "dimensionCheck": false,
      "endTime": "2019-08-30T02:47:58.978Z",
      "time": "2019-08-29T22:16:03.000Z",
      "stopstype": "working",
      "duration": "04:31:55"
    },
    {
      "dimensionCheck": false,
      "endTime": "2019-08-30T03:51:17.742Z",
      "time": "2019-08-30T02:47:58.978Z",
      "stopstype": "break",
      "duration": "01:03:18"
    },
    {
      "dimensionCheck": true,
      "endTime": "2019-08-30T08:23:56.000Z",
      "time": "2019-08-30T03:51:17.742Z",
      "stopstype": "working",
      "duration": "04:32:38"
    },
    {
      "dimensionCheck": false,
      "endTime": "2019-08-30T18:14:00.000Z",
      "time": "2019-08-30T08:23:56.000Z",
      "stopstype": "resting",
      "duration": "09:50:04"
    }
  ]
  id = 1
  stopsCount: number = 2;
  totalStopsData?: any;
  maxDateBoolean?: boolean = false;
  totalStopHours = [];
  stopTypes = ['WORKING', 'BREAK', 'RESTING'];
  totalTime;

  helpers = {

    getDimensions: function (id) {
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

  constructor() { }

  ngOnInit() {


    this.data = this.data.filter(
      v => {
        return (v.endTime);
      }
    )
    this.data.forEach(
      v => {
        v['stopType'] = v['stopstype'];
        v['start_date'] = new Date(v.time);
        v['end_date'] = new Date(v.endTime);
      }
    )
    this.totalStopsData = this.data[0];

    // if (this.totalStopsData) {
    //   Reflect.ownKeys(this.totalStopsData).forEach(key =>
    //     this.totalStopHours.push(this.totalStopsData[key])
    //   );
    // }

    // this.totalTime = this.addTimes(this.totalStopHours)
    // let datas1 = this.addTimes(this.data);
    // console.log(datas1);
  }

  ngAfterContentInit() {
    let data = this.data;
    setTimeout(value => {
      $('#chart' + this.id).empty();
      var chartConfig = {
        mainDiv: '#chart' + this.id,
        data: data,
        lineColor: " #3880aa",
        upLineValue: ["working"],
        typeFields: "stopType",
        minValueField: "start_date",
        maxValueField: "end_date",
        duration: "duration",
        dimensionCheck: "dimensionCheck"
      };
      var lineStepCharts = this.lineStepChart(chartConfig);

    }, 1000);

    // let totalStops;
    // let totalStopsCount;
    // totalStops = data.filter(v=>{
    //     return v.dimensionCheck == true
    // })
    // totalStopsCount = totalStops.length;
  }

  lineStepChart(config) {
    function setReSizeEvent(data) {
      var resizeTimer;
      var interval = 500;
      window.removeEventListener("resize", function () { });
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
    // var maxValueField = config.maxValueField;
    var duration = config.duration;
    var dimensionCheck = config.dimensionCheck;
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
    // let height1 = +svg.attr("height") - margin.top - margin.bottom;

    /* here i am zipping two arrays may need for future implementation
     let zipped = this.stopTypes.map((x, i) => [x, this.totalStopHours[i]]);
     console.log(zipped); */

    const yB = d3.scaleOrdinal()
      .domain(this.totalStopHours)
      .range([0, 133]);

    const yAxis1 = d3.axisRight(yB);



    d3.select(mainDiv)
      .append("svg")
      .attr("id", 'svg' + this.id)
      .attr("width", 800)
      .attr("height", 135)
      .style("margin-left", "22px")
      .attr("viewBox", "285 0 200 140")
      .append("defs")
      .append("pattern")
      .attr("id", "smallGrid")
      .attr("width", "20")
      .attr("height", "30")
      .attr("patternUnits", "userSpaceOnUse")
      .append("path")
      .attr("d", "M 50 0 L 0 0 0 50")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5");

    d3.select("defs")
      .append("pattern")
      .attr("id", "grid")
      .attr("width", "20")
      .attr("height", "30")
      .attr("patternUnits", "userSpaceOnUse")
      .append("rect")
      .attr("width", "50")
      .attr("height", "30")
      .attr("fill", "url(#smallGrid")
      .append("path")
      .attr("d", "M 50 0 L 0 0 0 50")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", "1");


    d3.select('#svg' + this.id)
      .append("rect")
      .attr("x", "60")
      .attr("y", "30")
      .attr("width", "750")
      .attr("height", "91")
      .attr("fill", "url(#smallGrid)");

    let border_size = "1px"
    if (this.totalStopsData) {
      d3.select(mainDiv)
        .append("svg")
        .attr("id", 'totalTime' + this.id)
        .attr("height", '135')
        .attr("width", '100')
        .style("display", "inline-block")
        .style("margin-left", "10px")
        // .style("border-top","1px solid #575962")
        // .style("border-bottom","1px solid #575962")
        // .style("border-right","1px solid #575962")
        .append("g")
        .attr("id", "g" + this.id)
        .append("rect")
        .style("fill", "white")
        .attr("height", '15')
        .attr("width", '100')
        .attr("x", "0")
        .attr("y", '1')


      // d3.select("#g" + this.id)
      //   .append("text")
      //   .attr("x", "10")
      //   .attr("y", '12')
      //   .style("font-family", "sans-serif")
      //   .style("font-weight", "bold")
      //   .style("font-size", "12px")
      //   .style("text-decoration", "underline")
      //   .text("TOTAL HOURS");

      d3.select("#totalTime" + this.id)

        .append("g")
        .attr("class", "y-axis1")
        .style("font-family", "sans-serif")
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .style("border", "1px solid black")
        .call(yAxis1)
        .selectAll(".tick")
        .each(function (data, index) {
          var tick = d3.select(this);
          if (index === 0) {
            var tickY = 42;
            tick.attr("transform", "translate(" + 0 + "," + tickY + ")");

          }
          if (index === 1) {
            var tickY = 70;
            tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
          }
          if (index === 2) {
            var tickY = 100;
            tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
          }
          // return data;
        });

      d3.select("#totalTime" + this.id)
        .selectAll("g")
        .filter(".y-axis1")
        .select("path")
        .filter(".domain")
        .attr("d", "M 1 0.5 H 0.5 V 135.5 H 1");
    }
    /*
    SVG CODE FOR TOTAL TIME IN CASE SOMEBODY ASKS YOU FOR SHOW ME THE TOTAL TIME,
    AS A DEVELOPER U MUST BE PREPARED YOU KNOW
    d3.select("#g"+this.id)
        .append("rect")
        .style("fill","white")
        .attr("height",'15')
        .attr("width",'80')
        .attr("x","0")
        .attr("y",'118');
    d3.select("#g"+this.id)
        .append("text")
        .attr("x","10")
        .attr("y",'128')
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("text-decoration", "overline")
        .text(this.totalTime);
    */

    var svg = d3.select(mainDiv + " svg"),
      margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 30
      },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    let uniqueStopType = [];
    var stopsUnique = data.forEach(datas => {
      if (uniqueStopType.includes(datas.stopType)) {
      } else {
        uniqueStopType.push(datas.stopType)
      }
    })

    var minDateLabelg = svg
      .append("g")
      .attr("transform", "translate(" + 62 + "," + 18 + ")");
    if (this.maxDateBoolean == false) {
      var maxDateLabelg = svg
        .append("g")
        .attr("transform", "translate(" + (-174) + "," + 18 + ")");
    } else {
      var maxDateLabelg = svg
        .append("g")
        .attr("transform", "translate(" + (-259) + "," + 18 + ")");
    }
    //-150

    var g = svg
      .append("g")
      .attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

    for (let d of this.data) {
      if (this.stopsCount > 0) {
        var star = d3.select(mainDiv)
          .append("svg")
          .attr("id", 'star' + this.id)
          .attr("height", '30')
          .attr("weight", '50')
          .attr("id", 'star' + this.id)
          .append("polygon")
          .attr("points", "7,3 4,12 11,6 3,6 10,12")
          .attr("fill", "red")
          .attr("transform", "translate(95,8)");

        var text = d3.select('#star' + this.id)
          .append("text")
          .style("font-weight", "bold")
          .text(this.stopsCount + " Dimensional Checks")
          .attr("transform", "translate(110,19)")
          .attr("font-size", '0.7rem');
        break;
      }
    }




    data.map(function (d) {
      d[minValueField] = d[minValueField];
      d[maxValueField] = d[maxValueField];
      d[dimensionCheck] = d[dimensionCheck];
      // d[dimensionCheck] = d[dimensionCheck];
    }
    );
    var minValueDate = d3.min(data, function (d) {
      //here we get the start_date
      return d[minValueField];
    });

    var maxValueDate = d3.max(data, function (d) {
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

    var endTime = new Date(minValueDate);
    endTime.setHours(23, 59, 59, 999);
    var xA = d3.scaleTime()
      .domain([minValueDate, endTime])
      .range([40, width + 18]);

    const yA = d3.scaleOrdinal()
      .domain(data.map(({ stopType }) => {
        return stopType.toUpperCase()
      }))
      .range([0, height]);


    // const xAxis = d3.axisBottom(xA);
    const xAxis = d3.axisBottom(xA).tickArguments([d3.timeHour.every(2)]);

    const stopsTick = d3.scaleOrdinal()
      .domain(this.stopTypes)
      .range([0, height]);


    const yAxis = d3.axisLeft(yA);
    const yAxis2 = d3.axisRight(yA);
    const stopAxis = d3.axisLeft(stopsTick);





    svg
      .append("g")
      .style("font", "10px sans-serif")
      .style("font-weight", "bold")
      .attr("class", "x-axis")
      .attr("transform", "translate(20,0)")
      .call(xAxis);

    // svg
    //   .append("g")
    //   .attr("class", "y-axis")
    //   .attr("transform", "translate(799,0)")
    //   .call(yAxis2);

    //path d attributes changes on x axis
    svg
      .selectAll("g")
      .filter(".x-axis")
      .select("path")
      .filter(".domain")
      .attr("d", "M 40.5 6 V 0.5 H 790 V 1");

    var arrayData = [];
    var tickY = 48;

    svg
      .append("g")
      .attr("class", "y-axis")
      .style("font-family", "sans-serif")
      .style("font-weight", "bold")
      .style("font-size", "12px")
      .style("border", "1px solid black")
      .attr("transform", "translate(41,0)")
      .call(stopAxis)
      .selectAll(".tick")
      .each(function (data) {
        var i = 0;
        arrayData.push(data);
        var tick = d3.select(this);

        if (data.toLowerCase() === "working") {
          var tickY = 46;
          tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
        }
        if (data.toLowerCase() === "resting") {
          var tickY = 105;
          tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
        }
        if (data.toLowerCase() === "break") {
          var tickY = 75;
          tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
        }
      });

    svg
      .selectAll("g")
      .filter(".y-axis")
      .select("path")
      .filter(".domain")
      .attr("d", "M 1 0.5 H 0.5 V 135.5 H 1");

    minDateLabelg
      .append("text")
      .attr("id", "textMinDateLabelg")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("font-size", "9px")
      .attr("font-family", "sans-serif")
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
      .attr("font-size", "9px")
      .attr("font-family", "sans-serif")
      .append("tspan")
      .attr("x", $(mainDiv).width())
      .attr("y", height + margin.bottom)
      .text(d3.timeFormat("%Y-%m-%d %H:%M:%S")(maxValueDate));
    $("#textmaxDateLabelg").css({ "z-index": -1 });

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

    let self = this;


    data.map(function (d, i) {

      // console.log(d);
      // debugger;
      if (upLineValue.indexOf(d[typeFields]) != -1) {
        yPos = height / 2;
        yPos = yPos - 10;
      } else {
        if (d[typeFields] == "break") {
          yPos = height - 19.5
        } else {
          yPos = height + 10;
        }
      }

      // if(d[typeFields] == "working"){
      //     yPos = 85
      // }else if (d[typeFields] == "break"){
      //    yPos = 27.5
      // }else{
      //     yPos = 53.5
      // }
      if (i == 0) {
        var startDateValue = d[minValueField].getTime() / (1000 * 60) - minValue;
        var endDateValue = d[maxValueField].getTime() / (1000 * 60) - minValue;
        pathg = g
          .append("path")
          .attr("class", "line")
          .attr("stroke", lineColor)
          .attr("stroke-width", "3px")
          .attr(
            "d",
            "M " +
            x(startDateValue) +
            " " +
            yPos +
            " L " +
            x(endDateValue) +
            " " +
            yPos
          );
        if (d.dimensionCheck == true) {
          var endDateTime = new Date(d['endTime']);
          var endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;


          var polygonTime = x(endDateTime1);

          pathg = g
            .append("polygon")
            .attr("points", "7,3 4,12 11,6 3,6 10,12")
            .attr("fill", "red")
            .attr("transform", "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")");
        }
        let rectangeWidth = x(endDateValue) - x(startDateValue);
        rectg = g
          .append("rect")
          .attr("class", "rectBackground")
          .attr("x", x(startDateValue))
          .attr("width", rectangeWidth)
          .attr("height", height + 30)
          .style("fill", z(d[typeFields]))
          .style("opacity", "0");

        prevX = x(endDateValue);
        prevY = yPos;
      }
      else {
        var startDateValue = d[minValueField].getTime() / (1000 * 60) - minValue;
        var endDateValue = d[maxValueField].getTime() / (1000 * 60) - minValue;

        if (prevY != yPos) {
          g
            .append("path")
            .attr("class", "line")
            .attr("stroke", lineColor)
            .attr("stroke-width", "1px")
            .attr(
              "d",
              "M " +
              x(startDateValue) +
              " " +
              prevY +
              " L " +
              x(startDateValue) +
              " " +
              yPos
            );

          pathg = g
            .append("path")
            .attr("class", "line")
            .attr("stroke", lineColor)
            .attr("stroke-width", "3px")
            .attr(
              "d",
              "M " +
              x(startDateValue) +
              " " +
              yPos +
              " L " +
              x(endDateValue) +
              " " +
              yPos
            );
          if (d.dimensionCheck == true) {
            var endDateTime = new Date(d['endTime']);
            var endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;

            var polygonTime = x(endDateTime1);
            var stopType = d[minValueField];


            pathg = g
              .append("polygon")
              .attr("points", "7,3 4,12 11,6 3,6 10,12")
              .attr("fill", "red")
              .attr("transform", "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")");
          }
        } else {
          pathg = g
            .append("path")
            .attr("class", "line")
            .attr("stroke", lineColor)
            .attr("stroke-width", "3px")
            .attr(
              "d",
              "M " +
              x(startDateValue) +
              " " +
              yPos +
              " L " +
              x(endDateValue) +
              " " +
              yPos
            );
          if (d.dimensionCheck == true) {
            var endDateTime = new Date(d['endTime']);
            var endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;
            var polygonTime = x(endDateTime1);
            var stopType = d[minValueField];


            pathg = g
              .append("polygon")
              .attr("points", "7,3 4,12 11,6 3,6 10,12")
              .attr("fill", "red")
              .attr("transform", "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")");
          }
        }
        let rectangle2Width = (x(endDateValue) - x(startDateValue));
        rectg = g
          .append("rect")
          .attr("class", "rectBackground")
          .attr("x", x(startDateValue))
          .attr("width", rectangle2Width)
          .attr("height", height + 30)
          .style("fill", z(d[typeFields]))
          .style("opacity", "0");

        prevY = yPos;
      }
      rectg
        .on("mouseover", () => {
          d3.select('#tooltipDiv' + self.id).style("top", "20");
          d3.select('#tooltipDiv' + self.id).style("display", null);
          d3.select('#tooltipDiv' + self.id).style("left");
        })
        .on("mouseout", () => d3.select('#tooltipDiv' + self.id).style("display", "none"))
        .on("mousemove", () => mousemove(self, d));
    });

    function mousemove(e, data) {
      if (d3.event) {
        $('#tooltipDiv' + self.id).css({
          left: d3.event.pageX - 10,
          top: d3.event.pageY + 15
        });
        d3.select('#startDate' + self.id).html(
          "Start Date:" +
          d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[minValueField])
        );
        d3.select('#endDate' + self.id).html(
          "End Date:" + d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[maxValueField])
        );
        d3.select('#processType' + self.id).html("Process Type:" + data[typeFields]);
      }
    }

  }

  /*
  THESE FUNCTIONS ARE USED FOR CALCULATING TOTAL TIME FROM AN ARRAY OF TIME FORMAT SHOULD BE 00:00:00
  addTimes (startTime) {
      var totals = startTime.reduce(function (a, timeString){
          var parts = timeString.split(':');
          var temp;
          if (parts.length > 0 && a) {
              temp = Number(parts.pop()) + a.seconds;
              a.seconds = temp % 60;
              if (parts.length > 0 && a) {
                  temp = (Number(parts.pop()) + a.minutes) + ((temp - a.seconds) / 60);
                  a.minutes = temp % 60;
                  a.hours = a.hours + ((temp - a.minutes) / 60);
                  if (parts.length > 0 && a) {
                      a.hours += Number(parts.pop());
                  }
              }
          }
          return a;
      },{
          hours: 0,
          minutes: 0,
          seconds: 0
      });
      return [
          this.zeroPad(totals.hours),
          this.zeroPad(totals.minutes),
          this.zeroPad(totals.seconds)
      ].join(':');
  }
  zeroPad(num) {
      var str = String(num);
      if (str.length < 2) {
          return '0' + str;
      }
      return str;
  }
*/


}