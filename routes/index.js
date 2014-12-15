var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var marked = require('marked');
var cheerio = require('cheerio');
var crypto = require('crypto');
var s = require('../settings');
// console.log(settings);
mongoose.connect("mongodb://" + s.host + ":" + s.port + "/" + s.db, function onMongooseError(err) {
    if (err) {
        throw err;
    }
});

// 模块
var models = {
    Cat: require("../models/cat.js")(mongoose, moment),
    Block: require("../models/block.js")(mongoose, moment, marked, cheerio),
    User: require("../models/user.js")(mongoose, moment, crypto),
    Page: require("../models/page.js")(mongoose, moment, marked)
};

/* GET home page. */


router.get('/', function(req, res) {
    // res.render("index", {
    //     title: 'index'
    // });
    res.redirect('/show');
});

router.get('/show', function(req, res) {
    models.Page.getIndexPage(0, function(err, pages) {
        models.Page.getHotPage(function(hotpage) {
            res.render("index", {
                title: 'index',
                pages: pages,
                tag: 0,
                hotpage: hotpage
            });
        });
    });
});
router.get('/show/:tag', function(req, res) {
    var tag = req.param('tag');
    models.Page.getIndexPage(tag, function(err, pages) {
        models.Page.getHotPage(function(hotpage) {
            res.render("index", {
                title: 'index',
                pages: pages,
                tag: tag,
                hotpage: hotpage
            });
        });
    });
});

// 注册
router.get('/admin/register', function(req, res) {
    if (req.session.loggedIn != true) {
        res.render('reg', {
            'title': 'register'
        });
    } else {
        res.redirect('/page/index');
    }
});

// 登陆
router.get('/admin/login', function(req, res) {
    // console.log(req.session.user);
    if (req.session.loggedIn != true) {
        res.render('login', {
            'title': 'login'
        });
    } else {
        res.redirect('/');
    }
});

// 退出
router.get('/admin/logout', function(req, res) {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect(req.headers.referer);
});

// 登陆判断
router.post('/admin/logincheck', function(req, res) {
    var email = req.param('email');
    var password = req.param('password');
    var user = {
        email: email,
        password: password
    };
    models.User.login(user, function(state, okuser) {
        if (state == 2) {
            req.session.loggedIn = true;
            req.session.user = okuser;
            console.log(req.session.user);
        }
        var b = {
            state: state
        };
        res.end(JSON.stringify(b));
    });
});

// 注册判断
router.post('/admin/regcheck', function(req, res) {
    var email = req.param('email');
    var password = req.param('password');
    var username = req.param('username');
    var user = {
        email: email,
        password: password,
        username: username
    };
    models.User.register(user, function(state, okuser) {
        if (state == 2) {
            req.session.loggedIn = true;
            req.session.user = okuser;
            console.log(req.session.user);
        }
        var b = {
            state: state
        };
        res.end(JSON.stringify(b));
    });
});

// 控制面板
router.get('/admin/index', function(req, res) {
    if (req.session.loggedIn) {
        models.Page.getAllPage(req.session.user.uid, function(err, pages) {
            res.render('panel', {
                title: '控制台',
                pages: pages
            });
        });
    } else {
        res.redirect('/admin/login');
    }

});

// 文档首页
router.get('/page/:id/index', function(req, res) {
    var pageid = req.param('id');
    models.Block.makeIndexBlock(pageid, function(err, blocks) {
        models.Page.getPageUserId(pageid, function(userid, pageys) {
            if (pageys == 1) {
                if (req.session.loggedIn) {
                    if (req.session.user.uid != userid) {
                        res.redirect('/show');
                    }
                } else {
                    res.redirect('/show');
                }
            }
            if (userid == null) {
                res.redirect('/admin/index');
            } else {
                models.Page.addPageView(pageid, function(err) {
                    res.render('doc', {
                        title: '文档',
                        pageid: pageid,
                        blocks: blocks,
                        userid: userid
                    });
                });
            }
        });
    });
})
router.get('/page/add', function(req, res) {
    if (req.session.loggedIn) {
        res.render('addpage', {
            title: 'Add Page'
        });
    } else {
        res.redirect('/admin/login');
    }
});
router.post('/page/add', function(req, res) {
    var page = {
        pagename: req.param('pagename'),
        pagedec: req.param('pagedec'),
        pagetag: req.param('pagetag'),
        pagetagValue: req.param('pagetagValue'),
        pageys: req.param('pageys')
    };
    models.Page.addPage(req.session.user, page, function(state) {
        var b = {
            state: 0
        };
        if (state) {
            b.state = 1;
        } else {
            b.state = 0;
        }
        res.end(JSON.stringify(b));
    });
});

router.get('/page/:id/edit', function(req, res) {
    var pageid = req.param('id');
    if (req.session.loggedIn) {
        models.Page.getPageUserId(pageid, function(userid, pageys) {
            if (req.session.user.uid == userid) {
                models.Page.getOnePage(pageid, function(err, page) {
                    res.render('pageedit', {
                        title: 'EDIT',
                        pageid: pageid,
                        userid: userid,
                        page: page
                    });
                });
            } else {
                res.redirect('/admin/index');
            }
        });
    } else {
        res.redirect('/admin/login');
    }
});

