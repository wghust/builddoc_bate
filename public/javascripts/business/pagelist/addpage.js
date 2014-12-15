$(document).ready(function() {
    addPage = function() {
        _pthis = this;
        _pthis.pagename = null;
        _pthis.pagedec = null;
        _pthis.pagetag = null;
        _pthis.pagetagValue = null;
        _pthis.pageys = null;
    };
    addPage.prototype = {
        _init: function() {
            _pthis._addPage();
        },
        _checkValue: function() {
            _pthis._getValue();
            if (_pthis.pagename == "") {
                return false;
            } else {
                return true;
            }
        },
        _getValue: function() {
            _pthis.pagename = $(".page_add_name").val();
            _pthis.pagedec = $(".page_add_dec").val();
            _pthis.pagetag = $(".page_tag_span").data('tag');
            _pthis.pagetagValue = $(".page_tag_span").text();
            _pthis.pageys = $(".page_ys_span").data('ys');
        },
        _addPage: function() {
            $(".page_tag_span").click(function() {
                var k_ul = $(".page_tag ul");
                if (k_ul.data("open") == 0) {
                    k_ul.slideDown(200);
                    k_ul.data({
                        'open': 1
                    });
                } else {
                    k_ul.slideUp(200);
                    k_ul.data({
                        'open': 0
                    });
                }
            });
            $(".page_tag ul li").click(function() {
                var g_li = $(this);
                g_li.parent('ul').data({
                    'open': 0
                });
                g_li.parent('ul').siblings('.page_tag_span').data({
                    'tag': g_li.data('tag')
                });
                g_li.parent('ul').siblings('.page_tag_span').text(g_li.text());
                g_li.parent('ul').data({
                    'open': 0
                }).slideUp(200);
            });

            $(".page_ys_span").click(function() {
                var k_ul = $(".page_ys ul");
                if (k_ul.data("open") == 0) {
                    k_ul.slideDown(200);
                    k_ul.data({
                        'open': 1
                    });
                } else {
                    k_ul.slideUp(200);
                    k_ul.data({
                        'open': 0
                    });
                }
            });

            $(".page_ys ul li").click(function() {
                var g_li = $(this);
                g_li.parent('ul').data({
                    'open': 0
                });
                g_li.parent('ul').siblings('.page_ys_span').data({
                    'ys': g_li.data('ys')
                });
                g_li.parent('ul').siblings('.page_ys_span').text(g_li.text());
                g_li.parent('ul').data({
                    'open': 0
                }).slideUp(200);
            });

            $(".page_btn_add").click(function() {
                if (_pthis._checkValue()) {
                    $.ajax({
                        type: 'POST',
                        data: {
                            pagename: _pthis.pagename,
                            pagedec: _pthis.pagedec,
                            pagetag: _pthis.pagetag,
                            pagetagValue: _pthis.pagetagValue,
                            pageys: _pthis.pageys
                        },
                        dataType: 'json',
                        url: '/page/add',
                        success: function(back) {
                            if (back.state) {
                                alert("add success");
                                window.location.href = "/admin/index";
                            } else {
                                alert("add fail");
                            }
                        }
                    })
                } else {
                    alert("page name is null");
                }
            });
        }
    };

    var addPage = new addPage();
    addPage._init();
});