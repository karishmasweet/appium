"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toParserArgs = toParserArgs;

require("source-map-support/register");

var _argparse = require("argparse");

var _lodash = _interopRequireDefault(require("lodash"));

var _configFile = require("../config-file");

var _schema = require("./schema");

var _cliTransformers = require("./cli-transformers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TYPENAMES = Object.freeze({
  ARRAY: 'array',
  OBJECT: 'object',
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  NUMBER: 'number',
  NULL: 'null',
  STRING: 'string'
});
const SHORT_ARG_CUTOFF = 3;

function aliasToFlag(argSpec, alias) {
  const {
    extType,
    extName,
    name
  } = argSpec;
  const arg = alias ?? name;
  const isShort = arg.length < SHORT_ARG_CUTOFF;

  if (extType && extName) {
    return isShort ? `--${extType}-${_lodash.default.kebabCase(extName)}-${arg}` : `--${extType}-${_lodash.default.kebabCase(extName)}-${_lodash.default.kebabCase(arg)}`;
  }

  return isShort ? `-${arg}` : `--${_lodash.default.kebabCase(arg)}`;
}

const screamingSnakeCase = _lodash.default.flow(_lodash.default.snakeCase, _lodash.default.toUpper);

function getSchemaValidator({
  ref: schemaId
}, coerce = _lodash.default.identity) {
  return value => {
    const coerced = coerce(value);
    const errors = (0, _schema.validate)(coerced, schemaId);

    if (_lodash.default.isEmpty(errors)) {
      return coerced;
    }

    throw new _argparse.ArgumentTypeError('\n\n' + (0, _configFile.formatErrors)(errors, value, {
      schemaId
    }));
  };
}

function makeDescription(schema) {
  const {
    appiumCliDescription,
    description = '',
    appiumDeprecated
  } = schema;
  let desc = appiumCliDescription ?? description;

  if (appiumDeprecated) {
    desc = `[DEPRECATED] ${desc}`;
  }

  return desc;
}

function subSchemaToArgDef(subSchema, argSpec) {
  let {
    type,
    appiumCliAliases,
    appiumCliTransformer,
    enum: enumValues
  } = subSchema;
  const {
    name,
    arg
  } = argSpec;
  const aliases = [aliasToFlag(argSpec), ...(appiumCliAliases ?? []).map(alias => aliasToFlag(argSpec, alias))];
  let argOpts = {
    required: false,
    help: makeDescription(subSchema)
  };
  let argTypeFunction;

  switch (type) {
    case TYPENAMES.BOOLEAN:
      {
        argOpts.action = 'store_const';
        argOpts.const = true;
        break;
      }

    case TYPENAMES.OBJECT:
      {
        argTypeFunction = _cliTransformers.transformers.json;
        break;
      }

    case TYPENAMES.ARRAY:
      {
        argTypeFunction = _cliTransformers.transformers.csv;
        break;
      }

    case TYPENAMES.NUMBER:
      {
        argTypeFunction = getSchemaValidator(argSpec, parseFloat);
        break;
      }

    case TYPENAMES.INTEGER:
      {
        argTypeFunction = getSchemaValidator(argSpec, _lodash.default.parseInt);
        break;
      }

    case TYPENAMES.STRING:
      {
        argTypeFunction = getSchemaValidator(argSpec);
        break;
      }

    case TYPENAMES.NULL:
    default:
      {
        throw new TypeError(`Schema property "${arg}": \`${type}\` type unknown or disallowed`);
      }
  }

  if (type !== TYPENAMES.BOOLEAN) {
    argOpts.metavar = screamingSnakeCase(name);
  }

  if (type !== TYPENAMES.ARRAY && type !== TYPENAMES.OBJECT && appiumCliTransformer) {
    argTypeFunction = _lodash.default.flow(argTypeFunction ?? _lodash.default.identity, _cliTransformers.transformers[appiumCliTransformer]);
  }

  if (argTypeFunction) {
    argOpts.type = argTypeFunction;
  }

  if (enumValues && !_lodash.default.isEmpty(enumValues)) {
    if (type === TYPENAMES.STRING) {
      argOpts.choices = enumValues.map(String);
    } else {
      throw new TypeError(`Problem with schema for ${arg}; \`enum\` is only supported for \`type: 'string'\``);
    }
  }

  return [aliases, argOpts];
}

