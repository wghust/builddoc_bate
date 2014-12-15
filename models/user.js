module.exports = function(mongoose, moment, crypto) {
    var UserSchema = new mongoose.Schema({
        uid: {
            type: Number,
            default: 0
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        username: {
            type: String
        }
    });
    var User = mongoose.model('user', UserSchema);

    // 判断是否存在
    isHas = function(email, callback) {
        User.findOne({
            email: email
        }, function(err, result) {
            if (result == null) {
                callback(true);
            } else {
                callback(false);
            }
        });
    };

    // 获取新的ID
    getNewId = function(callback) {
        User.find().sort({
            'uid': 'asc'
        }).exec(function(err, users) {
            var newuid = 1;
            if (users.length != 0) {
                newuid = users[users.length - 1].uid + 1;
            }
            callback(newuid);
        });
    };

    /**	
     * register
     * state 0 用户已经存在
     * 1 存入不成功 2 注册成功
     */
    register = function(user, callback) {
        isHas(user.email, function(back) {
            if (back) {
                getNewId(function(newuid) {
                    var shaSum = crypto.createHash('sha256');
                    shaSum.update(user.password);
                    var newUser = new User({
                        uid: newuid,
                        email: user.email,
                        password: shaSum.digest('hex'),
                        username: user.username
                    });
                    newUser.save(function(err) {
                        if (err) {
                            callback(1, null);
                        } else {
                            var b = {
                                uid: newuid,
                                email: user.email,
                                username: user.username
                            };
                            callback(2, b);
                        }
                    });
                });
            } else {
                callback(0, null);
            }
        });
    };

    // 登陆判断
    isLoginHas = function(email, password, callback) {
        User.findOne({
            email: email,
            password: password
        }, function(err, result) {
            if (result == null) {
                callback(false, result);
            } else {
                callback(true, result);
            }
        });
    };

    /**
     * login
     * state 0 用户不存在
     * 1 登陆不成功 2 登陆成功
     */
    login = function(user, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(user.password);
        isLoginHas(user.email, shaSum.digest('hex'), function(state, newuser) {
            if (state) {
                callback(2, newuser);
            } else {
                callback(0, newuser);
            }
        });
    };
    return {
        register: register,
        login: login
    };
};