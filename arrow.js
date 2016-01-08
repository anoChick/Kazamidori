//colors
bgColor = '#FFFFFF'
baseColor = '#B2CF3E'
subColor1 = '#7379AE'
subColor2 = '#5F1A42'
var w = window.innerWidth;
var h = window.innerHeight;
var targetHeading = 0;
var targetLength = 0;
createArrow();
rotateArrow(20);
function createArrow() {
  v = w;
  if(v > h){
    v = h;
  }
  var arrowPoints = [ {"x": v*1/8, "y": v*1/2}, {"x": v*1/2, "y": v*1/8},
                      {"x": v*7/8, "y": v*1/2}, {"x": v*5.3/8, "y": v*1/2},
                      {"x": v*5.3/8, "y": v*7/8}, {"x": v*2.7/8, "y": v*7/8},
                      {"x": v*2.7/8, "y": v*1/2}];
  var svg = d3.select("#show_arrow")
              .append("svg")
              .attr("width", w)
              .attr("height", h);
  var arrowFunction = d3.svg.line()
                           .x(function(d) {return d.x;})
                           .y(function(d) {return d.y;})
                           .interpolate("linear");

  svg.append("path").attr("id", "arrow")
                    .attr("d", arrowFunction(arrowPoints))
                    .attr("fill", subColor1)
                    .attr("transform", "rotate(0 "+w/2+" "+h/2+")");

  svg.append("text").attr("id", "lenText")
                    .attr("x", w/2)
                    .attr("y", h/2)
                    .attr("text-anchor", "middle")
                    .text(0 + "m");

};

function rotateArrow(targetHeading, compassHeading){
  arrowAngle = targetHeading-compassHeading;
  if(arrowAngle < 0){
    arrowAngle = 360 + arrowAngle;
  }
  d3.select("#arrow")
  .attr("transform", "rotate("+arrowAngle+" "+w/2+" "+h/2+"), translate(0, "+h*1/8+")");
};

function setLength(rawlen){
  slen = parseInt(rawlen);
  d3.select("#lenText")
  .text(slen + "m");
};
