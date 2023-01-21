"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("source-map-support/register");

var _lodash = _interopRequireDefault(require("lodash"));

var _extensionCommand = _interopRequireDefault(require("./extension-command"));

var _constants = require("../constants");

require("@colors/colors");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REQ_DRIVER_FIELDS = ['driverName', 'automationName', 'platformNames', 'mainClass'];

class DriverCommand extends _extensionCommand.default {
  constructor({
    config,
    json
  }) {
    super({
      config,
      json
    });
    this.knownExtensions = _constants.KNOWN_DRIVERS;
  }

  async install({
    driver,
    installType,
    packageName
  }) {
    return await super._install({
      installSpec: driver,
      installType,
      packageName
    });
  }

  async uninstall({
    driver
  }) {
    return await super._uninstall({
      installSpec: driver
    });
  }

  async update({
    driver,
    unsafe
  }) {
    return await super._update({
      installSpec: driver,
      unsafe
    });
  }

  async run({
    driver,
    scriptName,
    extraArgs
  }) {
    return await super._run({
      installSpec: driver,
      scriptName,
      extraArgs
    });
  }

  getPostInstallText({
    extName,
    extData
  }) {
    return `Driver ${extName}@${extData.version} successfully installed\n`.green + `- automationName: ${extData.automationName.green}\n` + `- platformNames: ${JSON.stringify(extData.platformNames).green}`;
  }

  validateExtensionFields(driverMetadata, installSpec) {
    const missingFields = REQ_DRIVER_FIELDS.reduce((acc, field) => driverMetadata[field] ? acc : [...acc, field], []);

    if (!_lodash.default.isEmpty(missingFields)) {
      throw new Error(`Driver "${installSpec}" did not expose correct fields for compability ` + `with Appium. Missing fields: ${JSON.stringify(missingFields)}`);
    }
  }

}

