let themeBtn;
let body;
let header;
let headerShadow;
let charLimitCheck;
let charLimitInput;
let textInput;
let textInputError;
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
};

const prepareDOMEvents = () => {
	themeBtn.addEventListener('click', handleThemeBtn);
	window.addEventListener('scroll', showHeaderShadow);
	charLimitCheck.addEventListener('click', showCharLimit);
	charLimitInput.addEventListener('keyup', debounce(getCharLimit, 100));
	textInput.addEventListener('keyup', debounce(charLimitError, 100));
	charLimitInput.addEventListener('keyup', charLimitError);
	charLimitCheck.addEventListener('click', charLimitError);
};

const restoreData = () => {
	restoreTheme();
	restoreCharLimit();
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

const charLimitError = () => {
	if (!charLimitCheck.checked) {
		textInputError.classList.add('hidden');
		return;
	} else {
		if (textInput.value.length > charLimitInput.value) {
			textInputError.classList.remove('hidden');
		} else {
			textInputError.classList.add('hidden');
		}
	}
};

document.addEventListener('DOMContentLoaded', main);
