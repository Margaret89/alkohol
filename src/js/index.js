import {$, Swiper, Navigation, Pagination, Mousewheel, EffectFade, Fancybox, Inputmask} from './common';

// $(window).scroll(function(){
// 	if($(this).scrollTop()>300){
// 		$('.js-move-up').addClass('visible');
// 	}else{
// 		$('.js-move-up').removeClass('visible');
// 	}
// });
// $('.js-move-up').click(function(){$('body,html').animate({scrollTop:0},800);return false;});

$(function(){ 
	if($('.js-history-animate').length){
		let beginAnimHist = $('.js-history-animate').offset().top;
		let heightAnimHistory = $('.js-history').outerHeight(false);
		let finishAnimHist = beginAnimHist + heightAnimHistory;
		let opacityMap = 0;
		let topMapBegin = parseInt($('.js-history-animate-map-wrap').css('top').replace('px',''));
		let scrollMapBegin = beginAnimHist + topMapBegin;
		let scrollMapFinish = finishAnimHist - $('.js-history-animate-map-wrap').outerHeight();
		let scrollMap = 0;
		let scalePattern = 0;
		let scrollHistoryVal = 0;

		$(window).on('scroll', function(){
			scrollHistoryVal = $(this).scrollTop();

			//Анимация карты
			if(scrollHistoryVal <= scrollMapBegin){
				$('.js-history-animate-map-color').css('opacity', '0');
				$('.js-history-animate-map-wrap').css('top', topMapBegin);
				$('.js-history-animate-pattern').css('transform', 'translateX(-50%) translateY(-50%) scale(0)');
				$('.js-history-animate-compas').css('opacity', '0');
			}else if(scrollHistoryVal > scrollMapBegin  && scrollHistoryVal < scrollMapFinish){
				opacityMap = scrollHistoryVal * 1 / (scrollMapFinish - scrollMapBegin);
				scrollMap = scrollHistoryVal - (scrollMapBegin - beginAnimHist);
				scalePattern = scrollHistoryVal * 1 / (scrollMapFinish - scrollMapBegin);

				if(scalePattern > 1){
					scalePattern = 1;
				}

				$('.js-history-animate-map-color').css('opacity', opacityMap);
				$('.js-history-animate-map-wrap').css('top', scrollMap);
				$('.js-history-animate-pattern').css('transform', 'translateX(-50%) translateY(-50%) scale('+scalePattern+')');
				$('.js-history-animate-compas').css('opacity', opacityMap);
			}

			//Анимация стакана
			let rotateGlass = 0;
			let scaleGlass = 1;

			if(scrollHistoryVal > 0  && scrollHistoryVal < finishAnimHist/2){
				rotateGlass = scrollHistoryVal * 60 / ((finishAnimHist - beginAnimHist) / 2);
				scaleGlass = 1 + (scrollHistoryVal * 0.05 / ((finishAnimHist - beginAnimHist) / 2));

				$('.js-history-animate-glass').css('transform', 'rotate('+rotateGlass+'deg) scale('+scaleGlass+')');
			}

			//Анимация пути
			let countLines = $('.js-path-line-item').length;//Получаем количество пунктиров
			let intervalPath = (scrollMapFinish - 100 - scrollMapFinish/2) / countLines;//Получаем интервал, через который будет появляться следующая линия
			let arrOpacityLines = [];//Массив для хранения прозрачности пунктиров

			for (let index = 0; index < countLines; index++) {//Получаем прозрачность для каждого пунктира
				arrOpacityLines.push(index/countLines);
			}

			if(scrollHistoryVal > scrollMapFinish/2  && scrollHistoryVal < scrollMapFinish-100){
				let curPath = scrollHistoryVal - scrollMapFinish/2;
				let curCountLines = 0;

				$('.js-path-line-item').css('opacity','0');//Скрываем все пунктиры
				curCountLines = Math.round(curPath/intervalPath);//Вычисляем текущие пунктиры
				
				for (let index = 0; index < curCountLines; index++) {//Показываем пунктиры в соответствии с прозрачностью
					$('.js-path-line-item:nth-child('+index+')').css('opacity', arrOpacityLines[index]);

					if(index > countLines - 5){
						$('.js-history-path-anchor').addClass('active');
					}else{
						$('.js-history-path-anchor').removeClass('active');
					}
				}
			}
		});
	}

	//Слайдер галерет картинок
	if($('.js-gallery-slider').length){
		var gallerySlider = new Swiper('.js-gallery-slider', {
			loop: false,
			spaceBetween: 40,
			slidesPerView: 3.4,
			modules: [Navigation, Pagination],
			navigation: {
				nextEl: '.js-gallery-slider-next',
				prevEl: '.js-gallery-slider-prev',
			},
		});
	}

	//Слайдер каталога
	if($('.js-catalog-slider').length){
		let catalogSlider = {};

		$('.js-catalog-slider').each(function(index) {//Задаем множественные слайдеры каталога
			let swiperSliderId = $(this).data('id');

			catalogSlider[index] = new Swiper('.js-catalog-slider[data-id="'+swiperSliderId+'"]', {
				slidesPerView: 1,
				spaceBetween: 30,
				loop: true,
				modules: [Mousewheel, EffectFade],
				mousewheel: true,
				fadeEffect: { crossFade: true },
				effect: 'fade',
				on: {
					slideChange: function (elem) {
						//Задаем активный пункт в крошках
						var activeIndex = this.realIndex;
						var $parentBlock = $('.js-catalog-slider[data-id="'+swiperSliderId+'"]').closest('.js-catalog-slider-wrap');

						$parentBlock.find('.js-crumb-slider-item').removeClass('active');
						$parentBlock.find('.js-crumb-slider-item[data-slide="'+activeIndex+'"]').addClass('active');
					},
				},
			});

		});

		//Переключаем слайдер при клике по крошкам
		$('.js-crumb-slider-item').on('click', function(){
			var $parentBlock = $(this).closest('.js-catalog-slider-wrap');
			var $idBlock = $parentBlock.find('.js-catalog-slider').data('id');

			$parentBlock.find('.js-crumb-slider-item').removeClass('active');
			$(this).addClass('active');

			catalogSlider[$idBlock].update();
			catalogSlider[$idBlock].slideToLoop($(this).data('slide'),0,false);
		});
	}

	//Переключение брендов
	if($('.js-choose-brand-item').length){
		//Клик по иконкам брендов
		$('.js-choose-brand-item').on('click', function(){
			chooseBrand($(this).data('choose'));
		});

		//Клик по стрелкам
		$('.js-choose-brand-arr-next').on('click', function(){
			let curBrand = $('.js-choose-brand-item.active').data('choose');
			curBrand++;

			chooseBrand(curBrand);
		});

		$('.js-choose-brand-arr-prev').on('click', function(){
			let curBrand = $('.js-choose-brand-item.active').data('choose');
			curBrand--;

			chooseBrand(curBrand);
		});

		function chooseBrand(num) {
			//Активируем иконку бренда
			$('.js-choose-brand-item').removeClass('active');
			$('.js-choose-brand-item[data-choose="'+num+'"]').addClass('active');
			
			//Активируем иконку страны
			$('.js-bottle-info-item').removeClass('active')
			$('.js-bottle-info-item[data-choose="'+num+'"]').addClass('active');

			//Деавтивируем стрелки
			$('.js-choose-brand-arr-prev').removeClass('disable');
			$('.js-choose-brand-arr-next').removeClass('disable');

			if(num == 1){
				$('.js-choose-brand-arr-prev').addClass('disable');
			}

			if(num == $('.js-choose-brand-item').length){
				$('.js-choose-brand-arr-next').addClass('disable');
			}
		}
	}

	// Табуляция
	if ($('.js-tabs-page').length) {
		$('.js-tabs-page-list').each(function(){
			$(this).find('.js-tabs-page-item:first').addClass("active");
		});

		$('.js-tabs-page-content').each(function(){
			$(this).find('.js-tabs-page-content-item:first').fadeIn();
		});

		$('.js-tabs-page-item').on('click',function(e) {
			e.preventDefault();
			var $parent = $(this).parents('.js-tabs-page');

			$parent.find('.js-tabs-page-content-item').hide();
			$parent.find('.js-tabs-page-item').removeClass('active');

			$(this).addClass("active");
			$parent.find('#' + $(this).attr('data-item')).fadeIn();
		});
	}

	if($('#age-gate').length){
		//После загрузки страницы открываем окно с проверкой возраста
		Fancybox.show([{ 
			src: "#age-gate", 
			type: "inline",
			closeButton: false,
			dragToClose: false,
			wheel: false,
			keyboard: false,
			backdropClick: false,
			contentClick: false,
			click: (fancybox, slide) => {
				// Fancybox.close();
			},
		}]);
	
		// Маска для телефона
		Inputmask("datetime", {
			inputFormat: "dd.mm.yyyy",
			placeholder: "_",
			leapday: "-02-29",
			alias: "tt.mm.jjjj"
		}).mask(".js-input-age");

		//Функция подсчета лет
		function calculateAge (birthDate, otherDate) {
			birthDate = new Date(birthDate);
			otherDate = new Date(otherDate);
			var years = (otherDate.getFullYear() - birthDate.getFullYear());
			if (otherDate.getMonth() < birthDate.getMonth() ||
				otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
				years--;
			}
			return years;
		}

		//Получаем текущую дату
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = mm + '/' + dd + '/' + yyyy;

		var age = 0;


		//Проврка возраста, если поле уже заполнено после загрузки страницы
		checkAge($('.js-input-age').val());

		//Функция проверки заполнения поля и его валидация
		function checkAge(val) {
			if(val.includes("_") != true && val!=''){
				let arrValDate = [];

				arrValDate = val.split('.');
				age = calculateAge(arrValDate[1]+'/'+arrValDate[0]+'/'+arrValDate[2], today);

				if(age < 18){
					$('.js-input-age').closest('.js-form-site-item').addClass('error');
					$('.js-submit-age').attr('disabled','disabled');
				}else{
					$('.js-submit-age').removeAttr('disabled');
				}
			}else{
				$('.js-input-age').closest('.js-form-site-item').removeClass('error');
				$('.js-submit-age').attr('disabled','disabled');
			}
		}

		//Закрываем попап при правильном заполнении возраста
		$('.js-submit-age').on('click', function(e){
			e.preventDefault();
			Fancybox.close();
		});

		
		//Проверка возраста при заполнении поля с клавиатуры
		$('.js-input-age').on('keyup', function(){
			checkAge($(this).val());
		});
	}
});