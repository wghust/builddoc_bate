module.exports = function(mongoose, moment, marked) {
    var PageSchema = new mongoose.Schema({
        uid: {
            type: Number,
            default: 1
        },
        author: {
            type: String
        },
        userid: {
            type: Number
        },
        pagename: {
            type: String
        },
        pagedec: {
            type: String
        },
        date: {
            type: Date
        },
        view: {
            type: Number,
            default: 0
        },
        pagetag: {
            type: Number
        },
        pagetagValue: {
            type: String
        },
        pageys: {
            type: Number
        }
    });

    var Page = mongoose.model('page', PageSchema);


    getNewPageUid = function(callback) {
        Page.find().sort({
            'uid': 'asc'
        }).exec(function(err, pages) {
            var nowUid = 1;
            if (pages.length != 0) {
                nowUid = pages[pages.length - 1].uid + 1;
            }
            callback(nowUid);
        });
    };

    getPageUserId = function(pageid, callback) {
        Page.findOne({
            'uid': pageid
        }).exec(function(err, page) {
            if (page == null) {
                callback(null, null);
            } else {
                callback(page.userid, page.pageys);
            }
        });
    };

    // 新建
    addPage = function(user, page, callback) {
        getNewPageUid(function(uid) {
            var newPage = new Page({
                uid: uid,
                author: user.username,
                userid: user.uid,
                pagename: page.pagename,
                pagedec: page.pagedec,
                pagetag: page.pagetag,
                pagetagValue: page.pagetagValue,
                date: moment().format(),
                pageys: page.pageys
            });
            newPage.save(function(err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        });
    };

    getOnePage = function(uid, callback) {
        Page.findOne({
            uid: uid
        }).exec(function(err, page) {
            callback(err, page);
        });
    };

    // 获取所有的文档
    getAllPage = function(userid, callback) {
        Page.find({
            'userid': userid
        }).sort({
            'uid': 'desc'
        }).exec(function(err, pages) {
            if (pages.length == 0) {
                callback(err, null);
            } else {
                callback(err, pages);
            }
        });
    };

    // page update
    updatePage = function(page, callback) {
        Page.update({
            uid: page.uid,
        }, {
            $set: {
                pagename: page.pagename,
                pagedec: page.pagedec,
                pagetag: page.pagetag,
                pagetagValue: page.pagetagValue,
                pageys: page.pageys
            }
        }).exec(function(err) {
            callback(err);
        });
    };

    // page delete
    deletePage = function(uid, callback) {
        Page.remove({
            uid: uid
        }).exec(function(err) {
            callback(err);
        });
    };

    addPageView = function(uid, callback) {
        Page.update({
            uid: uid
        }, {
            $inc: {
                view: 1
            }
        }).exec(function(err) {
            callback(err);
        });
    };

    getIndexPage = function(tag, callback) {
        if (tag == 0) {
            Page.find({
                'pageys': 0
            }).sort({
                'uid': 'desc'
            }).exec(function(err, pages) {
                var back = [];
                pages.forEach(function(page, index) {
                    b = {
                        uid: page.uid,
                        author: page.author,
                        userid: page.userid,
                        pagename: page.pagename,
                        pagedec: page.pagedec,
                        pagetag: page.pagetag,
                        pagetagValue: page.pagetagValue,
                        view: page.view,
                        date: moment(page.date).format('YYYY-MM-DD')
                    };
                    back.push(b);
                });
                callback(err, back);
            });
        } else {
            Page.find({
                'pagetag': tag,
                'pageys': 0
            }).sort({
                'uid': 'desc'
            }).exec(function(err, pages) {
                var back = [];
                pages.forEach(function(page, index) {
                    b = {
                        uid: page.uid,
                        author: page.author,
                        userid: page.userid,
                        pagename: page.pagename,
                        pagedec: page.pagedec,
                        pagetag: page.pagetag,
                        pagetagValue: page.pagetagValue,
                        view: page.view,
                        date: moment(page.date).format('YYYY-MM-DD')
                    };
                    back.push(b);
                });
                callback(err, back);
            });
        }
    };

    getHotPage = function(callback) {
        Page.find({
            "pageys": 0
        }).sort({
            'view': 'desc'
        }).skip(0).limit(4).exec(function(err, hotpage) {
            callback(hotpage);
        });
    };


    return {
        addPage: addPage,
        getAllPage: getAllPage,
        getPageUserId: getPageUserId,
        getOnePage: getOnePage,
        updatePage: updatePage,
        deletePage: deletePage,
        addPageView: addPageView,
        getIndexPage: getIndexPage,
        getHotPage: getHotPage
    };
};