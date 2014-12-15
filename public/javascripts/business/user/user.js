$(document).ready(function() {
    register = function(ele) {
        _rthis = this;
        _rthis.ele = ele;
        _rthis.user = {
            username: null,
            email: null,
            password: null
        };
    };
    register.prototype = {
        init: function() {
            _rthis._goReg();
        },
        _goReg: function() {
            _rthis.ele.click(function() {
                _rthis._getValue();
                var allcheck = _rthis._check();
                if (allcheck.checkResult == 0) {
                    var user_msg = $(".user_msg");
                    for (i = 0; i < user_msg.length; i++) {
                        user_msg.eq(i).text(allcheck.msg[i].msgValue);
                    }
                } else {
                    // ajax
                    $.ajax({
                        type: 'POST',
                        data: _rthis.user,
                        url: '/admin/regcheck',
                        dataType: 'JSON',
                        success: function(b) {
                            // alert(typeof state);
                            if (b.state == 0) {
                                alert("用户已经存在");
                            } else {
                                if (b.state == 1) {
                                    alert("注册不成功");
                                } else {
                                    alert("注册成功");
                                    window.location.href = "/admin/index";
                                }
                            }
                        }
                    });
                }
            });
        },
        _getValue: function() {
            _rthis.user = {
                username: $(".user_username").val(),
                email: $(".user_email").val(),
                password: $(".user_password").val()
            };
        },
        _check: function() {
            var allcheck = {
                checkResult: 1,
                msg: [{
                    msgid: 0, //邮箱
                    msgValue: ""
                }, {
                    msgid: 1, //用户名
                    msgValue: ""
                }, {
                    msgid: 2, //用户密码
                    msgValue: ""
                }]
            };
            if (_rthis.user.email == "") {
                allcheck.checkResult = 0;
                allcheck.msg[0].msgValue += "邮箱为空";
            } else {
                var reMail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/;
                if (!reMail.test(_rthis.user.email)) {
                    allcheck.checkResult = 0;
                    allcheck.msg[0].msgValue += "邮箱不正确";
                }
            }

            if (_rthis.user.username == "") {
                allcheck.checkResult = 0;
                allcheck.msg[1].msgValue += "用户名为空";
            }

            if (_rthis.user.password == "") {
                allcheck.checkResult = 0;
                allcheck.msg[2].msgValue += "密码为空";
            } else {
                if (_rthis.user.password.length < 6) {
                    allcheck.checkResult = 0;
                    allcheck.msg[2].msgValue += "密码太短";
                }
            }

            return allcheck;
        }

    };

    login = function(ele) {
        _gthis = this;
        _gthis.ele = ele;
        _gthis.user = {
            email: null,
            password: null
        };
    };
    login.prototype = {
        init: function() {
            _gthis._goLogin();
        },
        _goLogin: function() {
            _gthis.ele.click(function() {
                _gthis._getValue();
                var allcheck = _gthis._check();
                if (allcheck.checkResult == 0) {
                    var user_msg = $(".user_msg");
                    for (i = 0; i < user_msg.length; i++) {
                        user_msg.eq(i).text(allcheck.msg[i].msgValue);
                    }
                } else {
                    // ajax
                    $.ajax({
                        type: 'POST',
                        data: _gthis.user,
                        url: '/admin/logincheck',
                        dataType: 'JSON',
                        success: function(b) {
                            // alert(typeof state);
                            if (b.state == 0) {
                                alert("用户不存在");
                            } else {
                                if (b.state == 1) {
                                    alert("登陆不成功");
                                } else {
                                    alert("登陆成功");
                                    window.location.href = "/admin/index";
                                }
                            }
                        }
                    });
                }
            });
        },
        _getValue: function() {
            _gthis.user = {
                email: $(".user_email").val(),
                password: $(".user_password").val()
            };
        },
        _check: function() {
            var allcheck = {
                checkResult: 1,
                msg: [{
                    msgid: 0, //邮箱
                    msgValue: ""
                }, {
                    msgid: 1, //用户密码
                    msgValue: ""
                }]
            };

            // 邮箱验证
            if (_gthis.user.email == "") {
                allcheck.checkResult = 0;
                allcheck.msg[0].msgValue += "邮箱为空";
            } else {
                var reMail = /^(?:\w+\.?)*\w+@(?:\w+\.?)*\w+$/;
                if (!reMail.test(_gthis.user.email)) {
                    allcheck.checkResult = 0;
                    allcheck.msg[0].msgValue += "邮箱不正确";
                }
            }
            // 密码验证
            if (_gthis.user.password == "") {
                allcheck.checkResult = 0;
                allcheck.msg[1].msgValue += "密码为空";
            } else {
                if (_gthis.user.password.length < 6) {
                    allcheck.checkResult = 0;
                    allcheck.msg[1].msgValue += "密码太短";
                }
            }

            return allcheck;
        }
    };

    var panel = $(".getinpanel");
    if (panel.data('op') == "register") {
        var reg = new register($(".user_register"));
        reg.init();
    } else {
        var login = new login($(".user_l_login"));
        login.init();
    }
});