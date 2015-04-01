var startedAt;
var pausedAt;

function playSound() {
	//sourceNode = context.createBufferSource();
    //sourceNode.connect(context.destination);
    sourceNode.buffer = buffer;
    paused = false;

    if (pausedAt) {
        startedAt = Date.now() - pausedAt;
        sourceNode.start(0, pausedAt / 1000);
    }
    else {
        startedAt = Date.now();
        sourceNode.start(0);
    }
}

function stopSound() {
	sourceNode.stop(0);
	pausedAt = Date.now() - startedAt;
    paused = true;
}

// log if an error occurs
function onError(e) {
	console.log(e);
}

function drawSpectrum(array) {
	for ( var i = 0; i < (array.length); i++ ){
		var value = array[i];
		ctx.fillRect(i*30,250-value,18,250);
		//  console.log([i,value])
	}
};

// load the specified sound
function loadSound(url) {
	var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, onBufferLoad, onBufferError);
    };
    request.send();
}
function onBufferLoad(b) {
    buffer = b;
    playSound();
}

function onBufferError(e) {
    console.log('onBufferError', e);
}

function setupAudioNodes() {
	// setup a javascript node
	javascriptNode = context.createScriptProcessor(2048, 1, 1);
	// connect to destination, else it isn't called
	javascriptNode.connect(context.destination);

	// setup a analyzer
	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.3;
	analyser.fftSize = 32;

	// create a buffer source node
	sourceNode = context.createBufferSource();
	sourceNode.connect(analyser);
	analyser.connect(javascriptNode);
	sourceNode.connect(context.destination);
}

