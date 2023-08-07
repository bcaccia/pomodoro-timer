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
		timerDisplay.textContent = pomSessionState().toString().padStart(2, '0') + ':00';
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
	if (pomSessionStateCounter === 7 ||
		pomSessionStateCounter === 5 ||
		pomSessionStateCounter === 3 ||
		pomSessionStateCounter === 1
		) {
			changeBGColor(pomColor);
			return pomTime.value;
	} else if (pomSessionStateCounter === 0) {
		pomSessionStateCounter = 7;
		changeBGColor(pomColor);
		return pomBreakLong.value;
	} else {
		changeBGColor(breakColor);
		return pomBreakShort.value;
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
		// TODO: how to get seconds to remain 2 digits
		// implement if statement for single digit numbers vs 2
		let counterDisplay = remainingTimeMins.toString().padStart(2, '0') + ":" + remainingTimeSecs.toString().padStart(2, '0');
		
		// This statment ensures that on start of countdown the first update is skipped
		// so the user doesn't see 24:60
		if (remainingTimeSecs === 60) {
			
		} else {
			timerDisplay.textContent = counterDisplay;
			document.title = counterDisplay;
		}
		remainingTimeSecs--;
	if (remainingTimeMins < 0) {
		clearInterval(intervalId);
		pomsCompleted++;
		pomSessionStateCounter--;
		updateStats();
		playBell();
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

	if (pomSessionStateCounter === 6 ||
		pomSessionStateCounter === 4 ||
		pomSessionStateCounter === 2
		) {
		timerDisplay.textContent = pomBreakShort.value.toString().padStart(2, '0') + ':00';
		document.title = pomBreakShort.value.toString().padStart(2, '0') + ':00';
		changeBGColor(breakColor);
		pomsSkipped++;
	} else if (pomSessionStateCounter === 0) {
		timerDisplay.textContent = pomBreakLong.value.toString().padStart(2, '0') + ':00';
		document.title = pomBreakLong.value.toString().padStart(2, '0') + ':00';
		breaksLongSkipped++;
		changeBGColor(breakColor);
		pomSessionStateCounter = 8;
	} else {
		timerDisplay.textContent = pomTime.value.toString().padStart(2, '0') + ':00';
		document.title = pomTime.value.toString().padStart(2, '0') + ':00';
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
	timerDisplay.textContent = pomTime.value + ':00';
	document.title = pomTime.value + ':00';
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

function playClick () {
	let click = new Audio('/audio/click.mp3');
	click.play();
};

function playBell () {
	let bell = new Audio('/audio/bell.mp3');
	bell.play();
};