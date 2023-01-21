"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;
exports.default = void 0;
exports.init = init;

require("source-map-support/register");

var _npmlog = _interopRequireDefault(require("npmlog"));

var _winston = require("winston");

var _support = require("@appium/support");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_support.logger.patchLogger(_npmlog.default);

global._global_npmlog = _npmlog.default;
_npmlog.default.level = 'info';
const levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1
};
const colors = {
  info: 'cyan',
  debug: 'grey',
  warn: 'yellow',
  error: 'red'
};
const npmToWinstonLevels = {
  silly: 'debug',
  verbose: 'debug',
  debug: 'debug',
  info: 'info',
  http: 'info',
  warn: 'warn',
  error: 'error'
};
let log = null;
let useLocalTimeZone = false;

const timestampFormat = _winston.format.timestamp({
  format() {
    let date = new Date();

    if (useLocalTimeZone) {
      date = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    }

    return date.toISOString().replace(/[TZ]/g, ' ').replace(/\./g, ':').trim();
  }

});

const colorizeFormat = _winston.format.colorize({
  colors
});

const stripColorFormat = (0, _winston.format)(function stripColor(info) {
  const code = /\u001b\[(\d+(;\d+)*)?m/g;
  info.message = info.message.replace(code, '');
  return info;
})();

function createConsoleTransport(args, logLvl) {
  return new _winston.transports.Console({
    name: 'console',
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    stderrLevels: ['error'],
    format: _winston.format.combine((0, _winston.format)(function adjustDebug(info) {
      if (info.level === 'debug') {
        info.level = 'info';
        info.message = `[debug] ${info.message}`;
      }

      return info;
    })(), timestampFormat, args.logNoColors ? stripColorFormat : colorizeFormat, _winston.format.printf(function printInfo(info) {
      return `${args.logTimestamp ? `${info.timestamp} - ` : ''}${info.message}`;
    }))
  });
}

function createFileTransport(args, logLvl) {
  return new _winston.transports.File({
    name: 'file',
    filename: args.logFile,
    maxFiles: 1,
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    format: _winston.format.combine(stripColorFormat, timestampFormat, _winston.format.printf(function printInfo(info) {
      return `${info.timestamp} ${info.message}`;
    }))
  });
}

function createHttpTransport(args, logLvl) {
  let host = '127.0.0.1';
  let port = 9003;

  if (args.webhook.match(':')) {
    const hostAndPort = args.webhook.split(':');
    host = hostAndPort[0];
    port = parseInt(hostAndPort[1], 10);
  }

  return new _winston.transports.Http({
    name: 'http',
    host,
    port,
    path: '/',
    handleExceptions: true,
    exitOnError: false,
    json: false,
    level: logLvl,
    format: _winston.format.combine(stripColorFormat, _winston.format.printf(function printInfo(info) {
      return `${info.timestamp} ${info.message}`;
    }))
  });
}

async function createTransports(args) {
  let transports = [];
  let consoleLogLevel = null;
  let fileLogLevel = null;

  if (args.loglevel && args.loglevel.match(':')) {
    const lvlPair = args.loglevel.split(':');
    consoleLogLevel = lvlPair[0] || consoleLogLevel;
    fileLogLevel = lvlPair[1] || fileLogLevel;
  } else {
    consoleLogLevel = fileLogLevel = args.loglevel;
  }

  transports.push(createConsoleTransport(args, consoleLogLevel));

  if (args.logFile) {
    try {
      if (await _support.fs.exists(args.logFile)) {
        await _support.fs.unlink(args.logFile);
      }

      transports.push(createFileTransport(args, fileLogLevel));
    } catch (e) {
      console.log(`Tried to attach logging to file '${args.logFile}' but an error ` + `occurred: ${e.message}`);
    }
  }

  if (args.webhook) {
    try {
      transports.push(createHttpTransport(args, fileLogLevel));
    } catch (e) {
      console.log(`Tried to attach logging to Http at ${args.webhook} but ` + `an error occurred: ${e.message}`);
    }
  }

  return transports;
}

async function init(args) {
  _npmlog.default.level = 'silent';
  useLocalTimeZone = args.localTimezone;
  clear();
  log = (0, _winston.createLogger)({
    transports: await createTransports(args),
    levels
  });

  _npmlog.default.on('log', logObj => {
    const winstonLevel = npmToWinstonLevels[logObj.level] || 'info';
    let msg = logObj.message;

    if (logObj.prefix) {
      const prefix = `[${logObj.prefix}]`;
      msg = `${args.logNoColors ? prefix : prefix.magenta} ${msg}`;
    }

    log[winstonLevel](msg);

    if (args.logHandler && _lodash.default.isFunction(args.logHandler)) {
      args.logHandler(logObj.level, msg);
    }
  });
}

function clear() {
  if (log) {
    for (let transport of _lodash.default.keys(log.transports)) {
      log.remove(transport);
    }
  }

  _npmlog.default.removeAllListeners('log');
}

var _default = init;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJsb2dnZXIiLCJwYXRjaExvZ2dlciIsIm5wbWxvZyIsImdsb2JhbCIsIl9nbG9iYWxfbnBtbG9nIiwibGV2ZWwiLCJsZXZlbHMiLCJkZWJ1ZyIsImluZm8iLCJ3YXJuIiwiZXJyb3IiLCJjb2xvcnMiLCJucG1Ub1dpbnN0b25MZXZlbHMiLCJzaWxseSIsInZlcmJvc2UiLCJodHRwIiwibG9nIiwidXNlTG9jYWxUaW1lWm9uZSIsInRpbWVzdGFtcEZvcm1hdCIsImZvcm1hdCIsInRpbWVzdGFtcCIsImRhdGUiLCJEYXRlIiwidmFsdWVPZiIsImdldFRpbWV6b25lT2Zmc2V0IiwidG9JU09TdHJpbmciLCJyZXBsYWNlIiwidHJpbSIsImNvbG9yaXplRm9ybWF0IiwiY29sb3JpemUiLCJzdHJpcENvbG9yRm9ybWF0Iiwic3RyaXBDb2xvciIsImNvZGUiLCJtZXNzYWdlIiwiY3JlYXRlQ29uc29sZVRyYW5zcG9ydCIsImFyZ3MiLCJsb2dMdmwiLCJ0cmFuc3BvcnRzIiwiQ29uc29sZSIsIm5hbWUiLCJoYW5kbGVFeGNlcHRpb25zIiwiZXhpdE9uRXJyb3IiLCJqc29uIiwic3RkZXJyTGV2ZWxzIiwiY29tYmluZSIsImFkanVzdERlYnVnIiwibG9nTm9Db2xvcnMiLCJwcmludGYiLCJwcmludEluZm8iLCJsb2dUaW1lc3RhbXAiLCJjcmVhdGVGaWxlVHJhbnNwb3J0IiwiRmlsZSIsImZpbGVuYW1lIiwibG9nRmlsZSIsIm1heEZpbGVzIiwiY3JlYXRlSHR0cFRyYW5zcG9ydCIsImhvc3QiLCJwb3J0Iiwid2ViaG9vayIsIm1hdGNoIiwiaG9zdEFuZFBvcnQiLCJzcGxpdCIsInBhcnNlSW50IiwiSHR0cCIsInBhdGgiLCJjcmVhdGVUcmFuc3BvcnRzIiwiY29uc29sZUxvZ0xldmVsIiwiZmlsZUxvZ0xldmVsIiwibG9nbGV2ZWwiLCJsdmxQYWlyIiwicHVzaCIsImZzIiwiZXhpc3RzIiwidW5saW5rIiwiZSIsImNvbnNvbGUiLCJpbml0IiwibG9jYWxUaW1lem9uZSIsImNsZWFyIiwiY3JlYXRlTG9nZ2VyIiwib24iLCJsb2dPYmoiLCJ3aW5zdG9uTGV2ZWwiLCJtc2ciLCJwcmVmaXgiLCJtYWdlbnRhIiwibG9nSGFuZGxlciIsIl8iLCJpc0Z1bmN0aW9uIiwidHJhbnNwb3J0Iiwia2V5cyIsInJlbW92ZSIsInJlbW92ZUFsbExpc3RlbmVycyJdLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9sb2dzaW5rLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucG1sb2cgZnJvbSAnbnBtbG9nJztcbmltcG9ydCB7Y3JlYXRlTG9nZ2VyLCBmb3JtYXQsIHRyYW5zcG9ydHN9IGZyb20gJ3dpbnN0b24nO1xuaW1wb3J0IHtmcywgbG9nZ2VyfSBmcm9tICdAYXBwaXVtL3N1cHBvcnQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuLy8gc2V0IHVwIGRpc3RyaWJ1dGVkIGxvZ2dpbmcgYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZVxubG9nZ2VyLnBhdGNoTG9nZ2VyKG5wbWxvZyk7XG5nbG9iYWwuX2dsb2JhbF9ucG1sb2cgPSBucG1sb2c7XG5cbi8vIG5wbWxvZyBpcyB1c2VkIG9ubHkgZm9yIGVtaXR0aW5nLCB3ZSB1c2Ugd2luc3RvbiBmb3Igb3V0cHV0XG5ucG1sb2cubGV2ZWwgPSAnaW5mbyc7XG5jb25zdCBsZXZlbHMgPSB7XG4gIGRlYnVnOiA0LFxuICBpbmZvOiAzLFxuICB3YXJuOiAyLFxuICBlcnJvcjogMSxcbn07XG5cbmNvbnN0IGNvbG9ycyA9IHtcbiAgaW5mbzogJ2N5YW4nLFxuICBkZWJ1ZzogJ2dyZXknLFxuICB3YXJuOiAneWVsbG93JyxcbiAgZXJyb3I6ICdyZWQnLFxufTtcblxuY29uc3QgbnBtVG9XaW5zdG9uTGV2ZWxzID0ge1xuICBzaWxseTogJ2RlYnVnJyxcbiAgdmVyYm9zZTogJ2RlYnVnJyxcbiAgZGVidWc6ICdkZWJ1ZycsXG4gIGluZm86ICdpbmZvJyxcbiAgaHR0cDogJ2luZm8nLFxuICB3YXJuOiAnd2FybicsXG4gIGVycm9yOiAnZXJyb3InLFxufTtcblxubGV0IGxvZyA9IG51bGw7XG5sZXQgdXNlTG9jYWxUaW1lWm9uZSA9IGZhbHNlO1xuXG4vLyBhZGQgdGhlIHRpbWVzdGFtcCBpbiB0aGUgY29ycmVjdCBmb3JtYXQgdG8gdGhlIGxvZyBpbmZvIG9iamVjdFxuY29uc3QgdGltZXN0YW1wRm9ybWF0ID0gZm9ybWF0LnRpbWVzdGFtcCh7XG4gIGZvcm1hdCgpIHtcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgaWYgKHVzZUxvY2FsVGltZVpvbmUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShkYXRlLnZhbHVlT2YoKSAtIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKTtcbiAgICB9XG4gICAgLy8gJzIwMTItMTEtMDRUMTQ6NTE6MDYuMTU3WicgLT4gJzIwMTItMTEtMDQgMTQ6NTE6MDY6MTU3J1xuICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvW1RaXS9nLCAnICcpLnJlcGxhY2UoL1xcLi9nLCAnOicpLnRyaW0oKTtcbiAgfSxcbn0pO1xuXG4vLyBzZXQgdGhlIGN1c3RvbSBjb2xvcnNcbmNvbnN0IGNvbG9yaXplRm9ybWF0ID0gZm9ybWF0LmNvbG9yaXplKHtcbiAgY29sb3JzLFxufSk7XG5cbi8vIFN0cmlwIHRoZSBjb2xvciBtYXJraW5nIHdpdGhpbiBtZXNzYWdlc1xuY29uc3Qgc3RyaXBDb2xvckZvcm1hdCA9IGZvcm1hdChmdW5jdGlvbiBzdHJpcENvbG9yKGluZm8pIHtcbiAgY29uc3QgY29kZSA9IC9cXHUwMDFiXFxbKFxcZCsoO1xcZCspKik/bS9nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgaW5mby5tZXNzYWdlID0gaW5mby5tZXNzYWdlLnJlcGxhY2UoY29kZSwgJycpO1xuICByZXR1cm4gaW5mbztcbn0pKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNvbnNvbGVUcmFuc3BvcnQoYXJncywgbG9nTHZsKSB7XG4gIHJldHVybiBuZXcgdHJhbnNwb3J0cy5Db25zb2xlKHtcbiAgICAvLyBgbmFtZWAgaXMgdW5zdXBwb3J0ZWQgcGVyIHdpbnN0b24ncyB0eXBlIGRlY2xhcmF0aW9uc1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICBuYW1lOiAnY29uc29sZScsXG4gICAgaGFuZGxlRXhjZXB0aW9uczogdHJ1ZSxcbiAgICBleGl0T25FcnJvcjogZmFsc2UsXG4gICAganNvbjogZmFsc2UsXG4gICAgbGV2ZWw6IGxvZ0x2bCxcbiAgICBzdGRlcnJMZXZlbHM6IFsnZXJyb3InXSxcbiAgICBmb3JtYXQ6IGZvcm1hdC5jb21iaW5lKFxuICAgICAgZm9ybWF0KGZ1bmN0aW9uIGFkanVzdERlYnVnKGluZm8pIHtcbiAgICAgICAgLy8gcHJlcGVuZCBkZWJ1ZyBtYXJrZXIsIGFuZCBzaGlmdCB0byBgaW5mb2AgbG9nIGxldmVsXG4gICAgICAgIGlmIChpbmZvLmxldmVsID09PSAnZGVidWcnKSB7XG4gICAgICAgICAgaW5mby5sZXZlbCA9ICdpbmZvJztcbiAgICAgICAgICBpbmZvLm1lc3NhZ2UgPSBgW2RlYnVnXSAke2luZm8ubWVzc2FnZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgfSkoKSxcbiAgICAgIHRpbWVzdGFtcEZvcm1hdCxcbiAgICAgIGFyZ3MubG9nTm9Db2xvcnMgPyBzdHJpcENvbG9yRm9ybWF0IDogY29sb3JpemVGb3JtYXQsXG4gICAgICBmb3JtYXQucHJpbnRmKGZ1bmN0aW9uIHByaW50SW5mbyhpbmZvKSB7XG4gICAgICAgIHJldHVybiBgJHthcmdzLmxvZ1RpbWVzdGFtcCA/IGAke2luZm8udGltZXN0YW1wfSAtIGAgOiAnJ30ke2luZm8ubWVzc2FnZX1gO1xuICAgICAgfSlcbiAgICApLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRmlsZVRyYW5zcG9ydChhcmdzLCBsb2dMdmwpIHtcbiAgcmV0dXJuIG5ldyB0cmFuc3BvcnRzLkZpbGUoe1xuICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICBuYW1lOiAnZmlsZScsXG4gICAgZmlsZW5hbWU6IGFyZ3MubG9nRmlsZSxcbiAgICBtYXhGaWxlczogMSxcbiAgICBoYW5kbGVFeGNlcHRpb25zOiB0cnVlLFxuICAgIGV4aXRPbkVycm9yOiBmYWxzZSxcbiAgICBqc29uOiBmYWxzZSxcbiAgICBsZXZlbDogbG9nTHZsLFxuICAgIGZvcm1hdDogZm9ybWF0LmNvbWJpbmUoXG4gICAgICBzdHJpcENvbG9yRm9ybWF0LFxuICAgICAgdGltZXN0YW1wRm9ybWF0LFxuICAgICAgZm9ybWF0LnByaW50ZihmdW5jdGlvbiBwcmludEluZm8oaW5mbykge1xuICAgICAgICByZXR1cm4gYCR7aW5mby50aW1lc3RhbXB9ICR7aW5mby5tZXNzYWdlfWA7XG4gICAgICB9KVxuICAgICksXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVIdHRwVHJhbnNwb3J0KGFyZ3MsIGxvZ0x2bCkge1xuICBsZXQgaG9zdCA9ICcxMjcuMC4wLjEnO1xuICBsZXQgcG9ydCA9IDkwMDM7XG5cbiAgaWYgKGFyZ3Mud2ViaG9vay5tYXRjaCgnOicpKSB7XG4gICAgY29uc3QgaG9zdEFuZFBvcnQgPSBhcmdzLndlYmhvb2suc3BsaXQoJzonKTtcbiAgICBob3N0ID0gaG9zdEFuZFBvcnRbMF07XG4gICAgcG9ydCA9IHBhcnNlSW50KGhvc3RBbmRQb3J0WzFdLCAxMCk7XG4gIH1cblxuICByZXR1cm4gbmV3IHRyYW5zcG9ydHMuSHR0cCh7XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIG5hbWU6ICdodHRwJyxcbiAgICBob3N0LFxuICAgIHBvcnQsXG4gICAgcGF0aDogJy8nLFxuICAgIGhhbmRsZUV4Y2VwdGlvbnM6IHRydWUsXG4gICAgZXhpdE9uRXJyb3I6IGZhbHNlLFxuICAgIGpzb246IGZhbHNlLFxuICAgIGxldmVsOiBsb2dMdmwsXG4gICAgZm9ybWF0OiBmb3JtYXQuY29tYmluZShcbiAgICAgIHN0cmlwQ29sb3JGb3JtYXQsXG4gICAgICBmb3JtYXQucHJpbnRmKGZ1bmN0aW9uIHByaW50SW5mbyhpbmZvKSB7XG4gICAgICAgIHJldHVybiBgJHtpbmZvLnRpbWVzdGFtcH0gJHtpbmZvLm1lc3NhZ2V9YDtcbiAgICAgIH0pXG4gICAgKSxcbiAgfSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVRyYW5zcG9ydHMoYXJncykge1xuICBsZXQgdHJhbnNwb3J0cyA9IFtdO1xuICBsZXQgY29uc29sZUxvZ0xldmVsID0gbnVsbDtcbiAgbGV0IGZpbGVMb2dMZXZlbCA9IG51bGw7XG5cbiAgaWYgKGFyZ3MubG9nbGV2ZWwgJiYgYXJncy5sb2dsZXZlbC5tYXRjaCgnOicpKSB7XG4gICAgLy8gLS1sb2ctbGV2ZWwgYXJnIGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgZGlmZiBsb2dnaW5nIGxldmVscyBmb3IgY29uc29sZSBhbmQgZmlsZSwgc2VwYXJhdGVkIGJ5IGEgY29sb25cbiAgICBjb25zdCBsdmxQYWlyID0gYXJncy5sb2dsZXZlbC5zcGxpdCgnOicpO1xuICAgIGNvbnNvbGVMb2dMZXZlbCA9IGx2bFBhaXJbMF0gfHwgY29uc29sZUxvZ0xldmVsO1xuICAgIGZpbGVMb2dMZXZlbCA9IGx2bFBhaXJbMV0gfHwgZmlsZUxvZ0xldmVsO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGVMb2dMZXZlbCA9IGZpbGVMb2dMZXZlbCA9IGFyZ3MubG9nbGV2ZWw7XG4gIH1cblxuICB0cmFuc3BvcnRzLnB1c2goY3JlYXRlQ29uc29sZVRyYW5zcG9ydChhcmdzLCBjb25zb2xlTG9nTGV2ZWwpKTtcblxuICBpZiAoYXJncy5sb2dGaWxlKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGlmIHdlIGRvbid0IGRlbGV0ZSB0aGUgbG9nIGZpbGUsIHdpbnN0b24gd2lsbCBhbHdheXMgYXBwZW5kIGFuZCBpdCB3aWxsIGdyb3cgaW5maW5pdGVseSBsYXJnZTtcbiAgICAgIC8vIHdpbnN0b24gYWxsb3dzIGZvciBsaW1pdGluZyBsb2cgZmlsZSBzaXplLCBidXQgYXMgb2YgOS4yLjE0IHRoZXJlJ3MgYSBzZXJpb3VzIGJ1ZyB3aGVuIHVzaW5nXG4gICAgICAvLyBtYXhGaWxlcyBhbmQgbWF4U2l6ZSB0b2dldGhlci4gaHR0cHM6Ly9naXRodWIuY29tL2ZsYXRpcm9uL3dpbnN0b24vaXNzdWVzLzM5N1xuICAgICAgaWYgKGF3YWl0IGZzLmV4aXN0cyhhcmdzLmxvZ0ZpbGUpKSB7XG4gICAgICAgIGF3YWl0IGZzLnVubGluayhhcmdzLmxvZ0ZpbGUpO1xuICAgICAgfVxuXG4gICAgICB0cmFuc3BvcnRzLnB1c2goY3JlYXRlRmlsZVRyYW5zcG9ydChhcmdzLCBmaWxlTG9nTGV2ZWwpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS5sb2coXG4gICAgICAgIGBUcmllZCB0byBhdHRhY2ggbG9nZ2luZyB0byBmaWxlICcke2FyZ3MubG9nRmlsZX0nIGJ1dCBhbiBlcnJvciBgICsgYG9jY3VycmVkOiAke2UubWVzc2FnZX1gXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIGlmIChhcmdzLndlYmhvb2spIHtcbiAgICB0cnkge1xuICAgICAgdHJhbnNwb3J0cy5wdXNoKGNyZWF0ZUh0dHBUcmFuc3BvcnQoYXJncywgZmlsZUxvZ0xldmVsKSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgVHJpZWQgdG8gYXR0YWNoIGxvZ2dpbmcgdG8gSHR0cCBhdCAke2FyZ3Mud2ViaG9va30gYnV0IGAgK1xuICAgICAgICAgIGBhbiBlcnJvciBvY2N1cnJlZDogJHtlLm1lc3NhZ2V9YFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJhbnNwb3J0cztcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdChhcmdzKSB7XG4gIG5wbWxvZy5sZXZlbCA9ICdzaWxlbnQnO1xuICAvLyBzZXQgZGUgZmFjdG8gcGFyYW0gcGFzc2VkIHRvIHRpbWVzdGFtcCBmdW5jdGlvblxuICB1c2VMb2NhbFRpbWVab25lID0gYXJncy5sb2NhbFRpbWV6b25lO1xuXG4gIC8vIGNsZWFuIHVwIGluIGNhc2Ugd2UgaGF2ZSBpbml0aWF0ZWQgYmVmb3JlIHNpbmNlIG5wbWxvZyBpcyBhIGdsb2JhbCBvYmplY3RcbiAgY2xlYXIoKTtcblxuICBsb2cgPSBjcmVhdGVMb2dnZXIoe1xuICAgIHRyYW5zcG9ydHM6IGF3YWl0IGNyZWF0ZVRyYW5zcG9ydHMoYXJncyksXG4gICAgbGV2ZWxzLFxuICB9KTtcblxuICAvLyBDYXB0dXJlIGxvZ3MgZW1pdHRlZCB2aWEgbnBtbG9nIGFuZCBwYXNzIHRoZW0gdGhyb3VnaCB3aW5zdG9uXG4gIG5wbWxvZy5vbignbG9nJywgKGxvZ09iaikgPT4ge1xuICAgIGNvbnN0IHdpbnN0b25MZXZlbCA9IG5wbVRvV2luc3RvbkxldmVsc1tsb2dPYmoubGV2ZWxdIHx8ICdpbmZvJztcbiAgICBsZXQgbXNnID0gbG9nT2JqLm1lc3NhZ2U7XG4gICAgaWYgKGxvZ09iai5wcmVmaXgpIHtcbiAgICAgIGNvbnN0IHByZWZpeCA9IGBbJHtsb2dPYmoucHJlZml4fV1gO1xuICAgICAgbXNnID0gYCR7YXJncy5sb2dOb0NvbG9ycyA/IHByZWZpeCA6IHByZWZpeC5tYWdlbnRhfSAke21zZ31gO1xuICAgIH1cbiAgICBsb2dbd2luc3RvbkxldmVsXShtc2cpO1xuICAgIGlmIChhcmdzLmxvZ0hhbmRsZXIgJiYgXy5pc0Z1bmN0aW9uKGFyZ3MubG9nSGFuZGxlcikpIHtcbiAgICAgIGFyZ3MubG9nSGFuZGxlcihsb2dPYmoubGV2ZWwsIG1zZyk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIGlmIChsb2cpIHtcbiAgICBmb3IgKGxldCB0cmFuc3BvcnQgb2YgXy5rZXlzKGxvZy50cmFuc3BvcnRzKSkge1xuICAgICAgbG9nLnJlbW92ZSh0cmFuc3BvcnQpO1xuICAgIH1cbiAgfVxuICBucG1sb2cucmVtb3ZlQWxsTGlzdGVuZXJzKCdsb2cnKTtcbn1cblxuZXhwb3J0IHtpbml0LCBjbGVhcn07XG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBR0FBLGVBQUEsQ0FBT0MsV0FBUCxDQUFtQkMsZUFBbkI7O0FBQ0FDLE1BQU0sQ0FBQ0MsY0FBUCxHQUF3QkYsZUFBeEI7QUFHQUEsZUFBQSxDQUFPRyxLQUFQLEdBQWUsTUFBZjtBQUNBLE1BQU1DLE1BQU0sR0FBRztFQUNiQyxLQUFLLEVBQUUsQ0FETTtFQUViQyxJQUFJLEVBQUUsQ0FGTztFQUdiQyxJQUFJLEVBQUUsQ0FITztFQUliQyxLQUFLLEVBQUU7QUFKTSxDQUFmO0FBT0EsTUFBTUMsTUFBTSxHQUFHO0VBQ2JILElBQUksRUFBRSxNQURPO0VBRWJELEtBQUssRUFBRSxNQUZNO0VBR2JFLElBQUksRUFBRSxRQUhPO0VBSWJDLEtBQUssRUFBRTtBQUpNLENBQWY7QUFPQSxNQUFNRSxrQkFBa0IsR0FBRztFQUN6QkMsS0FBSyxFQUFFLE9BRGtCO0VBRXpCQyxPQUFPLEVBQUUsT0FGZ0I7RUFHekJQLEtBQUssRUFBRSxPQUhrQjtFQUl6QkMsSUFBSSxFQUFFLE1BSm1CO0VBS3pCTyxJQUFJLEVBQUUsTUFMbUI7RUFNekJOLElBQUksRUFBRSxNQU5tQjtFQU96QkMsS0FBSyxFQUFFO0FBUGtCLENBQTNCO0FBVUEsSUFBSU0sR0FBRyxHQUFHLElBQVY7QUFDQSxJQUFJQyxnQkFBZ0IsR0FBRyxLQUF2Qjs7QUFHQSxNQUFNQyxlQUFlLEdBQUdDLGVBQUEsQ0FBT0MsU0FBUCxDQUFpQjtFQUN2Q0QsTUFBTSxHQUFHO0lBQ1AsSUFBSUUsSUFBSSxHQUFHLElBQUlDLElBQUosRUFBWDs7SUFDQSxJQUFJTCxnQkFBSixFQUFzQjtNQUNwQkksSUFBSSxHQUFHLElBQUlDLElBQUosQ0FBU0QsSUFBSSxDQUFDRSxP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