exports.default = DriverCommand;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSRVFfRFJJVkVSX0ZJRUxEUyIsIkRyaXZlckNvbW1hbmQiLCJFeHRlbnNpb25Db21tYW5kIiwiY29uc3RydWN0b3IiLCJjb25maWciLCJqc29uIiwia25vd25FeHRlbnNpb25zIiwiS05PV05fRFJJVkVSUyIsImluc3RhbGwiLCJkcml2ZXIiLCJpbnN0YWxsVHlwZSIsInBhY2thZ2VOYW1lIiwiX2luc3RhbGwiLCJpbnN0YWxsU3BlYyIsInVuaW5zdGFsbCIsIl91bmluc3RhbGwiLCJ1cGRhdGUiLCJ1bnNhZmUiLCJfdXBkYXRlIiwicnVuIiwic2NyaXB0TmFtZSIsImV4dHJhQXJncyIsIl9ydW4iLCJnZXRQb3N0SW5zdGFsbFRleHQiLCJleHROYW1lIiwiZXh0RGF0YSIsInZlcnNpb24iLCJncmVlbiIsImF1dG9tYXRpb25OYW1lIiwiSlNPTiIsInN0cmluZ2lmeSIsInBsYXRmb3JtTmFtZXMiLCJ2YWxpZGF0ZUV4dGVuc2lvbkZpZWxkcyIsImRyaXZlck1ldGFkYXRhIiwibWlzc2luZ0ZpZWxkcyIsInJlZHVjZSIsImFjYyIsImZpZWxkIiwiXyIsImlzRW1wdHkiLCJFcnJvciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jbGkvZHJpdmVyLWNvbW1hbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBFeHRlbnNpb25Db21tYW5kIGZyb20gJy4vZXh0ZW5zaW9uLWNvbW1hbmQnO1xuaW1wb3J0IHtLTk9XTl9EUklWRVJTfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0ICdAY29sb3JzL2NvbG9ycyc7XG5cbmNvbnN0IFJFUV9EUklWRVJfRklFTERTID0gWydkcml2ZXJOYW1lJywgJ2F1dG9tYXRpb25OYW1lJywgJ3BsYXRmb3JtTmFtZXMnLCAnbWFpbkNsYXNzJ107XG5cbi8qKlxuICogQGV4dGVuZHMge0V4dGVuc2lvbkNvbW1hbmQ8RHJpdmVyVHlwZT59XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyaXZlckNvbW1hbmQgZXh0ZW5kcyBFeHRlbnNpb25Db21tYW5kIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7aW1wb3J0KCcuL2V4dGVuc2lvbi1jb21tYW5kJykuRXh0ZW5zaW9uQ29tbWFuZE9wdGlvbnM8RHJpdmVyVHlwZT59IG9wdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHtjb25maWcsIGpzb259KSB7XG4gICAgc3VwZXIoe2NvbmZpZywganNvbn0pO1xuICAgIHRoaXMua25vd25FeHRlbnNpb25zID0gS05PV05fRFJJVkVSUztcbiAgfVxuXG4gIGFzeW5jIGluc3RhbGwoe2RyaXZlciwgaW5zdGFsbFR5cGUsIHBhY2thZ2VOYW1lfSkge1xuICAgIHJldHVybiBhd2FpdCBzdXBlci5faW5zdGFsbCh7XG4gICAgICBpbnN0YWxsU3BlYzogZHJpdmVyLFxuICAgICAgaW5zdGFsbFR5cGUsXG4gICAgICBwYWNrYWdlTmFtZSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVuaW5zdGFsbCh7ZHJpdmVyfSkge1xuICAgIHJldHVybiBhd2FpdCBzdXBlci5fdW5pbnN0YWxsKHtpbnN0YWxsU3BlYzogZHJpdmVyfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGUoe2RyaXZlciwgdW5zYWZlfSkge1xuICAgIHJldHVybiBhd2FpdCBzdXBlci5fdXBkYXRlKHtpbnN0YWxsU3BlYzogZHJpdmVyLCB1bnNhZmV9KTtcbiAgfVxuXG4gIGFzeW5jIHJ1bih7ZHJpdmVyLCBzY3JpcHROYW1lLCBleHRyYUFyZ3N9KSB7XG4gICAgcmV0dXJuIGF3YWl0IHN1cGVyLl9ydW4oe2luc3RhbGxTcGVjOiBkcml2ZXIsIHNjcmlwdE5hbWUsIGV4dHJhQXJnc30pO1xuICB9XG5cbiAgZ2V0UG9zdEluc3RhbGxUZXh0KHtleHROYW1lLCBleHREYXRhfSkge1xuICAgIHJldHVybiAoXG4gICAgICBgRHJpdmVyICR7ZXh0TmFtZX1AJHtleHREYXRhLnZlcnNpb259IHN1Y2Nlc3NmdWxseSBpbnN0YWxsZWRcXG5gLmdyZWVuICtcbiAgICAgIGAtIGF1dG9tYXRpb25OYW1lOiAke2V4dERhdGEuYXV0b21hdGlvbk5hbWUuZ3JlZW59XFxuYCArXG4gICAgICBgLSBwbGF0Zm9ybU5hbWVzOiAke0pTT04uc3RyaW5naWZ5KGV4dERhdGEucGxhdGZvcm1OYW1lcykuZ3JlZW59YFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIGZpZWxkcyBpbiBgYXBwaXVtYCBmaWVsZCBvZiBgZHJpdmVyTWV0YWRhdGFgXG4gICAqXG4gICAqIEZvciBhbnkgYHBhY2thZ2UuanNvbmAgZmllbGRzIHdoaWNoIGEgZHJpdmVyIHJlcXVpcmVzLCB2YWxpZGF0ZSB0aGUgdHlwZSBvZlxuICAgKiB0aG9zZSBmaWVsZHMgb24gdGhlIGBwYWNrYWdlLmpzb25gIGRhdGEsIHRocm93aW5nIGFuIGVycm9yIGlmIGFueXRoaW5nIGlzXG4gICAqIGFtaXNzLlxuICAgKiBAcGFyYW0ge2ltcG9ydCgnYXBwaXVtL3R5cGVzJykuRXh0TWV0YWRhdGE8RHJpdmVyVHlwZT59IGRyaXZlck1ldGFkYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnN0YWxsU3BlY1xuICAgKi9cbiAgdmFsaWRhdGVFeHRlbnNpb25GaWVsZHMoZHJpdmVyTWV0YWRhdGEsIGluc3RhbGxTcGVjKSB7XG4gICAgY29uc3QgbWlzc2luZ0ZpZWxkcyA9IFJFUV9EUklWRVJfRklFTERTLnJlZHVjZShcbiAgICAgIChhY2MsIGZpZWxkKSA9PiAoZHJpdmVyTWV0YWRhdGFbZmllbGRdID8gYWNjIDogWy4uLmFjYywgZmllbGRdKSxcbiAgICAgIFtdXG4gICAgKTtcblxuICAgIGlmICghXy5pc0VtcHR5KG1pc3NpbmdGaWVsZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBEcml2ZXIgXCIke2luc3RhbGxTcGVjfVwiIGRpZCBub3QgZXhwb3NlIGNvcnJlY3QgZmllbGRzIGZvciBjb21wYWJpbGl0eSBgICtcbiAgICAgICAgICBgd2l0aCBBcHBpdW0uIE1pc3NpbmcgZmllbGRzOiAke0pTT04uc3RyaW5naWZ5KG1pc3NpbmdGaWVsZHMpfWBcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQHR5cGVkZWYgRHJpdmVyQ29tbWFuZE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7aW1wb3J0KCcuLi9leHRlbnNpb24vZXh0ZW5zaW9uLWNvbmZpZycpLkV4dGVuc2lvbkNvbmZpZzxEcml2ZXJUeXBlPn0gY29uZmlnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGpzb25cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ0BhcHBpdW0vdHlwZXMnKS5Ecml2ZXJUeXBlfSBEcml2ZXJUeXBlXG4gKi9cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsR0FBRyxDQUFDLFlBQUQsRUFBZSxnQkFBZixFQUFpQyxlQUFqQyxFQUFrRCxXQUFsRCxDQUExQjs7QUFLZSxNQUFNQyxhQUFOLFNBQTRCQyx5QkFBNUIsQ0FBNkM7RUFJMURDLFdBQVcsQ0FBQztJQUFDQyxNQUFEO0lBQVNDO0VBQVQsQ0FBRCxFQUFpQjtJQUMxQixNQUFNO01BQUNELE1BQUQ7TUFBU0M7SUFBVCxDQUFOO0lBQ0EsS0FBS0MsZUFBTCxHQUF1QkMsd0JBQXZCO0VBQ0Q7O0VBRVksTUFBUEMsT0FBTyxDQUFDO0lBQUNDLE1BQUQ7SUFBU0MsV0FBVDtJQUFzQkM7RUFBdEIsQ0FBRCxFQUFxQztJQUNoRCxPQUFPLE1BQU0sTUFBTUMsUUFBTixDQUFlO01BQzFCQyxXQUFXLEVBQUVKLE1BRGE7TUFFMUJDLFdBRjBCO01BRzFCQztJQUgwQixDQUFmLENBQWI7RUFLRDs7RUFFYyxNQUFURyxTQUFTLENBQUM7SUFBQ0w7RUFBRCxDQUFELEVBQVc7SUFDeEIsT0FBTyxNQUFNLE1BQU1NLFVBQU4sQ0FBaUI7TUFBQ0YsV0FBVyxFQUFFSjtJQUFkLENBQWpCLENBQWI7RUFDRDs7RUFFVyxNQUFOTyxNQUFNLENBQUM7SUFBQ1AsTUFBRDtJQUFTUTtFQUFULENBQUQsRUFBbUI7SUFDN0IsT0FBTyxNQUFNLE1BQU1DLE9BQU4sQ0FBYztNQUFDTCxXQUFXLEVBQUVKLE1BQWQ7TUFBc0JRO0lBQXRCLENBQWQsQ0FBYjtFQUNEOztFQUVRLE1BQUhFLEdBQUcsQ0FBQztJQUFDVixNQUFEO0lBQVNXLFVBQVQ7SUFBcUJDO0VBQXJCLENBQUQsRUFBa0M7SUFDekMsT0FBTyxNQUFNLE1BQU1DLElBQU4sQ0FBVztNQUFDVCxXQUFXLEVBQUVKLE1BQWQ7TUFBc0JXLFVBQXRCO01BQWtDQztJQUFsQyxDQUFYLENBQWI7RUFDRDs7RUFFREUsa0JBQWtCLENBQUM7SUFBQ0MsT0FBRDtJQUFVQztFQUFWLENBQUQsRUFBcUI7SUFDckMsT0FDRyxVQUFTRCxPQUFRLElBQUdDLE9BQU8sQ0FBQ0MsT0FBUSwyQkFBckMsQ0FBZ0VDLEtBQWhFLEdBQ0MscUJBQW9CRixPQUFPLENBQUNHLGNBQVIsQ0FBdUJELEtBQU0sSUFEbEQsR0FFQyxvQkFBbUJFLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxPQUFPLENBQUNNLGFBQXZCLEVBQXNDSixLQUFNLEVBSGxFO0VBS0Q7O0VBV0RLLHVCQUF1QixDQUFDQyxjQUFELEVBQWlCcEIsV0FBakIsRUFBOEI7SUFDbkQsTUFBTXFCLGFBQWEsR0FBR2xDLGlCQUFpQixDQUFDbUMsTUFBbEIsQ0FDcEIsQ0FBQ0MsR0FBRCxFQUFNQyxLQUFOLEtBQWlCSixjQUFjLENBQUNJLEtBQUQsQ0FBZCxHQUF3QkQsR0FBeEIsR0FBOEIsQ0FBQyxHQUFHQSxHQUFKLEVBQVNDLEtBQVQsQ0FEM0IsRUFFcEIsRUFGb0IsQ0FBdEI7O0lBS0EsSUFBSSxDQUFDQyxlQUFBLENBQUVDLE9BQUYsQ0FBVUwsYUFBVixDQUFMLEVBQStCO01BQzdCLE1BQU0sSUFBSU0sS0FBSixDQUNILFdBQVUzQixXQUFZLGtEQUF2QixHQUNHLGdDQUErQmdCLElBQUksQ0FBQ0MsU0FBTCxDQUFlSSxhQUFmLENBQThCLEVBRjVELENBQU47SUFJRDtFQUNGOztBQTFEeUQifQ==