var timer = null;
var offset = 5000;
var index = 0;
var imgTarget = [];
var scroll_offset = 0;
//大图交替轮换
function slideImage(i){
    var id = 'image_'+ imgTarget[i];
    $('#'+ id)
        .animate({opacity: 1}, 800, function(){
            $(this).find('.word').animate({height: 'show'}, 'slow');
        }).show()
        .siblings(':visible')
        .find('.word').animate({height: 'hide'},'fast',function(){
            $(this).parent().animate({opacity: 0}, 800).hide();
        });
}
//绑定 最小略缩图
function hookThumb(){    
    $('#thumbs li a').bind('click', function(){
            if (timer) {
                clearTimeout(timer);
            }                
            var id = this.id;            
            index = getIndex(id.substr(6));
            rechange(index,0);
            slideImage(index); 
            timer = window.setTimeout(auto, offset);  
            this.blur();            
            return false;
        });
}
//bind next/prev img 绑定略缩图上一页 下一页
function hookBtn(){
    $('#smallpicarea li img').filter('#play_prev,#play_next').bind('click', function(){
            if (timer){
                clearTimeout(timer);
            }
            var forward=1;
            var id = this.id;
            if (id == 'play_prev') {
                index--;
                if (index < 0){
                	index = imgTarget.length - 1;
                }
                forward = -1;
            }else{
                index++;
                if (index >= imgTarget.length) index = 0;
            }
            rechange(index,forward);
            slideImage(index);
            timer = window.setTimeout(auto, offset);
        });
}
//绑定大图上一页 下一页
function bighookBtn(){
    $('#bigpicarea p span').filter('#big_play_prev,#big_play_next').bind('click', function(){
            if (timer){
                clearTimeout(timer);
            }
            var forward=1;
            var id = this.id;
            if (id == 'big_play_prev') {
                index--;
                if (index < 0){
                	index = imgTarget.length - 1;
                }
                forward = -1;
            }else{
                index++;
                if (index >= imgTarget.length) index = 0;
            }
            rechange(index,forward);
            slideImage(index);
            timer = window.setTimeout(auto, offset);
        });
}

//get index
function getIndex(v){
    for(var i=0; i < imgTarget.length; i++){
        if (imgTarget[i] == v) return i;
    }
}
/** 
 * loop: 图片下标
 * forward : 方向(1:向前,-1:向后,0:方向不变)
 * **/
function rechange(loop,forward){
    var id = 'thumb_'+ imgTarget[loop];
    $('#thumbs li a.current').removeClass('current');
    $('#'+ id).addClass('current');
    /** 计算缩略图的偏移距离 **/
    if(forward == 1){//向前
    	if(loop == imgTarget.length - 1){
        	$("#thumbs").scrollLeft(imgTarget.length * scroll_offset);
        }else if(loop % 7 == 0){
        	var result = (loop / 7);
        	$("#thumbs").scrollLeft(scroll_offset * (loop) + 22 * result + result);
        }
    }else if(forward == -1){//向后
    	if(loop == imgTarget.length - 1){
        	$("#thumbs").scrollLeft(imgTarget.length * scroll_offset);
        }else if(loop % 7 == 6){
        	var result = (loop / 7);
        	$("#thumbs").scrollLeft(scroll_offset * (loop - 7) + 55 * result + result);
        }
    }
    
}
//自动播放
function auto(){
    index++;
    if (index > imgTarget.length){
        index = 0;
    }
    rechange(index,1);
    slideImage(index);
    timer = window.setTimeout(auto, offset); 
}

function imgSlide(){ 
    /** 绑定事件 **/
	hookThumb(); 
    //hookBtn();
	//bighookBtn();
	/** 计算横滚动条每张图片滚动的偏移量 **/
	scroll_offset = 0;
	var total_width = imgTarget.length * 104;
	if(total_width > 740){//大于div宽度
		scroll_offset = (total_width - 740) / imgTarget.length;
	}
} 