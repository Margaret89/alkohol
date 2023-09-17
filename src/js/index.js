import {$, Swiper, Navigation, Pagination} from './common';

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

	
});