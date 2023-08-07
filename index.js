// https://freshman.tech/pomodoro-timer/

// Retrieve and store all DOM locators
const pomTime = document.querySelector("#pomTime").value;
const pomBreakShort = document.querySelector("#pomBreakShort").value;
const pomBreakLong = document.querySelector("#pomBreakLong").value;
const pomTimeID = document.querySelector("#pomTime");
const pomBreakShortID = document.querySelector("#pomBreakShort");
const pomBreakLongID = document.querySelector("#pomBreakLong");
const timerDisplay = document.querySelector('#timer')
const startPause = document.querySelector('#startPause');
const pomsCompletedID = document.querySelector('#pomsCompleted');
const pomsSkippedID = document.querySelector('#pomsSkipped');
const breaksShortSkippedID = document.querySelector('#breaksShortSkipped');
const breaksLongSkippedID = document.querySelector('#breaksLongSkipped');

let intervalId;
let pomSessionStateCounter = 7;
let pomsCompleted = 0;
let pomsSkipped = 0;
let breaksShortSkipped = 0;
let breaksLongSkipped = 0;
let pauseState = false;
let remainingTimeSecs = 60;
let remainingTimeMins; 

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
	if (!pauseState) {
		remainingTimeMins = timeValue - 1;
	} else {
		remainingTimeMins = timeValue;
	}
	
	pauseState = true;
	lockInputs();

	// change the button text to read Pause and point to the pause function
	startPause.textContent = 'Pause';

	intervalId = setInterval(() => {
		let counterDisplay = remainingTimeMins + ":" + remainingTimeSecs;
		
		// This statment ensures that on start of countdown the first update is skipped
		// so the user doesn't see 24:60
		if (remainingTimeSecs === 60) {
			
		} else {
			timerDisplay.textContent = counterDisplay;
			document.title = counterDisplay;
		}
		remainingTimeSecs--;
	if (remainingTimeMins < 0) {
		console.log('Time Up!');
		clearInterval(intervalId);
		pomsCompleted++;
		pomSessionStateCounter--;
		updateStats();
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
	pauseState = false;
	unlockInputs();
	remainingTimeSecs = 60
	clearInterval(intervalId);
	startPause.textContent = 'Start';

	if (pomSessionStateCounter === 7 ||
		pomSessionStateCounter === 5 ||
		pomSessionStateCounter === 3 ||
		pomSessionStateCounter === 1
		) {
		timerDisplay.textContent = pomBreakShort + ':00';
		pomsSkipped++;
		pomSessionStateCounter--;
	} else if (pomSessionStateCounter === 0) {
		timerDisplay.textContent = pomTime + ':00';
		breaksLongSkipped++;
		pomSessionStateCounter--;
	} else if (pomSessionStateCounter < 0) {
		pomSessionStateCounter = 7;
		timerDisplay.textContent = pomTime + ':00';
	} else {
		breaksShortSkipped++;
		timerDisplay.textContent = pomTime + ':00';
		pomSessionStateCounter--;
	}
	updateStats();
	unlockInputs();
};

function resetSessions () {
	pauseState = false;
	clearInterval(intervalId);
	pomSessionStateCounter = 7;
	timerDisplay.textContent = pomTime + ':00';
	startPause.textContent = 'Start';
	remainingTimeSecs = 60
	pomsCompleted = 0;
	pomsSkipped = 0;
	breaksShortSkipped = 0;
	breaksLongSkipped = 0;
	unlockInputs();
};

function updateStats () {
	pomsCompletedID.textContent = pomsCompleted;
	pomsSkippedID.textContent = pomsSkipped;
	breaksShortSkippedID.textContent = breaksShortSkipped;
	breaksLongSkippedID.textContent = breaksLongSkipped;
};

function lockInputs () {
	pomTimeID.setAttribute('readonly', true);
	pomBreakShortID.setAttribute('readonly', true);
	pomBreakLongID.setAttribute('readonly', true);
};

function unlockInputs () {
	pomTimeID.removeAttribute('readonly');
	pomBreakShortID.removeAttribute('readonly');
	pomBreakLongID.removeAttribute('readonly');
};