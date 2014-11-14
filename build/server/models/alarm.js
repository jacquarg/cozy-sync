// Generated by CoffeeScript 1.8.0
var Alarm, americano;

americano = require('americano-cozy');

module.exports = Alarm = americano.getModel('Alarm', {
  id: String,
  caldavuri: String,
  trigg: String,
  description: String,
  timezone: String,
  action: {
    type: String,
    "default": 'DISPLAY'
  },
  related: {
    type: String,
    "default": null
  },
  tags: {
    type: function(x) {
      return x;
    }
  }
});

require('cozy-ical').decorateAlarm(Alarm);

Alarm.all = function(cb) {
  return Alarm.request('byURI', cb);
};

Alarm.byCalendar = function(calendarId, callback) {
  return Alarm.request('byCalendar', {
    key: calendarId
  }, callback);
};

Alarm.byURI = function(uri, cb) {
  var req;
  req = Alarm.request('byURI', null, cb);
  req.body = JSON.stringify({
    key: uri
  });
  return req.setHeader('content-type', 'application/json');
};

Alarm.tags = function(callback) {
  return Alarm.rawRequest("tags", {
    group: true
  }, function(err, results) {
    var out, result, tag, type, _i, _len, _ref;
    if (err) {
      return callback(err);
    }
    out = {
      calendar: [],
      tag: []
    };
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      result = results[_i];
      _ref = result.key, type = _ref[0], tag = _ref[1];
      out[type].push(tag);
    }
    return callback(null, out);
  });
};
