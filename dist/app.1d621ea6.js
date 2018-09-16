// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/hyperapp/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes) {
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    var node = rest.pop();
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true;
  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : recycleElement(element);
      })
    };
  }

  function resolveNode(node) {
    return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
  }

  function render() {
    skipRender = !skipRender;

    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, oldNode = node);
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) out[i] = target[i];
    for (var i in source) out[i] = source[i];

    return out;
  }

  function setPartialState(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function getPartialState(path, source) {
    var i = 0;
    while (i < path.length) {
      source = source[path[i++]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          var result = action(data);

          if (typeof result === "function") {
            result = result(getPartialState(path, globalState), actions);
          }

          if (result && result !== (state = getPartialState(path, globalState)) && !result.then // !isPromise
          ) {
              scheduleRender(globalState = setPartialState(path, clone(state, result), globalState));
            }

          return result;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
    }

    return actions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {} else if (name === "style") {
      for (var i in clone(oldValue, value)) {
        var style = value == null || value[i] == null ? "" : value[i];
        if (i[0] === "-") {
          element[name].setProperty(i, style);
        } else {
          element[name][i] = style;
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    var attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) {
        updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function () {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {} else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg);
      parent.insertBefore(newElement, element);

      if (oldNode != null) {
        removeElement(parent, element, oldNode);
      }

      element = newElement;
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node;
    } else {
      updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");

      var oldKeyed = {};
      var newKeyed = {};
      var oldElements = [];
      var oldChildren = oldNode.children;
      var children = node.children;

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldKey = getKey(oldChildren[i]);
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
        }
      }

      var i = 0;
      var k = 0;

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i]);
        var newKey = getKey(children[k] = resolveNode(children[k]));

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
          continue;
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
            k++;
          }
          i++;
        } else {
          var keyedNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
            i++;
          } else if (keyedNode[0]) {
            patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
          } else {
            patch(element, oldElements[i], null, children[k], isSvg);
          }

          newKeyed[newKey] = children[k];
          k++;
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i]);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    }
    return element;
  }
}
},{}],"src/state.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var state = exports.state = {
  activity_id: '499a63ab-971f-4edd-9c7d-a18b21227f7e',
  users: [],
  user: {},
  lrsdata: [],
  displaydata: []
};
},{}],"src/lib/lib.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var uniq = exports.uniq = function uniq(ar) {
  return ar.filter(function (v, i, s) {
    return s.indexOf(v) === i;
  });
};
var pluck = exports.pluck = function pluck(ele) {
  return function (arr) {
    return arr.map(function (a) {
      return a[ele];
    });
  };
};
var sortByProp = exports.sortByProp = function sortByProp(p) {
  return function (a, b) {
    return a[p] < b[p] ? -1 : a[p] > b[p] ? 1 : 0;
  };
};

var display_time = exports.display_time = function display_time(stamp) {
  var currentDate = new Date(stamp),
      day = currentDate.getDate(),
      month = currentDate.getMonth() + 1,
      year = currentDate.getFullYear(),
      hours = currentDate.getHours(),
      minutes = currentDate.getMinutes();

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var suffix = hours >= 12 ? "PM" : "AM";
  // hours = suffix === 'PM' ? hours - 12 : hours;
  hours = hours === 0 ? 12 : hours;
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + " " + suffix;
};
var datestamp = exports.datestamp = function datestamp(record) {
  return display_time(record.context.timing.timestamp) + ' ' + record.context.timing.timezone;
};

var time_from_seconds = exports.time_from_seconds = function time_from_seconds(time) {
  var hrs = Math.floor(time / 3600);
  var mins = Math.floor(time % 3600 / 60);
  var secs = Math.round(time % 60);
  var hrstr = hrs > 0 ? hrs + "h " : '';
  var minstr = mins > 0 ? mins + "m " : '';
  return "" + hrstr + minstr + secs + "s";
};
},{}],"src/components/usertable.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserTable = undefined;

var _hyperapp = require('hyperapp');

var _lib = require('../lib/lib');

