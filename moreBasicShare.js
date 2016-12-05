/*
 * Basic Share
 * @version 0.3
 * @author www.qinco.net
 * @license The MIT License (MIT)
 */
// Create closure.
;
(function($, window, document) {

    $.fn.basicShare = function() {
        //equals to function isset() in PHP:
        var isset = function(val) {
            return (typeof(val) != "undefined") && (val !== null);
        }

        //a function to inject css code in head
        this.insertCss = function(cssCode) {
            var style = document.createElement('style');
            style.type = 'text/css';

            if (style.styleSheet) {
                // IE
                style.styleSheet.cssText = cssCode;
            } else {
                // Other browsers
                style.innerHTML = cssCode;
            }

            document.getElementsByTagName("head")[0].appendChild(style);
        }

        //inject css:
        this.insertCss(
            " \
              .basicShareClearFix {box-sizing:border-box;} \
              .basicShareClearFix:before, \
              .basicShareClearFix:after { display:table;content:' '; } \
              \
              .basicShareClearFix:after { clear:both !important; } \
              \
              .basicShareZoomIn {\
                -webkit-transform:scale(1.06);\
                -moz-transform:scale(1.06);\
                transform:scale(1.06);\
                -moz-opacity:1;\
                -webkit-opacity:1;\
                opacity:1;\
                filter:alpha(opacity=100);\
              }\
              .basicShareZoomOut {\
                -webkit-transform:scale(1);\
                -moz-transform:scale(1);\
                transform:scale(1);\
                -moz-opacity:0.76;\
                -webkit-opacity:0.76;\
                opacity:0.76;\
                filter:alpha(opacity=76);\
              }\
              \
              #basicShareBg {box-sizing:border-box;position: fixed;left:0;top:0;bottom:0;right:0;z-index:9999999999;background:rgba(0,0,0,0.7)} \
              #basicShareWrap {box-sizing:border-box;display:table;position:relative;margin-left:auto;margin-right:auto;background:#ffffff;overflow:auto;border:4px solid #333;}\
              #basicShareCloseBox {box-sizing:border-box;position:absolute; width:50px;height:50px;right:5px;top:5px;}\
              #basicShareCloseBox > a {box-sizing:border-box;width:50px;height:50px;padding:0;text-align:center;display:block}\
              #basicShareCloseBox > a > img {width:32px;height:32px; margin-top:9px;margin-left:7px;}\
              #basicShareGoBack {box-sizing:border-box;position:absolute;width:50px;height:50px;left:5px;top:5px;}\
              #basicShareGoBackBtn {width:50px;height:50px;padding:0;text-align:center;background:#f6f6f6;display:none;}\
              #basicShareGoBackBtn > img {width:32px;height:32px; float:left;margin-top:9px;margin-left:7px;}\
              \
              #basicSharOutter {box-sizing:border-box;display:table;width:100%; padding:80px 0;}\
              #basicSharInner {box-sizing:border-box;margin:auto;height:100%;}\
              #basicSharContainer {box-sizing:border-box;display:table-cell;vertical-align:middle;height:100%;}\
              .basicShareElement {float: left; display:block; background:#f9f9f9; text-decoration:none!important; border:none!important;margin:1px; box-sizing: border-box;text-align:center;padding:30px 10px 20px 10px;}\
              .basicShareElement > div {}\
              .basicShareElement > p {color:#999; text-decoration:none!important;border:none!important;}\
              \
              .cssTransition {-ms-transition-duration: .5s;-moz-transition-duration: .5s;-webkit-transition-duration: .5s;transition-duration: .5s;-ms-transition-property: all;-moz-transition-property: all;-webkit-transition-property: all;transition-property: all;}\
              .cssOpacity {-moz-opacity:0.76;-webkit-opacity:0.76;filter:alpha(opacity=76);opacity:0.76;}\
              \
              img.basicShareImgRes { \
                display:block; \
                max-width:100%; \
                width:100%; \
                height:auto; \
              } \
            ");

        var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var is_mobile = false;
        var cellWidth = '49%';
        var innerWidth = '400px';
        var iconPadding = '2em';

        if (window_width < 500) {
            cellWidth = '99%';
            is_mobile = true;
            innerWidth = '260px';
            iconPadding = '4em';
        }


        var imgPath = "https://dn-qinco.qbox.me/basicShare/img",
            imgPreload = [
                imgPath + "/weibo-dark.png",
                imgPath + "/weixin-dark.png"
            ];

        var temp = new Array();
        for (i = 0; i < imgPreload.length; i++) {
            temp[i] = new Image();
            temp[i].src = imgPreload[i];
        }

        $('body').on('click', '.basicShareCloseBtn', function() {
            $('#basicShareBg').fadeOut('400').remove();
        });


        $('body').on('click', '#basicShareWeixin', function() {
            $('#basicShareGoBackBtn').fadeIn().css({
                'display': 'block'
            });
            $('#basicSharContainer').hide().html($('#basicShareWeixinShow').html()).fadeIn('1000');
        });

        $('body').on('click', '#basicShareGoBackBtn', function() {
            $(this).fadeOut();
            $('#basicSharContainer').html($('#basicShareTemp').html());
        });


        $('body').on('mouseenter', '.basicShareElement', function() {
            $(this).children('div').removeClass('basicShareZoomOut').addClass('basicShareZoomIn');
            var $temp = $(this).children('p');
            $temp.css({
                'color': $temp.attr('data-color')
            });
        });

        $('body').on('mouseleave', '.basicShareElement', function() {
            $(this).children('div').removeClass('basicShareZoomIn').addClass('basicShareZoomOut');
            $(this).children('p').css({
                'color': '#999'
            });
        });


        return this.each(function() {

            //Assign current element to variable, in this case is UL element
            var _ = $(this);


            var shareUrl = _.attr('data-shareUrl');
            var shareTitle = _.attr('data-shareTitle');
            var sharePic = _.attr('data-sharePic');

            if (typeof shareUrl == 'undefined')
                shareUrl = window.location.href;
            if (typeof shareTitle == 'undefined')
                shareTitle = document.title;
            if (typeof sharePic == 'undefined')
                sharePic = '';

            var baseUrl = window.location.protocol + '//' + window.location.host;
            if (shareUrl[0] === '/') {  // fix relative URL
              shareUrl = baseUrl + shareUrl;
            }
            if (sharePic[0] === '/') {  // fix relative URL
              sharePic = baseUrl + sharePic;
            }

            _.on('click', function() {

                if ($('#basicShareBg').length > 0)
                    $('#basicShareBg').remove();


                $('body').append(
                    "<div id='basicShareBg'>"
                      +"<div id='basicShareWrap' >"
                        +"<div id='basicShareCloseBox'>"
                          +"<a href='javascript:' class='basicShareCloseBtn'><img src='"+imgPath+"/closeBtn.png' /></a>"
                        +"</div>"
                        +"<div id='basicShareGoBack'>"
                          +"<a href='javascript:' id='basicShareGoBackBtn'><img src='"+imgPath+"/backBtn.png' /></a>"
                        +"</div>"
                        +"<div id='basicSharOutter'>"
                             +"<div id='basicSharInner' style='max-width:"+innerWidth+";'>"

                                 +"<div id='basicSharContainer'>"

                                     +"<a target='_blank' class='basicShareCloseBtn basicShareElement' style='width:"+cellWidth+";' href='http://v.t.sina.com.cn/share/share.php?title="+encodeURIComponent(shareTitle)+"&url="+encodeURIComponent(shareUrl)+"&pic="+encodeURIComponent(sharePic)+"'>"
                                       +"<div class='basicShareClearFix cssTransition cssOpacity' style='padding-left:"+iconPadding+";padding-right:"+iconPadding+";'>"
                                          +"<img src='"+imgPath+"/weibo-dark.png' alt='Weibo' class='basicShareImgRes' />"
                                       +"</div>"
                                       +"<p class='cssTransition' style='color:#999;' data-color='#e1b064'>分享到微博</p>"
                                     +"</a>"

                                     +"<a href='javascript:' id='basicShareWeixin' class='basicShareElement' style=' width:"+cellWidth+";'>"
                                       +"<div class='basicShareClearFix cssTransition cssOpacity' style='padding-left:"+iconPadding+";padding-right:"+iconPadding+";'>"
                                            +"<img src='"+imgPath+"/weixin-dark.png' alt='Weixin' class='basicShareImgRes'  />"
                                       +"</div>"
                                       +"<p class='cssTransition' style='color:#999;' data-color='#a0d191'>分享到微信</p>"
                                     +"</a>"

                               +"</div>"
                               +"<br/>"
                               +"或分享到:&nbsp;"
                               +"<a target='_blank' style='font-weight: 700;' href='https://plus.google.com/share?url="+encodeURIComponent(shareUrl)+"'>Google+</a>"
                               +",&nbsp;"
                               +"<a target='_blank' style='font-weight: 700;' href='https://twitter.com/intent/tweet?text="+encodeURIComponent(shareTitle)+"&url="+encodeURIComponent(shareUrl)+"'>Twitter</a>"
                               +",&nbsp;"
                               +"<a target='_blank' style='font-weight: 700;' href='https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(shareUrl)+"'>Facebook</a>"

                             +"</div>"


                             +"<div style='display:none;' id='basicShareTemp'></div>"

                             +"<div style='display:none;' id='basicShareWeixinShow'>"
                               +"<div style='display:table;width:100%;'>"
                                 +"<div style='float:left;width:100%;'>"

                                   +"<div style='margin:auto;width:50%;text-align:center;min-height:200px;'>"
                                       +"<img alt='二维码加载中...' src='https://api.qinco.me/api/qr?size=400&content="+encodeURIComponent(shareUrl)+"' style='width:100%;max-width:300px;height: auto;' />"
                                   +"</div>"

                                   +"<div style='display:table;width:100%;text-align:center;'>"
                                     +"<h5>打开微信“扫一扫”，扫描上面的二维码，打开网页后再点击微信右上角的菜单、即可分享到微信</h5>"
                                   +"</div>"

                                 +"</div>"
                               +"</div>"
                             +"</div>"

                        +"</div>"

                      +"</div>"
                    +"</div>"
                );


                $('#basicShareBg').css({
                    height: $('body').height() + 'px',
                    filter: "progid:DXImageTransform.Microsoft.gradient( startColorstr='#d1000000', endColorstr='#cf000000',GradientType=0 )"
                });


                $('#basicShareWrap').css({
                    height: 'auto',
                    maxHeight: (is_mobile) ? (parseInt(window_height * 0.9) + 'px') : (parseInt(window_height * 0.4) + 'px'),
                    minHeight: '200px',

                    width: (is_mobile) ? '90%' : '70%',
                    minWidth: '300px',
                    maxWidth: (is_mobile) ? (parseInt(window_width * 0.9) + 'px') : '600px'
                });


                $('#basicSharOutter').children().height($('#basicSharOutter').height() + 'px');
                $('#basicShareWrap').animate({
                    marginTop: parseInt((window_height - $('#basicShareWrap').height()) / 2.4) + 'px',
                }, 100);
                $('#basicShareTemp').html($('#basicSharContainer').html());
            });
        });
    };
})(jQuery, window, document);

if ($('.basicShareBtn').length > 0)
    $('.basicShareBtn').basicShare();
