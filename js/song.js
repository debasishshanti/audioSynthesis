function Song(context) {
	if(!!context) {
		this.context = context;
	}
	else {
		var audioContext = new AudioContext || new window.webkitAudioContext;
		this.context = audioContext();
	}
	this.attack = 10;
	this.decay = 50;
	this.position = 0;
    this.scale = {
        g: 392,
        f: 349.23,
        e: 329.63,
        b: 493.88
    };
    this.song = "gfefgg-fff-gbb-gfefggggffgfe---";
    this.timer;
    this.playing = false;
}

Song.prototype.setup = function() {
	this.osc = this.context.createOscillator();
	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination);
}

Song.prototype.trigger = function(freq, time) {
	var _this = this;
	this.setup();
	this.gain.gain.setValueAtTime(0.1, time);
	this.osc.frequency.value = freq;
	this.osc.type = "square";

	this.gain.gain.setValueAtTime(0.5, time + this.attack/1000);

	this.gain.gain.setValueAtTime(0.1, time + this.decay/1000);

	this.osc.start(0);
	this.osc.stop(time + this.decay/1000);
	/*this.osc.onended = function() {
		_this.osc.disconnect(_this.gain);
		_this.gain.disconnect(_this.context.destination);
	}*/

}

Song.prototype.play = function(time) {
	var note = this.song.charAt(this.position),
        freq = this.scale[note];
    this.position += 1;
    if(this.position >= this.song.length) {
        this.position = 0;
    }
    if(freq) {
        this.trigger(freq, time);
    }
}

Song.prototype.start = function() {
	if(!this.playing) {
		this.playing = true;
		this.play();
	}
}

Song.prototype.stop = function() {
	if(this.playing) {
		this.playing = false;
		this.position = 0;
	}
}

Song.prototype.attachStart = function(element) {
	var _this = this;
	$(element).click(function() {
		_this.start();
	});
}

Song.prototype.attachStop = function(element) {
	var _this = this;
	$(element).click(function() {
		_this.stop();
	});
}