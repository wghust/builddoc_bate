module.exports = function(mongoose, moment, marked, cheerio) {
    var BlockSchema = new mongoose.Schema({
        uid: {
            type: Number,
            default: 1
        },
        title: {
            type: String
        },
        userid: {
            type: Number
        },
        pageid: {
            type: Number
        },
        catid: {
            type: Number
        },
        catname: {
            type: String
        },
        dec: {
            type: String
        },
        content: {
            type: String
        },
        date: {
            type: Date
        }
    });
    var Block = mongoose.model('block', BlockSchema);


    // 获取块uid
    getBlockNum = function(callback) {
        var nowuid = 1;
        Block.find().sort({
            'uid': 'asc'
        }).exec(function(err, results) {
            if (results.length != 0) {
                nowuid = results[results.length - 1].uid + 1;
            }
            callback(err, nowuid);
        });
    };

    // 保存新块
    saveOneBlock = function(block, callback) {
        getBlockNum(function(err, nowuid) {
            block.uid = nowuid;
            var newOneBlock = new Block({
                uid: block.uid,
                title: block.title,
                catid: block.catid,
                catname: block.catname,
                dec: block.dec,
                content: block.content,
                date: moment().format(),
                pageid: block.pageid
            });
            newOneBlock.save(function(err) {
                var state = 0;
                if (err) {
                    state = 0; // 表示不成功
                } else {
                    state = 1; // 表示成功
                }
                callback(block.pageid, nowuid, state);
            });
        });
    };

    // 更新
    updateOneBlock = function(block, callback) {
        Block.update({
            uid: block.uid
        }, {
            $set: {
                title: block.title,
                catid: block.catid,
                catname: block.catname,
                dec: block.dec,
                content: block.content,
                date: moment().format()
            }
        }, function(err) {
            if (err) {
                callback(block.pageid, block.uid, 0);
            } else {
                callback(block.pageid, block.uid, 1);
            }
        });
    };

    // 删除
    deleteOneBlock = function(uid, callback) {
        Block.remove({
            uid: uid
        }, function(err) {
            if (err) {
                callback(0);
            } else {
                callback(1);
            }
        });
    };

    handle = function(html) {
        var $ = cheerio.load(html);
        var table = $("table");
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



        return transHref($.html());
    };

    transHref = function(html) {
        var regexp = new RegExp(/(\[.+?\))/g);
        var results = html.match(regexp);
        if (results != null) {
            for (var i = 0; i < results.length; i++) {
                var content = results[i];
                var text = content.substring(content.indexOf("[") + 1, content.indexOf("]"));
                var href = content.substring(content.indexOf("(") + 1, content.indexOf(")"));
                html = html.replace(content, '<a href="' + href + '" class="ainblock" >' + text + '</a>');
            }
        }
        return html;
    };

    // 获取一个block
    getOneBlock = function(uid, callback) {
        Block.findOne({
            uid: uid
        }).exec(function(err, block) {
            // console.log(block);
            var state = 0;
            if (err) {
                state = 0;
                callback(null, state);
            } else {
                state = 1;
                var b = [];
                if (block != null) {
                    b = {
                        uid: block.uid,
                        title: block.title,
                        catid: block.catid,
                        catname: block.catname,
                        dec: block.dec,
                        content: handle(marked(block.content)),
                        date: moment(block.date).format('YYYY-MM-DD')
                    };
                }
                callback(b, state);
            }
        });
    };

    getOneBlockMark = function(uid, callback) {
        Block.findOne({
            uid: uid
        }).exec(function(err, block) {
            var state = 0;
            if (err) {
                state = 0;
                callback(null, state);
            } else {
                state = 1;
                // var b = [];
                callback(block, state);
            }
        });
    };

    makeIndexBlock = function(pageid, callback) {
        Block.find({
            'pageid': pageid
        }).sort({
            'catid': 'asc',
            'uid': 'asc'
        }).exec(function(err, blocks) {
            if (err) {
                callback(0, []);
            } else {
                var b = [];
                blocks.forEach(function(block, index) {
                    var c = {
                        uid: block.uid,
                        title: block.title,
                        catid: block.catid,
                        catname: block.catname,
                        dec: block.dec,
                        content: handle(marked(block.content)),
                        date: moment(block.date).format('YYYY-MM-DD')
                    };
                    b.push(c);
                });
                callback(1, b);
            }
        });
    };

    editBlockCat = function(newCat, callback) {
        Block.update({
            'catid': newCat.catid
        }, {
            $set: {
                'catname': newCat.catname
            }
        }).exec(function(err) {
            if (err) {
                callback(1);
            } else {
                callback(0);
            }
        });
    };

    deleteBlockByPageId = function(pageid, callback) {
        Block.remove({
            'pageid': pageid
        }).exec(function(err) {
            if (err) {
                callback(0);
            } else {
                callback(1);
            }
        });
    };

    return {
        saveOneBlock: saveOneBlock,
        getOneBlock: getOneBlock,
        getOneBlockMark: getOneBlockMark,
        updateOneBlock: updateOneBlock,
        deleteOneBlock: deleteOneBlock,
        makeIndexBlock: makeIndexBlock,
        editBlockCat: editBlockCat,
        deleteBlockByPageId: deleteBlockByPageId
    };
};