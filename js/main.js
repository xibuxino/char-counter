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
let charCount = 0;
let wordCount = 0;
let sentenceCount = 0;
// storage
const STORAGE_KEYS = {
	theme: 'theme',
	isCharLimit: 'isCharLimit',
	charLimit: 'charLimit',
};
const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
const charLimitState = localStorage.getItem(STORAGE_KEYS.isCharLimit);
const charLimitValue = localStorage.getItem(STORAGE_KEYS.charLimit);

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
};

const prepareDOMEvents = () => {
	themeBtn.addEventListener('click', handleThemeBtn);
	window.addEventListener('scroll', showHeaderShadow);
	charLimitCheck.addEventListener('click', showCharLimit);
	charLimitInput.addEventListener('keyup', debounce(getCharLimit, 100));
	textInput.addEventListener('keyup', () => charCounter(textInput));
	excludeSpacesCheck.addEventListener('click', () => charCounter(textInput));
	textInput.addEventListener('keyup', debounce(charLimitError, 100));
	charLimitInput.addEventListener('keyup', charLimitError);
	charLimitCheck.addEventListener('click', charLimitError);
	excludeSpacesCheck.addEventListener('click', charLimitError);
};

const restoreData = () => {
	restoreTheme();
	// restoreCharLimit();
};
// utils
function debounce(fn, delay) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => fn.apply(this, args), delay);
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

const restoreCharLimit = () => {
	if (charLimitState === 'true') {
		charLimitCheck.checked = true;
		charLimitInput.classList.remove('main__options-input--hidden');
	} else {
		charLimitCheck.checked = false;
		charLimitInput.classList.add('main__options-input--hidden');
	}
	charLimitInput.value = localStorage.getItem(STORAGE_KEYS.charLimit);
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
		localStorage.setItem(STORAGE_KEYS.isCharLimit, 'true');
	} else {
		charLimitInput.classList.add('main__options-input--hidden');
		localStorage.setItem(STORAGE_KEYS.isCharLimit, 'false');
	}
};

const getCharLimit = () => {
	const defaultCharLimit = 300;
	if (!charLimitInput.value) {
		localStorage.setItem(STORAGE_KEYS.charLimit, defaultCharLimit);
	} else {
		localStorage.setItem(STORAGE_KEYS.charLimit, charLimitInput.value);
	}
	console.log(localStorage.getItem(STORAGE_KEYS.charLimit));
};

const charCounter = (input) => {
	let text = input.value;
	if (excludeSpacesCheck.checked) {
		let trimmedText = text.replaceAll(' ', '');
		charCount = trimmedText.length;
	} else {
		charCount = text.length;
	}
};
const charLimitError = () => {
	if (!charLimitCheck.checked) {
		textInputError.classList.add('hidden');
		textInput.classList.remove('main__text-input--error');
		return;
	} else {
		if (charCount > charLimitInput.value) {
			textInputError.classList.remove('hidden');
			textInput.classList.add('main__text-input--error');
			textInputErrorChars.textContent = charLimitInput.value;
		} else {
			textInputError.classList.add('hidden');
			textInput.classList.remove('main__text-input--error');
		}
	}
};

document.addEventListener('DOMContentLoaded', main);
