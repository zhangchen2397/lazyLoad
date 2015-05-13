lazyLoad 图片延时加载组件
=============================

图片延时加载组件，支持`img`标签形式图片及`background`背景图片

###对外调用方法及事件

```
@method setLazyImgs 动态加载图片时，重置需要延时加载图片时调用
@method actionLazy 执行图片延时加载
@customEvent afterLoaded 图片正解加载后执行事件
```

###具体使用

```javascript
var lazyLoadIns = new lazyLoad( {
    lazyLoadAttr: 'data-src',   //图片真实地址属性，适用于img及background
    preloadHeight: 20,          //预加载长度
    loadedCallback: null,       //加载完图片回调方法  
    lazyLoadBg: true,           //是否启动背景图延时加载
    lazyLoadBgClass: 'lazybg'   //如启用背景图延时加载，背景图class标识
} );

//调用lazyLoad方法
lazyLoadIns.actionLazy();

//调用替换真实图片后事件
$.bind( me, 'afterLoaded', function( data ) {
    console.log( data );
    //to do sth
} );

```

###demo 手机扫描以下二维码体验
![demo](https://github.com/zhangchen2397/lazyLoad/blob/master/qrcode.png?raw=true)