function toParserArgs() {
  const flattened = (0, _schema.flattenSchema)().filter(({
    schema
  }) => !schema.appiumCliIgnored);
  return new Map(_lodash.default.map(flattened, ({
    schema,
    argSpec
  }) => subSchemaToArgDef(schema, argSpec)));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUWVBFTkFNRVMiLCJPYmplY3QiLCJmcmVlemUiLCJBUlJBWSIsIk9CSkVDVCIsIkJPT0xFQU4iLCJJTlRFR0VSIiwiTlVNQkVSIiwiTlVMTCIsIlNUUklORyIsIlNIT1JUX0FSR19DVVRPRkYiLCJhbGlhc1RvRmxhZyIsImFyZ1NwZWMiLCJhbGlhcyIsImV4dFR5cGUiLCJleHROYW1lIiwibmFtZSIsImFyZyIsImlzU2hvcnQiLCJsZW5ndGgiLCJfIiwia2ViYWJDYXNlIiwic2NyZWFtaW5nU25ha2VDYXNlIiwiZmxvdyIsInNuYWtlQ2FzZSIsInRvVXBwZXIiLCJnZXRTY2hlbWFWYWxpZGF0b3IiLCJyZWYiLCJzY2hlbWFJZCIsImNvZXJjZSIsImlkZW50aXR5IiwidmFsdWUiLCJjb2VyY2VkIiwiZXJyb3JzIiwidmFsaWRhdGUiLCJpc0VtcHR5IiwiQXJndW1lbnRUeXBlRXJyb3IiLCJmb3JtYXRFcnJvcnMiLCJtYWtlRGVzY3JpcHRpb24iLCJzY2hlbWEiLCJhcHBpdW1DbGlEZXNjcmlwdGlvbiIsImRlc2NyaXB0aW9uIiwiYXBwaXVtRGVwcmVjYXRlZCIsImRlc2MiLCJzdWJTY2hlbWFUb0FyZ0RlZiIsInN1YlNjaGVtYSIsInR5cGUiLCJhcHBpdW1DbGlBbGlhc2VzIiwiYXBwaXVtQ2xpVHJhbnNmb3JtZXIiLCJlbnVtIiwiZW51bVZhbHVlcyIsImFsaWFzZXMiLCJtYXAiLCJhcmdPcHRzIiwicmVxdWlyZWQiLCJoZWxwIiwiYXJnVHlwZUZ1bmN0aW9uIiwiYWN0aW9uIiwiY29uc3QiLCJ0cmFuc2Zvcm1lcnMiLCJqc29uIiwiY3N2IiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiVHlwZUVycm9yIiwibWV0YXZhciIsImNob2ljZXMiLCJTdHJpbmciLCJ0b1BhcnNlckFyZ3MiLCJmbGF0dGVuZWQiLCJmbGF0dGVuU2NoZW1hIiwiZmlsdGVyIiwiYXBwaXVtQ2xpSWdub3JlZCIsIk1hcCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9zY2hlbWEvY2xpLWFyZ3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBcmd1bWVudFR5cGVFcnJvcn0gZnJvbSAnYXJncGFyc2UnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7Zm9ybWF0RXJyb3JzIGFzIGZvcm1hdEVycm9yc30gZnJvbSAnLi4vY29uZmlnLWZpbGUnO1xuaW1wb3J0IHtmbGF0dGVuU2NoZW1hLCB2YWxpZGF0ZX0gZnJvbSAnLi9zY2hlbWEnO1xuaW1wb3J0IHt0cmFuc2Zvcm1lcnN9IGZyb20gJy4vY2xpLXRyYW5zZm9ybWVycyc7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgY29uY2VybnMgZnVuY3Rpb25zIHdoaWNoIGNvbnZlcnQgc2NoZW1hIGRlZmluaXRpb25zIHRvXG4gKiBgYXJncGFyc2VgLWNvbXBhdGlibGUgZGF0YSBzdHJ1Y3R1cmVzLCBmb3IgZGVyaXZpbmcgQ0xJIGFyZ3VtZW50cyBmcm9tIGFcbiAqIHNjaGVtYS5cbiAqL1xuXG4vKipcbiAqIExvb2t1cCBvZiBwb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBgdHlwZWAgZmllbGQgaW4gYSBKU09OIHNjaGVtYS5cbiAqIEB0eXBlIHtSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBpbXBvcnQoJ2pzb24tc2NoZW1hJykuSlNPTlNjaGVtYTdUeXBlTmFtZT4+fVxuICovXG5jb25zdCBUWVBFTkFNRVMgPSBPYmplY3QuZnJlZXplKHtcbiAgQVJSQVk6ICdhcnJheScsXG4gIE9CSkVDVDogJ29iamVjdCcsXG4gIEJPT0xFQU46ICdib29sZWFuJyxcbiAgSU5URUdFUjogJ2ludGVnZXInLFxuICBOVU1CRVI6ICdudW1iZXInLFxuICBOVUxMOiAnbnVsbCcsXG4gIFNUUklORzogJ3N0cmluZycsXG59KTtcblxuLyoqXG4gKiBPcHRpb25zIHdpdGggYWxpYXMgbGVuZ3RocyBsZXNzIHRoYW4gdGhpcyB3aWxsIGJlIGNvbnNpZGVyZWQgXCJzaG9ydFwiIGZsYWdzLlxuICovXG5jb25zdCBTSE9SVF9BUkdfQ1VUT0ZGID0gMztcblxuLyoqXG4gKiBDb252ZXJ0IGFuIGFsaWFzIChgZm9vYCkgdG8gYSBmbGFnIChgLS1mb29gKSBvciBhIHNob3J0IGZsYWcgKGAtZmApLlxuICogQHBhcmFtIHtBcmdTcGVjfSBhcmdTcGVjIC0gdGhlIGFyZ3VtZW50IHNwZWNpZmljYXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbYWxpYXNdIC0gdGhlIGFsaWFzIHRvIGNvbnZlcnQgdG8gYSBmbGFnXG4gKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgZmxhZ1xuICovXG5mdW5jdGlvbiBhbGlhc1RvRmxhZyhhcmdTcGVjLCBhbGlhcykge1xuICBjb25zdCB7ZXh0VHlwZSwgZXh0TmFtZSwgbmFtZX0gPSBhcmdTcGVjO1xuICBjb25zdCBhcmcgPSBhbGlhcyA/PyBuYW1lO1xuICBjb25zdCBpc1Nob3J0ID0gYXJnLmxlbmd0aCA8IFNIT1JUX0FSR19DVVRPRkY7XG4gIGlmIChleHRUeXBlICYmIGV4dE5hbWUpIHtcbiAgICByZXR1cm4gaXNTaG9ydFxuICAgICAgPyBgLS0ke2V4dFR5cGV9LSR7Xy5rZWJhYkNhc2UoZXh0TmFtZSl9LSR7YXJnfWBcbiAgICAgIDogYC0tJHtleHRUeXBlfS0ke18ua2ViYWJDYXNlKGV4dE5hbWUpfS0ke18ua2ViYWJDYXNlKGFyZyl9YDtcbiAgfVxuICByZXR1cm4gaXNTaG9ydCA/IGAtJHthcmd9YCA6IGAtLSR7Xy5rZWJhYkNhc2UoYXJnKX1gO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgc3RyaW5nIHRvIFNDUkVBTUlOR19TTkFLRV9DQVNFXG4gKi9cbmNvbnN0IHNjcmVhbWluZ1NuYWtlQ2FzZSA9IF8uZmxvdyhfLnNuYWtlQ2FzZSwgXy50b1VwcGVyKTtcblxuLyoqXG4gKiBHaXZlbiB1bmlxdWUgcHJvcGVydHkgbmFtZSBgbmFtZWAsIHJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHZhbGlkYXRlcyBhIHZhbHVlXG4gKiBhZ2FpbnN0IGEgcHJvcGVydHkgd2l0aGluIHRoZSBzY2hlbWEuXG4gKiBAdGVtcGxhdGUgQ29lcmNlZFxuICogQHBhcmFtIHtBcmdTcGVjfSBhcmdTcGVjIC0gQXJndW1lbnQgbmFtZVxuICogQHBhcmFtIHsodmFsdWU6IHN0cmluZykgPT4gQ29lcmNlZH0gW2NvZXJjZV0gLSBGdW5jdGlvbiB0byBjb2VyY2UgdG8gYSBkaWZmZXJlbnRcbiAqIHByaW1pdGl2ZVxuICogQHRvZG8gU2VlIGlmIHdlIGNhbiByZW1vdmUgYGNvZXJjZWAgYnkgYWxsb3dpbmcgQWp2IHRvIGNvZXJjZSBpbiBpdHNcbiAqIGNvbnN0cnVjdG9yIG9wdGlvbnNcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGdldFNjaGVtYVZhbGlkYXRvcih7cmVmOiBzY2hlbWFJZH0sIGNvZXJjZSA9IF8uaWRlbnRpdHkpIHtcbiAgLyoqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAqL1xuICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgY29uc3QgY29lcmNlZCA9IGNvZXJjZSh2YWx1ZSk7XG4gICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGUoY29lcmNlZCwgc2NoZW1hSWQpO1xuICAgIGlmIChfLmlzRW1wdHkoZXJyb3JzKSkge1xuICAgICAgcmV0dXJuIGNvZXJjZWQ7XG4gICAgfVxuICAgIHRocm93IG5ldyBBcmd1bWVudFR5cGVFcnJvcignXFxuXFxuJyArIGZvcm1hdEVycm9ycyhlcnJvcnMsIHZhbHVlLCB7c2NoZW1hSWR9KSk7XG4gIH07XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIHRoZSBkZXNjcmlwdGlvbiBmb3IgZGlzcGxheSBvbiB0aGUgQ0xJLCBnaXZlbiB0aGUgc2NoZW1hLlxuICogQHBhcmFtIHtBcHBpdW1KU09OU2NoZW1hfSBzY2hlbWFcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIG1ha2VEZXNjcmlwdGlvbihzY2hlbWEpIHtcbiAgY29uc3Qge2FwcGl1bUNsaURlc2NyaXB0aW9uLCBkZXNjcmlwdGlvbiA9ICcnLCBhcHBpdW1EZXByZWNhdGVkfSA9IHNjaGVtYTtcbiAgbGV0IGRlc2MgPSBhcHBpdW1DbGlEZXNjcmlwdGlvbiA/PyBkZXNjcmlwdGlvbjtcbiAgaWYgKGFwcGl1bURlcHJlY2F0ZWQpIHtcbiAgICBkZXNjID0gYFtERVBSRUNBVEVEXSAke2Rlc2N9YDtcbiAgfVxuICByZXR1cm4gZGVzYztcbn1cblxuLyoqXG4gKiBHaXZlbiBhcmcgYG5hbWVgLCBhIEpTT04gc2NoZW1hIGBzdWJTY2hlbWFgLCBhbmQgb3B0aW9ucywgcmV0dXJuIGFuIGFyZ3VtZW50IGRlZmluaXRpb25cbiAqIGFzIHVuZGVyc3Rvb2QgYnkgYGFyZ3BhcnNlYC5cbiAqIEBwYXJhbSB7QXBwaXVtSlNPTlNjaGVtYX0gc3ViU2NoZW1hIC0gSlNPTiBzY2hlbWEgZm9yIHRoZSBvcHRpb25cbiAqIEBwYXJhbSB7QXJnU3BlY30gYXJnU3BlYyAtIEFyZ3VtZW50IHNwZWMgdHVwbGVcbiAqIEByZXR1cm5zIHtbc3RyaW5nW10sIGltcG9ydCgnYXJncGFyc2UnKS5Bcmd1bWVudE9wdGlvbnNdfSBUdXBsZSBvZiBmbGFnIGFuZCBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHN1YlNjaGVtYVRvQXJnRGVmKHN1YlNjaGVtYSwgYXJnU3BlYykge1xuICBsZXQge3R5cGUsIGFwcGl1bUNsaUFsaWFzZXMsIGFwcGl1bUNsaVRyYW5zZm9ybWVyLCBlbnVtOiBlbnVtVmFsdWVzfSA9IHN1YlNjaGVtYTtcblxuICBjb25zdCB7bmFtZSwgYXJnfSA9IGFyZ1NwZWM7XG5cbiAgY29uc3QgYWxpYXNlcyA9IFtcbiAgICBhbGlhc1RvRmxhZyhhcmdTcGVjKSxcbiAgICAuLi4vKiogQHR5cGUge3N0cmluZ1tdfSAqLyAoYXBwaXVtQ2xpQWxpYXNlcyA/PyBbXSkubWFwKChhbGlhcykgPT4gYWxpYXNUb0ZsYWcoYXJnU3BlYywgYWxpYXMpKSxcbiAgXTtcblxuICAvKiogQHR5cGUge2ltcG9ydCgnYXJncGFyc2UnKS5Bcmd1bWVudE9wdGlvbnN9ICovXG4gIGxldCBhcmdPcHRzID0ge1xuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBoZWxwOiBtYWtlRGVzY3JpcHRpb24oc3ViU2NoZW1hKSxcbiAgfTtcblxuICAvKipcbiAgICogR2VuZXJhbGx5IHdlIHdpbGwgcHJvdmlkZSBhIGB0eXBlYCB0byBgYXJncGFyc2VgIGFzIGEgZnVuY3Rpb24gd2hpY2hcbiAgICogdmFsaWRhdGVzIHVzaW5nIGFqdiAod2hpY2ggaXMgbXVjaCBtb3JlIGZ1bGwtZmVhdHVyZWQgdGhhbiB3aGF0IGBhcmdwYXJzZWBcbiAgICogY2FuIG9mZmVyKS4gVGhlIGV4Y2VwdGlvbiBpcyBgYm9vbGVhbmAtdHlwZSBvcHRpb25zLCB3aGljaCBoYXZlIG5vXG4gICAqIGBhcmdUeXBlYC5cbiAgICpcbiAgICogTm90IHN1cmUgaWYgdGhpcyB0eXBlIGlzIGNvcnJlY3QsIGJ1dCBpdCdzIG5vdCBkb2luZyB3aGF0IEkgd2FudC4gIEkgd2FudFxuICAgKiB0byBzYXkgXCJ0aGlzIGlzIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBzb21ldGhpbmcgb2YgdHlwZSBgVGAgd2hlcmUgYFRgIGlzXG4gICAqIG5ldmVyIGEgYFByb21pc2VgXCIuICBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgc3luYy5cbiAgICogQHR5cGUgeygodmFsdWU6IHN0cmluZykgPT4gdW5rbm93bil8dW5kZWZpbmVkfVxuICAgKi9cbiAgbGV0IGFyZ1R5cGVGdW5jdGlvbjtcblxuICAvLyBoYW5kbGUgc3BlY2lhbCBjYXNlcyBmb3IgdmFyaW91cyB0eXBlc1xuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAvLyBib29sZWFucyBkbyBub3QgaGF2ZSBhIHR5cGUgcGVyIGBBcmd1bWVudE9wdGlvbnNgLCBqdXN0IGFuIFwiYWN0aW9uXCJcbiAgICAvLyBOT1RFOiBkdWUgdG8gbGltaXRhdGlvbnMgb2YgYGFyZ3BhcnNlYCwgd2UgY2Fubm90IHByb3ZpZGUgZmFuY3kgaGVscCB0ZXh0LCBhbmQgbXVzdCByZWx5IG9uIGl0cyBpbnRlcm5hbCBlcnJvciBtZXNzYWdpbmcuXG4gICAgY2FzZSBUWVBFTkFNRVMuQk9PTEVBTjoge1xuICAgICAgYXJnT3B0cy5hY3Rpb24gPSAnc3RvcmVfY29uc3QnO1xuICAgICAgYXJnT3B0cy5jb25zdCA9IHRydWU7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlIFRZUEVOQU1FUy5PQkpFQ1Q6IHtcbiAgICAgIGFyZ1R5cGVGdW5jdGlvbiA9IHRyYW5zZm9ybWVycy5qc29uO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gYXJyYXlzIGFyZSB0cmVhdGVkIGFzIENTVnMsIGJlY2F1c2UgYGFyZ3BhcnNlYCBkb2Vzbid0IGhhbmRsZSBhcnJheSBkYXRhLlxuICAgIGNhc2UgVFlQRU5BTUVTLkFSUkFZOiB7XG4gICAgICBhcmdUeXBlRnVuY3Rpb24gPSB0cmFuc2Zvcm1lcnMuY3N2O1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gXCJudW1iZXJcIiB0eXBlIGlzIGNvZXJjZWQgdG8gZmxvYXQuIGBhcmdwYXJzZWAgZG9lcyB0aGlzIGZvciB1cyBpZiB3ZSB1c2UgYGZsb2F0YCB0eXBlLCBidXRcbiAgICAvLyB3ZSBkb24ndC5cbiAgICBjYXNlIFRZUEVOQU1FUy5OVU1CRVI6IHtcbiAgICAgIGFyZ1R5cGVGdW5jdGlvbiA9IGdldFNjaGVtYVZhbGlkYXRvcihhcmdTcGVjLCBwYXJzZUZsb2F0KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFwiaW50ZWdlclwiIGlzIGNvZXJjZWQgdG8gYW4gLi4gaW50ZWdlci4gIGFnYWluLCBgYXJncGFyc2VgIHdvdWxkIGRvIHRoaXMgZm9yIHVzIGlmIHdlIHVzZWQgYGludGAuXG4gICAgY2FzZSBUWVBFTkFNRVMuSU5URUdFUjoge1xuICAgICAgYXJnVHlwZUZ1bmN0aW9uID0gZ2V0U2NoZW1hVmFsaWRhdG9yKGFyZ1NwZWMsIF8ucGFyc2VJbnQpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gc3RyaW5ncyAobGlrZSBudW1iZXIgYW5kIGludGVnZXIpIGFyZSBzdWJqZWN0IHRvIGZ1cnRoZXIgdmFsaWRhdGlvblxuICAgIC8vIChlLmcuLCBtdXN0IHNhdGlzZnkgYSBtYXNrIG9yIHJlZ2V4IG9yIGV2ZW4gc29tZSBjdXN0b20gdmFsaWRhdGlvblxuICAgIC8vIGZ1bmN0aW9uKVxuICAgIGNhc2UgVFlQRU5BTUVTLlNUUklORzoge1xuICAgICAgYXJnVHlwZUZ1bmN0aW9uID0gZ2V0U2NoZW1hVmFsaWRhdG9yKGFyZ1NwZWMpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogdGhlcmUgbWF5IGJlIHNvbWUgd2F5IHRvIHJlc3RyaWN0IHRoaXMgYXQgdGhlIEFqdiBsZXZlbCAtLVxuICAgIC8vIHRoYXQgbWF5IGludm9sdmUgcGF0Y2hpbmcgdGhlIG1ldGFzY2hlbWEuXG4gICAgY2FzZSBUWVBFTkFNRVMuTlVMTDpcbiAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgZGVmYXVsdDoge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgU2NoZW1hIHByb3BlcnR5IFwiJHthcmd9XCI6IFxcYCR7dHlwZX1cXGAgdHlwZSB1bmtub3duIG9yIGRpc2FsbG93ZWRgKTtcbiAgICB9XG4gIH1cblxuICAvLyBtZXRhdmFyIGlzIHVzZWQgaW4gaGVscCB0ZXh0LiBgYm9vbGVhbmAgY2Fubm90IGhhdmUgYSBtZXRhdmFyLS1pdCBpcyBub3RcbiAgLy8gZGlzcGxheWVkLS1hbmQgYGFyZ3BhcnNlYCB0aHJvd3MgaWYgeW91IGdpdmUgaXQgb25lLlxuICBpZiAodHlwZSAhPT0gVFlQRU5BTUVTLkJPT0xFQU4pIHtcbiAgICBhcmdPcHRzLm1ldGF2YXIgPSBzY3JlYW1pbmdTbmFrZUNhc2UobmFtZSk7XG4gIH1cblxuICAvLyB0aGUgdmFsaWRpdHkgb2YgXCJhcHBpdW1DbGlUcmFuc2Zvcm1lclwiIHNob3VsZCBhbHJlYWR5IGhhdmUgYmVlbiBkZXRlcm1pbmVkXG4gIC8vIGJ5IGFqdiBkdXJpbmcgc2NoZW1hIHZhbGlkYXRpb24gaW4gYGZpbmFsaXplU2NoZW1hKClgLiB0aGUgYGFycmF5YCAmXG4gIC8vIGBvYmplY3RgIHR5cGVzIGhhdmUgYWxyZWFkeSBhZGRlZCBhIGZvcm1hdHRlciAoc2VlIGFib3ZlLCBzbyB3ZSBkb24ndCBkbyBpdFxuICAvLyB0d2ljZSkuXG4gIGlmICh0eXBlICE9PSBUWVBFTkFNRVMuQVJSQVkgJiYgdHlwZSAhPT0gVFlQRU5BTUVTLk9CSkVDVCAmJiBhcHBpdW1DbGlUcmFuc2Zvcm1lcikge1xuICAgIGFyZ1R5cGVGdW5jdGlvbiA9IF8uZmxvdyhhcmdUeXBlRnVuY3Rpb24gPz8gXy5pZGVudGl0eSwgdHJhbnNmb3JtZXJzW2FwcGl1bUNsaVRyYW5zZm9ybWVyXSk7XG4gIH1cblxuICBpZiAoYXJnVHlwZUZ1bmN0aW9uKSB7XG4gICAgYXJnT3B0cy50eXBlID0gYXJnVHlwZUZ1bmN0aW9uO1xuICB9XG5cbiAgLy8gY29udmVydCBKU09OIHNjaGVtYSBgZW51bWAgdG8gYGNob2ljZXNgLiBgZW51bWAgY2FuIGNvbnRhaW4gYW55IEpTT04gdHlwZSwgYnV0IGBhcmdwYXJzZWBcbiAgLy8gaXMgbGltaXRlZCB0byBhIHNpbmdsZSB0eXBlIHBlciBhcmcgKEkgdGhpbmspLiAgc28gbGV0J3MgbWFrZSBldmVyeXRoaW5nIGEgc3RyaW5nLlxuICAvLyBhbmQgbWlnaHQgYXMgd2VsbCBfcmVxdWlyZV8gdGhlIGB0eXBlOiBzdHJpbmdgIHdoaWxlIHdlJ3JlIGF0IGl0LlxuICBpZiAoZW51bVZhbHVlcyAmJiAhXy5pc0VtcHR5KGVudW1WYWx1ZXMpKSB7XG4gICAgaWYgKHR5cGUgPT09IFRZUEVOQU1FUy5TVFJJTkcpIHtcbiAgICAgIGFyZ09wdHMuY2hvaWNlcyA9IGVudW1WYWx1ZXMubWFwKFN0cmluZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgIGBQcm9ibGVtIHdpdGggc2NoZW1hIGZvciAke2FyZ307IFxcYGVudW1cXGAgaXMgb25seSBzdXBwb3J0ZWQgZm9yIFxcYHR5cGU6ICdzdHJpbmcnXFxgYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW2FsaWFzZXMsIGFyZ09wdHNdO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBmaW5hbGl6ZWQsIGZsYXR0ZW5lZCBzY2hlbWEgcmVwcmVzZW50YXRpb24gaW50b1xuICogQXJndW1lbnREZWZpbml0aW9ucyBmb3IgaGFuZG9mZiB0byBgYXJncGFyc2VgLlxuICpcbiAqIEB0aHJvd3MgSWYgc2NoZW1hIGhhcyBub3QgYmVlbiBhZGRlZCB0byBhanYgKHZpYSBgZmluYWxpemVTY2hlbWEoKWApXG4gKiBAcmV0dXJucyB7aW1wb3J0KCcuLi9jbGkvYXJncycpLkFyZ3VtZW50RGVmaW5pdGlvbnN9IEEgbWFwIG9mIGFycnlhcyBvZlxuICogYWxpYXNlcyB0byBgYXJncGFyc2VgIGFyZ3VtZW50czsgZW1wdHkgaWYgbm8gc2NoZW1hIGZvdW5kXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1BhcnNlckFyZ3MoKSB7XG4gIGNvbnN0IGZsYXR0ZW5lZCA9IGZsYXR0ZW5TY2hlbWEoKS5maWx0ZXIoKHtzY2hlbWF9KSA9PiAhc2NoZW1hLmFwcGl1bUNsaUlnbm9yZWQpO1xuICByZXR1cm4gbmV3IE1hcChfLm1hcChmbGF0dGVuZWQsICh7c2NoZW1hLCBhcmdTcGVjfSkgPT4gc3ViU2NoZW1hVG9BcmdEZWYoc2NoZW1hLCBhcmdTcGVjKSkpO1xufVxuXG4vKipcbiAqIEB0ZW1wbGF0ZSBUXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdhanYvZGlzdC90eXBlcycpLkZvcm1hdFZhbGlkYXRvcjxUPn0gRm9ybWF0VmFsaWRhdG9yPFQ+XG4gKi9cblxuLyoqXG4gKiBBIEpTT04gNyBzY2hlbWEgd2l0aCBvdXIgY3VzdG9tIGtleXdvcmRzLlxuICogQHR5cGVkZWYge2ltcG9ydCgnLi9rZXl3b3JkcycpLkFwcGl1bUpTT05TY2hlbWFLZXl3b3JkcyAmIGltcG9ydCgnanNvbi1zY2hlbWEnKS5KU09OU2NoZW1hN30gQXBwaXVtSlNPTlNjaGVtYVxuICovXG5cbi8qKlxu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