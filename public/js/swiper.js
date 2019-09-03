let swiperNumber;
const ww = $(window).width();
if(ww>468) {
	swiperNumber = 3;
}else{
	swiperNumber = 1;
}

if(typeof Swiper === 'function') {

	/* Site Swipers */
	const mySwiper = new Swiper('.swiper-container.post-slides', {
		parallax : true,
		autoplay: {
			delay: 5000
		},
		navigation: {
			nextEl: '.swiper-button-next.post-btn-right',
			prevEl: '.swiper-button-prev.post-btn-left'
		}
	});
	const swiperTutor = new Swiper('.swiper-container.tutor-slides', {
		loop: true,
		slidesPerView: 5,
		centeredSlides:true,
		effect: 'coverflow',
		coverflowEffect: {
			rotate: 0,
			stretch: 100,
			depth: 100,
			modifier: 1,
			slideShadows : false
		},
		navigation: {
			nextEl: '.swiper-button-next.tutor-btn-right',
			prevEl: '.swiper-button-prev.tutor-btn-left'
		}
	});

	const swiperTutorial = new Swiper('.swiper-container.tutorial-slides', {
		parallax : true,
		loop: true,
		autoplay: {
			delay: 3000,
			stopOnLast:false,
			disableOnInteraction: false
		},
		navigation: {
			nextEl: '.swiper-button-next.tutorial-btn-right',
			prevEl: '.swiper-button-prev.tutorial-btn-left'
		}
	});
}
