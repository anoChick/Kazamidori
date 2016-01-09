//colors
bgColor = '#FFFFFF'
baseColor = '#B2CF3E'
subColor1 = '#7379AE'
subColor2 = '#5F1A42'
var w = window.innerWidth;
var h = window.innerHeight;
var v = w;
if(v >= h){
  v = h;
}
var targetHeading = 0;
var targetLength = 0;
createArrow();
rotateArrow(20);
function createArrow() {
  var arrowPoints = [ {"x": v*1/8, "y": v*1/2}, {"x": v*1/2, "y": v*1/8},
                      {"x": v*7/8, "y": v*1/2}, {"x": v*5.3/8, "y": v*1/2},
                      {"x": v*5.3/8, "y": v*7/8}, {"x": v*2.7/8, "y": v*7/8},
                      {"x": v*2.7/8, "y": v*1/2}];
  var svg = d3.select("#show_arrow")
              .append("svg")
              .attr("width", v)
              .attr("height", v);
  var arrowFunction = d3.svg.line()
                           .x(function(d) {return d.x;})
                           .y(function(d) {return d.y;})
                           .interpolate("linear");

  svg.append("path").attr("id", "arrow")
                    .attr("d", arrowFunction(arrowPoints))
                    .attr("fill", subColor1)
                    .attr("transform", "rotate(0 "+v/2+" "+v/2+")");

  svg.append("text").attr("id", "lenText")
                    .attr("x", v/2)
                    .attr("y", v/2)
                    .attr("text-anchor", "middle")
                    .text(0 + "m");

};

function rotateArrow(targetHeading, compassHeading){
  if(!compassHeading){
    compassHeading = 0;
  }
  arrowAngle = targetHeading-compassHeading;
  if(arrowAngle < 0){
    arrowAngle = 360 + arrowAngle;
  }
  d3.select("#arrow")
  .attr("transform", "rotate("+arrowAngle+" "+v/2+" "+v/2+")");

};

function setLength(rawlen){
  slen = parseInt(rawlen);
  d3.select("#lenText")
  .text(slen + "m");
};
