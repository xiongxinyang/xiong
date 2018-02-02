var ClipBoard = function(obj){
    this.handlerID = obj.handlerID || null;
    this.textID = obj.textID || null;
    this.type = obj.type || 'copy';
    this.isAttr = obj.isAttr || false;
    this.isPlugin = true;
    this.isActive = false;

    var ua = window.navigator.userAgent;
    var is_IE = ua.match(/(rv:|msie )\d+/i);
    var IE_Version = is_IE ? parseInt(is_IE[0].split(/:| /g)[1]) : 9;
    if(IE_Version <= 8){
        this.isPlugin = false;
    }
    var handlerObj = document.getElementById(obj.handlerID);
    if(typeof this.type === 'string'){
        handlerObj.setAttribute('data-clipboard-action',this.type)
    }else{
        throw error('type类型错误！');
    }
    if(!obj.isAttr && obj.textID){
        handlerObj.setAttribute('data-clipboard-target','#'+obj.textID);
    }
}
ClipBoard.prototype.attach = function(){
    if(this.isActive){ // 对象已经被实例化
        return;
    }
    var tip = '复制';
    if(this.type === 'cut'){
        tip = '剪切';
    }
    this.isActive = true;
    if(this.isPlugin){
        var clip = new Clipboard('#'+this.handlerID);
        clip.on('success', function(e) {
            //alert(tip+'成功，可通过Ctrl+V进行粘贴！');
        	 global.ajaxLoading.pop(tip+'成功，可通过Ctrl+V进行粘贴！',true,1000);
        });
        clip.on('error', function(e) {
            //alert(e.action+'操作失败！');
        });
    }else if(window.attachEvent){
        var self = this;
        var handlerObj = document.getElementById(this.handlerID);
        handlerObj.attachEvent('onclick',function(){
            var text = '';
            if(self.isAttr){// 复制属性值
                text = handlerObj.getAttribute('data-clipboard-text');
            }else{
                var textObj = document.getElementById(self.textID);
                text = textObj.value || textObj.innerHTML;
            }
            window.clipboardData.setData('Text',text);
            global.ajaxLoading.pop(tip+'成功，可通过Ctrl+V进行粘贴！',true,1000);
        });
    }else{
            alert('浏览器版本过低，不支持该插件！')
    }
}