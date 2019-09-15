//некоторые конфиги
var ecomment_path = '/ecomment.php';

//расширение jquery - парсирование URL
jQuery.parseQuery = function(qs,options) {
	var q = (typeof qs === 'string'?qs:window.location.search), o = {'f':function(v){return unescape(v).replace(/\+/g,' ');}}, options = (typeof qs === 'object' && typeof options === 'undefined')?qs:options, o = jQuery.extend({}, o, options), params = {};
	jQuery.each(q.match(/^\??(.*)$/)[1].split('&'),function(i,p){
		p = p.split('=');
		p[1] = o.f(p[1]);
		params[p[0]] = params[p[0]]?((params[p[0]] instanceof Array)?(params[p[0]].push(p[1]),params[p[0]]):[params[p[0]],p[1]]):p[1];
	});
	return params;
}

function html_return(data){
    if(data.desktop) $('#ecomment_desktop').html(data.desktop);
	if(data.info) html_return_info(data.info);
    if(data.list) $('#ecomment_list').html(data.list);
    ecomment_counter = $('.ecomment_counter').val();
}
function html_return_info(info){
	$('#ecomment_info').html(info);
}


//первичная инициализация
if(!$('#ecomment_list').length && !$('#ecomment_info').length && !$('#ecomment_desktop').length){
    document.write('<div id="ecomment_list"></div>');
    document.write('<div id="ecomment_info"></div>');
    document.write('<div id="ecomment_desktop"></div>');

	var query = jQuery.parseQuery();
    $.ajax({
        url: ecomment_path,
        type: 'post',
        dataType: 'json',
        data:{
            op: 'init',
            ref: location.href,
	        http_ref: location.href,
			ecomment_page: query.ecomment_page || undefined
        },
        success: function(data){
            html_return(data);
        }
    })
}


//обвес сабмита формы
$('#ecomment_desktop').on('submit', '.ecomment_form', function(e){
    e.preventDefault();
	var request = $(this).serializeArray();
	request.push({
		name: 'page_title',
		value: $('title').text()
	});
    $.ajax({
        type: 'POST',
        url: ecomment_path,
        data: request,
        success: html_return,
        dataType: 'JSON'
    });
})

//обвес управляющих кнопок
$('#ecomment_list,#ecomment_desktop').on('click', 'a.ecomment_op, .pagination a', function(e){
    e.preventDefault();
    var href = $.parseQuery( $(this).attr('href') );
	href.page_title = $('title').text();
	href.http_ref = location.href;

    if(href.op == 'login'){
        href.password = prompt('Введите пароль администратора:');
        if(!href.password) return false;
    }
    if(href.op == 'get_list'){
        $('input[name=ecomment_page]').val(href.ecomment_page);
    }
    $.ajax({
        type: 'POST',
        url: ecomment_path,
        data: href,
        success: html_return,
        dataType: 'JSON'
    });
});

//обвес клика по ссылке "ответить"
$('#ecomment_list,#ecomment_desktop').on('click', 'a.ecomment_answer_link', function(e){
    e.preventDefault();
    var href = $.parseQuery( $(this).attr('href') );
    var input = $('.ecomment_form input[name=parent]');
    $('.ecomment').removeClass('ecomment_selected_for_answer');


    if(input.val() && input.val() == href.id){
        input.val('');
        $('.ecomment_answer_caption').html('');
    } else {
        var name = $(this).parents('.ecomment').addClass('ecomment_selected_for_answer').find('.ecomment_name').text();
        $('.ecomment_answer_caption').html('ответ для <b>'+ name +'</b>');
        input.val(href.id);
    }
})

//обвес редактируемых полей
//делаем поле редактируемым
$('#ecomment_list').on('click', '.ecomment_editable', function(e){
    e.preventDefault();
    $(this).attr('contenteditable', true).focus();
})
$('#ecomment_list')
	//у редактируемых полей внедряем обработчик потери фокуса
	.on('blur', '[contenteditable]', function(e){
		var $this = $(this);
		var name = $this.attr('rel');
		var key = $this.parents('.ecomment').attr('rel');

		var data = {
			op: 'update_comment',
			id: key,
			http_ref: location.href
		};
		data[name] = $this.html();

		$.ajax({
			url: ecomment_path,
			dataType: 'json',
			type: 'post',
			data: data,
			success: function(data){
				html_return(data);
				$this.off('blur').removeAttr('contenteditable');
			}
		});
	})
	//и добавляем обработку нажатия enter (в тему обработки переносов строк и сохранения изменний)
	.on('keyup, keydown', '[contenteditable]', function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			if(e.ctrlKey){ //CTRL+ENTER - потеря фокуса и сохранение
				$(this).trigger('blur');
			} else { //просто добавляем br в разметку
				document.execCommand('insertHTML', false, '<br>');
			}
		}

	});

//обвес клика по чекбоксу
$('#ecomment_desktop').on('click', '.ecomment_form_not_robot', function(e){
    var d = new Date();
    $(this).val( d.getTime() );
})

//обвес счетчика символов
$('#ecomment_desktop').on('keyup', '.ecomment_form_message', function(e){
    var length = $(this).val().length;
    $('.ecomment_counter').val( ecomment_counter - length );
});
