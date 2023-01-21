"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commandClasses = void 0;
exports.runExtensionCommand = runExtensionCommand;

require("source-map-support/register");

var _driverCommand = _interopRequireDefault(require("./driver-command"));

var _pluginCommand = _interopRequireDefault(require("./plugin-command"));

var _constants = require("../constants");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandClasses = Object.freeze({
  [_constants.DRIVER_TYPE]: _driverCommand.default,
  [_constants.PLUGIN_TYPE]: _pluginCommand.default
});
exports.commandClasses = commandClasses;

async function runExtensionCommand(args, config) {
  let jsonResult = null;
  const {
    extensionType: type
  } = config;
  const extCmd = args[`${type}Command`];

  if (!extCmd) {
    throw new TypeError(`Cannot call ${type} command without a subcommand like 'install'`);
  }

  let {
    json,
    suppressOutput
  } = args;
  json = Boolean(json);

  if (suppressOutput) {
    json = true;
  }

  const CommandClass = commandClasses[type];
  const cmd = new CommandClass({
    config,
    json
  });

  try {
    jsonResult = await cmd.execute(args);
  } catch (err) {
    if (suppressOutput) {
      throw err;
    }

    (0, _utils.errAndQuit)(json, err);
  }

  if (json && !suppressOutput) {
    console.log(JSON.stringify(jsonResult, null, _utils.JSON_SPACES));
  }

  return jsonResult;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb21tYW5kQ2xhc3NlcyIsIk9iamVjdCIsImZyZWV6ZSIsIkRSSVZFUl9UWVBFIiwiRHJpdmVyQ29tbWFuZCIsIlBMVUdJTl9UWVBFIiwiUGx1Z2luQ29tbWFuZCIsInJ1bkV4dGVuc2lvbkNvbW1hbmQiLCJhcmdzIiwiY29uZmlnIiwianNvblJlc3VsdCIsImV4dGVuc2lvblR5cGUiLCJ0eXBlIiwiZXh0Q21kIiwiVHlwZUVycm9yIiwianNvbiIsInN1cHByZXNzT3V0cHV0IiwiQm9vbGVhbiIsIkNvbW1hbmRDbGFzcyIsImNtZCIsImV4ZWN1dGUiLCJlcnIiLCJlcnJBbmRRdWl0IiwiY29uc29sZSIsImxvZyIsIkpTT04iLCJzdHJpbmdpZnkiLCJKU09OX1NQQUNFUyJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jbGkvZXh0ZW5zaW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCBEcml2ZXJDb21tYW5kIGZyb20gJy4vZHJpdmVyLWNvbW1hbmQnO1xuaW1wb3J0IFBsdWdpbkNvbW1hbmQgZnJvbSAnLi9wbHVnaW4tY29tbWFuZCc7XG5pbXBvcnQge0RSSVZFUl9UWVBFLCBQTFVHSU5fVFlQRX0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7ZXJyQW5kUXVpdCwgSlNPTl9TUEFDRVN9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgY29tbWFuZENsYXNzZXMgPSBPYmplY3QuZnJlZXplKFxuICAvKiogQHR5cGUge2NvbnN0fSAqLyAoe1xuICAgIFtEUklWRVJfVFlQRV06IERyaXZlckNvbW1hbmQsXG4gICAgW1BMVUdJTl9UWVBFXTogUGx1Z2luQ29tbWFuZCxcbiAgfSlcbik7XG5cbi8qKlxuICogUnVuIGEgc3ViY29tbWFuZCBvZiB0aGUgJ2FwcGl1bSBkcml2ZXInIHR5cGUuIEVhY2ggc3ViY29tbWFuZCBoYXMgaXRzIG93biBzZXQgb2YgYXJndW1lbnRzIHdoaWNoXG4gKiBjYW4gYmUgcmVwcmVzZW50ZWQgYXMgYSBKUyBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtpbXBvcnQoJ2FwcGl1bS90eXBlcycpLkFyZ3M8aW1wb3J0KCdhcHBpdW0vdHlwZXMnKS5XaXRoRXh0U3ViY29tbWFuZD59IGFyZ3MgLSBKUyBvYmplY3Qgd2hlcmUgdGhlIGtleSBpcyB0aGUgcGFyYW1ldGVyIG5hbWUgKGFzIGRlZmluZWQgaW5cbiAqIGRyaXZlci1wYXJzZXIuanMpXG4gKiBAdGVtcGxhdGUge0V4dGVuc2lvblR5cGV9IEV4dFR5cGVcbiAqIEBwYXJhbSB7aW1wb3J0KCcuLi9leHRlbnNpb24vZXh0ZW5zaW9uLWNvbmZpZycpLkV4dGVuc2lvbkNvbmZpZzxFeHRUeXBlPn0gY29uZmlnIC0gRXh0ZW5zaW9uIGNvbmZpZyBvYmplY3RcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcnVuRXh0ZW5zaW9uQ29tbWFuZChhcmdzLCBjb25maWcpIHtcbiAgLy8gVE9ETyBkcml2ZXIgY29uZmlnIGZpbGUgc2hvdWxkIGJlIGxvY2tlZCB3aGlsZSBhbnkgb2YgdGhlc2UgY29tbWFuZHMgYXJlXG4gIC8vIHJ1bm5pbmcgdG8gcHJldmVudCB3ZWlyZCBzaXR1YXRpb25zXG4gIGxldCBqc29uUmVzdWx0ID0gbnVsbDtcbiAgY29uc3Qge2V4dGVuc2lvblR5cGU6IHR5cGV9ID0gY29uZmlnO1xuICBjb25zdCBleHRDbWQgPSBhcmdzW2Ake3R5cGV9Q29tbWFuZGBdO1xuICBpZiAoIWV4dENtZCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYENhbm5vdCBjYWxsICR7dHlwZX0gY29tbWFuZCB3aXRob3V0IGEgc3ViY29tbWFuZCBsaWtlICdpbnN0YWxsJ2ApO1xuICB9XG4gIGxldCB7anNvbiwgc3VwcHJlc3NPdXRwdXR9ID0gYXJncztcbiAganNvbiA9IEJvb2xlYW4oanNvbik7XG4gIGlmIChzdXBwcmVzc091dHB1dCkge1xuICAgIGpzb24gPSB0cnVlO1xuICB9XG4gIGNvbnN0IENvbW1hbmRDbGFzcyA9IC8qKiBAdHlwZSB7RXh0Q29tbWFuZDxFeHRUeXBlPn0gKi8gKGNvbW1hbmRDbGFzc2VzW3R5cGVdKTtcbiAgY29uc3QgY21kID0gbmV3IENvbW1hbmRDbGFzcyh7Y29uZmlnLCBqc29ufSk7XG4gIHRyeSB7XG4gICAganNvblJlc3VsdCA9IGF3YWl0IGNtZC5leGVjdXRlKGFyZ3MpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBpbiB0aGUgc3VwcHJlc3Mgb3V0cHV0IGNhc2UsIHdlIGFyZSBjYWxsaW5nIHRoaXMgZnVuY3Rpb24gaW50ZXJuYWxseSBhbmQgc2hvdWxkXG4gICAgLy8ganVzdCB0aHJvdyBpbnN0ZWFkIG9mIHByaW50aW5nIGFuIGVycm9yIGFuZCBlbmRpbmcgdGhlIHByb2Nlc3NcbiAgICBpZiAoc3VwcHJlc3NPdXRwdXQpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgZXJyQW5kUXVpdChqc29uLCBlcnIpO1xuICB9XG5cbiAgaWYgKGpzb24gJiYgIXN1cHByZXNzT3V0cHV0KSB7XG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoanNvblJlc3VsdCwgbnVsbCwgSlNPTl9TUEFDRVMpKTtcbiAgfVxuXG4gIHJldHVybiBqc29uUmVzdWx0O1xufVxuXG5leHBvcnQge3J1bkV4dGVuc2lvbkNvbW1hbmR9O1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSB7RXh0ZW5zaW9uVHlwZX0gRXh0VHlwZVxuICogQHR5cGVkZWYge0V4dFR5cGUgZXh0ZW5kcyBEcml2ZXJUeXBlID8gQ2xhc3M8RHJpdmVyQ29tbWFuZD4gOiBFeHRUeXBlIGV4dGVuZHMgUGx1Z2luVHlwZSA/IENsYXNzPFBsdWdpbkNvbW1hbmQ+IDogbmV2ZXJ9IEV4dENvbW1hbmRcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ0BhcHBpdW0vdHlwZXMnKS5FeHRlbnNpb25UeXBlfSBFeHRlbnNpb25UeXBlXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdAYXBwaXVtL3R5cGVzJykuRHJpdmVyVHlwZX0gRHJpdmVyVHlwZVxuICogQHR5cGVkZWYge2ltcG9ydCgnQGFwcGl1bS90eXBlcycpLlBsdWdpblR5cGV9IFBsdWdpblR5cGVcbiAqL1xuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdAYXBwaXVtL3R5cGVzJykuQ2xhc3M8VD59IENsYXNzXG4gKi9cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sTUFBTUEsY0FBYyxHQUFHQyxNQUFNLENBQUNDLE1BQVAsQ0FDTjtFQUNwQixDQUFDQyxzQkFBRCxHQUFlQyxzQkFESztFQUVwQixDQUFDQyxzQkFBRCxHQUFlQztBQUZLLENBRE0sQ0FBdkI7OztBQWdCUCxlQUFlQyxtQkFBZixDQUFtQ0MsSUFBbkMsRUFBeUNDLE1BQXpDLEVBQWlEO0VBRy9DLElBQUlDLFVBQVUsR0FBRyxJQUFqQjtFQUNBLE1BQU07SUFBQ0MsYUFBYSxFQUFFQztFQUFoQixJQUF3QkgsTUFBOUI7RUFDQSxNQUFNSSxNQUFNLEdBQUdMLElBQUksQ0FBRSxHQUFFSSxJQUFLLFNBQVQsQ0FBbkI7O0VBQ0EsSUFBSSxDQUFDQyxNQUFMLEVBQWE7SUFDWCxNQUFNLElBQUlDLFNBQUosQ0FBZSxlQUFjRixJQUFLLDhDQUFsQyxDQUFOO0VBQ0Q7O0VBQ0QsSUFBSTtJQUFDRyxJQUFEO0lBQU9DO0VBQVAsSUFBeUJSLElBQTdCO0VBQ0FPLElBQUksR0FBR0UsT0FBTyxDQUFDRixJQUFELENBQWQ7O0VBQ0EsSUFBSUMsY0FBSixFQUFvQjtJQUNsQkQsSUFBSSxHQUFHLElBQVA7RUFDRDs7RUFDRCxNQUFNRyxZQUFZLEdBQXVDbEIsY0FBYyxDQUFDWSxJQUFELENBQXZFO0VBQ0EsTUFBTU8sR0FBRyxHQUFHLElBQUlELFlBQUosQ0FBaUI7SUFBQ1QsTUFBRDtJQUFTTTtFQUFULENBQWpCLENBQVo7O0VBQ0EsSUFBSTtJQUNGTCxVQUFVLEdBQUcsTUFBTVMsR0FBRyxDQUFDQyxPQUFKLENBQVlaLElBQVosQ0FBbkI7RUFDRCxDQUZELENBRUUsT0FBT2EsR0FBUCxFQUFZO0lBR1osSUFBSUwsY0FBSixFQUFvQjtNQUNsQixNQUFNSyxHQUFOO0lBQ0Q7O0lBQ0QsSUFBQUMsaUJBQUEsRUFBV1AsSUFBWCxFQUFpQk0sR0FBakI7RUFDRDs7RUFFRCxJQUFJTixJQUFJLElBQUksQ0FBQ0MsY0FBYixFQUE2QjtJQUMzQk8sT0FBTyxDQUFDQyxHQUFSLENBQVlDLElBQUksQ0FBQ0MsU0FBTCxDQUFlaEIsVUFBZixFQUEyQixJQUEzQixFQUFpQ2lCLGtCQUFqQyxDQUFaO0VBQ0Q7O0VBRUQsT0FBT2pCLFVBQVA7QUFDRCJ9