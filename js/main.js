const DOM = {
	body: null,
	themeBtn: null,
	header: null,
	headerShadow: null,
	charLimitCheck: null,
	charLimitInput: null,
	textInput: null,
	textInputError: null,
	excludeSpacesCheck: null,
	textInputErrorChars: null,
	charCountText: null,
	wordCountText: null,
	sentenceCountText: null,
	readingTimeText: null,
	letterList: null,
	letterListMsg: null,
	letterBtn: null,
	letterBtnMore: null,
	letterBtnLess: null,
	letterBtnIcon: null,
};

let currentCharLimit = 300;
let charCount = 0;
let wordCount = 0;
let sentenceCount = 0;
let readingTime = 0;
let letterCounts = {};
let sortedLetterCounts = [];

// storage keys
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
	DOM.body = document.body;
	DOM.themeBtn = document.querySelector('.theme-btn-switch');
	DOM.header = document.querySelector('.header');
	DOM.headerShadow = document.querySelector('.header--shadow');
	DOM.charLimitCheck = document.querySelector('.char-limit');
	DOM.charLimitInput = document.querySelector('.char-limit-input');
	DOM.textInput = document.querySelector('.main__text-input');
	DOM.textInputError = document.querySelector('.main__error-msg');
	DOM.excludeSpacesCheck = document.querySelector('.exclude-spaces');
	DOM.textInputErrorChars = document.querySelector('.error-limit');
	DOM.charCountText = document.querySelector('.char-count');
	DOM.wordCountText = document.querySelector('.word-count');
	DOM.sentenceCountText = document.querySelector('.sentence-count');
	DOM.readingTimeText = document.querySelector('.reading-time');
	DOM.letterList = document.querySelector('.stats__list');
	DOM.letterListMsg = document.querySelector('.stats__msg');
	DOM.letterBtn = document.querySelector('.stats__btn');
	DOM.letterBtnMore = document.querySelector('.stats__btn--more');
	DOM.letterBtnLess = document.querySelector('.stats__btn--less');
	DOM.letterBtnIcon = document.querySelector('.stats__btn-icon');
};

const prepareDOMEvents = () => {
	DOM.themeBtn.addEventListener('click', handleThemeBtn);
	window.addEventListener('scroll', showHeaderShadow);
	DOM.charLimitCheck.addEventListener('click', showCharLimit);
	DOM.charLimitInput.addEventListener('blur', charLimitAutoFill);
	DOM.charLimitInput.addEventListener('blur', charLimitError);
	DOM.charLimitInput.addEventListener(
		'keydown',
		handleKeys(['Enter'], () => {
			charLimitAutoFill();
			charLimitError();
		})
	);
	DOM.textInput.addEventListener('keyup', debounce(updateAllCounters, 150));
	DOM.charLimitCheck.addEventListener('click', charLimitError);
	DOM.excludeSpacesCheck.addEventListener('click', updateAllCounters);
	DOM.letterBtn.addEventListener('click', handleLetterBtn);
};

const updateAllCounters = () => {
	charCounter();
	wordCounter();
	sentenceCounter();
	readingTimeCounter();
	assignValues();
	charLimitError();
	letterCounter();
	letterDensity();
};

const restoreData = () => {
	restoreTheme();
};

// utils;
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

// show header shadow
const showHeaderShadow = () => {
	if (window.pageYOffset > 20) {
		DOM.headerShadow.classList.remove('invisible');
	} else {
		DOM.headerShadow.classList.add('invisible');
	}
};
// color theme
const setTheme = (theme) => {
	DOM.body.classList.remove('theme-light', 'theme-dark');
	DOM.body.classList.add(`theme-${theme}`);
	localStorage.setItem(STORAGE_KEYS.theme, theme);
};
const handleThemeBtn = () => {
	const currentTheme = DOM.body.classList.contains('theme-dark')
		? 'dark'
		: 'light';
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
};

// show char limit
const showCharLimit = () => {
	if (DOM.charLimitCheck.checked) {
		DOM.charLimitInput.classList.remove('main__options-input--hidden');
	} else {
		DOM.charLimitInput.classList.add('main__options-input--hidden');
	}
};

// counters
const charCounter = () => {
	let text = DOM.textInput.value.replaceAll('\n', '');
	if (DOM.excludeSpacesCheck.checked) {
		let trimmedText = text.replaceAll(' ', '');
		charCount = trimmedText.length;
	} else {
		charCount = text.length;
	}
};

const wordCounter = () => {
	let text = DOM.textInput.value.replaceAll('\n', ' ');
	let words = [];
	words = text.match(/\p{L}+/gu) || [];
	wordCount = words.length;
};

