import {$, Swiper, Navigation, Pagination, Mousewheel, EffectFade, Fancybox, Inputmask} from './common';

$(function(){
	// //Плавность скролла
	// $(document).bind( 'mousewheel', function (e) { 
	// 	var nt = $(document.body).scrollTop()-(e.deltaY*e.deltaFactor*100); 
	// 	e.preventDefault(); 
	// 	e.stopPropagation(); 
	// 	$(document.body).stop().animate( { 
	// 		 scrollTop : nt,
	// 		 behavior: 'smooth'
	// 	 } , 500 , 'linier' );  
	// } )

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
		if(scroll >= crumbFixedStart && scroll <= crumbFixedFinish){
			$('.js-nav-catalog-wrap').css('height', $('.js-nav-catalog-wrap').outerHeight(true)+'px');
			$('.js-nav-catalog-wrap').addClass('fixed');
		}else{
			$('.js-nav-catalog-wrap').removeClass('fixed');
			$('.js-nav-catalog-wrap').css('height', 'auto');
		}

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

		// if(scroll >= crumbFixedStart && scroll <= crumbFixedFinish-$('.js-cat-main-item-img-wrap').outerHeight()){
		// 	$('.js-cat-main-item-img-wrap').addClass('fixed');
		// 	$('.js-cat-main-item-img-wrap').css('top',$('.js-header').outerHeight()+$('.js-nav-catalog-wrap').outerHeight()+'px');
		// }else{
		// 	$('.js-cat-main-item-img-wrap').removeClass('fixed');
		// 	$('.js-cat-main-item-img-wrap').css('top','0');
		// }


		// js-cat-main-item-img-wrap
	}

	$(window).on('scroll', function(){
		fixedCrumb($(this).scrollTop());
	});


	//Анимация каталога
	if($('.js-cat-main').length){
		let arrPointSectCatalog = [];
		let arrPointItemCatalog = [];
		let heightCrumb = $('.js-nav-catalog-wrap').outerHeight();//Высота крошек
		let animateScroll = true;//Разрешена наимация при скролле

		//Собираем точки разделов
		$('.js-cat-main-sect').each(function( index ) {
			arrPointSectCatalog[index] = $(this).offset().top;
		});

		//Собираем точки элементов
		$('.js-cat-main-item').each(function( index ) {
			arrPointItemCatalog.push([$(this).offset().top, $(this).offset().top + $(this).outerHeight()]);
		});

		console.log('arrPointItemCatalog = ', arrPointItemCatalog);

		changeActiveCat($(window).scrollTop());

		function changeActiveCat(scroll) {
			let opacityImg = 0;

	
			
			if(scroll > crumbFixedStart && scroll < crumbFixedFinish){
				//Меняем активный элемент каталога и крошек при скроле
				for (let index = 0; index < arrPointItemCatalog.length; index++) {
					// if(scroll < arrPointItemCatalog[index][0] - heightHeader - heightCrumb){
					// 	let curId = index - 1;
					// 	$('.js-cat-main-item').removeClass('active');
					// 	$('.js-cat-main-item[data-id="'+curId+'"]').addClass('active');
					// 	$('.js-crumb-catalog-item').removeClass('active');
					// 	$('.js-crumb-catalog-item[data-id="'+curId+'"]').addClass('active');
					// 	console.log('111111111');
					// 	console.log('index = ', index);
						
					// 	break;
					// }else if(index == arrPointItemCatalog.length - 1 && scroll >= arrPointItemCatalog[index][0] - heightHeader - heightCrumb){
					// 	let curId = index;

					// 	$('.js-cat-main-item').removeClass('active');
					// 	$('.js-cat-main-item[data-id="'+curId+'"]').addClass('active');
					// 	$('.js-crumb-catalog-item').removeClass('active');
					// 	$('.js-crumb-catalog-item[data-id="'+curId+'"]').addClass('active');
					// 	break;
					// }

					let minPos = arrPointItemCatalog[index][0] - heightHeader - heightCrumb;
					let maxPos = arrPointItemCatalog[index][1] - heightHeader - heightCrumb;

					if(scroll > minPos && scroll < maxPos){

						let halfPath = (maxPos - minPos)/2;

						if(!$('.js-crumb-catalog-item[data-id="'+index+'"]').hasClass('active')){

							$('.js-cat-main-item').removeClass('active');
							$('.js-cat-main-item[data-id="'+index+'"]').addClass('active');
							$('.js-crumb-catalog-item').removeClass('active');
							$('.js-crumb-catalog-item[data-id="'+index+'"]').addClass('active');
							// console.log('111111111');
							
							if(animateScroll == true){
								// console.log('index = ', index);
								// console.log('scroll = ', scroll);
								animateScroll = false;

								document.addEventListener("scroll", returnFalse);

								var top = $('.js-cat-main-item[data-id='+index+']').offset().top - heightHeader - $('.js-nav-catalog-wrap-content').outerHeight() ;
								// console.log('top = ', top);
		
		
								$('body,html').animate({scrollTop: top}, 500, function() {
									animateScroll = true;
									document.removeEventListener("scroll", returnFalse);
								});
							}
						}



						// console.log('scroll = ', scroll);
						// console.log('arrPointItemCatalog[index][0] - heightHeader - heightCrumb = ', arrPointItemCatalog[index][0] - heightHeader - heightCrumb);

						// if( scroll < minPos + halfPath - 200){
						// 	console.log('min');

						// 	opacityImg = (scroll - minPos) / halfPath;
						// }else if( scroll > minPos + halfPath - 200){
						// 	console.log('max');
						// 	opacityImg = 1 - ((scroll - minPos - halfPath) / halfPath);

						// }else{
						// 	opacityImg = 1
						// }

						if( scroll > minPos + halfPath){
							opacityImg = 1 - ((scroll - minPos - halfPath) / halfPath);
							$('.js-cat-main-item.active .js-cat-main-item-img').css('opacity',opacityImg);

							console.log('2222222');
						}
						

						// console.log('opacityImg = ', opacityImg);
						
						break;
					}
				}

				//Меняем активный раздел каталога при скроле
				for (let index = 0; index < arrPointSectCatalog.length; index++) {
					// console.log('arrPointSectCatalog[index] = ', arrPointSectCatalog[index]);
					// console.log('scroll = ', scroll);
					if(scroll < arrPointSectCatalog[index] - heightHeader - heightCrumb){
						let curId = index - 1;
						$('.js-nav-catalog-item').removeClass('active');
						$('.js-nav-catalog-item[data-sect="'+curId+'"]').addClass('active');
						// $('.js-crumb-catalog-item').removeClass('active');
						// $('.js-crumb-catalog-item[data-id="'+curId+'"]').addClass('active');
						
						break;
					}else if(index == arrPointSectCatalog.length - 1 && scroll >= arrPointSectCatalog[index] - heightHeader - heightCrumb){
						let curId = index;

						$('.js-nav-catalog-item').removeClass('active');
						$('.js-nav-catalog-item[data-sect="'+curId+'"]').addClass('active');
						// $('.js-crumb-catalog-item').removeClass('active');
						// $('.js-crumb-catalog-item[data-id="'+curId+'"]').addClass('active');
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
		// let pointAnimPath = $('.js-anim-point-path').offset().top;//Начало анимации пути
		let scrollWindow = $(window).scrollTop();//текущее положение на странице


		
		let sratPosMap = parseInt($('.js-history-animate-map-wrap').css('top').replace('px',''));//Первоначальное положение карты
		// let firstAnimSect = pointAnimPath - pointAnimStart - sratPosMap*2 - $('.js-history-animate-map').outerHeight()/2;//Первый отрезок анимации
		
		let scrollMap = 0;//Смещение карты
		// let pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight()/2 - sratPosMap;//Конец аимации для карты
		let pointAnimFinishMap = pointAnimFinish - $('.js-history-animate-map').outerHeight() - sratPosMap;//Конец аимации для карты
		let opacityFirstMap = 0;//Прозрачность первого слоя карты
		let opacitySecondMap = 0;//Прозрачность второго слоя карты
		let opacityFullMap = 0;//Прозрачность всей карты
		let scaleFullMap = 0;//Масштаб всей карты


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

		// let indentTopCatImg = ($(window).height() - $('.js-catalog-slider-img-wrap').height()) / 2;
		// let indentTopCat = $('.js-catalog-slider').offset().top;
		let indentTopImgScroll = 0;//Смещение картинки каталога
		// let startImgScroll = $('.js-catalog-slider-img-wrap').offset().top - indentTopCatImg;//Точка старта скрола картинки каталога
		// let finishImgScroll = indentTopCat + $('.js-catalog-slider').height() - $('.js-catalog-slider-img-wrap').height();//Точка финиша скрола картинки каталога

		let arrPointChangeImg = [];
		// let scrollToElem = false;
		// let curIndexItem = $('.js-catalog-slider-item.active').data('id');

		let startPointAnimSlider = $('.js-anim-point-gallery').offset().top - $(window).outerHeight()*1.5;//Начало анимации слайдера
		let finishPointAnimSlider = startPointAnimSlider + $(window).outerHeight();//Конец анимации слайдера
		let moveSlider = 100;//Смещение слайдера

		let mapScrolling = false;//Флаг перемещения карты
		let beginScrolling = $(window).scrollTop();//Первоначальная позиция на экране


		animateMap(scrollWindow);


		// $('.js-tabs-page-content-item.active').find('.js-catalog-slider-bottle').each(function( index ) {
		// 	// let point = $(this).offset().top - ($(window).height() - $(this).height()) / 2;
		// 	// let minPoint = $(this).offset().top - ($(window).height() - $(this).height()) / 2;
		// 	let minPoint = $(this).offset().top;
		// 	let maxPoint = $(this).offset().top + $(this).height();
		// 	arrPointChangeImg[index] = [minPoint, maxPoint];
		// });

		// scrollImgCat(scrollWindow);

		function animateMap(scroll) {
			// pointAnimStart = $('.js-anim-start').offset().top;
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

			// function parallaxScroll(){
			// 	var scrolled = $(window).scrollTop();
			// 	$('#parallax-bg1').css('top',(0-(scrolled*.25))+'px');
			// 	$('#parallax-bg2').css('top',(0-(scrolled*.5))+'px');
			// 	$('#parallax-bg3').css('top',(0-(scrolled*.75))+'px');
			// }

			// $('.js-history-animate-map-wrap').hover(function() {
			// 	console.log('hover');
			// 	console.log($(this).);



			// 	// if(prevMouseX)
			// });

			// $('.js-history-animate-map-wrap').mousemove(function(event) {
			// 	if(scroll > thirdPointAnimMap && scroll < finishOpacityClouds){
			// 		curMousePos.x = event.pageX;
			// 		curMousePos.y = event.pageY;
			// 		let transformCloudFirst = $('.js-history-animate-cloud-first').width() * 0.1;
			// 		let transformCloudSecond = $('.js-history-animate-cloud-second').width() * 0.1;
					
			// 		console.log('transformCloudFirst = ', transformCloudFirst);

			// 		if(curMousePos.x > prevMousePos.x){
			// 			console.log('1111');
			// 			$('.js-history-animate-cloud-first').animate({'margin-left': transformCloudFirst+'px'}, 300);
			// 			// $('.js-history-animate-cloud-first').css('transform', 'translateX('+transformCloudFirst+'px)')
			// 			prevMousePos.x = curMousePos.x;
			// 		}else if(curMousePos.x < prevMousePos.x){
			// 			console.log('2222');
			// 			$('.js-history-animate-cloud-first').animate({'margin-left': '-'+transformCloudFirst+'px'}, 300);
			// 			// $('.js-history-animate-cloud-first').css('transform', 'translateX('+transformCloudFirst+'px)')
			// 			prevMousePos.y = curMousePos.y;
			// 		}

			// 		// console.log('currentMousePos.x = ', curMousePos.x);
			// 		// console.log('currentMousePos.y = ', curMousePos.y);
			// 	}
				
			// });

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
			if(scroll <= pointAnimStart){
				mapScrolling = false;
				$('.js-history-animate-map-wrap').animate({'top': '250px'}, 10);
				$('.js-history-animate-map-wrap').removeClass('fixed');
			}else if(scroll > pointAnimStart && scroll < pointAnimFinishMap){
				// scrollMap = scroll - pointAnimStart + sratPosMap;

				// if(scrollMap < sratPosMap){
				// 	scrollMap = sratPosMap;
				// }

				// $('.js-history-animate-map-wrap').css('top', scrollMap);
				// // $('.js-history-animate-map-wrap').animate({'top': scrollMap}, 10);
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

		// function scrollImgCat(scroll) {
		// 	//Скролл картинки каталога
		// 	if(scroll < startImgScroll){
		// 		indentTopImgScroll = 0;
		// 	}else if(scroll > startImgScroll && scroll < finishImgScroll){
		// 		indentTopImgScroll = scroll - indentTopCat + indentTopCatImg;

		// 		//Переключаем активную карточку
		// 		for (let index = 0; index < arrPointChangeImg.length; index++) {
		// 			if(scroll+$(window).height()/2 > arrPointChangeImg[index][0]  && scroll+$(window).height()/2 < arrPointChangeImg[index][1]){
		// 				$('.js-tabs-page-content-item.active').find('.js-catalog-slider-item').removeClass('active');
		// 				$('.js-tabs-page-content-item.active').find('.js-catalog-slider-item[data-id='+index+']').addClass('active');
		// 				// console.log('indexffffff = ', index);
		// 				// console.log('curIndexItemfffff = ', curIndexItem);
		// 				if(curIndexItem != index){
		// 					console.log('index = ', index);
		// 					console.log('curIndexItem = ', curIndexItem);


		// 					$('body,html').animate({scrollTop: arrPointChangeImg[index][0] - 100}, 1000);

		// 					curIndexItem = index;
		// 				}

		// 				break;
		// 			}
		// 		}
		// 	}

		// 	$('.js-catalog-slider-img-wrap').css('top', indentTopImgScroll);
		// 	// $('.js-catalog-slider-img-wrap').animate({'top': indentTopImgScroll}, 10);
		// }

		$(window).on('scroll', function(){
			scrollWindow = $(this).scrollTop();

			// console.log('scrollWindow = ', scrollWindow);

			animateMap(scrollWindow);
			// scrollImgCat(scrollWindow);
			

			


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

		// Паралакс для бутылок
		// function parallaxScroll(){
		// 	var scrolled = $(window).scrollTop() - $('.js-catalog-slider-wrap').offset().top;
		// 	console.log('scrolled = ', scrolled);
		// 	$('.js-catalog-slider-bottle').css('top',(0-(scrolled*.05))+'px');
		// }

		// $(window).on('scroll', function(){
		// 	parallaxScroll();
		// });
	}

	//Слайдер галерея картинок
	if($('.js-gallery-slider').length){
		var gallerySlider = new Swiper('.js-gallery-slider', {
			loop: false,
			spaceBetween: 40,
			slidesPerView: 3.4,
			// modules: [Navigation, Pagination, Mousewheel],
			modules: [Navigation, Pagination],
			// mousewheel: true,
			navigation: {
				nextEl: '.js-gallery-slider-next',
				prevEl: '.js-gallery-slider-prev',
			},
			breakpoints: {
				// // when window width is >= 320px
				// 320: {
				//   slidesPerView: 2,
				//   spaceBetween: 20
				// },
				// // when window width is >= 480px
				992: {
				  slidesPerView: 1.6,
				},
				1280: {
					slidesPerView: 2.6,
				},
				1500: {
					slidesPerView: 3.4,
				}
			}
		});
	}

	//Слайдер каталога
	// if($('.js-catalog-slider').length){
	// 	// let catalogSlider = {};

	// 	// $('.js-catalog-slider').each(function(index) {//Задаем множественные слайдеры каталога
	// 	// 	let swiperSliderId = $(this).data('id');

	// 	// 	catalogSlider[index] = new Swiper('.js-catalog-slider[data-id="'+swiperSliderId+'"]', {
	// 	// 		slidesPerView: 1,
	// 	// 		spaceBetween: 30,
	// 	// 		loop: true,
	// 	// 		modules: [Mousewheel, EffectFade],
	// 	// 		mousewheel: true,
	// 	// 		fadeEffect: { crossFade: true },
	// 	// 		effect: 'fade',
	// 	// 		on: {
	// 	// 			slideChange: function (elem) {
	// 	// 				//Задаем активный пункт в крошках
	// 	// 				var activeIndex = this.realIndex;
	// 	// 				var $parentBlock = $('.js-catalog-slider[data-id="'+swiperSliderId+'"]').closest('.js-catalog-slider-wrap');

	// 	// 				$parentBlock.find('.js-crumb-catalog-item').removeClass('active');
	// 	// 				$parentBlock.find('.js-crumb-catalog-item[data-slide="'+activeIndex+'"]').addClass('active');
	// 	// 			},
	// 	// 		},
	// 	// 	});

	// 	// });

		
	// }

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
});