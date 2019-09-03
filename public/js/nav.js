export default function() {
	// Nav
	// ------------------------------
	$('#site-nav-toggle').click(function () {
		$(this).toggleClass('open');
		$('#site-nav').toggleClass('open');
		$('body').toggleClass('no-touch-scrolling');

		// Disable hardware scrolling on mobile
		if ($('body').is('.no-touch-scrolling')) {
			document.ontouchmove = function(e) { e.preventDefault(); };
		} else {
			document.ontouchmove = function() { return true; };
		}
	});


	// UI Reveal
	// ------------------------------

	$('.ui-reveal__trigger').click( function() {
		const container = $(this).closest('.ui-reveal');

		container.addClass('is-revealed');

		//- click ensures browse is envoked on file fields
		container.find('input[type!=hidden],textarea').eq(0).click().focus();
	});

	$('.ui-reveal__hide').click( function() {
		const container = $(this).closest('.ui-reveal');

		container.removeClass('is-revealed');
	});

	// Clean up URL if signed in via Facebook, see - https://github.com/jaredhanson/passport-facebook/issues/12
	if (window.location.hash && window.location.hash === '#_=_') {

		if (window.history && history.pushState) {
			window.history.pushState('', document.title, window.location.pathname);
		} else {
			const scroll = {
				top: document.body.scrollTop,
				left: document.body.scrollLeft
			};
			window.location.hash = '';
			document.body.scrollTop = scroll.top;
			document.body.scrollLeft = scroll.left;
		}
	}
	$('.consulting-modal-btn').on('click', function() {
		$('#consultingInfoModal').modal('show');
	});
}
