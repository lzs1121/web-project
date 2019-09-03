const inputTriggerLimit = 3;
let showEntryCount = 3;
let upDownCount = -1;
let itemLink = '';
let arrResults = [];
const screenWidth = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
let isInputFocused = false;

const setEntryCount = () => {
	if (screenWidth < 576) {
		showEntryCount = 3;
	} else if (screenWidth >= 576) {
		showEntryCount = 4;
	}
};
const handleKeyUp = (event) => {
	if (!isInputFocused) {
		showResults();
	}
	const keyPressed = event.which || event.keyCode;
	event.preventDefault();
	setEntryCount();
	setTimeout(filterFunction, 500);
	if (arrResults.length > 0) {
		switch (keyPressed) {
		case 38:
			if (upDownCount > -1)
			{ upDownCount--; }
			break;
		case 40:
			if (upDownCount < showEntryCount - 1)
			{ upDownCount++; }
			break;
		case 13:
			handleOnClick();
			upDownCount = -1;
			break;
		default:
			upDownCount = -1;
		}
		if (upDownCount >= 0)
		{ itemLink = arrResults[upDownCount]; }
		else
		{ itemLink = ''; }
	} else {
		if (keyPressed === 13)
		{ handleOnClick(); }
	}
	for (let i = 0; i < arrResults.length; i++) {
		if (i === upDownCount)
		{ addClass(arrResults[i], 'selected'); }
		else
		{ removeClass(arrResults[i], 'selected'); }
	}
};

function handleMouseOver(entry) {
	const listItem = document.getElementById('result-dropdown').getElementsByTagName('a');
	for (let i = 0; i < listItem.length; i++) {
		removeClass(listItem[i], 'selected');
	}
	addClass(entry, 'selected');
}

function handleMouseOut(entry) {
	removeClass(entry, 'selected');
}

function filterFunction() {
	let input, inputText, count;
	const listItem = document.getElementById('result-dropdown').getElementsByTagName('a');
	input = document.getElementById('search-input');
	inputText = input.value.toUpperCase();
	count = 0;
	const arr = [];
	if (input.value.length < inputTriggerLimit) {
		hideContent(0);
	}
	else {
		for (let i = 0; i < listItem.length; i++) {
			if (listItem[i].innerHTML.toUpperCase().indexOf(inputText) > -1) {
				if (count++ < showEntryCount) {
					arr.push(listItem[i]);
					listItem[i].style.display = 'block';
				}
				else
				{ listItem[i].style.display = 'none'; }
			} else {
				listItem[i].style.display = 'none';
			}
		}
	}
	arrResults = arr;
}

const hideContent = (count) => {
	let showCount = showEntryCount;
	const itemList = document.getElementById('result-dropdown').getElementsByTagName('a');
	if (count !== undefined)
	{ showCount = count; }
	if (itemList.length > showCount) {
		for (let i = showCount; i < itemList.length; i++) {
			itemList[i].style.display = 'none';
		}
	}
};

const showResults = () => {
	const resultsMenu = document.getElementById('result-dropdown');
	setEntryCount();
	addClass(resultsMenu, 'search-result-dropdown--visible');
	hideContent(0);
	isInputFocused = true;
};

const removeResults = () => {
	const input = document.getElementById('search-input');
	input.value = '';
	const resultsMenu = document.getElementById('result-dropdown');
	removeClass(resultsMenu, 'search-result-dropdown--visible');
	isInputFocused = false;
};

const hasClass = (el, className) => {
	if (el.classList)
	{ return el.classList.contains(className); }
	return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

const addClass = (el, className) => {
	if (!hasClass(el, className)) {
		if (el.classList) {
			el.classList.toggle(className);
		}
		else if (!hasClass(el, className)) {
			el.className += ' ' + className;
		}
	}
};

const removeClass = (el, className) => {
	if (el.classList) {
		el.classList.remove(className);
	}
	else if (hasClass(el, className)) {
		const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ');
	}
};

const handleOnClick = () => {
	const currentURL = location.href;
	const tempURL = currentURL.substr(currentURL.length - 1, 1) !== '/' ?
		currentURL + '/' : currentURL;
	const resultURL = tempURL + 'results?keywords=' + document.getElementById('search-input').value.toUpperCase();
	if (itemLink === '') {
		if (arrResults.length > 0)
		{ window.open(resultURL, '_blank'); }
		else {
			alert('没有找到合适的内容，请重新输入。');
		}
	} else
	{ window.open(itemLink, '_blank'); }
};