$(document).ready(function() {
    addblock = function() {
        // _this.ele = $(".")
        _this = this;
        _this.ele = null;

    };
    addblock.prototype = {
        init: function() {
            _this._showpanel();
            _this._selectcat();
            _this._showaddcatpanel();
            _this._showuseage();
            _this._addnewMarkdown();
        },

        // 现实cat面板
        _showpanel: function() {
            $(".b_selected_cat").click(function() {
                $(".b_select_panel").show();
            });
        },

        // 选择栏目
        _selectcat: function() {
            $(".b_select_ul li .b_thiscat").click(function(e) {
                var _self = $(this);
                var _selfValue = _self.parent('li').data('value');
                var _selfText = _self.text();
                $(".b_selected_cat span").data({
                    'value': _selfValue
                }).text(_selfText);
                $(".b_select_panel").hide();
                _this._catinit();
            });
            $(".b_select_ul li .b_delete").click(function() {
                _this._catdelete($(this).parent("li")); //传输li属性
            });
            $(".b_select_ul li .b_edit").click(function() {
                _this._catedit($(this).parent("li"));
            });
        },

        // 编辑栏目
        _catedit: function(element) {
            var _ele = element;
            $(".b_edit_panel").css({
                'display': 'block'
            });
            $(".edit_cat_form_title").val(_ele.children(".b_thiscat").text());
            $(".b_edit_panel").data({
                id: parseInt(_ele.data('value'))
            });
            $(".edit_cat_form_dec").val(_ele.children(".b_dec").text());
            $(".b_edit_panel").animate({
                'left': '250px',
                'opacity': 1
            }, 200, function() {

            });
            // console.log(_ele.html());
            _this._cateditsave(_ele);
        },

        // 编辑栏目保存
        _cateditsave: function(element) {
            $(".edit_savecat_btn").click(function() {
                var newCat = {
                    catid: parseInt($(".b_edit_panel").data('id')),
                    catname: $(".edit_cat_form_title").val(),
                    catdec: $(".edit_cat_form_dec").val()
                };
                $.ajax({
                    type: 'POST',
                    data: newCat,
                    dataType: 'json',
                    url: '/doc/editcat',
                    success: function(callback) {
                        if (callback.state == 0) {
                            // console.log(_ele);
                            $(".b_select_ul").children("#" + callback.cat.catid).children('.b_thiscat').text(callback.cat.catname);
                            $(".b_select_ul").children("#" + callback.cat.catid).children('.b_dec').text(callback.cat.catdec);
                            _this._editinit();
                        } else {
                            alert("保存不成功");
                        }
                    }
                });
            });
        },

        // 删除栏目
        _catdelete: function(element) {
            var _ele = element;
            var deleteCat = {
                catid: parseInt(_ele.data('value'))
            };
            $.ajax({
                type: 'POST',
                data: deleteCat,
                dataType: 'json',
                url: '/doc/deletecat',
                success: function(callback) {
                    if (callback.state == 1) {
                        alert("删除失败");
                    } else {
                        _ele.remove();
                    }
                }
            })
        },

        _catinit: function() {
            $(".add_cat_form").hide();
            $(".add_cat_btn").val("添加栏目");
            $(".add_cat_btn").data({
                'open': 'hide'
            });
            $(".add_cat_form_title").val("");
            $(".add_cat_form_dec").val("");
            _this._editinit();
        },

        _editinit: function() {
            $(".b_edit_panel").animate({
                'left': '50px',
                'opacity': 0
            }, 200, function() {
                $(this).hide();
            });
            $(".b_edit_panel").data({
                'id': 0
            });
            $(".edit_cat_form_title").val('');
            $(".edit_cat_form_dec").val('');
        },

        // 现实添加cat的面板
        _showaddcatpanel: function() {
            $(".add_cat_btn").click(function() {
                var _addself = $(this);
                if (_addself.data('open') == 'hide') {
                    $(".add_cat_form").slideDown();
                    _addself.data({
                        'open': 'add'
                    });
                    _addself.val('点击添加');
                } else {
                    var _addtitle = $(".add_cat_form_title").val();
                    var _adddec = $(".add_cat_form_dec").val();
                    var _addpageid = parseInt($(".block").data('pageid'));
                    if (_addtitle == "") {
                        alert("栏目名为空!");
                    } else {
                        var data = {
                            pageid: _addpageid,
                            catname: _addtitle,
                            catdec: _adddec
                        };
                        $.ajax({
                            type: 'POST',
                            data: data,
                            dataType: 'json',
                            url: '/doc/savecat',
                            success: function(callback) {
                                var back = callback;
                                if (back.state == false) {
                                    alert("保存不成");
                                } else {
                                    var str = "<li data-value='" + back.cat.catid + "' id='" + back.cat.catid + "'>" + "<span class='b_thiscat'>" + back.cat.catname + "</span><span class='b_delete'>删除</span><span class='b_edit'>编辑</span><span class='b_dec'>" + back.cat.catdec + "</span><div class='clear'></div></li>";
                                    $(".b_select_ul").append(str);
                                    _this._catinit();
                                    _this._selectcat();
                                }
                            }
                        });
                    }
                }
            });
        },

        // 现实用法
        _showuseage: function() {
            $(".useage").click(function() {
                var _uthis = $(this);
                var _uthisuse = _uthis.siblings('.useageshow');
                if (_uthis.data('open') == 0) {
                    _uthisuse.css({
                        'display': 'block'
                    });
                    _uthisuse.animate({
                        'left': '80px',
                        'opacity': 1
                    }, 200, function() {
                        _uthis.data({
                            'open': 1
                        }).val("关闭介绍");
                    });
                } else {
                    _uthisuse.animate({
                        'left': '30px',
                        'opacity': 0
                    }, 200, function() {
                        _uthis.data({
                            'open': 0
                        }).val("语法介绍");
                        _uthisuse.css({
                            'display': 'none'
                        });
                    });
                }
            });
        },

        // 添加额外markdown
        _addnewMarkdown: function() {
            $(".newmark").css({
                'height': $(window).height() - 50 + 'px'
            });
            $(window).resize(function() {
                $(".newmark").css({
                    'height': $(window).height() - 50 + 'px'
                });
            });
            $(".addmark").click(function() {
                $(".addmarkfile").click();
            });
            $(".addmarkfile").change(function() {
                var _panel = $(".newmark");
                var file = $(".addmarkfile")[0].files[0];
                var fileName = file.name.substring(0, file.name.lastIndexOf("."));
                var fileType = file.type;
                if (fileType != "text/markdown") {
                    alert("文件类型错误");
                } else {
                    _panel.children('.newmark_title').text(fileName);
                    var fileReader = new FileReader();
                    fileReader.readAsText(file);
                    fileReader.onload = function(e) {
                        $(".newmark_textarea").val(e.target.result);
                        if (_panel.data('open') == 0) {
                            _panel.animate({
                                'right': 0
                            }, 1000, "easeOutElastic", function() {
                                _panel.data({
                                    'open': 1
                                });
                            });
                        }
                    };
                }
            });
            $(".closenewmark").click(function() {
                var _panel = $(".newmark");
                _panel.animate({
                    'right': '-450px'
                }, 1000, "easeInCirc", function() {
                    _panel.data({
                        'open': 0
                    });
                    _panel.children('.newmark_title').text("");
                    _panel.children(".newmark_textarea").val("");
                    $(".addmarkfile").val("");
                });
            });
        }
    };


    // newedit
    newedit = function() {
        _nthis = this;
        _nthis._neditor = null;
    };
    newedit.prototype = {
        init: function() {
            _nthis._buildnewText();
            _nthis._preview();
            _nthis._save();
            _nthis._addEditNewMarkdown();
        },
        _buildnewText: function() {
            _nthis._neditor = CodeMirror.fromTextArea(document.getElementById("write_text"), {
                mode: 'markdown',
                lineWrapping: true,
                // lineNumbers: true,
                theme: "default",
                extraKeys: {
                    "Enter": "newlineAndIndentContinueMarkdownList"
                }
            });
            $(".previewpanel").css({
                'width': $(".CodeMirror").width() + 'px'
            });
            $(window).resize(function() {
                $(".previewpanel").css({
                    'width': $(".CodeMirror").width() + 'px'
                });
            });
        },
        _handleTable: function() {
            var table = $(".previewpanel").children("table");
            for (i = 0; i < table.length; i++) {
                var _thistable = table.eq(i);
                var _thisdefaultlen = _thistable.children('thead').children('tr').children('th').length;
                var _thistr = _thistable.children('tbody').children('tr');
                for (j = 0; j < _thistr.length; j++) {
                    var _thistdlen = _thistr.eq(j).children('td').length;
                    if (_thistdlen < _thisdefaultlen) {
                        _thistr.eq(j).children('td').eq(_thistdlen - 1).attr({
                            'colspan': _thisdefaultlen - _thistdlen + 1
                        });
                    }
                }
            }
        },
        _preview: function() {
            $(".preview").click(function() {
                var _this = $(this);
                if (_this.data('open') == 0) {
                    $(".previewpanel").html(marked(_nthis._neditor.getValue()));
                    _nthis._handleTable();
                    $(".previewpanel").css({
                        'display': 'block'
                    });
                    $(".previewpanel").animate({
                        'left': '0',
                        'opacity': 1
                    }, 1000, function() {
                        _this.data({
                            'open': 1
                        });
                        _this.val('关闭预览');
                    });
                } else {
                    $(".previewpanel").animate({
                        'left': '800px',
                        'opacity': 0
                    }, 1000, function() {
                        _this.data({
                            'open': 0
                        });
                        _this.val("预览");
                        $(".previewpanel").css({
                            'display': 'none'
                        });
                    });
                }
            });
        },
        _save: function() {
            $(".saveall").click(function() {
                // var content = tinymce.get('edittable').getContent();
                var content = _nthis._neditor.getValue();
                var title = $(".b_title").val();
                var catid = parseInt($(".b_selected_cat span").data("value"));
                var catname = $(".b_selected_cat span").text();
                var dec = $(".b_description").val();
                var pageid = parseInt($(".block").data('pageid'));

                var block = {
                    content: content,
                    title: title,
                    catid: catid,
                    catname: catname,
                    dec: dec,
                    pageid: pageid
                };

                var url = "/doc/savecon";
                var msg = ["保存成功", "保存不成功", "保存中"];
                if ($(this).data('op') == 'update') {
                    url = "/doc/updatecon";
                    block.uid = $(".b_uid").val();
                    msg = ["更新成功", "更新不成功", "更新中"];
                }
                $(".saveall").val(msg[2]);
                $.ajax({
                    type: 'POST',
                    data: {
                        block: block
                    },
                    dataType: 'json',
                    url: url,
                    success: function(callback) {
                        var back = callback;
                        // console.log(back);
                        if (back.state) {
                            $(".saveall").val(msg[0]);
                            alert(msg[0]);
                            window.location.href = "/block/" + back.nowpageid + "/" + back.nowuid;
                        } else {
                            alert(msg[1]);
                        }
                    }
                });
            });
        },

        // 添加额外markdown
        _addEditNewMarkdown: function() {
            $(".newmark").css({
                'height': $(window).height() - 50 + 'px'
            });
            $(window).resize(function() {
                $(".newmark").css({
                    'height': $(window).height() - 50 + 'px'
                });
            });
            $(".addmark").click(function() {
                $(".addmarkfile").click();
            });
            $(".addmarkfile").change(function() {
                var _panel = $(".newmark");
                var file = $(".addmarkfile")[0].files[0];
                var fileName = file.name.substring(0, file.name.lastIndexOf("."));
                var fileType = file.type;
                if (fileType != "text/markdown") {
                    alert("文件类型错误");
                } else {
                    _panel.children('.newmark_title').text(fileName);
                    var fileReader = new FileReader();
                    fileReader.readAsText(file);
                    fileReader.onload = function(e) {
                        $(".newmark_textarea").val(e.target.result);
                        if (_panel.data('open') == 0) {
                            _panel.animate({
                                'right': 0
                            }, 1000, "easeOutElastic", function() {
                                _panel.data({
                                    'open': 1
                                });
                            });
                        }
                    };
                }
            });
            $(".closenewmark").click(function() {
                var _panel = $(".newmark");
                _panel.animate({
                    'right': '-450px'
                }, 1000, "easeInCirc", function() {
                    _panel.data({
                        'open': 0
                    });
                    _panel.children('.newmark_title').text("");
                    _panel.children(".newmark_textarea").val("");
                    $(".addmarkfile").val("");
                });
            });
        }
    };

    var nowcon = $(".opcontainer");
    if (nowcon.data("op") == "add") {
        var block = new addblock();
        block.init();
    } else {
        var thisnew = new newedit();
        thisnew.init();
    }
});