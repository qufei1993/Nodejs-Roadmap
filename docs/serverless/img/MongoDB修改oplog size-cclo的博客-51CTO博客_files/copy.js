/*if(!$.browser.msie){
	document.oncopy = addLink;
}
window.onload = function(){
    this.focus();
}
function addLink() {
    var body_element = document.getElementsByTagName('body')[0];
    var selection;
    selection = window.getSelection();
    var pagelink = '<br/><br/>作者：<a href="'+nicknameurl+'" class="name fl">'+nickname+'</a><br/>链接：<a href="'+myself+'">'+myself+'</a><br/>来源：51CTO博客<br/>著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。'
    var copytext = selection + pagelink;
    var newdiv = document.createElement('div');
    newdiv.style.position='absolute';
    newdiv.style.left='-99999px';
    body_element.appendChild(newdiv);
    newdiv.innerHTML = copytext;
    selection.selectAllChildren(newdiv);
    window.setTimeout(function() {
        body_element.removeChild(newdiv);
    },0);
 
}*/
