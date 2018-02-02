/***隐藏和显示导航栏div点击事件begin 【用作导航栏是否显示】***/
$(function() {
	$("#importNav3").bind("click",function(){
		var $impNav2=$("#importNav2");
		$impNav2.toggle();
		$(this).toggleClass("importNav");
		//信息面板的位置
		if($impNav2.css("display")=="none"){
			$(".yyBox").css("top","80px");
		}else{
			$(".yyBox").css("top","140px");	
		}	
		$impNav2.css("display")=="none"?$(".left_menu").css("top","48px"):$(".left_menu").css("top","112px");//导航菜单面板的位置
	});
});


