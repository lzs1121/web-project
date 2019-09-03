export default function scrollSpy() {
	const navbar = document.getElementById('navbar--sticky');
	let sticky;
	if(navbar) {
		sticky = navbar.offsetTop;
	}

	if(navbar) {
		if (window.pageYOffset >= sticky) {
			navbar.classList.add('sticky');
		}
		if (window.pageYOffset === 0) {
			navbar.classList.remove('sticky');
		}
	}
}