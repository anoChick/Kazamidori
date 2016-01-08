window.addEventListener("deviceorientation", function(e) {
        document.getElementById('orientation').textContent = [e.alpha | 0, e.beta | 0, e.gamma | 0];
});

window.addEventListener('devicemotion', function(e) {
		var acc = e.acceleration;
		document.getElementById('motion').textContent = [acc.x.toFixed(3), acc.y.toFixed(3), acc.y.toFixed(3)];
});

window.ondeviceorientation = function(event) {
	var compassHeading = event.webkitCompassHeading;
	document.getElementById('heading').innerHTML = 'コンパスの向き： ' + compassHeading;

	var compassAccuracy = event.webkitCompassAccuracy;
	document.getElementById('headingAccuracy').innerHTML = 'コンパスの正確性： ' + compassAccuracy;
}
