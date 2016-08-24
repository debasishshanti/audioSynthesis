function Mix(context, track, scale){
	if(!!context) {
		this.context = context;
	}
	else {
		var audioContext = new AudioContext || new window.webkitAudioContext;
		this.context = audioContext();
	}
	this.attack = 2;
	this.decay = 250;
	this.position = 0;
    this.song = track;
    this.scale = scale;
    this.duration = 0;
}

Mix.prototype.setup = function() {
	this.osc = this.context.createOscillator();
	this.gain = this.context.createGain();
	this.osc2 = this.context.createOscillator();
	this.gain2 = this.context.createGain();
	this.delay = this.context.createDelay();
	this.osc2.connect(this.gain2);
	this.gain2.connect(this.delay);
	this.delay.connect(this.osc.frequency);
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination);
}
Mix.prototype.trigger = function(freq, time) {
	var _this = this;
	this.setup();
	this.gain.gain.setValueAtTime(0.1, time);
	this.osc2.frequency.value = 2*freq;
	// this.osc2.type = "sawtooth";

	this.gain2.gain.value = 0.5;

	this.delay.delayTime.value = 0.25;

	this.osc.frequency.value = freq;
	this.osc.type = "triangle";

	this.gain.gain.exponentialRampToValueAtTime(0.6, time + this.attack/1000);

	this.gain.gain.exponentialRampToValueAtTime(0.1, time + this.decay/1000);

	this.osc2.start(time);
	this.osc2.stop(time + (this.decay+10)/1000);

	this.osc.start(time);
	this.osc.stop(time + (this.decay+10)/1000);
	/*this.osc.onended = function() {
		_this.osc.disconnect(_this.gain);
		_this.gain.disconnect(_this.context.destination);
	}*/

}

Mix.prototype.play = function(time) {
	if(this.duration<=this.song[this.position].duration) {
		this.duration = 0;
		var note = this.song[this.position].note,
	        freq = this.scale[note];
	    this.position += 1;
	    if(this.position >= this.song.length) {
	        this.position = 0;
	    }
	    if(freq) {
	        this.trigger(freq, time);
	    }
	}
	else {
		this.duration++;
	}
}