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
var watchID;

// Position: Latitude [deg]
//				Longitude [deg]
//				Altitude [m]
var myPosition = {lat: 0.0,lon: 0.0, alt: 0.0}
var friendPosition = {lat: 0.0, lon: 0.0, alt: 0.0}

createArrow();
startOrientationEvent();
positionSet(35.692027, 139.701166, 37.0) //サンプル新宿東口交番前

function positionSet(lat, lon, alt){
  friendPosition.lat = lat;
  friendPosition.lon = lon;
  friendPosition.alt = alt;
}

function startOrientationEvent(){
  if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', function(event){
      var compassHeading;
      if(event.webkitCompassHeading){
        compassHeading = event.webkitCompassHeading;
        compassAccuracy = event.webkitCompassAccuracy;
      }
      else{
        compassHeading = event.alpha;
        compassAccuracy = event.absolute;
      }
      document.getElementById('heading').innerHTML = compassHeading;
      document.getElementById('headingAccuracy').innerHTML = compassAccuracy;
      if(!App.ael) return;
      rotateArrow(App.ael.A, compassHeading);
      setLength(App.ael.L);
    });
  }
}

function positionDetect(io){
	function successCallback(position) {
		myPosition.lat = position.coords.latitude
		myPosition.lon = position.coords.longitude
		myPosition.alt = position.coords.altitude
		var gl_text = "緯度：" + myPosition.lat + "<br>";
			gl_text += "経度：" + myPosition.lon + "<br>";
			gl_text += "高度：" + myPosition.alt + "<br>";
			gl_text += "緯度・経度の誤差：" + position.coords.accuracy + "<br>";
			gl_text += "高度の誤差：" + position.coords.altitudeAccuracy + "<br>";
			gl_text += "方角：" + position.coords.heading + "<br>";
			gl_text += "速度：" + position.coords.speed + "<br>";
		document.getElementById("show_result").innerHTML = gl_text;
		var ael = getVector(myPosition, friendPosition);
		var ael_text = "Azimas:" + ael.A + "<br>";
				ael_text += "Elevation:" + ael.E + "<br>";
				ael_text += "Length:" + ael.L + "<br>";
		targetHeading = ael.A;
		targetLength = ael.L;
		document.getElementById("Friend").innerHTML = ael_text;
	}

	function errorCallback(error) {
		var err_msg = "";
		switch(error.code)
		{
			case 1:
				err_msg = "位置情報の利用が許可されていません";
				break;
			case 2:
				err_msg = "デバイスの位置が判定できません";
				break;
			case 3:
				err_msg = "タイムアウトしました";
				break;
		}
		document.getElementById("show_result").innerHTML = err_msg;
	}

	if (io == 0) {
		navigator.geolocation.clearWatch(watchID);
	}else{
		if (navigator.geolocation) {
			watchID = navigator.geolocation.watchPosition(successCallback, errorCallback);
		} else {
			alert('位置情報をオンにしてね');
		}
	}
}

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
  document.getElementById('arrowp').innerHTML = arrowAngle


  d3.select("#arrow")
  .attr("transform", "rotate("+arrowAngle+" "+v/2+" "+v/2+")");

};

function setLength(rawlen){
  slen = parseInt(rawlen);
  d3.select("#lenText")
  .text(slen + "m");
};

function wgs2ecef(pos){
	lat = pos.lat / 180 * Math.PI;
	lon = pos.lon / 180 * Math.PI;

	//WGS-84準拠
	var a = 6378137; //[m] 赤道面平均半径
	var f = 1/298.257223563; //扁平率
	var e2 = 2*f-Math.pow(f,2);
	var N = a / Math.sqrt(1-e2*Math.pow(Math.sin(lat),2));
	var ecef = {X: 0.0, Y: 0.0, Z: 0.0};
	ecef.X = (N + pos.alt) * Math.cos(lat) * Math.cos(lon);
	ecef.Y = (N + pos.alt) * Math.cos(lat) * Math.sin(lon);
	ecef.Z = (N * (1-e2) + pos.alt) * Math.sin(lat);
	return ecef;
}

function ecef2enu(myPos, myEcef, friEcef){
	function Rx(theta){
		theta = theta / 180 * Math.PI;
		return [
			[1, 0, 0],
			[0, Math.cos(theta), Math.sin(theta)],
			[0, -Math.sin(theta), Math.cos(theta)]
		]
	}
	function Ry(theta){
		theta = theta / 180 * Math.PI;
		return [
			[Math.cos(theta), 0, -Math.sin(theta)],
			[0, 1, 0],
			[Math.sin(theta), 0, Math.cos(theta)]
		]
	}
	function Rz(theta){
		theta = theta / 180 * Math.PI;
		return [
			[Math.cos(theta), Math.sin(theta), 0],
			[-Math.sin(theta), Math.cos(theta), 0],
			[0, 0, 1]
		]
	}

	function dot(x,y) {
	    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0;
	    p = x.length; q = y.length; r = y[0].length;
	    ret = Array(p);
	    for(i=p-1;i>=0;i--) {
	        foo = Array(r);
	        bar = x[i];
	        for(k=r-1;k>=0;k--) {
	            woo = bar[q-1]*y[q-1][k];
	            for(j=q-2;j>=1;j-=2) {
	                i0 = j-1;
	                woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
	            }
	            if(j===0) { woo += bar[0]*y[0][k]; }
	            foo[k] = woo;
	        }
	        ret[i] = foo;
	    }
	    return ret;
	}

	lat = myPos.lat;
	lon = myPos.lon;
	angle_mat = dot(dot(Rz(90),Ry(90-lat)), Rz(lon));
	var ENU = dot(angle_mat, [[friEcef.X - myEcef.X], [friEcef.Y - myEcef.Y], [friEcef.Z - myEcef.Z]]);
	var enu = {E: ENU[0], N: ENU[1], U: ENU[2]};
	return enu;
}

function enu2ael(enu){
	az = Math.atan2(enu.E, enu.N) / Math.PI * 180;
	if(az < 0){
		az = 360 + az
	}
 	enLen = Math.sqrt(Math.pow(enu.E,2)+Math.pow(enu.N,2));
	el = Math.atan2(enLen, enu.U) / Math.PI * 180;
	len = Math.sqrt(Math.pow(enLen,2)+Math.pow(enu.U,2));
	var AEL = {A: az, E: el, L: len};
	return AEL;
}

function getVector(myPos, friPos){
	myEcef = wgs2ecef(myPos);
	friEcef = wgs2ecef(friPos);
	enu = ecef2enu(myPos, myEcef, friEcef);
	ael = enu2ael(enu);
	return ael;
}
