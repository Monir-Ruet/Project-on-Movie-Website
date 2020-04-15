$(document).ready(function(){
	$('.fa-bars').click(function(){
		var a=$('.nav-outer-container').css("display");
		if(a==='none')
			$(".nav-outer-container").css("display", "block");
		else
			$(".nav-outer-container").css("display", "none");
	})

	$('.fa-search').click(function(){
		var a=$("#search").css("display");
		// var b=$("form").css("display");
		if($(window).width()<600){
			if(a==='none'){
				$('.logo').css("display","none");
				$('form').css({"margin":"0px","width":"50%","display":"block"});
			}
			else{
				$('.logo').css("display","block");
			}
		}
		if(a==='none')
			$("#search").css("display", "block");
		else
			$("#search").css("display", "none");
	})
})
function cat(){
	var catagory=["Comedy","Romance","Drama","Thriller","Fantasy","Horror","Action","War","Crime","Adventure","Animation","Sport","Sci-fi","Documentary","History","Music","Family","Western","Mystery"];
	var nav_container=$('.nav-main-sections-container')[1];
	for(var i=0;i<catagory.length;i++)
		nav_container.innerHTML+='<li class="nav-main-section"><div class="nav-main-section-inner-container"><ul class="nav-main-section-links"><li class="nav-main-section-link"><a href="/'+catagory[i][0].toLowerCase()+catagory[i].substr(1)+'?page=1" class="nav-main-section-link-a"><span class="link-container"><span class="nav-link-icon"><i class="ion-ios-paper icon"></i></span><span class="nav-link-text">'+catagory[i]+'</span></span></a></li></ul></div></li>';
}
$(document).on("click", function(){
  $('#results').hide();
});

$(function() {      
    let isMobile = window.matchMedia("only screen and (max-width: 800px)").matches;

    if (isMobile) {
        $(document).on('click', function (e) {
        	if ($(e.target).closest(".fa-bars").length === 0) {
        		$(".nav-outer-container").hide();
        		$('.main-content').css("margin","auto");
        		$('.main-content').css("width","100%");
        	}
        });
    }
 });