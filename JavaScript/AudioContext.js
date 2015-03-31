function playSound(buffer) {
	sourceNode.buffer = buffer;
	sourceNode.start(0);
}

// log if an error occurs
function onError(e) {
	console.log(e);
}

function drawSpectrum(array) {
	for ( var i = 0; i < (array.length); i++ ){
		var value = array[i];
		ctx.fillRect(i*5,325-value,3,325);
		//  console.log([i,value])
	}
};

// load the specified sound
function loadSound(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// When loaded decode the data
	request.onload = function() {

		// decode the data
		context.decodeAudioData(request.response, function(buffer) {
			// when the audio is decoded play the sound
			playSound(buffer);
		}, onError);
	}
	request.send();
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