const sentenceCounter = () => {
	let text = DOM.textInput.value.replaceAll('"', '').trim();
	let sentences = [];
	sentences = text
		.split(/[.!?]/)
		.map((s) => s.trim())
		.filter(Boolean);
	sentenceCount = sentences.length;
};

const readingTimeCounter = () => {
	readingTime = Math.round(wordCount / 200);
	if (readingTime < 1) {
		readingTime = '<1';
	}
};

const letterCounter = () => {
	letterCounts = {};
	sortedLetterCounts = [];
	let letters = DOM.textInput.value.replace(/[^\p{L}]/gu, '').toUpperCase();

	for (let letter of letters) {
		letterCounts[letter] = (letterCounts[letter] || 0) + 1;
	}
	let resultArray = Object.entries(letterCounts).map(([char, count]) => {
		return { char, count };
	});

	sortedLetterCounts = resultArray.sort((a, b) => {
		if (b.count !== a.count) {
			return b.count - a.count;
		}
		return a.char.localeCompare(b.char);
	});
};

const letterDensity = () => {
	let letterSum = 0;
	DOM.letterList.innerHTML = '';
	letterSum = sortedLetterCounts.reduce((acc, obj) => acc + obj.count, 0);
	if (letterSum === 0) {
		DOM.letterListMsg.classList.remove('hidden');
	} else {
		DOM.letterListMsg.classList.add('hidden');
	}

	for (let o of sortedLetterCounts) {
		let letter = o.char;
		let count = o.count;
		let percent = ((count / letterSum) * 100).toFixed(2);
		const secondPContent = `${count} (${percent})%`;
		let li = document.createElement('li');
		let firstP = document.createElement('p');
		let bar = document.createElement('div');
		let barResult = document.createElement('div');
		let secondP = document.createElement('p');
		li.classList.add('stats__list-item');
		firstP.classList.add('stats__list-letter');
		bar.classList.add('stats__list-bar');
		barResult.classList.add('stats__list-bar-result');
		secondP.classList.add('stats__list-amount');
		DOM.letterList.appendChild(li);
		li.appendChild(firstP);
		bar.appendChild(barResult);
		li.appendChild(bar);
		li.appendChild(secondP);
		firstP.textContent = letter;
		secondP.textContent = secondPContent;
		barResult.style.width = `${percent}%`;
	}
	if (sortedLetterCounts.length > 4) {
		DOM.letterBtn.classList.remove('hidden');
	} else {
		DOM.letterBtn.classList.add('hidden');
		DOM.letterList.classList.remove('stats__list--expanded');
		DOM.letterBtnLess.classList.add('hidden');
		DOM.letterBtnMore.classList.remove('hidden');
	}
};

// button handlers
const handleLetterBtn = () => {
	if (DOM.letterList.classList.contains('stats__list--expanded')) {
		DOM.letterList.classList.remove('stats__list--expanded');
		DOM.letterBtnLess.classList.add('hidden');
		DOM.letterBtnMore.classList.remove('hidden');
		DOM.letterBtnIcon.classList.remove('stats__btn-icon--rotated');
	} else {
		DOM.letterList.classList.add('stats__list--expanded');
		DOM.letterBtnLess.classList.remove('hidden');
		DOM.letterBtnMore.classList.add('hidden');
		DOM.letterBtnIcon.classList.add('stats__btn-icon--rotated');
		DOM.letterBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}
};

const charLimitAutoFill = () => {
	let value = Math.abs(parseInt(DOM.charLimitInput.value.trim())) || 300;
	currentCharLimit = value;
	DOM.charLimitInput.value = value;
};

// errors
const charLimitError = () => {
	if (!DOM.charLimitCheck.checked) {
		DOM.textInputError.classList.add('hidden');
		DOM.textInput.classList.remove('main__text-input--error');
		return;
	} else {
		if (charCount > currentCharLimit) {
			DOM.textInputError.classList.remove('hidden');
			DOM.textInput.classList.add('main__text-input--error');
			DOM.textInputErrorChars.textContent = currentCharLimit;
		} else {
			DOM.textInputError.classList.add('hidden');
			DOM.textInput.classList.remove('main__text-input--error');
		}
	}
};

// assign values
const assignValues = () => {
	DOM.charCountText.textContent = charCount || 0;
	DOM.wordCountText.textContent = wordCount || 0;
	DOM.sentenceCountText.textContent = sentenceCount || 0;
	DOM.readingTimeText.textContent = readingTime;
};

document.addEventListener('DOMContentLoaded', main);
