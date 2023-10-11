import {$, Swiper, Navigation, Pagination, Mousewheel, EffectFade, Fancybox, Inputmask} from './common';

$(function(){
	var widthWindow = $(window).width();

	function returnFalse(e){
		e = e||event;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
   }

	//Фиксированое меню
	let heightHeader = $('.js-header').outerHeight();//Высота шапки

	fixedHeader($(window).scrollTop());

	function fixedHeader(scroll) {
		if(scroll > heightHeader){
			$('.js-header').addClass('fixed');
		}else{
			$('.js-header').removeClass('fixed');
		}
	}

	$(window).on('scroll', function(){
		fixedHeader($(this).scrollTop());
	});


	//Фиксированые крошки
	let crumbFixedStart = $('.js-nav-catalog-fixed-start').offset().top - heightHeader;
	let crumbFixedFinish = $('.js-nav-catalog-fixed-finish').offset().top - heightHeader - $('.js-nav-catalog-wrap').outerHeight();

	fixedCrumb($(window).scrollTop());

	function fixedCrumb(scroll) {
		crumbFixedStart = $('.js-nav-catalog-fixed-start').offset().top - heightHeader;
		crumbFixedFinish = $('.js-nav-catalog-fixed-finish').offset().top - heightHeader - $('.js-nav-catalog-wrap').outerHeight();

		if(scroll >= crumbFixedStart && scroll <= crumbFixedFinish){
			$('.js-nav-catalog-wrap').css('height', $('.js-nav-catalog-wrap').outerHeight(true)+'px');
			$('.js-nav-catalog-wrap').addClass('fixed');
		}else{
			$('.js-nav-catalog-wrap').removeClass('fixed');
			$('.js-nav-catalog-wrap').css('height', 'auto');
		}

		if(widthWindow > 767){
			if(scroll < crumbFixedStart){
				$('.js-cat-main-item-img-wrap').removeClass('fixed');
				$('.js-cat-main-item-img-wrap').removeClass('finished');
				$('.js-cat-main-item-img-wrap').css({'bottom':'auto', 'top':'0'});
			}else if(scroll >= crumbFixedStart && scroll <= crumbFixedFinish-$('.js-cat-main-item-img-wrap').outerHeight()){
				$('.js-cat-main-item-img-wrap').addClass('fixed');
				$('.js-cat-main-item-img-wrap').removeClass('finished');
				$('.js-cat-main-item-img-wrap').css({'top':$('.js-header').outerHeight()+$('.js-nav-catalog-wrap').outerHeight()+'px', 'bottom':'auto'});
			}else{
				$('.js-cat-main-item-img-wrap').removeClass('fixed');
				$('.js-cat-main-item-img-wrap').addClass('finished');
				$('.js-cat-main-item-img-wrap').css({'bottom':'0', 'top':'auto'});
			}
		}
	}

	$(window).on('scroll', function(){
		fixedCrumb($(this).scrollTop());
	});


	//Анимация каталога
	if($('.js-cat-main').length){
		let arrPointSectCatalog = [];
		let arrPointItemCatalog = [];
		let heightCrumb = $('.js-nav-catalog-wrap').outerHeight();//Высота крошек
		let animateScroll = true;//Разрешена анимация при скролле

		//Собираем точки разделов
		$('.js-cat-main-sect').each(function( index ) {
			arrPointSectCatalog[index] = $(this).offset().top;
		});

		//Собираем точки элементов
		$('.js-cat-main-item').each(function( index ) {
			arrPointItemCatalog.push([$(this).offset().top, $(this).offset().top + $(this).outerHeight()]);
		});

		changeActiveCat($(window).scrollTop());

		function changeActiveCat(scroll) {
			let opacityImg = 0;

			if(scroll > crumbFixedStart && scroll < crumbFixedFinish){
				//Меняем активный элемент каталога и крошек при скроле
				for (let index = 0; index < arrPointItemCatalog.length; index++) {
					let minPos = arrPointItemCatalog[index][0] - heightHeader - heightCrumb;
					let maxPos = arrPointItemCatalog[index][1] - heightHeader - heightCrumb;

					if(scroll > minPos && scroll < maxPos){

						let halfPath = (maxPos - minPos)/2;

						if(!$('.js-crumb-catalog-item[data-id="'+index+'"]').hasClass('active')){

							$('.js-cat-main-item').removeClass('active');
							$('.js-cat-main-item[data-id="'+index+'"]').addClass('active');
							$('.js-crumb-catalog-item').removeClass('active');
							$('.js-crumb-catalog-item[data-id="'+index+'"]').addClass('active');
	
							
							if(widthWindow > 991){
								if(animateScroll == true){
									animateScroll = false;
									document.addEventListener("scroll", returnFalse);

									var top = $('.js-cat-main-item[data-id='+index+']').offset().top - heightHeader - $('.js-nav-catalog-wrap-content').outerHeight() ;

									$('body,html').animate({scrollTop: top}, 500, function() {
										animateScroll = true;
										document.removeEventListener("scroll", returnFalse);
									});
								}
							}
						}

						if( scroll > minPos + halfPath){
							opacityImg = 1 - ((scroll - minPos - halfPath) / halfPath);
							$('.js-cat-main-item.active .js-cat-main-item-img').css('opacity',opacityImg);
						}

						break;
					}
				}

				//Меняем активный раздел каталога при скроле
				for (let index = 0; index < arrPointSectCatalog.length; index++) {
					if(scroll < arrPointSectCatalog[index] - heightHeader - heightCrumb){
						let curId = index - 1;
						$('.js-nav-catalog-item').removeClass('active');
						$('.js-nav-catalog-item[data-sect="'+curId+'"]').addClass('active');
						
						break;
					}else if(index == arrPointSectCatalog.length - 1 && scroll >= arrPointSectCatalog[index] - heightHeader - heightCrumb){
						let curId = index;

						$('.js-nav-catalog-item').removeClass('active');
						$('.js-nav-catalog-item[data-sect="'+curId+'"]').addClass('active');

						break;
					}
				}
			}
		}

		$(window).on('scroll', function(){
			changeActiveCat($(this).scrollTop());
		});

		//Переход к карточке при клике по крошкам
		$('.js-crumb-catalog-item').on('click', function(){
			var $idBlock = $(this).data('id');
			var top = $('.js-cat-main-item[data-id='+$idBlock+']').offset().top - heightHeader - $('.js-nav-catalog-wrap-content').outerHeight();

			$('.js-crumb-catalog-item').removeClass('active');
			$(this).addClass('active');
			animateScroll = false;
			document.addEventListener("scroll", returnFalse);

			$('body,html').animate({scrollTop: top}, 500, function() {
				animateScroll = true;
				document.removeEventListener("scroll", returnFalse);
			});
		});

		//Переход к разделу с карточками
		$('.js-nav-catalog-item').on('click', function(){
			var $idSect = $(this).data('sect');
			var top = $('.js-cat-main-sect[data-sect='+$idSect+']').offset().top - heightHeader - $('.js-nav-catalog-wrap-content').outerHeight();
			animateScroll = false;
			document.addEventListener("scroll", returnFalse);

			$('body,html').animate({scrollTop: top}, 500, function() {
				animateScroll = true;
				document.removeEventListener("scroll", returnFalse);
			});
		});
	}

	if($('.js-history-animate').length){
		let pointAnimStart = $('.js-anim-start').offset().top;// Начало анимации (расстояние от верха страницы)
		let pointAnimFinish = $('.js-anim-finish').offset().top;// Конец анимации
		let scrollWindow = $(window).scrollTop();//текущее положение на странице
		let sratPosMap = parseInt($('.js-history-animate-map-wrap').css('top').replace('px',''));//Первоначальное положение карты
		if(widthWindow < 768){
			var pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight();//Конец аимации для карты
		}else{
			var pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight() - sratPosMap;//Конец аимации для карты
		}
		let opacityFirstMap = 0;//Прозрачность первого слоя карты
		let opacitySecondMap = 0;//Прозрачность второго слоя карты
		let opacityFullMap = 0;//Прозрачность всей карты
		let scaleFullMap = 0;//Масштаб всей карты
		let firstPointAnimMap = pointAnimStart + sratPosMap;
		let secondPointAnimMap = $('.js-anim-point-path').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		let thirdPointAnimMap = $('.js-anim-point-gallery').offset().top  - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		let fourthPointAnimMap = $('.js-anim-point-clouds').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
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
		let moveCloudFirstTop = 0; //Паралакс первого облака
		let moveCloudSecondTop = 0; //Паралакс второго облака

		

		//Паралакс при наведении мышкой на первое облако
		let cloudFirst = document.querySelector('.js-history-animate-cloud-first');
		window.addEventListener('mousemove', function(e) {
			let x = e.clientX / window.innerWidth;
			let y = e.clientY / window.innerHeight;  
			cloudFirst.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
		});

		//Паралакс при наведении мышкой на второе облако
		let cloudSecond = document.querySelector('.js-history-animate-cloud-second');
		window.addEventListener('mousemove', function(e) {
			let x = e.clientX / window.innerWidth;
			let y = e.clientY / window.innerHeight;  
			cloudSecond.style.transform = 'translate(-' + x * 50 + 'px, -' + y * 50 + 'px)';
		});

		let startPointAnimSlider = $('.js-anim-point-gallery').offset().top - $(window).outerHeight()*1.5;//Начало анимации слайдера
		let finishPointAnimSlider = startPointAnimSlider + $(window).outerHeight();//Конец анимации слайдера
		let moveSlider = 100;//Смещение слайдера
		let mapScrolling = false;//Флаг перемещения карты
		let beginScrolling = $(window).scrollTop();//Первоначальная позиция на экране


		animateMap(scrollWindow);

		function animateMap(scroll) {
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

			//Анимация слайдера
			if(scroll <= startPointAnimSlider){
				moveSlider = 100;
			}else if(scroll > startPointAnimSlider && scroll < finishPointAnimSlider){
				moveSlider = 100 -((scroll - startPointAnimSlider) * 100 / (finishPointAnimSlider - startPointAnimSlider));
			}else if(scroll > finishPointAnimSlider){
				moveSlider = 0;
			}

			$('.js-gallery-slider').css('left', moveSlider+'%');

			//Появление облаков
			if(scroll <= thirdPointAnimMap){
				opacityClouds = 0;
			}else if(scroll > thirdPointAnimMap && scroll < startOpacityClouds){
				opacityClouds = (scroll - thirdPointAnimMap) / (startOpacityClouds - thirdPointAnimMap);
			}else if(scroll > startOpacityClouds && scroll < finishOpacityClouds){
				opacityClouds = 1 - ((scroll - startOpacityClouds) / (finishOpacityClouds - startOpacityClouds));
			}else if(scroll > finishOpacityClouds){
				opacityClouds = 0;
			}

			$('.js-history-animate-cloud-first').css('opacity', opacityClouds);
			$('.js-history-animate-cloud-second').css('opacity', opacityClouds);

			// Перемещение облаков
			if(scroll > thirdPointAnimMap && scroll < finishOpacityClouds){
				moveCloudFirst = startCloudFirstLeft - ((scroll - thirdPointAnimMap) * startCloudFirstLeft/ (finishOpacityClouds - thirdPointAnimMap));
				moveCloudSecond = startCloudSecondLeft + ((scroll - thirdPointAnimMap) * startCloudSecondLeft/ (finishOpacityClouds - thirdPointAnimMap));
				moveCloudFirstTop = ((scroll - thirdPointAnimMap)*.05);
				moveCloudSecondTop = 0-((scroll - thirdPointAnimMap)*.1);
			}

			$('.js-history-animate-cloud-first').css({'left': moveCloudFirst+'%', 'margin-top':moveCloudFirstTop+'px'});
			$('.js-history-animate-cloud-second').css({'left': moveCloudSecond+'%', 'margin-top':moveCloudSecondTop+'px'});

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


			//Перемещение карты
			if(scroll <= firstPointAnimMap-heightHeader){
				mapScrolling = false;
				$('.js-history-animate-map-wrap').animate({'top': sratPosMap+'px'}, 10);
				$('.js-history-animate-map-wrap').removeClass('fixed');
			}else if(scroll > firstPointAnimMap-heightHeader && scroll < pointAnimFinishMap){
				mapScrolling = true;
				$('.js-history-animate-map-wrap').addClass('fixed');

			}else if(scroll >= pointAnimFinishMap){
				if(beginScrolling > pointAnimFinishMap){
					beginScrolling = 0;

					$('.js-history-animate-map-wrap').animate({'top': pointAnimFinishMap+'px'}, 10);
				}

				if(mapScrolling == true){
					mapScrolling = false;

	
					$('.js-history-animate-map-wrap').animate({'top': $('.js-history-animate-map-wrap').offset().top+'px'}, 10);
					$('.js-history-animate-map-wrap').removeClass('fixed');
				}
			}
		}

		$(window).on('scroll', function(){
			scrollWindow = $(this).scrollTop();

			animateMap(scrollWindow);
		});
	}


	$(window).on('resize', function(){
		widthWindow = $(window).width();

		arrPointSectCatalog = [];
		arrPointItemCatalog = [];
		heightCrumb = $('.js-nav-catalog-wrap').outerHeight();//Высота крошек
		animateScroll = true;//Разрешена наимация при скролле

		heightHeader = $('.js-header').outerHeight();//Высота шапки

		crumbFixedStart = $('.js-nav-catalog-fixed-start').offset().top - heightHeader;
		crumbFixedFinish = $('.js-nav-catalog-fixed-finish').offset().top - heightHeader - $('.js-nav-catalog-wrap').outerHeight();

		pointAnimStart = $('.js-anim-start').offset().top;// Начало анимации (расстояние от верха страницы)
		pointAnimFinish = $('.js-anim-finish').offset().top;// Конец анимации
		scrollWindow = $(window).scrollTop();//текущее положение на странице
		sratPosMap = parseInt($('.js-history-animate-map-wrap').css('top').replace('px',''));//Первоначальное положение карты
		if(widthWindow < 768){
			pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight();//Конец аимации для карты
		}else{
			pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight() - sratPosMap;//Конец аимации для карты
		}
		opacityFirstMap = 0;//Прозрачность первого слоя карты
		opacitySecondMap = 0;//Прозрачность второго слоя карты
		opacityFullMap = 0;//Прозрачность всей карты
		scaleFullMap = 0;//Масштаб всей карты
		firstPointAnimMap = pointAnimStart + sratPosMap;
		secondPointAnimMap = $('.js-anim-point-path').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		thirdPointAnimMap = $('.js-anim-point-gallery').offset().top  - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		fourthPointAnimMap = $('.js-anim-point-clouds').offset().top - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;
		startPosCompas = parseInt($('.js-history-animate-compas').css('left').replace('px',''));//Начальная позиция компаса
		moveCompas = startPosCompas;//Перемещение компаса
		scalePatern = 0;//Масштаб патерна
		opacityPath = 0;//Прозрачность пути
		countLines = $('.js-path-line-item').length;//Получаем количество пунктиров
		startPath = secondPointAnimMap - (thirdPointAnimMap - secondPointAnimMap) / 2;//Начало анимации пути
		finishPath = thirdPointAnimMap - (thirdPointAnimMap - secondPointAnimMap) / 2;//Конец анимации пути
		intervalPath = ((finishPath - startPath) - ((finishPath - startPath)/3)) / countLines;//Получаем интервал, через который будет появляться следующая линия
		arrOpacityLines = [];//Массив для хранения прозрачности пунктиров
		curCountLines = 0;//Текущее количество пунктиров, которые показываются на данный момент

		for (let index = 0; index < countLines; index++) {//Получаем прозрачность для каждого пунктира
			arrOpacityLines.push(index/countLines);
		}

		opacityClouds = 0;
		startOpacityClouds = fourthPointAnimMap;
		finishOpacityClouds = fourthPointAnimMap + (fourthPointAnimMap - thirdPointAnimMap);
		startCloudFirstLeft = Math.round(parseInt($('.js-history-animate-cloud-first').css('left').replace('px','')) / $('.js-history-animate-map-wrap').width() * 100); //Отступ первого облока по горизонтали (в процентах)
		startCloudSecondLeft = Math.round(parseInt($('.js-history-animate-cloud-second').css('left').replace('px','')) / $('.js-history-animate-map-wrap').width() * 100); //Отступ первого облока по горизонтали (в процентах)
		moveCloudFirst = startCloudFirstLeft; //Смещение первого облока по горизонтали (в процентах)
		moveCloudSecond = startCloudSecondLeft; //Смещение первого облока по горизонтали (в процентах)
		moveCloudFirstTop = 0; //Паралакс первого облака
		moveCloudSecondTop = 0; //Паралакс второго облака
		startPointAnimSlider = $('.js-anim-point-gallery').offset().top - $(window).outerHeight()*1.5;//Начало анимации слайдера
		finishPointAnimSlider = startPointAnimSlider + $(window).outerHeight();//Конец анимации слайдера
		moveSlider = 100;//Смещение слайдера
		mapScrolling = false;//Флаг перемещения карты
		beginScrolling = $(window).scrollTop();//Первоначальная позиция на экране

	});

	//Слайдер галерея картинок
	if($('.js-gallery-slider').length){
		var gallerySlider = new Swiper('.js-gallery-slider', {
			loop: false,
			spaceBetween: 15,
			slidesPerView: 2.5,
			modules: [Navigation, Pagination],
			navigation: {
				nextEl: '.js-gallery-slider-next',
				prevEl: '.js-gallery-slider-prev',
			},
			breakpoints: {
				// 992: {
				//   slidesPerView: 1.6,
				// },
				480: {
					slidesPerView: 3.5,
				},
				768: {
					slidesPerView: 2.9,
					spaceBetween: 17,
				},
				1500: {
					slidesPerView: 3.4,
					spaceBetween: 40,
				}
			}
		});
	}

	//Переключение брендов
	if($('.js-choose-brand-item').length){
		//Клик по иконкам брендов
		$('.js-choose-brand-item').on('click', function(){
			chooseBrand($(this).data('choose'));
		});

		//Клик по стране
		$('.js-bottle-info-item').on('click', function(){
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

			//Активируем текст
			$('.js-choose-brand-text-item').removeClass('active')
			$('.js-choose-brand-text-item[data-choose="'+num+'"]').addClass('active');

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

	//Попап с выбором возраста
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

	//Открыть/Закрыть мобильное меню
	$('.js-open-main-menu').on('click', function(){
		$('.js-main-menu-wrap').addClass('open');
		$('.js-body').addClass('no-scroll');
	});

	$('.js-close-main-menu').on('click', function(){
		$('.js-main-menu-wrap').removeClass('open');
		$('.js-body').removeClass('no-scroll');
	});
});