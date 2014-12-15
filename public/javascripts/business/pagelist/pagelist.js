$(document).ready(function() {
    page = function() {
        _pthis = this;
    };
    page.prototype = {
        _init: function() {
            _pthis._random();
            _pthis._showop();
        },
        _random: function() {
            var _bg_img = $(".bg_img");
            for (var i = 0; i < _bg_img.length; i++) {
                var r = i % 4 + 1;
                _bg_img.eq(i).attr({
                    'src': '/images/' + r + '.jpg'
                });
            }
        },
        _showop: function() {
            $(".onepage").hover(function() {
                $(this).children('.page_edit').fadeIn();
                $(this).children('.page_delete').fadeIn();
            }, function() {
                $(this).children('.page_edit').fadeOut();
                $(this).children('.page_delete').fadeOut();
            });
            $(".page_delete").click(function(e) {
                _pthis._delete($(this));
                return false;
            });
        },
        _delete: function(ele) {
            var url = ele.attr('href');
            if (confirm("你确定要删除？")) {
                window.location.href = url;
            }
        }
    };
    var p = new page();
    p._init();
});