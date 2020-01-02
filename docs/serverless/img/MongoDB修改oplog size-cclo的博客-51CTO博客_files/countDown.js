
  var zDate = {
    visiChangeTimer: null,
    setLastTimePc: function (obj, time, timeInter, callback) {
      if (time > 0) {
        var day, hour, minute, seconds, hm,
        day = Math.floor(time / 1000 / 60 / 60 / 24),
        hour = Math.floor(time / 1000 / 60 / 60 % 24) + day * 24,
        minute = Math.floor(time / 1000 / 60 % 60),
        seconds = Math.floor(time / 1000 % 60),
        hm = Math.floor(time % 1000),
        hm = ('' + hm).substring(0, 1);

        obj.html((hour < 10 ? '0' + hour : hour) + ':' +
        (minute < 10 ? '0' + minute : minute) + ':' +
        (seconds < 10 ? '0' + seconds : seconds) + '.' + hm);
      } else {
        clearInterval(timeInter);
        callback && callback();
      }
    },
    getServerTime: function (callback) {
        var xhr = new XMLHttpRequest(),
            self = this,
            dateStr, dateObj, callBackFlag = false;
        if (!xhr) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.open("HEAD", location.href, true);
        xhr.onreadystatechange = function () {
            if (!callBackFlag && (xhr.readyState == 4 || xhr.status == 200)) {
                callBackFlag = true;
                dateStr = xhr.getResponseHeader('Date');
                dateObj = new Date(dateStr);
                if (dateStr && dateObj) {
                    callback && callback(dateObj);
                } else {
                    callback && callback(null);
                }
            }
        }
        xhr.send(null);
    },
    visibilityAction: function (callback) {
      document.addEventListener('visibilitychange',function(){ //浏览器切换事件
          if(document.visibilityState !=='hidden') { //状态判断
            if (this.visiChangeTimer) {
              clearTimeout(this.visiChangeTimer);
            }
            this.visiChangeTimer = setTimeout(function() {
              callback && callback();
            }, 500);
          }
      });
    }
  };
