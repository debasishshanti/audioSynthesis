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
}