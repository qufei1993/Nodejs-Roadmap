// H5和Pc同用（解析博文展示）zjf20171011
(function(){
  setTimeout(function(){
    $(".main-content").find('a').css({'color':'#4285f4'})
    $(".main-content").find('.cnblogs_code_copy').remove()
    $(".artical-content-bak").find('img').css('cursor','pointer')
    
    $(".artical-content-bak").find('img').click(function(){
        var hrefobj = $(this).parent('a')
        var href = ''
        if(hrefobj.length != 0){
            href = hrefobj.attr('href')
            if(typeof href == 'undefined') href = ''; 
        }
        var img_src = $(this).attr('src')
        href=="" ? window.open(img_src) : window.open(href)
        return false;
    })
  },50)
  if(is_old != 1){
    hljs.initHighlightingOnLoad();
  }
})();

/**
 * [insertCodeElement 代码部分是用<pre>标签包裹的，而且class属性中的“brush:”后面为这段代码所用的语言，只有在<code>标签里，并且 <code> 标签要有一个类似于  “language-css” 之类的class，才能正确工作]
 * @param  {[type]} content   [博文]
 * @param  {[type]} container [放置这些内容的容器]
 */
function insertCodeElement(content, container){
  container = container || document;
  // 创建一个 div 来放置获取到的内容，这样就可以把 content 字符串内容转换成 dom
  // 方便我们对这个 dom 进行操作（只是创建 div，并没有插入到文档，他只存在于内存中）
  var parent = document.createElement('div');
  parent.innerHTML = content;

  // 找到 parent 中的所有 pre 标签，并遍历
  var $pres = $(parent).find('pre');
  $pres.each(function(index, el) {
    var $el = $(el),
        html = $el.html(),
        code = document.createElement('code'),
        elClass = $el.attr('class'),
        // 获取 pre 标签中，class 属性中包含的本段代码所有的编程语言
        language = elClass.substring(6, elClass.indexOf(';'));

    code.className = 'language-' + language;
    code.innerHTML = html;

    $el.html(code);
  });

  $(container).html(parent.innerHTML);

  // 最后，调用 Prism 的方法来高亮代码
  Prism.highlightAll();
}
