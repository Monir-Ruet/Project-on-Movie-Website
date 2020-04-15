$(document).ready(function(){
	$('.fa-bars').click(function(){
		var a=$('.nav-outer-container').css("display");
		if(a==='none') {
			$(".main-content").css("margin", "auto");
			$(".main-content").css("width", "100%");
		}
		else {
			$(".main-content").css("margin-left", "235px");
			$(".main-content").css("width", "calc(100% - 235px)");
		}
	})
})