var UserRow = function UserRow(_ref) {
  var id = _ref.id,
      email = _ref.email,
      clickFn = _ref.clickFn;
  return (0, _hyperapp.h)(
    'tr',
    null,
    (0, _hyperapp.h)(
      'td',
      { 'class': 'tiny' },
      (0, _hyperapp.h)(
        'a',
        { onclick: function onclick(e) {
            return clickFn(id);
          } },
        email
      )
    )
  );
};

var UserTable = exports.UserTable = function UserTable(_ref2) {
  var users = _ref2.users,
      select = _ref2.select;
  return (0, _hyperapp.h)(
    'table',
    { id: 'usertable' },
    (0, _hyperapp.h)(
      'thead',
      null,
      (0, _hyperapp.h)(
        'th',
        null,
        'Users'
      )
    ),
    (0, _hyperapp.h)(
      'tbody',
      null,
      users.map(function (user) {
        return (0, _hyperapp.h)(UserRow, {
          id: user.id,
          email: user.email,
          clickFn: select
        });
      })
    )
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","../lib/lib":"src/lib/lib.js"}],"src/components/datatable.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataTable = undefined;

var _hyperapp = require('hyperapp');

var _lib = require('../lib/lib');

var LrsRow = function LrsRow(_ref) {
  var row = _ref.row;
  return (0, _hyperapp.h)(
    'tr',
    null,
    (0, _hyperapp.h)(
      'td',
      { 'class': 'tiny' },
      row.user_id
    ),
    (0, _hyperapp.h)(
      'td',
      { 'class': 'tiny' },
      row.context.item_id
    ),
    (0, _hyperapp.h)(
      'td',
      null,
      row.verb
    ),
    (0, _hyperapp.h)(
      'td',
      null,
      (0, _lib.time_from_seconds)(row.context.timing.timer.total)
    ),
    (0, _hyperapp.h)(
      'td',
      null,
      row.context.chosen_answer
    ),
    (0, _hyperapp.h)(
      'td',
      null,
      row.context.correct ? "Yes" : ''
    ),
    (0, _hyperapp.h)(
      'td',
      { 'class': 'tiny' },
      (0, _lib.display_time)(row.context.timing.timestamp),
      ' ',
      row.context.timing.timezone
    ),
    (0, _hyperapp.h)(
      'td',
      { 'class': 'tiny' },
      (0, _lib.display_time)(row.timestamp)
    )
  );
};

var DataTable = exports.DataTable = function DataTable(_ref2) {
  var data = _ref2.data;
  return (0, _hyperapp.h)(
    'table',
    { id: 'datatable' },
    (0, _hyperapp.h)(
      'thead',
      null,
      (0, _hyperapp.h)(
        'th',
        null,
        'User'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Item'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Verb'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Time'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Chosen Answer'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Correct?'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'User Timestamp'
      ),
      (0, _hyperapp.h)(
        'th',
        null,
        'Server Timestamp'
      )
    ),
    (0, _hyperapp.h)(
      'tbody',
      null,
      data.sort((0, _lib.sortByProp)('timestamp')).map(function (row) {
        return (0, _hyperapp.h)(LrsRow, { row: row });
      })
    )
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","../lib/lib":"src/lib/lib.js"}],"src/components/inputs.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputFields = undefined;

var _hyperapp = require('hyperapp');

var TextInput = function TextInput(_ref) {
  var field = _ref.field,
      func = _ref.func,
      init = _ref.init,
      label = _ref.label;
  return (0, _hyperapp.h)(
    'label',
    { 'for': field,
      onclick: function onclick(e) {
        return func(init);
      }
    },
    label,
    ':\xA0',
    (0, _hyperapp.h)('input', {
      name: field,
      type: 'text',
      'class': 'input_text',
      value: init,
      oninput: function oninput(e) {
        return func(e.target.value);
      }
    })
  );
};

var InputFields = exports.InputFields = function InputFields(_ref2) {
  var state = _ref2.state,
      actions = _ref2.actions;
  return (0, _hyperapp.h)(
    'div',
    { 'class': 'inputs' },
    (0, _hyperapp.h)(TextInput, {
      field: 'activity_id',
      func: actions.get_records,
      init: state.activity_id,
      label: 'Activity UUID'
    }),
    (0, _hyperapp.h)(TextInput, {
      field: 'user_id',
      func: actions.user_select,
      init: state.user.id,
      label: 'User UUID'
    })
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js"}],"src/components/report/demographics.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Demographics = undefined;

var _hyperapp = require("hyperapp");

var Demographics = exports.Demographics = function Demographics(_ref) {
  var user = _ref.user;
  return (0, _hyperapp.h)(
    "demographics",
    { appointmentid: "", functioncode: "", workstationname: "" },
    (0, _hyperapp.h)("demographic", { name: "CandidateFirstName", value: "" }),
    (0, _hyperapp.h)("demographic", { name: "CandidateLastName", value: "" }),
    (0, _hyperapp.h)("demographic", { name: "email", value: "{user.email}" })
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js"}],"src/components/report/calc_item.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getByVerb = function getByVerb(verb) {
  return function (rs) {
    return rs.find(function (i) {
      return i.verb === verb;
    });
  };
};
var correctAttempt = function correctAttempt(rs) {
  return rs.find(function (i) {
    return i.context.correct === true;
  });
};
var gradedAttempt = function gradedAttempt(rs) {
  return correctAttempt(rs) || getByVerb('second_attempt')(rs);
};

var iscorrect = exports.iscorrect = function iscorrect(rs) {
  return correctAttempt(rs) ? 1 : 0;
};

var total_duration = exports.total_duration = function total_duration(rs) {
  return rs.reduce(function (t, r) {
    return t + r.context.timing.timer.total;
  }, 0).toFixed(3);
};

var duration_of = exports.duration_of = function duration_of(verb) {
  return function (rs) {
    var r = getByVerb(verb)(rs);
    return r ? r.context.timing.timer.total : 0;
  };
};

var correctAnswerLetter = exports.correctAnswerLetter = function correctAnswerLetter(rs) {
  var letters = "ABCDE".split('');
  var ga = gradedAttempt(rs);
  var result = { guess: '', correct: '' };
  ga.context.item.responses.forEach(function (r, i) {
    if (r.displayText === ga.context.chosen_answer) {
      result.guess = letters[i];
    }
    if (r.type[0] === 'correct') {
      result.correct = letters[i];
    }
  });
  return result;
};

var attempted = exports.attempted = function attempted(rs) {
  return rs.find(function (i) {
    return i.verb === 'first_attempt';
  }) ? 1 : 0;
};
var completed = exports.completed = function completed(rs) {
  return skipped(rs) ? 0 : 1;
};
var skipped = exports.skipped = function skipped(rs) {
  var first = getByVerb('first_attempt')(rs);
  var second = getByVerb('second_attempt')(rs);
  var cor = iscorrect(rs);
  return first && !cor && !second ? 1 : 0;
};
},{}],"src/components/report/counts.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortAndGroupRecords = undefined;

var _lib = require('../../lib/lib');

var groupByItemId = function groupByItemId(arr) {
  return arr.reduce(function (rv, x) {
    var v = x.context.item_id;
    var el = rv.find(function (r) {
      return r && r[0].context.item_id === v;
    });
    if (el) {
      el.push(x);
    } else {
      rv.push([x]);
    }
    return rv;
  }, []);
};

var sortAndGroupRecords = exports.sortAndGroupRecords = function sortAndGroupRecords(lrs) {
  return groupByItemId(lrs.sort((0, _lib.sortByProp)('timestamp')));
};
},{"../../lib/lib":"src/lib/lib.js"}],"src/components/report/calc_score.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentage_correct = exports.count_skipped = exports.count_incorrect = exports.count_correct = undefined;

var _calc_item = require("./calc_item");

var _counts = require("./counts");

var ITEMS = 175;

var count_correct = exports.count_correct = function count_correct(rs) {
  return (0, _counts.sortAndGroupRecords)(rs).reduce(function (tot, i) {
    return tot + (0, _calc_item.iscorrect)(i);
  }, 0);
};
var count_incorrect = exports.count_incorrect = function count_incorrect(rs) {
  return (0, _counts.sortAndGroupRecords)(rs).reduce(function (tot, i) {
    return tot + ((0, _calc_item.iscorrect)(i) ? 0 : 1);
  }, 0);
};
var count_skipped = exports.count_skipped = function count_skipped(rs) {
  return ITEMS - count_correct(rs) - count_incorrect(rs);
};
var percentage_correct = exports.percentage_correct = function percentage_correct(rs) {
  return (count_correct(rs) * 100 / ITEMS).toFixed(2);
};
},{"./calc_item":"src/components/report/calc_item.js","./counts":"src/components/report/counts.js"}],"src/components/report/categories.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Categories = undefined;

var _hyperapp = require('hyperapp');

var _calc_score = require('./calc_score');

var Categories = exports.Categories = function Categories(_ref) {
  var data = _ref.data;
  return (0, _hyperapp.h)(
    'categories',
    null,
    (0, _hyperapp.h)('category', { name: 'hand_surgery',
      count: '175',
      countcorrect: (0, _calc_score.count_correct)(data),
      countincorrect: (0, _calc_score.count_incorrect)(data),
      countskipped: (0, _calc_score.count_skipped)(data),
      countmarked: '0'
    })
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./calc_score":"src/components/report/calc_score.js"}],"src/components/report/items.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Items = undefined;

var _hyperapp = require('hyperapp');

var _counts = require('./counts');

var _calc_item = require('./calc_item');

// TODO: Need some extra data from the Sequence
// which will give me items that were SEEN...
// but may not have attempts and LRS records

var ItemGroup = function ItemGroup(_ref) {
  var item = _ref.item;
  return (0, _hyperapp.h)(
    'itemgroup',
    {
      id: item[0].context.item_id,
      name: item[0].context.item.external_id[0],
      scored: (0, _calc_item.iscorrect)(item),
      duration: (0, _calc_item.total_duration)(item),
      durationFirstAttempt: (0, _calc_item.duration_of)('first_attempt')(item),
      durationRationale: (0, _calc_item.duration_of)('rationale_time')(item),
      durationSecondAttempt: (0, _calc_item.duration_of)('second_attempt')(item),
      progid: 'UTDP.MultiChoiceItem.1',
      weight: '1',
      presented: (0, _calc_item.attempted)(item),
      visited: (0, _calc_item.attempted)(item)
    },
    (0, _hyperapp.h)('item', {
      response: (0, _calc_item.correctAnswerLetter)(item).guess,
      correctresponse: (0, _calc_item.correctAnswerLetter)(item).correct,
      score: (0, _calc_item.iscorrect)(item),
      scoremin: '0',
      scoremax: '1',
      scorenom: '0',
      complete: (0, _calc_item.completed)(item),
      skipped: (0, _calc_item.skipped)(item),
      marked: '0' })
  );
};

var Items = exports.Items = function Items(_ref2) {
  var records = _ref2.records;
  return (0, _counts.sortAndGroupRecords)(records).map(function (it) {
    return (0, _hyperapp.h)(ItemGroup, { item: it });
  });
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./counts":"src/components/report/counts.js","./calc_item":"src/components/report/calc_item.js"}],"src/components/report/sections.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sections = undefined;

var _hyperapp = require('hyperapp');

var _items = require('./items');

var _lib = require('../../lib/lib');

var _calc_item = require('./calc_item');

var _calc_score = require('./calc_score');

var Section = function Section(_ref) {
  var data = _ref.data;
  return (0, _hyperapp.h)(
    'section',
    { name: 'hand_exam',
      count: '175',
      countcorrect: (0, _calc_score.count_correct)(data),
      countincorrect: (0, _calc_score.count_incorrect)(data),
      countskipped: (0, _calc_score.count_skipped)(data),
      countmarked: '0',
      startdatetime: (0, _lib.datestamp)(data[0]),
      enddatetime: (0, _lib.datestamp)(data[data.length - 1]),
      duration: (0, _calc_item.total_duration)(data)
    },
    (0, _hyperapp.h)('score', {
      scorevalue: (0, _calc_score.count_correct)(data),
      scoredisplay: (0, _calc_score.percentage_correct)(data),
      passindicator: 'p',
      scoremin: '0',
      scoremax: '175',
      scorecut: '0'
    }),
    (0, _hyperapp.h)(_items.Items, { records: data })
  );
};

var Sections = exports.Sections = function Sections(_ref2) {
  var data = _ref2.data;
  return (0, _hyperapp.h)(
    'sections',
    null,
    (0, _hyperapp.h)(Section, { data: data })
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./items":"src/components/report/items.js","../../lib/lib":"src/lib/lib.js","./calc_item":"src/components/report/calc_item.js","./calc_score":"src/components/report/calc_score.js"}],"src/components/report/exam.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Exam = undefined;

var _hyperapp = require('hyperapp');

var _categories = require('./categories');

var _sections = require('./sections');

var _lib = require('../../lib/lib');

var _calc_item = require('./calc_item');

var _calc_score = require('./calc_score');

var Exam = exports.Exam = function Exam(_ref) {
  var data = _ref.data,
      user = _ref.user;
  return (0, _hyperapp.h)(
    'exam',
    {
      resourcefilename: user.email + '.xml',
      resourceversion: '1.0',
      name: 'MOC-HANDEXAM',
      examformname: 'HANDEXAM',
      driverversion: '9.1.1 Build #0 (UTD 9.1 CORE (A))',
      startdatetime: (0, _lib.datestamp)(data[0]),
      enddatetime: (0, _lib.datestamp)(data[data.length - 1]),
      duration: (0, _calc_item.total_duration)(data),
      restartcount: '0',
      count: '175',
      countcorrect: (0, _calc_score.count_correct)(data),
      countincorrect: (0, _calc_score.count_incorrect)(data),
      countskipped: (0, _calc_score.count_skipped)(data),
      countmarked: '0',
      functioncode: '',
      workstationname: ''
    },
    (0, _hyperapp.h)('score', {
      scorevalue: (0, _calc_score.count_correct)(data),
      scoredisplay: (0, _calc_score.percentage_correct)(data),
      passindicator: 'p',
      scoremin: '0',
      scoremax: '175',
      scorecut: '0'
    }),
    (0, _hyperapp.h)(_sections.Sections, { data: data }),
    (0, _hyperapp.h)(_categories.Categories, { data: data })
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./categories":"src/components/report/categories.js","./sections":"src/components/report/sections.js","../../lib/lib":"src/lib/lib.js","./calc_item":"src/components/report/calc_item.js","./calc_score":"src/components/report/calc_score.js"}],"src/components/report/report.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Report = undefined;

var _hyperapp = require('hyperapp');

var _demographics = require('./demographics');

var _exam = require('./exam');

var _counts = require('./counts');

var _calc_item = require('./calc_item');

var _lib = require('../../lib/lib');

var _calc_score = require('./calc_score');

var Report = exports.Report = function Report(_ref) {
  var state = _ref.state;
  return (0, _hyperapp.h)(
    'div',
    { id: 'report' },
    (0, _hyperapp.h)(
      'ul',
      { 'class': 'data' },
      (0, _hyperapp.h)(
        'li',
        null,
        'Records: ',
        state.displaydata.length
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Unique Items: ',
        (0, _counts.sortAndGroupRecords)(state.displaydata).length
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Correct: ',
        (0, _calc_score.count_correct)(state.displaydata)
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Wrong: ',
        (0, _calc_score.count_incorrect)(state.displaydata)
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Skipped: ',
        (0, _calc_score.count_skipped)(state.displaydata)
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Score: ',
        (0, _calc_score.percentage_correct)(state.displaydata)
      ),
      (0, _hyperapp.h)(
        'li',
        null,
        'Duration: ',
        (0, _lib.time_from_seconds)((0, _calc_item.total_duration)(state.displaydata))
      )
    ),
    (0, _hyperapp.h)(
      'script',
      null,
      (0, _hyperapp.h)(
        'simpleXMLResult',
        { xmlns: 'http://sdk.prometric.com/schemas/SimpleXMLResults1_3', version: '1.3' },
        (0, _hyperapp.h)(_demographics.Demographics, { user: state.user }),
        state.displaydata[0] ? (0, _hyperapp.h)(_exam.Exam, { data: state.displaydata, user: state.user }) : null
      )
    )
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./demographics":"src/components/report/demographics.js","./exam":"src/components/report/exam.js","./counts":"src/components/report/counts.js","./calc_item":"src/components/report/calc_item.js","../../lib/lib":"src/lib/lib.js","./calc_score":"src/components/report/calc_score.js"}],"src/view.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.view = undefined;

var _hyperapp = require('hyperapp');

var _state = require('./state');

var _usertable = require('./components/usertable');

var _datatable = require('./components/datatable');

var _inputs = require('./components/inputs');

var _report = require('./components/report/report');

var no_user = function no_user(actions) {
  return (0, _hyperapp.h)(
    'button',
    {
      'class': 'fetch_users',
      onclick: function onclick(e) {
        return actions.get_users();
      }
    },
    'Fetch Users'
  );
};

var selected_user = function selected_user(user) {
  return (0, _hyperapp.h)(
    'h3',
    null,
    (0, _hyperapp.h)(
      'em',
      null,
      user.id
    ),
    user.email
  );
};

var view = exports.view = function view(state, actions) {
  return (0, _hyperapp.h)(
    'section',
    null,
    (0, _hyperapp.h)(
      'h2',
      null,
      'Search Propel2 LRS'
    ),
    (0, _hyperapp.h)(_inputs.InputFields, { state: state, actions: actions }),
    (0, _hyperapp.h)('br', null),
    state.user.id ? selected_user(state.user) : no_user(actions),
    (0, _hyperapp.h)(_report.Report, { state: state }),
    (0, _hyperapp.h)(
      'div',
      { 'class': 'tables' },
      (0, _hyperapp.h)(_usertable.UserTable, { users: state.users, select: actions.user_select }),
      (0, _hyperapp.h)(_datatable.DataTable, { data: state.displaydata })
    )
  );
};
},{"hyperapp":"node_modules/hyperapp/src/index.js","./state":"src/state.js","./components/usertable":"src/components/usertable.js","./components/datatable":"src/components/datatable.js","./components/inputs":"src/components/inputs.js","./components/report/report":"src/components/report/report.js"}],"node_modules/debounce-promise/dist/index.js":[function(require,module,exports) {
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* global setTimeout, clearTimeout */

module.exports = function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var lastCallAt = void 0;
  var deferred = void 0;
  var timer = void 0;
  var pendingArgs = [];
  return function debounced() {
    var currentWait = getWait(wait);
    var currentTime = new Date().getTime();

    var isCold = !lastCallAt || currentTime - lastCallAt > currentWait;

    lastCallAt = currentTime;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isCold && options.leading) {
      return options.accumulate ? Promise.resolve(fn.call(this, [args])).then(function (result) {
        return result[0];
      }) : Promise.resolve(fn.call.apply(fn, [this].concat(args)));
    }

    if (deferred) {
      clearTimeout(timer);
    } else {
      deferred = defer();
    }

    pendingArgs.push(args);
    timer = setTimeout(flush.bind(this), currentWait);

    if (options.accumulate) {
      var _ret = function () {
        var argsIndex = pendingArgs.length - 1;
        return {
          v: deferred.promise.then(function (results) {
            return results[argsIndex];
          })
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }

    return deferred.promise;
  };

  function flush() {
    var thisDeferred = deferred;
    clearTimeout(timer);

    Promise.resolve(options.accumulate ? fn.call(this, pendingArgs) : fn.apply(this, pendingArgs[pendingArgs.length - 1])).then(thisDeferred.resolve, thisDeferred.reject);

    pendingArgs = [];
    deferred = null;
  }
};

function getWait(wait) {
  return typeof wait === 'function' ? wait() : wait;
}

function defer() {
  var deferred = {};
  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}
//# sourceMappingURL=index.js.map
},{}],"src/actions/api.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var endpoint = exports.endpoint = 'https://4ibvog74h7.execute-api.us-east-1.amazonaws.com/dev';
},{}],"src/actions/records.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set_lrsdata = exports.get_records = undefined;

var _debouncePromise = require('debounce-promise');

var _debouncePromise2 = _interopRequireDefault(_debouncePromise);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetch_lrsdata = function fetch_lrsdata(activity_id, user_id) {
  return fetch(_api.endpoint + '/lrs/activities/' + activity_id + '?user_id=' + user_id).then(function (res) {
    return res.json();
  });
};
var get_lrsdata = (0, _debouncePromise2.default)(fetch_lrsdata, 700);

var get_records = exports.get_records = function get_records(_ref) {
  var activity_id = _ref.activity_id,
      user_id = _ref.user_id;
  return function (state, actions) {
    console.log('get_records', activity_id, user_id);
    get_lrsdata(activity_id, user_id).then(actions.set_lrsdata).then(actions.log_state);
    return { activity_id: activity_id, displaydata: [] };
  };
};

var set_lrsdata = exports.set_lrsdata = function set_lrsdata(lrsdata) {
  return { lrsdata: lrsdata, displaydata: lrsdata.lrsEvents };
};
},{"debounce-promise":"node_modules/debounce-promise/dist/index.js","./api":"src/actions/api.js"}],"src/actions/users.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.user_select = exports.set_users = exports.get_users = undefined;

var _debouncePromise = require('debounce-promise');

var _debouncePromise2 = _interopRequireDefault(_debouncePromise);

var _api = require('./api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetch_users = function fetch_users(actions) {
  return fetch(_api.endpoint + '/users').then(function (res) {
    return res.json();
  });
};

var get_users = exports.get_users = function get_users() {
  return function (state, actions) {
    fetch_users(actions).then(actions.set_users).then(actions.log_state);
    return {};
  };
};

var set_users = exports.set_users = function set_users(users) {
  return { users: users };
};

var user_select = exports.user_select = function user_select(user_id) {
  return function (state, actions) {
    console.log('user_id', user_id);
    actions.get_records({ activity_id: state.activity_id, user_id: user_id });
    var uu = state.users.filter(function (u) {
      return u.id == user_id;
    })[0];
    return { user: { id: uu.id, email: uu.email } };
  };
};
},{"debounce-promise":"node_modules/debounce-promise/dist/index.js","./api":"src/actions/api.js"}],"src/actions/actions.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = undefined;

var _records = require('./records');

var _users = require('./users');

var actions = exports.actions = {
  log_state: function log_state() {
    return function (state) {
      window.__state = state;
      console.log("state:", state);
    };
  },
  get_records: _records.get_records,
  set_lrsdata: _records.set_lrsdata,
  get_users: _users.get_users,
  set_users: _users.set_users,
  user_select: _users.user_select
};
},{"./records":"src/actions/records.js","./users":"src/actions/users.js"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"src/app.scss":[function(require,module,exports) {

var reloadCSS = require('_css_loader');
module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/app.js":[function(require,module,exports) {
'use strict';

var _hyperapp = require('hyperapp');

var _view = require('./view');

var _state = require('./state');

var _actions = require('./actions/actions');

require('./app.scss');

(0, _hyperapp.app)(_state.state, _actions.actions, _view.view, document.body);
},{"hyperapp":"node_modules/hyperapp/src/index.js","./view":"src/view.js","./state":"src/state.js","./actions/actions":"src/actions/actions.js","./app.scss":"src/app.scss"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55830' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/app.js"], null)
//# sourceMappingURL=/app.1d621ea6.map