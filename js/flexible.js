//cms活动的公共代码文件，打包后会自动添加在所有活动act.js头部。

window.mobileUtil = (function(win, doc) {

	var UA = navigator.userAgent,
		isAndroid = /android|adr/gi.test(UA),
		isIos = /iphone|ipod|ipad/gi.test(UA) && !isAndroid, // 据说某些国产机的UA会同时包含 android iphone 字符
		isMobile = isAndroid || isIos;  // 粗略的判断

	return {
		isAndroid: isAndroid,
		isIos: isIos,
		isMobile: isMobile,
    isNewsApp: /NewsApp\/[\d\.]+/gi.test(UA),
		isWeixin: /MicroMessenger/gi.test(UA),
		isQQ: /QQ\/\d/gi.test(UA),
		isYixin: /YiXin/gi.test(UA),
		isWeibo: /Weibo/gi.test(UA),
		isTXWeibo: /T(?:X|encent)MicroBlog/gi.test(UA),
		tapEvent: isMobile ? 'tap' : 'click',
		/**
		 * 缩放页面
		 */
		fixScreen: function() {
      var docEl = doc.documentElement,
      maxwidth = docEl.dataset.mw || 750, // 每 dpr 最大页面宽度
      dpr = isIos ? Math.min(win.devicePixelRatio, 3) : 1,
      scale = 1 / dpr,
      tid,
      metaEl = doc.querySelector('meta[name="viewport"]');

      docEl.removeAttribute('data-mw');
      docEl.dataset.dpr = dpr;

      if(!metaEl){
        metaEl = doc.createElement('meta');
        docEl.firstElementChild.appendChild(metaEl);
      }
      metaEl.name = 'viewport';
      metaEl.content = fillScale(scale);

      win.addEventListener('resize', resizeCallBack, false);
      win.addEventListener('pageshow', pageshowCallBack, false);

      refreshRem();

      function resizeCallBack(e) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }

      function pageshowCallBack(e) {
        if (e.persisted) {
          clearTimeout(tid);
          tid = setTimeout(refreshRem, 300);
        }
      }

      function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > maxwidth) {
          width = maxwidth * dpr;
        }
        var rem = width / 16;
        docEl.style.fontSize = rem + 'px';
      }

      function fillScale(scale) {
        return 'initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale + ',user-scalable=0';
      }
		},
		/**
		 * 转href参数成键值对
		 * @param href {string} 指定的href，默认为当前页href
		 * @returns {object} 键值对
		 */
		getSearch: function(href) {
			href = href || win.location.search;
			var data = {},reg = new RegExp( "([^?=&]+)(=([^&]*))?", "g" );
			href && href.replace(reg,function( $0, $1, $2, $3 ){
				data[ $1 ] = $3;
			});
			return data;
		}
	};
})(window, document);

// 默认直接适配页面
mobileUtil.fixScreen();
