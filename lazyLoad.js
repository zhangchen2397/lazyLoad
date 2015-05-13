/**
 * 图片延时载组件
 * @author samczhang@tencent.com
 * --------------------------------------
 * 对外调用接口及自定义事件
 * @method setLazyImgs 动态加载图片时，重置需要延时加载图片时调用
 * @method actionLazy 执行图片延时加载
 * @customEvent afterLoaded 图片正解加载后执行事件
 * 
 * demo http://info.3g.qq.com/g/s?aid=wechat_l
 *
 */

define( 'lazyLoad', [ 'jqmobi' ], function( $ ) {
    var lazyLoad = function( config ) {
        this.defaultConfig = {
            lazyLoadAttr: 'data-src',   //图片真实地址属性，适用于img及background
            preloadHeight: 20,          //预加载长度
            loadedCallback: null,       //加载完图片回调方法  
            lazyLoadBg: true,           //是否启动背景图延时加载
            lazyLoadBgClass: 'lazybg'   //如启用背景图延时加载，背景图class标识
        };

        this.config = $.extend( this.defaultConfig, config || {} );

        this.init.call( this );
    };

    $.extend( lazyLoad.prototype, {
        init: function() {
            this.setLazyImgs();
            this._initEvent();
            this.actionLazy();
        },

        _initEvent: function() {
            var me = this,
                config = this.config;

            this.actionLazy = $.proxy( me._lazy, me );

            $( window ).on( 'scroll', me.actionLazy );
            $( window ).on( 'resize', me.actionLazy );
            $( window ).on( 'orientationchange', me.actionLazy );

            $.bind( me, 'afterLoaded', function( event ) {
                me._afterLoaded( event.img , event.loadType);
            } );
        },

        _cache: function() {

        },

        _getLazyImgs: function() {
            var me = this,
                config = this.config,
                lazyImgs = [],
                item = null;

            $( 'img' ).each( function( el, index ) {
                item = $( this );
                if ( item.attr( config.lazyLoadAttr ) ) {
                    lazyImgs.push( item );
                }
            } );

            if ( config.lazyLoadBg ) {
                $( '.' + config.lazyLoadBgClass ).each( function( el, index ) {
                    item = $( this );
                    if ( item.attr( config.lazyLoadAttr ) ) {
                        lazyImgs.push( item );
                    }
                } );
            }

            return lazyImgs;
        },

        setLazyImgs: function() {
            this.lazyImgs = this._getLazyImgs();
            this.lazyImgsLen = this.lazyImgs.length;
        },

        _lazy: function() {
            var me = this,
                config = this.config,
                lazyLoadAttr = config.lazyLoadAttr,
                preloadHeight = config.preloadHeight,

                win = $( window ),
                scrollTop = document.body.scrollTop,
                clientHeight = win.height(),
                viewOffset = scrollTop + clientHeight + preloadHeight,
                scrollOffset = scrollTop - preloadHeight;

            $.each( this.lazyImgs, function( index, item ) {
                var itemPosY = item.offset().top,
                    itemPosDepY = itemPosY + item.height(),
                    imgSrc = item.attr( lazyLoadAttr );

                if ( itemPosY < viewOffset && itemPosDepY > scrollOffset && imgSrc ) {
                    if ( !item.hasClass( config.lazyLoadBgClass ) ) {
                        //lazyload img
                        item.attr( 'src', imgSrc );
                        item.removeAttr( lazyLoadAttr );
                        me.lazyImgsLen--;

                        $.trigger( me, 'afterLoaded', [ {
                            img: item,
                            loadType: 'img'
                        } ] );
                    } else {
                        //lazyload background-image
                        item.css( 'background-image','url( ' + imgSrc + ' )' );
                        item.removeAttr( lazyLoadAttr );
                        me.lazyImgsLen--;

                        $.trigger( me, 'afterLoaded', [ {
                            img: item,
                            loadType: 'bg'
                        } ] );
                    }
                }
            } );

            //动态添加的数据不能根据lazyImgsLen的长度来移除事件
            me.lazyImgsLen || me._dispose();
        },

        _dispose: function() {
            $( window ).off( 'scroll', this.actionLazy );
            $( window ).off( 'resize', this.actionLazy );
            $( window ).off( 'orientationchange', this.actionLazy );
        },

        _afterLoaded: function( img , loadType) {
            var me = this,
                config = this.config;

            if ( $.isFunction( config.loadedCallback ) ) {
                config.loadedCallback( img , loadType );
            }
        }
    } );

    return lazyLoad;
} );
