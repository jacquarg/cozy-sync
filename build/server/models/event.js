// Generated by CoffeeScript 1.7.1
var Alarm, Event, VAlarm, VCalendar, VEvent, VTodo, americano, async, moment, time, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

americano = require('americano-cozy');

time = require('time');

moment = require('moment');

Alarm = require('./alarm');

async = require('async');

_ref = require('../lib/ical_helpers'), VCalendar = _ref.VCalendar, VTodo = _ref.VTodo, VAlarm = _ref.VAlarm, VEvent = _ref.VEvent;

module.exports = Event = americano.getModel('Event', {
  id: {
    type: String,
    "default": null
  },
  caldavuri: String,
  start: String,
  end: String,
  place: {
    type: String,
    "default": ''
  },
  details: {
    type: String,
    "default": ''
  },
  description: {
    type: String,
    "default": ''
  },
  rrule: String,
  attendees: {
    type: [Object]
  },
  related: {
    type: String,
    "default": null
  },
  timezone: {
    type: String
  },
  alarms: {
    type: [Object]
  },
  tags: {
    type: function(x) {
      return x;
    }
  }
});

require('cozy-ical').decorateEvent(Event);

Event.dateFormat = 'YYYY-MM-DD';

Event.ambiguousDTFormat = 'YYYY-MM-DD[T]HH:mm:00.000';

Event.utcDTFormat = 'YYYY-MM-DD[T]HH:mm:00.000[Z]';

Event.alarmTriggRegex = /(\+?|-)PT?(\d+)(W|D|H|M|S)/;

Event.all = function(cb) {
  return Event.request('byURI', cb);
};

Event.byCalendar = function(calendarId, callback) {
  return Event.request('byCalendar', {
    key: calendarId
  }, callback);
};

Event.tags = function(callback) {
  return Event.rawRequest("tags", {
    group: true
  }, function(err, results) {
    var out, result, tag, type, _i, _len, _ref1;
    if (err) {
      return callback(err);
    }
    out = {
      calendar: [],
      tag: []
    };
    for (_i = 0, _len = results.length; _i < _len; _i++) {
      result = results[_i];
      _ref1 = result.key, type = _ref1[0], tag = _ref1[1];
      out[type].push(tag);
    }
    return callback(null, out);
  });
};

Event.byURI = function(uri, cb) {
  var req;
  req = Event.request('byURI', null, cb);
  req.body = JSON.stringify({
    key: uri
  });
  return req.setHeader('content-type', 'application/json');
};

Event.getCalendarsName = function(callback) {
  return async.series([Event.tags, Alarm.tags], function(err, results) {
    var calendars, rawCalendar, rawCalendars, _i, _len;
    if (err != null) {
      return callback(err);
    } else {
      rawCalendars = results[0].calendar.concat(results[1].calendar);
      calendars = [];
      for (_i = 0, _len = rawCalendars.length; _i < _len; _i++) {
        rawCalendar = rawCalendars[_i];
        if (__indexOf.call(calendars, rawCalendar) < 0) {
          calendars.push(rawCalendar);
        }
      }
      return callback(null, calendars);
    }
  });
};
