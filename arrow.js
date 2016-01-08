//colors
bgColor = '#FFFFFF'
baseColor = '#B2CF3E'
subColor1 = '#7379AE'
subColor2 = '#5F1A42'
var w = 400;
var h = 400;
var targetHeading = 0;
createArrow();
rotateArrow(20);
function createArrow() {
  var arrowPoints = [ {"x": w*1/8, "y": h*1/2}, {"x": w*1/2, "y": h*1/8},
                      {"x": w*7/8, "y": h*1/2}, {"x": w*5/8, "y": h*1/2},
                      {"x": w*5/8, "y": h*7/8}, {"x": w*3/8, "y": h*7/8},
                      {"x": w*3/8, "y": h*1/2}];
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
};

function rotateArrow(arrowAngle){
  d3.select("#arrow")
  .attr("transform", "rotate("+arrowAngle+" "+w/2+" "+h/2+")");
};
