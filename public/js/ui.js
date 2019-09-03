// require('./jquery/jquery-3.3.1.slim.min.js');
import scrollSpy from './scrollSpy';
import nav from './nav';

window.onscroll = function() { scrollSpy(); };
nav();

if(typeof $ !== undefined) {
	$('#policy-list li a').click(function() {
		$('.active').toggleClass('active');
	});
}