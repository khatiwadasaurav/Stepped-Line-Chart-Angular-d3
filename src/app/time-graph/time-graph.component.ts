import { Component, OnInit } from "@angular/core";
import * as d3 from "d3";

declare let $: any;
@Component({
  selector: "app-graph",
  templateUrl: "./time-graph.component.html",
  styles: []
})
export class TimeGraphComponent implements OnInit {
  data = [
    {
      dimensionCheck: true,
      endTime: "2019-08-29T22:16:03.000Z",
      time: "2019-08-29T18:15:00.000Z",
      stopstype: "resting",
      duration: "04:01:03"
    },
    {
      dimensionCheck: false,
      endTime: "2019-08-30T02:47:58.978Z",
      time: "2019-08-29T22:16:03.000Z",
      stopstype: "working",
      duration: "04:31:55"
    },
    {
      dimensionCheck: false,
      endTime: "2019-08-30T03:51:17.742Z",
      time: "2019-08-30T02:47:58.978Z",
      stopstype: "break",
      duration: "01:03:18"
    },
    {
      dimensionCheck: true,
      endTime: "2019-08-30T08:23:56.000Z",
      time: "2019-08-30T03:51:17.742Z",
      stopstype: "working",
      duration: "04:32:38"
    },
    {
      dimensionCheck: false,
      endTime: "2019-08-30T18:14:00.000Z",
      time: "2019-08-30T08:23:56.000Z",
      stopstype: "resting",
      duration: "09:50:04"
    }
  ];
  id = 1;
  stopsCount: number = 2;
  totalStopsData?: any;
  maxDateBoolean?: boolean = false;
  totalStopHours = [];
  stopTypes = ["WORKING", "BREAK", "RESTING"];
  totalTime;