router.post('/page/save', function(req, res) {
    var page = req.param('page');
    // console.log(page);
    models.Page.updatePage(page, function(err) {
        var b = {
            state: 0,
        };
        if (err) {
            b.state = 0;
        } else {
            b.state = 1;
        }
        res.end(JSON.stringify(b));
    });
});

router.get('/page/:uid/delete', function(req, res) {
    var pageid = req.param('uid');
    models.Page.deletePage(pageid, function(err) {
        models.Cat.deleteCatByPageId(pageid, function(state_1) {
            models.Block.deleteBlockByPageId(pageid, function(state_2) {
                var msg = ""
                if (state_2 == 0) {
                    msg = "删除失败";
                } else {
                    msg = "删除成功";
                }
                res.render('deletepage', {
                    'title': '删除',
                    'msg': msg
                });
            });
        });
    });
});

// 保存栏目
router.post('/doc/savecat', function(req, res) {
    var newCat = {
        catname: req.param('catname'),
        catdec: req.param('catdec'),
        pageid: req.param('pageid')
    };
    models.Cat.insertCat(newCat, function(cat, state) {
        var b = {
            cat: cat,
            state: state
        };
        res.end(JSON.stringify(b));
    });
});


// 删除栏目
router.post('/doc/deletecat', function(req, res) {
    var catid = req.param('catid');
    models.Cat.deleteCat(catid, function(state) {
        var b = {
            state: state
        };
        res.end(JSON.stringify(b));
    });
});

// 编辑栏目
router.post('/doc/editcat', function(req, res) {
    var newCat = {
        catid: req.param('catid'),
        catname: req.param('catname'),
        catdec: req.param('catdec')
    };
    models.Cat.editCat(newCat, function(state) {
        models.Block.editBlockCat(newCat, function(state_2) {
            var b = {
                state: state_2,
                cat: newCat
            };
            res.end(JSON.stringify(b));
        });
    });
});

// 保存文档
router.post('/doc/savecon', function(req, res) {
    var block = req.param('block');
    models.Block.saveOneBlock(block, function(nowpageid, nowuid, state) {
        var back = {
            nowpageid: nowpageid,
            nowuid: nowuid,
            state: state
        };
        res.end(JSON.stringify(back));
    });
});

// 更新文档
router.post('/doc/updatecon', function(req, res) {
    var block = req.param('block');
    models.Block.updateOneBlock(block, function(nowpageid, nowuid, state) {
        var back = {
            nowpageid: nowpageid,
            nowuid: nowuid,
            state: state
        };
        res.end(JSON.stringify(back));
    });
});


// 添加块
router.get('/block/:id/add', function(req, res) {
    if (req.session.loggedIn) {
        var pageid = req.param('id');
        getPageUserId(pageid, function(userid, pageys) {
            if (req.session.user.uid == userid) {
                models.Cat.getAllCat(pageid, function(err, cats) {
                    res.render('addblock', {
                        title: '添加块',
                        pageid: pageid,
                        cats: cats,
                        userid: userid
                    });
                });
            } else {
                res.redirect('/admin/login');
            }
        });
    } else {
        res.redirect('/admin/login');
    }
});

// one block
router.get('/block/:id/:uid', function(req, res) {
    var uid = req.param('uid');
    var pageid = req.param('id');
    getPageUserId(pageid, function(userid, pageys) {
        if (pageys == 1) {
            if (req.session.loggedIn) {
                if (req.session.user.uid != userid) {
                    res.redirect('/show');
                }
            } else {
                res.redirect('/show');
            }
        }
        models.Block.getOneBlock(uid, function(block, state) {
            res.render('block', {
                title: 'Block',
                block: block,
                pageid: pageid,
                state: state,
                userid: userid
            });
        });
    });
});

// 编辑
router.get('/block/:id/:uid/edit', function(req, res) {
    var pageid = req.param('id');
    var uid = req.param('uid');
    // console.log(uid);
    if (req.session.loggedIn) {
        models.Page.getPageUserId(pageid, function(userid, pageys) {
            if (req.session.user.uid == userid) {
                models.Block.getOneBlockMark(uid, function(block, state) {
                    models.Cat.getAllCat(pageid, function(err, cats) {
                        res.render('edit', {
                            title: '编辑',
                            cats: cats,
                            pageid: pageid,
                            block: block,
                            userid: userid
                        });
                    });
                });
            } else {
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/');
    }
});

// 删除
router.get('/block/:id/:uid/delete', function(req, res) {
    var uid = req.param('uid');
    var pageid = req.param('id');
    if (req.session.loggedIn) {
        models.Page.getPageUserId(pageid, function(userid, pageys) {
            if (req.session.user.uid == userid) {
                models.Block.deleteOneBlock(uid, function(state) {
                    var msg = "";
                    if (state == 0) {
                        msg = "删除不成功";
                    } else {
                        msg = "删除成功";
                    }
                    res.render('delete', {
                        title: '删除',
                        msg: msg,
                        pageid: pageid,
                        userid: userid
                    });
                });
            } else {
                res.render('delete', {
                    title: '删除',
                    msg: '删除不成功',
                    pageid: pageid,
                    userid: userid
                });
            }
        });
    } else {
        res.render('delete', {
            title: '删除',
            msg: "删除不成功",
            pageid: pageid
        });
    }
});

// 404
router.get('*', function(req, res) {
    res.render('404', {
        'title': '404'
    });
});

module.exports = router;