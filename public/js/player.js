function getAjax(offset)
{
	$.ajax({
		url : '/watch?v='+window.location.href.substr(30)+'&offset='+offset,
		type : "GET",
		dataType:'json',
		success : function(response) {
			for(var i=0;i<response.length;i++){
				document.getElementsByClassName('play-list')[0].innerHTML+='<a href="/watch?v='+response[i].embeded+'" class="nav"><div class="card"><div class="img"><img src="https://img.putlocker.how/'+response[i].img+'"></div><div class="details"><h3 class="title">'+response[i].title+'</h3><p class="all"> Rating :'+response[i].rating+'</p><p class="all"> Year :'+response[i].year+'</p><p class="all"> Genre :'+response[i].genre+'</p></div></div></a>';
			}
		}
	});
}
function suggestion(){
	var offset = 0;
	// getAjax(offset);
	$(window).scroll(function() {
		if($(window).scrollTop() >= $(document).height() - $(window).height()) {
			offset+=16;
			getAjax(offset);
		}
	});
}

$(document).on('click', function (e) {
	if ($(e.target).closest(".fa-bars").length === 0) {
		$(".nav-outer-container").hide();
	}
});