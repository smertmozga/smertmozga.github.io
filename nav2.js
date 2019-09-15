 jQuery(function($) {
	        $(window).scroll(function(){
	            if($(this).scrollTop()>0)
	            {
	                $('nav').addClass('fix');
	   	        }
	            else if ($(this).scrollTop()<5)
	            {
	                $('nav').removeClass('fix');	                
	            }
		});
	    });