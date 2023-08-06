// https://freshman.tech/pomodoro-timer/

const pomTime = document.querySelector("#pomTime").value;
const pomBreakShort = document.querySelector("#pomBreakShort").value;
const pomBreakLong = document.querySelector("#pomBreakLong").value;
const timerDisplay = document.querySelector('#timer')
const startPause = document.querySelector('#startPause');
let intervalId;
let pomSessionStateCounter = 7;
let pomsCompleted;
let pomsSkipped;
let breaksShortSkipped;
let breaksLongSkipped;
let pauseState = false;
let remainingTimeSecs = 60;
let remainingTimeMins; 

window.onload = function () {
	timerDisplay.textContent = pomTime + ':00';
};

function pomSessionState () {
	if (pomSessionStateCounter === 7 ||
		pomSessionStateCounter === 5 ||
		pomSessionStateCounter === 3 ||
		pomSessionStateCounter === 1
		) {
		return pomTime;
	} else if (pomSessionStateCounter === 0) {
		return pomBreakLong;

	} else if (pomSessionStateCounter < 0) {
		pomSessionStateCounter = 6;
		return pomTime;
	} else {
		return pomBreakShort;
	}
}

function buttonClick () {
	if (!pauseState) {
		startPomTimer (pomSessionState());
	} else {
		pausePomTimer()
	}
};

function startPomTimer (timeValue) {
	if (pauseState === false) {
		remainingTimeMins = timeValue - 1;
	} else {
		remainingTimeMins = timeValue;
	}
	
	pauseState = true;

	// change the button text to read Pause and point to the pause function
	startPause.textContent = 'Pause';

	intervalId = setInterval(() => {
		let counterDisplay = remainingTimeMins + ":" + remainingTimeSecs;
		timerDisplay.textContent = counterDisplay;
		// Updates tab title to show current elapsed time
		document.title = counterDisplay;
		remainingTimeSecs--;
	if (remainingTimeMins < 0) {
		console.log('Time Up!');
		clearInterval(intervalId);
		pomsCompleted++;
		pomSessionStateCounter--;
		} else if (remainingTimeSecs < 0) {
			remainingTimeMins--;
			remainingTimeSecs = 60;
		}
		}, 1000);
	};

function pausePomTimer () {
	// implement using active/inactive class toggle trick
	// https://stackoverflow.com/questions/70052954/how-can-i-call-2-different-function-using-one-toggle-button-in-vanilla-javascrip	
	pauseState = false;
	clearInterval(intervalId);
	startPause.textContent = 'Resume';
};

function skipPom() {
	if (pomSessionStateCounter === 7 ||
		pomSessionStateCounter === 5 ||
		pomSessionStateCounter === 3 ||
		pomSessionStateCounter === 1
		) {
		pomsSkipped++;
	} else if (pomSessionStateCounter === 0) {
		breaksLongSkipped++;

	} else if (pomSessionStateCounter < 0) {
		pomSessionStateCounter = 7;
	} else {
		breaksShortSkipped++;
	}
	clearInterval(intervalId);
	startPause.textContent = 'Start';
}

function resetSessions () {
	pomSessionStateCounter = 7;
	timerDisplay.textContent = pomTime + ':00';
	remainingTimeSecs = 60
}