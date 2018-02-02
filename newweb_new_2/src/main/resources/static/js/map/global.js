/**
 * Created by Administrator on 2017-06-11.
 */
var global = {
	
	url : {
        domain : 'http://'+ window.location.host + '/'      
    },
    
    ajaxCode : {
    	success: '10001'
    },
    /*
     * cookie读写
     * */
    cookie : {
        write: function(name, value, exp, path, domain, secure) {
            if (!(/^\w*$/).test(name)) alert("cookie格式不正确");
            if (/; /.test(value)) alert("cookie格式不正确");
            var cookieValue = name + "=" + escape(value);
            if (exp) {
                var dt = new Date();
                dt.setTime(dt.getTime() + (exp * 1000));
                cookieValue += "; expires=" + dt.toGMTString();
            }
            path = path ? path : '/';
            cookieValue += "; path=" + path;
            if (domain) {
                //cookieValue += "; domain=" + domain;
                cookieValue += "; domain=" + domain;
            }
            if (secure) {
                cookieValue += "; secure";
            }
            document.cookie = cookieValue;
        },
        read: function(name) {
            var cookieValue = "";
            var arrStr = document.cookie.split("; ");
            for (var i = 0; i < arrStr.length; i++) {
                var temp = arrStr[i].match(/^(\w+)=(.+)$/);
                if (temp && temp.length > 1 && temp[1] == name) {
                    //cookieValue = temp[2];
                    cookieValue = unescape(temp[2]);
                    break;
                }
            }
            return cookieValue;
        },
        remove: function(name, path, domain) {
            var cookie = name + "=";
            path = path ? path : '/';
            //if (path){
            cookie += '; path=' + path;
            //}
            if (domain){
                cookie += ';domain=' + domain;
            }
            cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';
            document.cookie = cookie;
        }
    },

    /*
     * 获取公用请求参数
     * */
    getBaseParm : function(data){
        var da = {
            exp: window.navigator.userAgent,
            screen: {width: window.innerWidth, height: window.innerHeight},
            time: new Date().toUTCString(),
            _t:new Date().getTime()//防止低端浏览器缓存
        };
        for(var i in data){
            da[i] = data[i];
        }
        return da;
    },

    /*时间格式转换*/
    getTime : function(time){
        //var time = new Date(),
        var y = time.getFullYear(),
            m = time.getMonth()+1,
            d = time.getDate(),
            h = time.getHours(),
            M = time.getMinutes(),
            s = time.getSeconds();
        m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
        h = h < 10 ? '0' + h : h;
        M = M < 10 ? '0' + M : M;
        s = s < 10 ? '0' + s : s;
        var date = y + '-' + m + '-' + d + ' ' + h + ':' + M + ':' + s;
        return date;
    },
    
    /**
     * 获取年月日
     * date 时间戳 不传代表今天
     */
    getToday : function(time){
    	if(time){
    		var today = new Date(time);
    	}else{
    		var today = new Date()
    	}
    	var y = today.getFullYear(),
        	m = today.getMonth()+1,
        	d = today.getDate();
    	m = m < 10 ? '0' + m : m;
        d = d < 10 ? '0' + d : d;
    	return y + '-' + m + '-' + d + " 00:00:00";
    },

    /*
     * 数组
     * */
    arr : {
        /*去重*/
        removeRepeat : function(arr){
            var len = arr.length;
            if(len<=1) return arr;
            var newArr = [];
            newArr.push(arr[0]);
            for(var i=0;i<len;i++){
            	global.vaild();
                if(newArr.indexOf(arr[i]) == -1){
                    newArr.push(arr[i]);
                }
            }
            return newArr;
        },

        /*排序*/
        sequence : function(arr,sequenceArr){
            var len = arr.length;
            if(len<=1) return arr;
            if(!sequenceArr){
                return arr.sort();
            }else{
                var newArr = [];
                var seqLen = sequenceArr.length;
                for(var i=0;i<seqLen;i++){
                    if(arr.indexOf(sequenceArr[i]) > -1){
                        newArr.push(sequenceArr[i]);
                    }
                }
                return newArr;
            }
        },

        /*删除指定位置数组*/
        removeIndex : function(arr,index){
            if(index > -1){
                arr.splice(index,1);
            }
            return arr;
        },

        /*指定位置添加数组元素*/
        addIndex : function(arr,index,obj){
            if(index >= 0){
                arr.splice(index,0,obj);
            }
            return arr;
        },

        /*删除指定元素*/
        removeElm : function(arr,elm){
        	global.vaild();
            var index = arr.indexOf(elm);
            if(index >= 0){
                this.removeIndex(arr,index);
            }
        },
        /*是否包含元素*/
        contains : function(arr, obj) {  
            var i = arr.length;  
            while (i--) {  
                if (arr[i] === obj) {  
                    return true;  
                }  
            }  
            return false;  
        }  
    },

    /*
     * 获取参数
     * */
    getUrlParam : function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
            href = window.location.search,
            r = href.substr(1).match(reg);
        if (r != null){
            return decodeURIComponent(r[2]);
        }
        return '';
    },

    /**
     * 显示隐藏ajax-loading层
     * @param string msg 提示语
     * @param boolean loading 显示隐藏loading图片   true显示    false隐藏
     * @param Nan time 定时关闭
     * */
    ajaxLoading : {
        
    	timer : null,
    	
    	pop : function(msg,loading,time){       //time不传则不关闭
            msg = msg ? msg : '正在拼命加载,请稍候!';
            if(loading){
            	$('#msgLoadImg').show();
            	$('#mask .close').hide();
            }else{
            	$('#msgLoadImg').hide();
            	$('#mask .close').show();
            }
            loading ? $('#msgLoadImg').show() : $('#msgLoadImg').hide();
            $('#msgSpan').html(msg);
            $('#ajax-loading').show();
            $('#mask').show();
            if(time){
                global.ajaxLoading.close(time);
            }
        },

        close : function(time){                 //不传则立即关闭
        	global.ajaxLoading.timer = setTimeout(function(){
                $('#mask').hide();
                $('#ajax-loading').hide();
            },time);
        },
        
        clearTimer : function(){
        	$('#ajax-loading').find('.close').click(function(){
        		clearTimeout(global.ajaxLoading.timer);
    			global.ajaxLoading.close();
    		});
        }
    },

    /**
     * 遮罩层显示隐藏
     * */
    mark : {
        show : function(animate){
            $('#mark').show(animate);
        },

        hide : function(animate){
            $('#mark').hide(animate);
        }
    },

    /**
     * 深层对象克隆，不影响原来对象
     * */
    cloneObj : function(obj){
        $.extend(clone,obj);
        return clone;
    },

    /**
    * 地图渲染
    * */
    map : function(){
        var map = new AMap.Map('mymap',{
            resizeEnable: true,
            zoom: 10,
            center: [116.480983, 40.0958]
        });
        return map;
    },
    
    vaild : function(){    //为IE8 的indexOf增加的方法
    	if (!Array.prototype.indexOf){  
            Array.prototype.indexOf = function(elt /*, from*/){  
            var len = this.length >>> 0;  
            var from = Number(arguments[1]) || 0;  
            from = (from < 0)  
                 ? Math.ceil(from)  
                 : Math.floor(from);  
            if (from < 0)  
              from += len;  
            for (; from < len; from++)  
            {  
              if (from in this &&  
                  this[from] === elt)  
                return from;  
            }  
            return -1;  
          };  
        } 
    },
    
    
    /**
     * 创建表头
     */
    creatTableH : function(params){
    	var tobayWidth = params.width;
    	var hTr = document.createElement('tr');
    	var tdW = [];
    	for(var i=0;i<params.hTh.length;i++){
    		var th = document.createElement('th');
    		var div = document.createElement('div');
    		if(params.widthType == '%'){
    			var w = tobayWidth / 100 * params.tdW[i] - 11;
    			div.style.width = w + 'px';
    			tdW.push(w);
    		}else{
    			div.style.width = params.tdW[i] - 11 + 'px';
    		}
    		div.innerHTML = params.hTh[i];
    		th.appendChild(div);
    		hTr.appendChild(th);
    	}
    	$(params.id).append($(hTr));
    	return {
    		width : tdW
    	};
    },
    
    /**
     * 局部模态框
     * @params dom 要遮罩的层的父级
     * @params msg 提示信息
     * @params loading 值为true || false  true为显示loading动画 false反之
     * @params time 自动关闭时间   毫秒
     * 
     */
    subModal : function(){
    	var modal,modalLoading,imgDom,modalSpan;
    	var pop =  function(dom,msg,loading,time){
    		if(!modal){
    			modal = document.createElement('div');
            	modal.className = 'modalMask';
            	modalLoading = document.createElement('div');
            	modalLoading.className = 'modalLoading';
            	imgDom = document.createElement('div');
            	imgDom.src = appCtx  +'resources/images/main/big_loading.gif';
            	imgDom.className = 'loadimg';
            	modalSpan = document.createElement('span');
            	modalLoading.appendChild(imgDom);
            	modalLoading.appendChild(modalSpan);
            	$(dom).append(modal);
            	$(dom).append(modalLoading);
    		}else{
    			modal.style.display = 'block';
    			modalLoading.style.display = 'block';
    		}
    		if(loading){
        		imgDom.style.display = 'block';
        	}else{
        		imgDom.style.display = 'none';
        	}
    		modalSpan.innerHTML = msg;
    		if(time){
    			setTimeout(function(){
    				close();
    			},time);
    		}
    	};
    	
    	var close = function(){
    		modal.style.display = 'none';
			modalLoading.style.display = 'none';
    	};
    	
    	return {
    		pop : pop,
    		close : close
    	};
    	
    	/*close : function(){
    		subModal.modal.style.display = 'none';
			subModal.modalLoading.style.display = 'none';
    	}*/
    	//
    },
    
    /*
     * 车牌颜色
     */
    carColor: function(status){
    	if(typeof(status) == 'string'){
    		status = JSON.parse(status);
    	}
    	var color = '蓝色';
    	switch (status){
    		case 1 :
    			color = '蓝色';
    			break;
    		case 2 :
    			color = '黄色';
    			break;
    		case 3 :
    			color = '黑色';
    			break;
    		case 4 :
    			color = '白色';
    			break;
    		case 9 :
    			color = '其他';
    			break;
    	}
    	return color;
    },
    
    carColorC: function(color){
    	if(color.length == 1){
    		color+='色';
    	}
    	var Ccolor = '1';
    	switch (color){
    		case '蓝色':
    			Ccolor = 1;
    			break;
    		case '黄色':
    			Ccolor = 2;
    			break;
    		case '黑色':
    			Ccolor = 3;
    			break;
    		case '白色':
    			Ccolor = 4;
    			break;
    		case '其他':
    			Ccolor = 9;
    			break;
    	}
    },
    
    maskHide: function(count,_this){
    	_this.mask[count] = 1;
		if(_this.mask.indexOf(0) == -1){
			global.ajaxLoading.close();
		}
    },
    
    /*
     * 各省车牌对照
     */
    /*carNo: {
    	'京': 'j11',
    	'津': 'j12',
    	'沪': 's31',
    	'渝': 'z50',
    	'冀': 'h13',
    	'豫': 'h41',
    	'云': 'y53',
    	'辽': 'l21',
    	'黑': 'h23',
    	'湘': 'h43',
    	'皖': 'a34',
    	'鲁': 's37',
    	'新': 'x65',
    	'苏': 'j32',
    	'浙': 'z33',
    	'赣': 's36',
    	'鄂': 'h42',
    	'桂': 'g45',
    	'甘': 'g62',
    	'晋': 's14',
    	'蒙': 'n15',
    	'陕': 's61',
    	'吉': 'j22',
    	'闽': 'f35',
    	'贵': 'g52',
    	'粤': 'g44',
    	'青': 'q63',
    	'藏': 'x54',
    	'川': 's51',
    	'宁': 'n64',
    	'琼': 'h46',
    	'测': 'c10'
    }*/
    
    /*
     * 保留nun位小数
     */
    tofixed: function(data,num){
    	if(typeof(data) == 'number'){
    		if(JSON.stringify(data).indexOf('.') > -1){
        		return data.toFixed(2);
        	}else{
        		return JSON.stringify(data) + '.00';
        	}
    	}else{
    		return data;
    	}
    	
    },
    
    
    /*
     *饼图没数据时显示图片 
     */
    noData: function(dom){
    	var html = '<div class="pa" id="noData"></div>';
    	$(dom).append(html);
    }
    

};

global.ajaxLoading.clearTimer();
/*
global.ajaxLoading.pop('正在拼命加载,请稍候!',true);
global.ajaxLoading.close(2000);
*/
