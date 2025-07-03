let themeBtn;
let body;
let header;
let headerShadow;
let charLimitCheck;
let excludeSpacesCheck;
let charLimitInput;
let textInput;
let textInputError;
let textInputErrorChars;
let readingTimeText;
let currentCharLimit = 300;
let charCount = 0;
let wordCount = 0;
let sentenceCount = 0;
let readingTime = 0;
let charCountText;
let wordCountText;
let sentenceCountText;

let statsList;
// storage
const STORAGE_KEYS = {
	theme: 'theme',
};
const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);

// prepare DOM and restore data
const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
	restoreData();
};

const prepareDOMElements = () => {
	body = document.body;
	themeBtn = document.querySelector('.theme-btn-switch');
	header = document.querySelector('.header');
	headerShadow = document.querySelector('.header--shadow');
	charLimitCheck = document.querySelector('.char-limit');
	charLimitInput = document.querySelector('.char-limit-input');
	textInput = document.querySelector('.main__text-input');
	textInputError = document.querySelector('.main__error-msg');
	excludeSpacesCheck = document.querySelector('.exclude-spaces');
	textInputErrorChars = document.querySelector('.error-limit');
	charCountText = document.querySelector('.char-count');
	wordCountText = document.querySelector('.word-count');
	sentenceCountText = document.querySelector('.sentence-count');
	readingTimeText = document.querySelector('.reading-time');
	statsList = document.querySelector('.stats__list');
};

const prepareDOMEvents = () => {
	themeBtn.addEventListener('click', handleThemeBtn);
	window.addEventListener('scroll', showHeaderShadow);
	charLimitCheck.addEventListener('click', showCharLimit);
	charLimitInput.addEventListener('blur', charLimitAutoFill);
	charLimitInput.addEventListener('blur', charLimitError);
	charLimitInput.addEventListener(
		'keydown',
		handleKeys(['Enter'], charLimitAutoFill)
	);
	charLimitInput.addEventListener(
		'keydown',
		handleKeys(['Enter'], charLimitError)
	);

	charLimitCheck.addEventListener('click', charLimitError);
	textInput.addEventListener('keyup', updateAllCounters);
	// textInput.addEventListener('keydown', updateAllCounters);
	excludeSpacesCheck.addEventListener('click', updateAllCounters);
};
const updateAllCounters = () => {
	charCounter();
	wordCounter();
	sentenceCounter();
	readingTimeCounter();
	assignValues();
	charLimitError();
};

const restoreData = () => {
	restoreTheme();
};
// utils
function debounce(fn, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), delay);
	};
}

function handleKeys(targetKeys, callback) {
	return function (e) {
		if (targetKeys.includes(e.key)) {
			callback();
		}
	};
}

// restore data
const restoreTheme = () => {
	if (savedTheme) {
		setTheme(savedTheme);
		return;
	}
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	setTheme(prefersDark ? 'dark' : 'light');
};

// header shadow
const showHeaderShadow = () => {
	if (window.pageYOffset > 20) {
		headerShadow.classList.remove('invisible');
	} else {
		headerShadow.classList.add('invisible');
	}
};
// color theme
const setTheme = (theme) => {
	body.classList.remove('theme-light', 'theme-dark');
	body.classList.add(`theme-${theme}`);
	localStorage.setItem(STORAGE_KEYS.theme, theme);
};
const handleThemeBtn = () => {
	const currentTheme = body.classList.contains('theme-dark') ? 'dark' : 'light';
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
};

// char limit
const showCharLimit = () => {
	if (charLimitCheck.checked) {
		charLimitInput.classList.remove('main__options-input--hidden');
	} else {
		charLimitInput.classList.add('main__options-input--hidden');
	}
};

// counters

const charCounter = () => {
	let text = textInput.value.replaceAll('\n', '');
	if (excludeSpacesCheck.checked) {
		let trimmedText = text.replaceAll(' ', '');
		charCount = trimmedText.length;
	} else {
		charCount = text.length;
	}
};

const wordCounter = () => {
	let text = textInput.value.replaceAll('\n', ' ');
	let words = [];
	words = text.split(' ').filter(Boolean);
	wordCount = words.length;
};

const sentenceCounter = () => {
	let text = textInput.value.replaceAll('"', '').trim();
	let sentences = [];
	sentences = text.split(/[.!?]/).filter(Boolean);
	sentenceCount = sentences.length;
};

const readingTimeCounter = () => {
	readingTime = Math.round(wordCount / 200);
	if (readingTime < 1) {
		readingTime = '<1';
	}
};
const charLimitError = () => {
	if (!charLimitCheck.checked) {
		textInputError.classList.add('hidden');
		textInput.classList.remove('main__text-input--error');
		return;
	} else {
		if (charCount > currentCharLimit) {
			textInputError.classList.remove('hidden');
			textInput.classList.add('main__text-input--error');
			textInputErrorChars.textContent = currentCharLimit;
		} else {
			textInputError.classList.add('hidden');
			textInput.classList.remove('main__text-input--error');
		}
	}
};

const charLimitAutoFill = () => {
	let value = charLimitInput.value.trim();

	if (value === '') {
		currentCharLimit = 300;
		charLimitInput.value = 300;
		return;
	}
	value = parseInt(value);
	if (isNaN(value) || value <= 0) {
		currentCharLimit = 300;
		charLimitInput.value = 300;
	} else {
		currentCharLimit = value;
		charLimitInput.value = value;
	}
};
// assign box data

const assignValues = () => {
	charCountText.textContent = charCount || 0;
	wordCountText.textContent = wordCount || 0;
	sentenceCountText.textContent = sentenceCount || 0;
	readingTimeText.textContent = readingTime;
};
document.addEventListener('DOMContentLoaded', main);
