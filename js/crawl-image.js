// ==UserScript==
// @name         捕获查看到的图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       wuhialin
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// ==/UserScript==
window.jQuery321 = $.noConflict(true);
(function($) {
    // #@require      https://wuhialin.github.io/js/crawl-image.js
    'use strict';
    var attr = 'use' + String(Math.random()).substr(2);

    function resolve(url, base_url) {
        var doc      = document,
            old_base = doc.getElementsByTagName('base')[0],
            old_href = old_base && old_base.href,
            doc_head = doc.head || doc.getElementsByTagName('head')[0] ,
            our_base = old_base || doc_head.appendChild(doc.createElement('base')),
            resolver = doc.createElement('a'),
            resolved_url;
        our_base.href = base_url || '';
        resolver.href = url;
        resolved_url  = resolver.href; // browser magic at work here
        if (old_base) old_base.href = old_href;
        else doc_head.removeChild(our_base);
        return resolved_url;
    }
    
    if(location.protocol.toLowerCase() === 'https:'){
        $('head').append('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
    }

    setInterval(function(){
        var urls = [];
        $('*:visible:not(['+attr+'])').each(function(){
            $(this).attr(attr, 1);
            var image = $(this).css('background-image'),
                url;
            image = image.substr(3).replace(/[\'\"\(\)]/g, '');
            if(image && image != 'none' && image != 'e'){
                url = resolve(image);
                urls.push(url);
            }
            if(this.tagName.toLowerCase() === 'img'){
                url = resolve($(this).attr('src'));
                urls.push(url);
            }
        });
        if(urls.length){
            try{
                var iframe = document.createElement('iframe'),
                    form = document.createElement('form'),
                    id = 'crawl-form' + String(Math.random()).substr(2),
                    frameId = 'crawl-iframe' + String(Math.random()).substr(2),
                    input;
                iframe.src= '404';
                iframe.style.height = '0';
                iframe.style.display = 'none';
                iframe.style.border = '0';
                iframe.style.margin = '0';
                iframe.style.padding = '0';
                iframe.id = frameId;
                form.action = 'http://yii2.tk/crawl/img';
                form.method = 'post';
                form.style.display = 'none'
                form.id = id
                $.each(urls, function(k, url){
                    input = document.createElement('input')
                    input.type = 'hidden';
                    input.name = 'data[]';
                    input.value = url;
                    form.append(input)
                });
                $('body').append(iframe);
                $('#'+frameId).contents().find('body').append(form)
                $('#'+frameId).contents().find('#'+id).submit();
            }
            catch(e){
                if(typeof console.log === 'function'){
                    console.log(e);
                }
            }
        }
    }, 5000);
})(jQuery321);
