import {$} from './common';

$(window).scroll(function(){
	if($(this).scrollTop()>300){
		$('.js-move-up').addClass('visible');
	}else{
		$('.js-move-up').removeClass('visible');
	}
});
$('.js-move-up').click(function(){$('body,html').animate({scrollTop:0},800);return false;});