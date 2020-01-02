if(!window.location.host.match(".51cto.com")){
window.location.href="https://blog.51cto.com"
}
var url = window.location.href;
var referer = document.referrer;
if(typeof pv_log_info == 'undefined'){
    var pv_log_info = {};
}
$.post(BLOG_URL+'pv-log',{'url':url,'referer':referer,'info':pv_log_info},function(e){},'json')