$(document).ready(function() {
    editpage = function() {
        _ethis = this;
        _ethis.page = {
            uid: null,
            pagename: null,
            pagedec: null,
            pagetag: null,
            pagetagValue: null,
            pageys: null
        };
    };
    editpage.prototype = {
        _init: function() {
            _ethis._updatePage();
        },
        _getValue: function() {
            _ethis.page = {
                uid: $(".block").data('pageid'),
                pagename: $(".page_add_name").val(),
                pagedec: $(".page_add_dec").val(),
                pagetag: $(".page_tag_span").data('tag'),
                pagetagValue: $(".page_tag_span").text(),
                pageys: $(".page_ys_span").data('ys')
            };
        },
        _checkPage: function() {
            if (_ethis.page.pagename == "") {
                return false;
            } else {
                return true;
            }
        },
        _updatePage: function() {
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
                _ethis._getValue();
                if (_ethis._checkPage()) {
                    $.ajax({
                        type: 'POST',
                        url: '/page/save',
                        data: {
                            page: _ethis.page
                        },
                        dataType: "json",
                        success: function(back) {
                            if (back.state) {
                                alert("update sucess");
                                window.location.href = "/admin/index";
                            } else {
                                alert("sorry,update fail");
                            }
                        }
                    })
                } else {
                    alert("the pagename is null");
                }
            });
        }
    };
    var editPage = new editpage();
    editPage._init();
});