// Retrieve and store all DOM locators
const allInputFields = document.querySelectorAll("input")
const pomTime = document.querySelector("#pomTime");
const pomBreakShort = document.querySelector("#pomBreakShort");
const pomBreakLong = document.querySelector("#pomBreakLong");
const timerDisplay = document.querySelector('#timer')
const startPause = document.querySelector('#startPause');
const pomsCompletedID = document.querySelector('#pomsCompleted');
const pomsSkippedID = document.querySelector('#pomsSkipped');
const breaksShortSkippedID = document.querySelector('#breaksShortSkipped');
const breaksLongSkippedID = document.querySelector('#breaksLongSkipped');
const pomColor = "rgb(186, 73, 73)";
const breakColor = "rgb(57, 112, 151)";

// Set variables for tracking timer states
let intervalId;
let pomSessionStateCounter = 7;
let pomsCompleted = 0;
let pomsSkipped = 0;
let breaksShortSkipped = 0;
let breaksLongSkipped = 0;
let pauseState = false;
let remainingTimeSecs = 60;
let remainingTimeMins;


// Event listeners for changes to input fields
// These update the timer display accordingly
allInputFields.forEach(function(elem) {
	elem.addEventListener('input', function (event) {
		timerDisplay.textContent = pomSessionState().value.toString().padStart(2, '0') + ':00';
	});
});

/*
7. 25 min pomodoro
6. 5 min short break
5. 25 min pomodoro
4. 5 min short break
3. 25 min pomodoro
2. 5 min short break
1. 25 min pomodoro
0. 15 min long break
*/
function pomSessionState () {
	if (pomSessionStateCounter === 0) {
		pomSessionStateCounter = 7;
		changeBGColor(pomColor);
		return pomBreakLong;
	} else if ((pomSessionStateCounter % 2) === 0) {
		changeBGColor(breakColor);
		return pomBreakShort;
	} else {
		changeBGColor(pomColor);
		return pomTime;
	}
};

function buttonClick () {
	if (!pauseState) {
		startPomTimer (pomSessionState().value);
	} else {
		pausePomTimer()
	}
};

function startPomTimer (timeValue) {
	playClick();
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
		let counterDisplay = remainingTimeMins.toString().padStart(2, '0') + ":" + remainingTimeSecs.toString().padStart(2, '0');
		
		// This statment ensures that on start of countdown the first update is skipped
		// so the user doesn't see 24:60
		if (remainingTimeSecs !== 60) {
			document.title = counterDisplay;
			timerDisplay.textContent = counterDisplay;
		}
		remainingTimeSecs--;
		if (remainingTimeMins < 0) {
			playBell();
			pauseState = false;
			clearInterval(intervalId);
			pomsCompleted++;
			pomSessionStateCounter--;
			resetTimerDisplay(pomSessionState());
			startPause.textContent = 'Start Timer';
			document.title = 'Times Up!';
			updateStats();
			} else if (remainingTimeSecs < 0) {
				remainingTimeMins--;
				remainingTimeSecs = 60;
				startPause.textContent = 'Pause';
			}
		}, 1000);
	};

function pausePomTimer () {
	playClick();
	pauseState = false;
	clearInterval(intervalId);
	startPause.textContent = 'Resume';
};

function skipPom() {
	playClick();
	pauseState = false;
	unlockInputs();
	remainingTimeSecs = 60
	clearInterval(intervalId);
	startPause.textContent = 'Start';
	pomSessionStateCounter--;

	if (pomSessionStateCounter === 0) {
		resetTimerDisplay(pomBreakLong);
		breaksLongSkipped++;
		changeBGColor(breakColor);
		pomSessionStateCounter = 8;
	} else if ((pomSessionStateCounter % 2) === 0) {
		resetTimerDisplay(pomBreakShort);
		changeBGColor(breakColor);
		pomsSkipped++;
	} else {
		resetTimerDisplay(pomTime);
		changeBGColor(pomColor);
		breaksShortSkipped++;
	}
	updateStats();
	unlockInputs();
};

function resetSessions () {
	playClick();
	pauseState = false;
	clearInterval(intervalId);
	changeBGColor(pomColor);
	pomSessionStateCounter = 7;
	resetTimerDisplay(pomTime);
	startPause.textContent = 'Start';
	remainingTimeSecs = 60
	pomsCompleted = 0;
	pomsSkipped = 0;
	breaksShortSkipped = 0;
	breaksLongSkipped = 0;
	unlockInputs();
	updateStats();
};

function updateStats () {
	pomsCompletedID.textContent = pomsCompleted;
	pomsSkippedID.textContent = pomsSkipped;
	breaksShortSkippedID.textContent = breaksShortSkipped;
	breaksLongSkippedID.textContent = breaksLongSkipped;
};

function lockInputs () {
	pomTime.setAttribute('readonly', true);
	pomBreakShort.setAttribute('readonly', true);
	pomBreakLong.setAttribute('readonly', true);
};

function unlockInputs () {
	pomTime.removeAttribute('readonly');
	pomBreakShort.removeAttribute('readonly');
	pomBreakLong.removeAttribute('readonly');
};

function changeBGColor (color) {
	const bgColor = document.querySelector("body");
	bgColor.style.backgroundColor = color;
};

function resetTimerDisplay (timeValue) {
	document.title = timeValue.value.toString().padStart(2, '0') + ':00';
	timerDisplay.textContent = timeValue.value.toString().padStart(2, '0') + ':00';
};

function playClick () {
	let click = new Audio('/audio/click.mp3');
	click.play();
};

function playBell () {
	let bell = new Audio('/audio/bell.mp3');
	bell.play();
};