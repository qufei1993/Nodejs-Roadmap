var WEB_USER_TIME = 'WEB_USER_TIME';
var timerFlag = true;
var operaFlag = true;
window.onload = function() {
  initInfo();
};

function initInfo() {
  // 登录判断
  if (!uid) {
    //console.log('未登录');
    return;
  }
  // 刷新或重新打开的安全时间
  var keepTimeStep = 30 * 1000;

  var temp = $.cookie(WEB_USER_TIME);
  if (!temp) {
    temp = {
      num: 1,
      uid: uid,
      startTime: new Date()
    };
  } else if (temp.num <= 0 && new Date().getTime() - new Date(temp.endTime) < keepTimeStep) {
    // 上次关闭30秒内，使用原有的startTime
    temp = {
      num: 1,
      uid: uid,
      startTime: temp.startTime
    };
  } else {
    // 开启新页面，统计下page
    temp = {
      num: temp.num + 1,
      uid: uid,
      startTime: temp.startTime
    };
  }

  $.cookie(WEB_USER_TIME, JSON.stringify(temp), {
    expires: 7,
    path: '/'
  });

  timeUserFun(5);
}
// ajax
function updateAction(isAsync, during) {
  var _that = this;
  _that.count = 0;
  timerFlag = false;
  //console.log('执行阅读时间计时');

  if (_that.timer) {
    _that.count = 0;
    //console.log('清除定时器'+_that.count);
    clearInterval(_that.timer);
  }

  _that.timer = setInterval(function() {
    timerFlag = false;
    if (!operaFlag) {
      return;
    }
    $.ajax({
      url: BLOG_URL + 'pv-log/at',
      type: 'get',
      dataType: 'json',
      async: isAsync,
      success: function(e) {
        _that.count++;
        //console.log('模拟异步请求'+ _that.count);
        timerFlag = true;
      }
    });
  }, during);
}

function closeHandler(e) {
  var temp = JSON.parse($.cookie(WEB_USER_TIME));
  if (!temp || temp.num < 0) {
    return false;
  } else {
    temp = {
      num: temp.num - 1 <= 0 ? 0 : temp.num - 1,
      startTime: temp.startTime
    };
  }

  if (temp.num === 0 && operaFlag && uid) {
    $.ajax({
      url: BLOG_URL + 'pv-log/at',
      type: 'get',
      dataType: 'json',
      async: false,
      success: function(e) {
        //console.log('页面关闭接口回调信息：' + e.msg);
      }
    });
    temp.endTime = new Date();
    $.cookie(WEB_USER_TIME, JSON.stringify(temp), {
      expires: 7,
      path: '/'
    });
  }
}

window.onunload = closeHandler;

function timeUserFun (time) {
  var time = time || 2;
  var userTime = time * 60;
  var objTime = {
    init: 0,
    time: function() {
      objTime.init += 1;
      if (objTime.init == userTime) {
        //console.log('未操作log') // 用户到达未操作事件 做一些处理
        operaFlag = false;
      }
    },
    eventFun: function() {
      operaFlag = true;
      clearInterval(testUser);

      var tempTime = objTime.init >= time ? 0 : objTime.init;
      objTime.init = 0;
      testUser = setInterval(objTime.time, 1000);

      if (timerFlag) {
        debounce(updateAction(true, 1000*60*5 - 1000*60*tempTime), 1000 * 10);
      }
    }
  };
  var testUser = setInterval(objTime.time, 1000);

  var body = document.querySelector('html');
  body.addEventListener("click", objTime.eventFun);
  body.addEventListener("keydown", objTime.eventFun);
  body.addEventListener("mousemove", objTime.eventFun);
  body.addEventListener("mousewheel", objTime.eventFun);
}
// 函数去抖
function debounce(func, delay) {
  var timer = null;
  var context = this;

  return function() {
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}
