"use strict";

require("babel-polyfill");

require("babel-core/register");

require("isomorphic-fetch");
var run = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
		return regeneratorRuntime.wrap(function _callee5$(_context6) {
			while (1) {
				switch (_context6.prev = _context6.next) {
					case 0:
						if (!(process.env.UPDATES === 'webhook')) {
							_context6.next = 6;
							break;
						}

						_context6.next = 3;
						return vk.updates.startWebhook();

					case 3:

						console.log('Webhook server started');
						_context6.next = 9;
						break;

					case 6:
						_context6.next = 8;
						return vk.updates.startPolling();

					case 8:

						console.log('Polling started');

					case 9:
					case "end":
						return _context6.stop();
				}
			}
		}, _callee5, this);
	}));

	return function run() {
		return _ref5.apply(this, arguments);
	};
}();


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(quoteGenerator);

var _require = require('vk-io'),
    VK = _require.VK;

var vk = new VK();

vk.setOptions({
	token: 'cd960ec90ee87b31491dce04c694914752f0925761a7b7c2c65bc700c180591dd66c56bf9615cf8294aed',
	apiMode: 'parallel_selected',
	webhookPath: '/webhook/secret-path'
});

var updates = vk.updates;


function quoteGenerator() {
	return regeneratorRuntime.wrap(function quoteGenerator$(_context) {
		while (1) {
			switch (_context.prev = _context.next) {
				case 0:
					if (!true) {
						_context.next = 5;
						break;
					}

					_context.next = 3;
					return fetch('http://ron-swanson-quotes.herokuapp.com/v2/quotes').then(function (res) {
						return res.json();
					});

				case 3:
					_context.next = 0;
					break;

				case 5:
				case "end":
					return _context.stop();
			}
		}
	}, _marked, this);
}

var generator = quoteGenerator();

// Skip outbox message and handle errors
updates.use(function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context, next) {
		return regeneratorRuntime.wrap(function _callee$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						if (!(context.is('message') && context.isOutbox())) {
							_context2.next = 2;
							break;
						}

						return _context2.abrupt("return");

					case 2:
						_context2.prev = 2;
						_context2.next = 5;
						return next();

					case 5:
						_context2.next = 10;
						break;

					case 7:
						_context2.prev = 7;
						_context2.t0 = _context2["catch"](2);

						console.error('Error:', _context2.t0);

					case 10:
					case "end":
						return _context2.stop();
				}
			}
		}, _callee, undefined, [[2, 7]]);
	}));

	return function (_x, _x2) {
		return _ref.apply(this, arguments);
	};
}());

updates.hear('/start', function () {
	var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(context) {
		return regeneratorRuntime.wrap(function _callee2$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						_context3.next = 2;
						return context.send("\n\t\tMy commands list\n\t\t/cat - Cat photo\n\t");

					case 2:
					case "end":
						return _context3.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x3) {
		return _ref2.apply(this, arguments);
	};
}());

updates.hear(/hah/i, function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(context) {
		return regeneratorRuntime.wrap(function _callee3$(_context4) {
			while (1) {
				switch (_context4.prev = _context4.next) {
					case 0:
						_context4.next = 2;
						return generator.next().value.then(function (data) {
							context.send("" + data[0]);
						});

					case 2:
					case "end":
						return _context4.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x4) {
		return _ref3.apply(this, arguments);
	};
}());

updates.hear('/cat', function () {
	var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(context) {
		return regeneratorRuntime.wrap(function _callee4$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						_context5.next = 2;
						return Promise.all([context.send('Wait for the uploads awesome 😻'), context.sendPhoto('http://lorempixel.com/400/200/cats/')]);

					case 2:
					case "end":
						return _context5.stop();
				}
			}
		}, _callee4, undefined);
	}));

	return function (_x5) {
		return _ref4.apply(this, arguments);
	};
}());

run().catch(console.error);
