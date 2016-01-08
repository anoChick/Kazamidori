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
	var ENU = dot(angle_mat, [[myEcef.X - friEcef.X], [myEcef.Y - friEcef.Y], [myEcef.Z - friEcef.Z]]);
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


// myPos: Latitude [deg]
//				Longitude [deg]
//				Altitude [m]
function getVector(myPos, friPos){
	myEcef = wgs2ecef(myPos);
	friEcef = wgs2ecef(friPos);
	enu = ecef2enu(myPos, myEcef, friEcef);
	ael = enu2ael(enu);
	return ael;
}

var watchID;
var myPosition = {lon: 0.0, lat: 0.0, alt: 0.0}
function positionDetect(io){
	function successCallback(position) {
		var friendPosition = {lon: 139.701166, lat: 35.692027, alt: 37} //新宿東口交番前
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
		document.getElementById("Shinjuku").innerHTML = ael_text;
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
