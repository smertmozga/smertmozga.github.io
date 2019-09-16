 jQuery(function($) {
	        $(window).scroll(function(){
	            if($(this).scrollTop()>100){
	                $('#navigation').addClass('fixed');
	                $('#menu a').addClass('fixed1');
	            }
	            else if ($(this).scrollTop()<105){
	                $('#navigation').removeClass('fixed');
	                $('#menu a').removeClass('fixed1');
	            }
	        });
	    });
