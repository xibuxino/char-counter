let themeBtn;
let body;
let header;
let headerShadow;
let charLimitCheck;
let charLimitInput;

// storage
const STORAGE_KEYS = {
	theme: 'theme',
	isCharLimit: 'isCharLimit',
};
const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
const charLimitState = localStorage.getItem(STORAGE_KEYS.isCharLimit);

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
};

const prepareDOMEvents = () => {
	themeBtn.addEventListener('click', handleThemeBtn);
	window.addEventListener('scroll', showHeaderShadow);
	charLimitCheck.addEventListener('click', showCharLimit);
};

const restoreData = () => {
	restoreTheme();
	restoreCharLimit();
};

// restore data
const restoreTheme = () => {
	if (savedTheme) {
		setTheme(savedTheme);
	} else {
		setTheme('dark');
	}
};

const restoreCharLimit = () => {
	if (charLimitState === 'true') {
		charLimitCheck.checked = true;
		charLimitInput.classList.remove('main__options-input--hidden');
	} else {
		charLimitCheck.checked = false;
		charLimitInput.classList.add('main__options-input--hidden');
	}
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

document.addEventListener('DOMContentLoaded', main);
