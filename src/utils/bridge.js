
/* eslint-disable */
function isAndroid() {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  return isAndroid;
}
var appNative = (function () {
  var _sendData = '';
  var _formId = '';
  var _handler = '';
  var _bridge = null;
  window.onerror = function (err) { };
  function setupWebViewJavascriptBridge(callback) {
    if (isAndroid()) {
      if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
      } else {
        document.addEventListener(
          'WebViewJavascriptBridgeReady',
          function () {
            callback(WebViewJavascriptBridge);
          },
          false
        );
      }
    } else {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
    }
  }
  return {
    setForm: function (formId) {
      _formId = formId;
    },
    setHandler: function (handler) {
      if (_handler !== handler) {
        _handler = handler;
        _bridge = null;
      }
    },
    setSendData: function (sendData) {
      _sendData = sendData;
    },
    handleSend: function () {
      // js调APP方法 （参数分别为:app提供的方法名  传给app的数据  回调）
      if (isAndroid()) {
        _bridge.send(_sendData, function (response) {
          // callbackFn 与App.vue定义的方法callbackFn一致
          _sendData.callbackFn && _sendData.callbackFn(response);
        });
      } else {
        // js调用iOS方法
        _bridge.callHandler(_handler, _sendData, function (response) {
          _sendData.callbackFn && _sendData.callbackFn(response);
        });
      }
    },
    init: function () {
      setupWebViewJavascriptBridge(function (bridge) {
        _bridge = bridge;
        if (isAndroid()) {
          bridge.init(function (message, responseCallback) {
            var data = {
              'Javascript Responds': 'Responds!'
            };
            responseCallback(data);
          });
        }
        // js注册handler给app端调用
        bridge.registerHandler(_handler, function (data, responseCallback) {
          var responseData = {
            'Javascript Says': 'Right back atcha!'
          };
          if (_formId != null && _formId.length > 0) {
            var form = document.getElementById(_formId);
            if (typeof data === 'string') {
              data = eval(data);
            }
            for (var key in data) {
              var input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = data[key];
              form.appendChild(input);
            }
            form.submit();
          }
          // 带有responseCallback都是来自本端--服务器（目前是js代码，所以是js）的数据
          responseCallback(responseData);
        });
      });
    },
    getBridge: function () {
      return _bridge;
    }
  };
})();
window.appNative = appNative;
/* eslint-disable */