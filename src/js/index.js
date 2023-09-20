import {$, Swiper, Navigation, Pagination, Mousewheel, EffectFade, Fancybox, Inputmask} from './common';

$(function(){

	if($('.js-history-animate').length){
		let pointAnimStart = $('.js-anim-start').offset().top;// Начало анимации (расстояние от верха страницы)
		let pointAnimFinish = $('.js-anim-finish').offset().top;// Конец анимации
		// let pointAnimPath = $('.js-anim-point-path').offset().top;//Начало анимации пути
		let scrollWindow = $(window).scrollTop();//текущее положение на странице


		
		let sratPosMap = parseInt($('.js-history-animate-map-wrap').css('top').replace('px',''));//Первоначальное положение карты
		// let firstAnimSect = pointAnimPath - pointAnimStart - sratPosMap*2 - $('.js-history-animate-map').outerHeight()/2;//Первый отрезок анимации
		
		let scrollMap = 0;//Смещение карты
		let pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;//Конец аимации для карты
		let opacityFirstMap = 0;//Прозрачность первого слоя карты
		let opacitySecondMap = 0;//Прозрачность второго слоя карты
		let opacityFullMap = 0;//Прозрачность всей карты
		let scaleFullMap = 0;//Масштаб всей карты

		// let pointAnimFirstMap = pointAnimPath - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		// let pointAnimSecondMap = $('.js-anim-point-gallery').offset().top - pointAnimStart - sratPosMap -  $('.js-history-animate-map').outerHeight()/2;


		// let pointMapAnimFirst = pointAnimStart + sratPosMap;
		// let pointMapAnimSect = pointMapAnimFirst + firstAnimSect;

		// let secondAnimSect = $('.js-anim-point-gallery').offset().top - pointMapAnimSect;//Второй отрезок анимации


		let firstPointAnimMap = pointAnimStart + sratPosMap;
		let secondPointAnimMap = $('.js-anim-point-path').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		let thirdPointAnimMap = $('.js-anim-point-gallery').offset().top  - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		let fourthPointAnimMap = $('.js-anim-point-clouds').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		// let fifthPointAnimMap = $('.js-anim-point-gallery').offset().top - secondPointAnimMap;

		let startPosCompas = parseInt($('.js-history-animate-compas').css('left').replace('px',''));//Начальная позиция компаса
		let moveCompas = startPosCompas;//Перемещение компаса
		let scalePatern = 0;//Масштаб патерна

		let opacityPath = 0;//Прозрачность пути
		let countLines = $('.js-path-line-item').length;//Получаем количество пунктиров
		let startPath = secondPointAnimMap - (thirdPointAnimMap - secondPointAnimMap) / 2;//Начало анимации пути
		let finishPath = thirdPointAnimMap - (thirdPointAnimMap - secondPointAnimMap) / 2;//Конец анимации пути
		let intervalPath = ((finishPath - startPath) - ((finishPath - startPath)/3)) / countLines;//Получаем интервал, через который будет появляться следующая линия
		let arrOpacityLines = [];//Массив для хранения прозрачности пунктиров
		let curCountLines = 0;//Текущее количество пунктиров, которые показываются на данный момент

		for (let index = 0; index < countLines; index++) {//Получаем прозрачность для каждого пунктира
			arrOpacityLines.push(index/countLines);
		}

		let opacityClouds = 0;
		let startOpacityClouds = fourthPointAnimMap;
		let finishOpacityClouds = fourthPointAnimMap + (fourthPointAnimMap - thirdPointAnimMap);
		let startCloudFirstLeft = Math.round(parseInt($('.js-history-animate-cloud-first').css('left').replace('px','')) / $('.js-history-animate-map-wrap').width() * 100); //Отступ первого облока по горизонтали (в процентах)
		let startCloudSecondLeft = Math.round(parseInt($('.js-history-animate-cloud-second').css('left').replace('px','')) / $('.js-history-animate-map-wrap').width() * 100); //Отступ первого облока по горизонтали (в процентах)
		let moveCloudFirst = startCloudFirstLeft; //Смещение первого облока по горизонтали (в процентах)
		let moveCloudSecond = startCloudSecondLeft; //Смещение первого облока по горизонтали (в процентах)


		console.log('startCloudFirstLeft = ', startCloudFirstLeft);
		console.log('startCloudSecondLeft = ', startCloudSecondLeft);

		animateMap(scrollWindow);


		function animateMap(scroll) {
			// if(scroll <= firstPointAnimMap){
			// 	console.log('1111111');
			// 	// $('.js-kv').css('background-color','green');
			// 	// $('.js-kv').html('0');
			// }else if(scroll > firstPointAnimMap && scroll < secondPointAnimMap){
			// 	console.log('2222');
			// 	// $('.js-kv').css('background-color','pink');
			// 	// $('.js-kv').html('1');
			// }else if(scroll >= secondPointAnimMap  && scroll < thirdPointAnimMap){
			// 	console.log('3333');
			// 	// $('.js-kv').css('background-color','grey');
			// 	// $('.js-kv').html('2');
			// }else if(scroll >= thirdPointAnimMap  && scroll < fourthPointAnimMap){
			// 	console.log('4444');
			// 	// $('.js-kv').css('background-color','yellow');
			// 	// $('.js-kv').html('3');
			// }else if(scroll >= fourthPointAnimMap  && scroll < pointAnimFinish){
			// 	console.log('5555');
			// 	// $('.js-kv').css('background-color','purple');
			// 	// $('.js-kv').html('4');
			// }

			//Изменение прозрачности карты (первый слой)
			if(scroll <= firstPointAnimMap){
				opacityFirstMap = 0;
			}else if(scroll > firstPointAnimMap && scroll < secondPointAnimMap){
				opacityFirstMap = (scroll - firstPointAnimMap) / (secondPointAnimMap - firstPointAnimMap);
			}else if(scroll > secondPointAnimMap){
				opacityFirstMap = 1;
			}

			$('.js-history-animate-map-color').css('opacity', opacityFirstMap);

			//Передвижение компаса
			if(scroll <= firstPointAnimMap){
				moveCompas = startPosCompas;
			}else if(scroll > firstPointAnimMap && scroll < secondPointAnimMap){
				moveCompas = startPosCompas - ((scroll - firstPointAnimMap) * startPosCompas / (secondPointAnimMap - firstPointAnimMap));
			}else if(scroll > secondPointAnimMap){
				moveCompas = 0;
			}

			$('.js-history-animate-compas').css('left', moveCompas+'px');

			//Появление патерна под картой
			if(scroll <= firstPointAnimMap){
				scalePatern = 0;
			}else if(scroll > firstPointAnimMap && scroll < secondPointAnimMap){
				scalePatern = (scroll - firstPointAnimMap) / (secondPointAnimMap - firstPointAnimMap);
			}else if(scroll > secondPointAnimMap){
				scalePatern = 1;
			}

			$('.js-history-animate-pattern').css('transform', 'translateX(-50%) translateY(-50%) scale('+scalePatern+')');

			//Анимация пути
			if(scroll > startPath && scroll < finishPath){
				$('.js-path-line-item').css('opacity','0');//Скрываем все пунктиры
				curCountLines = Math.round((scroll - startPath)/intervalPath);//Вычисляем текущие пунктиры

				for (let index = 0; index < curCountLines; index++) {//Показываем пунктиры в соответствии с прозрачностью
					$('.js-path-line-item:nth-child('+index+')').css('opacity', arrOpacityLines[index]);

					if(index > countLines - 5){
						$('.js-history-path-anchor').addClass('active');
					}else{
						$('.js-history-path-anchor').removeClass('active');
					}
				}
			}

			//Прозрачность пути
			if(scroll <= finishPath){
				opacityPath = 1;
			}else if(scroll > finishPath && scroll < thirdPointAnimMap){
				opacityPath = 1- ((scroll - finishPath) / (thirdPointAnimMap - finishPath));
			}else if(scroll > thirdPointAnimMap){
				opacityPath = 0;
			}

			$('.js-history-path').css('opacity', opacityPath)
		
			//Изменение прозрачности карты (второй слой)
			if(scroll <= secondPointAnimMap){
				opacitySecondMap = 0;
			}else if(scroll > secondPointAnimMap && scroll < thirdPointAnimMap){
				opacitySecondMap = (scroll - secondPointAnimMap) / (thirdPointAnimMap - secondPointAnimMap);
			}else if(scroll > thirdPointAnimMap){
				opacitySecondMap = 1;
			}

			$('.js-history-animate-map-color-full').css('opacity', opacitySecondMap);

			//Появление облаков
			if(scroll <= thirdPointAnimMap){
				opacityClouds = 0;
			}else if(scroll > thirdPointAnimMap && scroll < startOpacityClouds){
				opacityClouds = (scroll - thirdPointAnimMap) / (startOpacityClouds - thirdPointAnimMap);
			}else if(scroll > startOpacityClouds && scroll < finishOpacityClouds){
				opacityClouds = 1 - ((scroll - startOpacityClouds) / (finishOpacityClouds - startOpacityClouds));;
			}else if(scroll > finishOpacityClouds){
				opacityClouds = 0;
			}

			$('.js-history-animate-cloud-first').css('opacity', opacityClouds);
			$('.js-history-animate-cloud-second').css('opacity', opacityClouds);

		// // 	let startOpacityClouds = fourthPointAnimMap;
		// // let finishOpacityClouds = fourthPointAnimMap + (fourthPointAnimMap - thirdPointAnimMap);
		// 	// Перемещение облаков
		// 	if(scroll <= thirdPointAnimMap){
		// 		// opacityClouds = 0;
		// 	}else if(scroll > thirdPointAnimMap && scroll < finishOpacityClouds){
		// 		moveCloudFirst = startCloudFirstLeft - ((scroll - thirdPointAnimMap) * startCloudFirstLeft/ (finishOpacityClouds - thirdPointAnimMap));
		// 		// moveCloudSecond = (scroll - thirdPointAnimMap) * startCloudSecondLeft/ (finishOpacityClouds - thirdPointAnimMap);
				
		// 		console.log('moveCloudFirst = ', moveCloudFirst);
		// 		console.log('moveCloudSecond = ', moveCloudSecond);

		// // 		moveCloudFirst
		// // 		let moveCloudFirstLeft = 30; //Смещение первого облока по горизонтали (в процентах)
		// // let moveCloudSecondLeft = 20; //Смещение первого облока по горизонтали (в процентах)

		// 	}else if(scroll > finishOpacityClouds){
		// 		// opacityClouds = 1;
		// 	}

		// 	$('.js-history-animate-cloud-first').css('left', moveCloudFirst+'%');
			// $('.js-history-animate-cloud-second').css('left', moveCloudSecond+'%');
			// $('.js-history-animate-cloud-second').css('opacity', opacityClouds);

			// function parallaxScroll(){
			// 	var scrolled = $(window).scrollTop();
			// 	$('#parallax-bg1').css('top',(0-(scrolled*.25))+'px');
			// 	$('#parallax-bg2').css('top',(0-(scrolled*.5))+'px');
			// 	$('#parallax-bg3').css('top',(0-(scrolled*.75))+'px');
			// }

			//Увеличение карты
			if(scroll <= fourthPointAnimMap){
				opacityFullMap = 1;
				scaleFullMap = 1;
			}else if(scroll > fourthPointAnimMap && scroll < pointAnimFinishMap){
				opacityFullMap = 1 - ((scroll - fourthPointAnimMap) * 0.8 / (pointAnimFinishMap - fourthPointAnimMap));
				scaleFullMap = 1 + ((scroll - fourthPointAnimMap) * 0.5 / (pointAnimFinishMap - fourthPointAnimMap));
			}else if(scroll > pointAnimFinishMap){
				opacityFullMap = 0.2;
				scaleFullMap = 1.5;
			}

			$('.js-history-animate-map-wrap').css({'opacity': opacityFullMap, 'transform':'scale('+scaleFullMap+')'});


			//Изменение прозрачности карты (первый слой)
			// if(scroll <= (pointAnimStart + sratPosMap)){
			// 	opacityFirstMap = 0;
			// 	$('.js-history-animate-map-color').css('opacity', opacityFirstMap);
			// }else if(scroll > (pointAnimStart + sratPosMap) && scroll < pointAnimFirstMap){
			// 	opacityFirstMap = (scroll - (pointAnimStart + sratPosMap)) / firstAnimSect;
			// 	$('.js-history-animate-map-color').css('opacity', opacityFirstMap);
			// 	console.log('1111111111');
			// 	// console.log('path1 = ', scroll - (pointAnimStart + sratPosMap));
			// 	// console.log('path2 = ', firstAnimSect - (pointAnimFirstMap - scroll));
			// }

			// //Изменение прозрачности карты (второй слой)
			// if(scroll <= pointAnimFirstMap){
			// 	opacitySecondMap = 0;
			// 	$('.js-history-animate-map-color-full').css('opacity', opacitySecondMap);
			// }else if(scroll > pointAnimFirstMap && scroll < pointAnimSecondMap){
			// 	opacitySecondMap = (scroll - pointAnimFirstMap) / secondAnimSect;
			// 	// opacitySecondMap = (scroll - (pointAnimStart + sratPosMap + firstAnimSect)) / (firstAnimSect - sratPosMap*2 - $('.js-history-animate-map').outerHeight()/2);
			// 	// $('.js-history-animate-map-color-full').css('opacity', opacitySecondMap);
			// 	console.log('2222');
			// 	console.log('opacitySecondMap = ', opacitySecondMap);
			// }

			

			//Перемещение карты
			if(scroll > pointAnimStart && scroll < pointAnimFinishMap){
				scrollMap = scroll - pointAnimStart + sratPosMap;

				if(scrollMap < sratPosMap){
					scrollMap = sratPosMap;
				}

				$('.js-history-animate-map-wrap').css('top', scrollMap);
			}else{
				// console.log('2222');
			}
			
		}

		$(window).on('scroll', function(){
			scrollWindow = $(this).scrollTop();

			// console.log('scrollWindow = ', scrollWindow);

			animateMap(scrollWindow);

			


		// 	scrollHistoryVal = $(this).scrollTop();

		// 	//Анимация карты
		// 	if(scrollHistoryVal <= scrollMapBegin){
		// 		$('.js-history-animate-map-color').css('opacity', '0');
		// 		$('.js-history-animate-map-wrap').css('top', topMapBegin);
		// 		$('.js-history-animate-pattern').css('transform', 'translateX(-50%) translateY(-50%) scale(0)');
		// 		$('.js-history-animate-compas').css('opacity', '0');
		// 	}else if(scrollHistoryVal > scrollMapBegin  && scrollHistoryVal < scrollMapFinish){
		// 		opacityMap = scrollHistoryVal * 1 / (scrollMapFinish - scrollMapBegin);
		// 		scrollMap = scrollHistoryVal - (scrollMapBegin - beginAnimHist);
		// 		scalePattern = scrollHistoryVal * 1 / (scrollMapFinish - scrollMapBegin);

		// 		if(scalePattern > 1){
		// 			scalePattern = 1;
		// 		}

		// 		$('.js-history-animate-map-color').css('opacity', opacityMap);
		// 		$('.js-history-animate-map-wrap').css('top', scrollMap);
		// 		$('.js-history-animate-pattern').css('transform', 'translateX(-50%) translateY(-50%) scale('+scalePattern+')');
		// 		$('.js-history-animate-compas').css('opacity', opacityMap);
		// 	}

		// 	//Анимация стакана
		// 	let rotateGlass = 0;
		// 	let scaleGlass = 1;

		// 	if(scrollHistoryVal > 0  && scrollHistoryVal < finishAnimHist/2){
		// 		rotateGlass = scrollHistoryVal * 60 / ((finishAnimHist - beginAnimHist) / 2);
		// 		scaleGlass = 1 + (scrollHistoryVal * 0.05 / ((finishAnimHist - beginAnimHist) / 2));

		// 		$('.js-history-animate-glass').css('transform', 'rotate('+rotateGlass+'deg) scale('+scaleGlass+')');
		// 	}

		// 	//Анимация пути
		// 	let countLines = $('.js-path-line-item').length;//Получаем количество пунктиров
		// 	let intervalPath = (scrollMapFinish - 100 - scrollMapFinish/2) / countLines;//Получаем интервал, через который будет появляться следующая линия
		// 	let arrOpacityLines = [];//Массив для хранения прозрачности пунктиров

		// 	for (let index = 0; index < countLines; index++) {//Получаем прозрачность для каждого пунктира
		// 		arrOpacityLines.push(index/countLines);
		// 	}

		// 	if(scrollHistoryVal > scrollMapFinish/2  && scrollHistoryVal < scrollMapFinish-100){
		// 		let curPath = scrollHistoryVal - scrollMapFinish/2;
		// 		let curCountLines = 0;

		// 		$('.js-path-line-item').css('opacity','0');//Скрываем все пунктиры
		// 		curCountLines = Math.round(curPath/intervalPath);//Вычисляем текущие пунктиры
				
		// 		for (let index = 0; index < curCountLines; index++) {//Показываем пунктиры в соответствии с прозрачностью
		// 			$('.js-path-line-item:nth-child('+index+')').css('opacity', arrOpacityLines[index]);

		// 			if(index > countLines - 5){
		// 				$('.js-history-path-anchor').addClass('active');
		// 			}else{
		// 				$('.js-history-path-anchor').removeClass('active');
		// 			}
		// 		}
		// 	}
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