  helpers = {
    getDimensions: function (id) {
      let el: any = document.getElementById(id);
      let w = 1,
        h = 1;
      if (el) {
        let dimensions = el.getBBox();
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
    this.data = this.data.filter(v => {
      return v.endTime;
    });
    this.data.forEach(v => {
      v["stopType"] = v["stopstype"];
      v["start_date"] = new Date(v.time);
      v["end_date"] = new Date(v.endTime);
    });
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
      $("#chart" + this.id).empty();
      let chartConfig = {
        mainDiv: "#chart" + this.id,
        data: data,
        lineColor: " #3880aa",
        upLineValue: ["working"],
        typeFields: "stopType",
        minValueField: "start_date",
        maxValueField: "end_date",
        duration: "duration",
        dimensionCheck: "dimensionCheck"
      };
      let lineStepCharts = this.lineStepChart(chartConfig);
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
      let resizeTimer;
      let interval = 500;
      window.removeEventListener("resize", function () { });
    }
    this.drawLineStepsChart(config);
    setReSizeEvent(config);
  }

  drawLineStepsChart(config) {
    let data = config.data;
    let lineColor = config.lineColor;
    let upLineValue = config.upLineValue;
    let typeFields = config.typeFields;
    let mainDiv = config.mainDiv;
    let minValueField = config.minValueField;
    let maxValueField = config.maxValueField;
    let duration = config.duration;
    let dimensionCheck = config.dimensionCheck;
    let mainDivName = mainDiv.substr(1, mainDiv.length);
    let z = d3.scaleOrdinal();

    let mainDivWidth = $(mainDiv).width();
    let mainDivHeight = $(mainDiv).height();
    // let height1 = +svg.attr("height") - margin.top - margin.bottom;

    /* here i am zipping two arrays may need for future implementation
     let zipped = this.stopTypes.map((x, i) => [x, this.totalStopHours[i]]);
     console.log(zipped); */

    const yB = d3
      .scaleOrdinal()
      .domain(this.totalStopHours)
      .range([0, 133]);

    const yAxis1 = d3.axisRight(yB);

    d3.select(mainDiv)
      .append("svg")
      .attr("id", "svg" + this.id)
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

    d3.select("#svg" + this.id)
      .append("rect")
      .attr("x", "60")
      .attr("y", "30")
      .attr("width", "750")
      .attr("height", "91")
      .attr("fill", "url(#smallGrid)");

    let border_size = "1px";
    if (this.totalStopsData) {
      d3.select(mainDiv)
        .append("svg")
        .attr("id", "totalTime" + this.id)
        .attr("height", "135")
        .attr("width", "100")
        .style("display", "inline-block")
        .style("margin-left", "10px")
        // .style("border-top","1px solid #575962")
        // .style("border-bottom","1px solid #575962")
        // .style("border-right","1px solid #575962")
        .append("g")
        .attr("id", "g" + this.id)
        .append("rect")
        .style("fill", "white")
        .attr("height", "15")
        .attr("width", "100")
        .attr("x", "0")
        .attr("y", "1");

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
          let tick = d3.select(this);
          if (index === 0) {
            let tickY = 42;
            tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
          }
          if (index === 1) {
            let tickY = 70;
            tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
          }
          if (index === 2) {
            let tickY = 100;
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

    let svg = d3.select(mainDiv + " svg"),
      margin = {
        top: 20,
        right: 20,
        bottom: 40,
        left: 30
      },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    let uniqueStopType = [];
    let stopsUnique = data.forEach(datas => {
      if (uniqueStopType.includes(datas.stopType)) {
      } else {
        uniqueStopType.push(datas.stopType);
      }
    });

    let minDateLabelg = svg
      .append("g")
      .attr("transform", "translate(" + 62 + "," + 18 + ")");
    let maxDateLabelg;
    if (this.maxDateBoolean == false) {
      maxDateLabelg = svg
        .append("g")
        .attr("transform", "translate(" + -174 + "," + 18 + ")");
    } else {
      maxDateLabelg = svg
        .append("g")
        .attr("transform", "translate(" + -259 + "," + 18 + ")");
    }
    //-150

    let g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + (margin.left + 30) + "," + margin.top + ")"
      );

    for (let d of this.data) {
      if (this.stopsCount > 0) {
        let star = d3
          .select(mainDiv)
          .append("svg")
          .attr("id", "star" + this.id)
          .attr("height", "30")
          .attr("weight", "50")
          .attr("id", "star" + this.id)
          .append("polygon")
          .attr("points", "7,3 4,12 11,6 3,6 10,12")
          .attr("fill", "red")
          .attr("transform", "translate(95,8)");

        let text = d3
          .select("#star" + this.id)
          .append("text")
          .style("font-weight", "bold")
          .text(this.stopsCount + " Dimensional Checks")
          .attr("transform", "translate(110,19)")
          .attr("font-size", "0.7rem");
        break;
      }
    }

    data.map(function (d) {
      d[minValueField] = d[minValueField];
      d[maxValueField] = d[maxValueField];
      d[dimensionCheck] = d[dimensionCheck];
      // d[dimensionCheck] = d[dimensionCheck];
    });
    let minValueDate = d3.min(data, function (d) {
      //here we get the start_date
      return d[minValueField];
    });

    let maxValueDate = d3.max(data, function (d) {
      //here we get the end_date
      return d[maxValueField];
    });

    let minValue = new Date(minValueDate).getTime() / (1000 * 60);
    let maxValue = new Date(maxValueDate).getTime() / (1000 * 60);
    let diffInMinutes = maxValue - minValue;
    let x = d3.scaleLinear().range([0, width]);
    x.domain([0, diffInMinutes]);

    let y = d3.scaleLinear().range([height, 0]);
    y.domain([0, height]);

    let endTime = new Date(minValueDate);
    endTime.setHours(23, 59, 59, 999);
    let xA = d3
      .scaleTime()
      .domain([minValueDate, endTime])
      .range([40, width + 18]);

    const yA = d3
      .scaleOrdinal()
      .domain(
        data.map(({ stopType }) => {
          return stopType.toUpperCase();
        })
      )
      .range([0, height]);

    // const xAxis = d3.axisBottom(xA);
    const xAxis = d3.axisBottom(xA).tickArguments([d3.timeHour.every(2)]);

    const stopsTick = d3
      .scaleOrdinal()
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

    let arrayData = [];
    let tickY = 48;

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
        let i = 0;
        arrayData.push(data);
        let tick = d3.select(this);

        if (data.toLowerCase() === "working") {
          let tickY = 46;
          tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
        }
        if (data.toLowerCase() === "resting") {
          let tickY = 105;
          tick.attr("transform", "translate(" + 0 + "," + tickY + ")");
        }
        if (data.toLowerCase() === "break") {
          let tickY = 75;
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

    let dims = this.helpers.getDimensions("textmaxDateLabelg");
    d3.selectAll("#textmaxDateLabelg tspan").attr(
      "x",
      $(mainDiv).width() - dims.w
    );

    let prevX = 0;
    let prevY = 0;
    let yPos = 1;
    let pathg: any;
    let rectg: any;

    let self = this;

    data.map(function (d, i) {
      // console.log(d);
      // debugger;
      if (upLineValue.indexOf(d[typeFields]) != -1) {
        yPos = height / 2;
        yPos = yPos - 10;
      } else {
        if (d[typeFields] == "break") {
          yPos = height - 19.5;
        } else {
          yPos = height + 10;
        }
      }

      if (i == 0) {
        let startDateValue =
          d[minValueField].getTime() / (1000 * 60) - minValue;
        let endDateValue = d[maxValueField].getTime() / (1000 * 60) - minValue;
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
          let endDateTime = new Date(d["endTime"]);
          let endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;

          let polygonTime = x(endDateTime1);

          pathg = g
            .append("polygon")
            .attr("points", "7,3 4,12 11,6 3,6 10,12")
            .attr("fill", "red")
            .attr(
              "transform",
              "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")"
            );
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
      } else {
        let startDateValue =
          d[minValueField].getTime() / (1000 * 60) - minValue;
        let endDateValue = d[maxValueField].getTime() / (1000 * 60) - minValue;

        if (prevY != yPos) {
          g.append("path")
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
            let endDateTime = new Date(d["endTime"]);
            let endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;

            let polygonTime = x(endDateTime1);
            let stopType = d[minValueField];

            pathg = g
              .append("polygon")
              .attr("points", "7,3 4,12 11,6 3,6 10,12")
              .attr("fill", "red")
              .attr(
                "transform",
                "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")"
              );
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
            let endDateTime = new Date(d["endTime"]);
            let endDateTime1 = endDateTime.getTime() / (1000 * 60) - minValue;
            let polygonTime = x(endDateTime1);
            let stopType = d[minValueField];

            pathg = g
              .append("polygon")
              .attr("points", "7,3 4,12 11,6 3,6 10,12")
              .attr("fill", "red")
              .attr(
                "transform",
                "translate(" + (polygonTime - 10) + "," + (yPos - 9) + ")"
              );
          }
        }
        let rectangle2Width = x(endDateValue) - x(startDateValue);
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
          d3.select("#tooltipDiv" + self.id).style("top", "20");
          d3.select("#tooltipDiv" + self.id).style("display", null);
          d3.select("#tooltipDiv" + self.id).style("left");
        })
        .on("mouseout", () =>
          d3.select("#tooltipDiv" + self.id).style("display", "none")
        )
        .on("mousemove", () => mousemove(self, d));
    });

    function mousemove(e, data) {
      if (d3.event) {
        $("#tooltipDiv" + self.id).css({
          left: d3.event.pageX - 10,
          top: d3.event.pageY + 15
        });
        d3.select("#startDate" + self.id).html(
          "Start Date:" +
          d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[minValueField])
        );
        d3.select("#endDate" + self.id).html(
          "End Date:" + d3.timeFormat("%Y-%m-%d %H:%M:%S")(data[maxValueField])
        );
        d3.select("#processType" + self.id).html(
          "Process Type:" + data[typeFields]
        );
      }
    }
  }

  /*
  THESE FUNCTIONS ARE USED FOR CALCULATING TOTAL TIME FROM AN ARRAY OF TIME FORMAT SHOULD BE 00:00:00
  addTimes (startTime) {
      let totals = startTime.reduce(function (a, timeString){
          let parts = timeString.split(':');
          let temp;
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
      let str = String(num);
      if (str.length < 2) {
          return '0' + str;
      }
      return str;
  }
*/
}
