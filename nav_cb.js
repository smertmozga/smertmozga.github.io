jQuery(function($) {
	        $(window).scroll(function(){
	            if($(this).scrollTop()>0){
	                $('#any-button').addClass('fixed');
	            }
	            else if ($(this).scrollTop()<0){
	                $('#any-button').removeClass('fixed');
	            }
	        });
	    });