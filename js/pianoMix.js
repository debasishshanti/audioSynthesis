function Mix(context, track){
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
    this.song = track;
    this.duration = 0;
}

Mix.prototype.setup = function() {
	this.osc = this.context.createOscillator();
	this.gain = this.context.createGain();
	this.osc.connect(this.gain);
	this.gain.connect(this.context.destination);
}
Mix.prototype.trigger = function(freq, time) {
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

Mix.prototype.play = function(time) {
	if(this.duration<=this.song[position].duration) {
		this.duration = 0;
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
	else {
		this.duration++;
	}
}