/**
 * Created by Administrator on 2017-06-13.
 */

var nav = {
    init : function(){
        this.bind();
        this.sliderH();
    },

    /**
     * 计算导航高度的高度
     * */
    sliderH : function(){
        var winH = $(window).height();
        var sliderH = winH - 76;
        this.whiceH = [winH,sliderH];
    },
    
    classActive : function(){
    	$('.menu'+menuId).addClass('active');
    },


    bind : function(){
        var _this = this;

        $("input[type = 'password']").change(function () {
                    var s  = $(this).val();
                    var patrn=/^(\w){4,20}$/;
                    if (!patrn.exec(s)) {
                        //$(this).css("background-color","#FF1213");
                        global.ajaxLoading.pop("密码为4到20个数字字母",true,1000);
                    }else {
                        //$(this).css("background-color","#FFFFCC");
                    }
            }
        );

        $(".closeBtn").click(function () {
                     $("#oldPwd").val("");
                     //$("#oldPwd").css("background-color","#FFFFCC");
                     $("#newPwd").val("");
                     //$("#newPwd").css("background-color","#FFFFCC");
                     $("#confirm").val("");
                     //$("#confirm").css("background-color","#FFFFCC");
            }
        );

        $("#updatePwdBtn").click(function () {
            var isOk = false;
            $("input[type = 'password']").each(function (index,element) {
                    var s  = $(element).val();
                    var patrn=/^(\w){4,20}$/;
                    if (!patrn.exec(s)) {
                        $(element).css("background-color","#FF1213");
                        global.ajaxLoading.pop("密码为4到20个数字字母",true,1000);
                        isOk = true;
                    }
                }
            );
            if (isOk){
                return ;
            }
            var params = [{
                name  : "oldPwd",
                value : $("#oldPwd").val()
            },{
                name  : "newPwd",
                value : $("#newPwd").val()
            },{
                name  : "confirm",
                value : $("#confirm").val()
            }]
            $.ajax({
                type: "POST",
                url: appCtx + "/updatePassword.html",
                data: params,
                dataType: "json",
                success  : function(result){
                    if(result.code == "RETURN_ERROR_CODE"){

                        global.ajaxLoading.pop(result.msg,true,1000);
                    }
                    if(result.code == "RETURN_OK_CODE"){
                        var msg = "修改密码完成\n\n请确认！";
                        if (confirm(msg)==true){
                            window.location.href = appCtx + "loginOut.html";
                        }else{
                            window.location.href = appCtx + "loginOut.html";
                        }
                    }
                }
            });
        });

        $('.nav-menu .small-nav').click(function(){
            $('.big-nav').fadeIn();
            $('#mask-nav').fadeIn();
        });
        
        $('#mask-nav').mouseover(function(){
        	$('.big-nav').fadeOut();
            $('#mask-nav').fadeOut();
        });
        
        $('.big-nav').on('mouseover','.sub-menu',function(){
        	if($(this).find('.three-menu-ul-hide').length ==1){
                $(this).find('.three-menu-ul-hide').show();
                $('.big-nav').addClass('big-nav-show');
                $(this).find('.icon-more').hide();
            }
        });
        
        $('.big-nav').on('mouseout','.sub-menu',function(){
        	if($(this).find('.three-menu-ul-hide').length ==1){
                $(this).find('.three-menu-ul-hide').hide();
                $('.big-nav').removeClass('big-nav-show');
                $(this).find('.icon-more').show();
            }
        });
        
        /*$('.big-nav').on('click','.three-menu-li',function(){
        	var menuId = $(this).attr('data-menuId');
        	global.cookie.write('menuId',menuId);
        });*/

        /*$(document).scroll(function(e){
            var scrollTop = $(document).scrollTop();
            if(scrollTop > 0){
                if(scrollTop < 42){
                    $('.slider').css({
                        'position':'fixed',
                        'height':_this.whiceH[0] - scrollTop + 'px',
                        'top':42 - scrollTop + 'px',
                        'z-index':1000
                    });
                }else{
                    $('.slider').css({
                        'position':'fixed',
                        'height':_this.whiceH[0] + 'px',
                        'top':0,
                        'z-index':1000
                    });
                }
            }else{
                $('.slider').css({
                    'position':'absolute',
                    'height':_this.whiceH[1] + 'px',
                    'top':0
                });
            }
        });*/
    },
};

nav.init();
