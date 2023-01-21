"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatErrors = formatErrors;
exports.normalizeConfig = normalizeConfig;
exports.readConfigFile = readConfigFile;

require("source-map-support/register");

var _betterAjvErrors = _interopRequireDefault(require("@sidvind/better-ajv-errors"));

var _lilconfig = require("lilconfig");

var _lodash = _interopRequireDefault(require("lodash"));

var _yaml = _interopRequireDefault(require("yaml"));

var _schema = require("./schema/schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function yamlLoader(filepath, content) {
  return _yaml.default.parse(content);
}

const rawConfig = new Map();

function jsonLoader(filepath, content) {
  rawConfig.set(filepath, content);
  return JSON.parse(content);
}

async function loadConfigFile(lc, filepath) {
  try {
    return await lc.load(filepath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      err.message = `Config file not found at user-provided path: ${filepath}`;
      throw err;
    } else if (err instanceof SyntaxError) {
      err.message = `Config file at user-provided path ${filepath} is invalid:\n${err.message}`;
      throw err;
    }

    throw err;
  }
}

async function searchConfigFile(lc) {
  return await lc.search();
}

function formatErrors(errors = [], config = {}, opts = {}) {
  if (errors && !errors.length) {
    throw new TypeError('Array of errors must be non-empty');
  }

  return (0, _betterAjvErrors.default)((0, _schema.getSchema)(opts.schemaId), config, errors, {
    json: opts.json,
    format: 'cli'
  });
}

async function readConfigFile(filepath, opts = {}) {
  const lc = (0, _lilconfig.lilconfig)('appium', {
    loaders: {
      '.yaml': yamlLoader,
      '.yml': yamlLoader,
      '.json': jsonLoader,
      noExt: jsonLoader
    },
    packageProp: 'appiumConfig'
  });
  const result = filepath ? await loadConfigFile(lc, filepath) : await searchConfigFile(lc);

  if (result !== null && result !== void 0 && result.filepath && !(result !== null && result !== void 0 && result.isEmpty)) {
    const {
      pretty = true
    } = opts;

    try {
      let configResult;
      const errors = (0, _schema.validate)(result.config);

      if (_lodash.default.isEmpty(errors)) {
        configResult = { ...result,
          errors
        };
      } else {
        const reason = formatErrors(errors, result.config, {
          json: rawConfig.get(result.filepath),
          pretty
        });
        configResult = reason ? { ...result,
          errors,
          reason
        } : { ...result,
          errors
        };
      }

      configResult.config = normalizeConfig(configResult.config);
      return configResult;
    } finally {
      rawConfig.delete(result.filepath);
    }
  }

  return result ?? {};
}

function normalizeConfig(config) {
  const schema = (0, _schema.getSchema)();

  const normalize = (config, section) => {
    const obj = _lodash.default.isUndefined(section) ? config : _lodash.default.get(config, section, config);

    const mappedObj = _lodash.default.mapKeys(obj, (__, prop) => {
      var _schema$properties$pr;

      return ((_schema$properties$pr = schema.properties[prop]) === null || _schema$properties$pr === void 0 ? void 0 : _schema$properties$pr.appiumCliDest) ?? _lodash.default.camelCase(prop);
    });

    return _lodash.default.mapValues(mappedObj, (value, property) => {
      var _schema$properties;

      const nextSection = section ? `${section}.${property}` : property;
      return isSchemaTypeObject((_schema$properties = schema.properties) === null || _schema$properties === void 0 ? void 0 : _schema$properties[property]) ? normalize(config, nextSection) : value;
    });
  };

  const isSchemaTypeObject = schema => Boolean((schema === null || schema === void 0 ? void 0 : schema.properties) || (schema === null || schema === void 0 ? void 0 : schema.type) === 'object');

  return normalize(config);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ5YW1sTG9hZGVyIiwiZmlsZXBhdGgiLCJjb250ZW50IiwieWFtbCIsInBhcnNlIiwicmF3Q29uZmlnIiwiTWFwIiwianNvbkxvYWRlciIsInNldCIsIkpTT04iLCJsb2FkQ29uZmlnRmlsZSIsImxjIiwibG9hZCIsImVyciIsImNvZGUiLCJtZXNzYWdlIiwiU3ludGF4RXJyb3IiLCJzZWFyY2hDb25maWdGaWxlIiwic2VhcmNoIiwiZm9ybWF0RXJyb3JzIiwiZXJyb3JzIiwiY29uZmlnIiwib3B0cyIsImxlbmd0aCIsIlR5cGVFcnJvciIsImJldHRlckFqdkVycm9ycyIsImdldFNjaGVtYSIsInNjaGVtYUlkIiwianNvbiIsImZvcm1hdCIsInJlYWRDb25maWdGaWxlIiwibGlsY29uZmlnIiwibG9hZGVycyIsIm5vRXh0IiwicGFja2FnZVByb3AiLCJyZXN1bHQiLCJpc0VtcHR5IiwicHJldHR5IiwiY29uZmlnUmVzdWx0IiwidmFsaWRhdGUiLCJfIiwicmVhc29uIiwiZ2V0Iiwibm9ybWFsaXplQ29uZmlnIiwiZGVsZXRlIiwic2NoZW1hIiwibm9ybWFsaXplIiwic2VjdGlvbiIsIm9iaiIsImlzVW5kZWZpbmVkIiwibWFwcGVkT2JqIiwibWFwS2V5cyIsIl9fIiwicHJvcCIsInByb3BlcnRpZXMiLCJhcHBpdW1DbGlEZXN0IiwiY2FtZWxDYXNlIiwibWFwVmFsdWVzIiwidmFsdWUiLCJwcm9wZXJ0eSIsIm5leHRTZWN0aW9uIiwiaXNTY2hlbWFUeXBlT2JqZWN0IiwiQm9vbGVhbiIsInR5cGUiXSwic291cmNlcyI6WyIuLi8uLi9saWIvY29uZmlnLWZpbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJldHRlckFqdkVycm9ycyBmcm9tICdAc2lkdmluZC9iZXR0ZXItYWp2LWVycm9ycyc7XG5pbXBvcnQge2xpbGNvbmZpZ30gZnJvbSAnbGlsY29uZmlnJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgeWFtbCBmcm9tICd5YW1sJztcbmltcG9ydCB7Z2V0U2NoZW1hLCB2YWxpZGF0ZX0gZnJvbSAnLi9zY2hlbWEvc2NoZW1hJztcblxuLyoqXG4gKiBsaWxjb25maWcgbG9hZGVyIHRvIGhhbmRsZSBgLnlhbWxgIGZpbGVzXG4gKiBAdHlwZSB7aW1wb3J0KCdsaWxjb25maWcnKS5Mb2FkZXJTeW5jfVxuICovXG5mdW5jdGlvbiB5YW1sTG9hZGVyKGZpbGVwYXRoLCBjb250ZW50KSB7XG4gIHJldHVybiB5YW1sLnBhcnNlKGNvbnRlbnQpO1xufVxuXG4vKipcbiAqIEEgY2FjaGUgb2YgdGhlIHJhdyBjb25maWcgZmlsZSAoYSBKU09OIHN0cmluZykgYXQgYSBmaWxlcGF0aC5cbiAqIFRoaXMgaXMgdXNlZCBmb3IgYmV0dGVyIGVycm9yIHJlcG9ydGluZy5cbiAqIE5vdGUgdGhhdCBjb25maWcgZmlsZXMgbmVlZG4ndCBiZSBKU09OLCBidXQgaXQgaGVscHMgaWYgdGhleSBhcmUuXG4gKiBAdHlwZSB7TWFwPHN0cmluZyxSYXdKc29uPn1cbiAqL1xuY29uc3QgcmF3Q29uZmlnID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIEN1c3RvbSBKU09OIGxvYWRlciB0aGF0IGNhY2hlcyB0aGUgcmF3IGNvbmZpZyBmaWxlIChmb3IgdXNlIHdpdGggYGJldHRlci1hanYtZXJyb3JzYCkuXG4gKiBJZiBpdCB3ZXJlbid0IGZvciB0aGlzIGNhY2hlLCB0aGlzIHdvdWxkIGJlIHVubmVjZXNzYXJ5LlxuICogQHR5cGUge2ltcG9ydCgnbGlsY29uZmlnJykuTG9hZGVyU3luY31cbiAqL1xuZnVuY3Rpb24ganNvbkxvYWRlcihmaWxlcGF0aCwgY29udGVudCkge1xuICByYXdDb25maWcuc2V0KGZpbGVwYXRoLCBjb250ZW50KTtcbiAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudCk7XG59XG5cbi8qKlxuICogTG9hZHMgYSBjb25maWcgZmlsZSBmcm9tIGFuIGV4cGxpY2l0IHBhdGhcbiAqIEBwYXJhbSB7TGlsY29uZmlnQXN5bmNTZWFyY2hlcn0gbGMgLSBsaWxjb25maWcgaW5zdGFuY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlcGF0aCAtIFBhdGggdG8gY29uZmlnIGZpbGVcbiAqIEByZXR1cm5zIHtQcm9taXNlPGltcG9ydCgnbGlsY29uZmlnJykuTGlsY29uZmlnUmVzdWx0Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gbG9hZENvbmZpZ0ZpbGUobGMsIGZpbGVwYXRoKSB7XG4gIHRyeSB7XG4gICAgLy8gcmVtb3ZpbmcgXCJhd2FpdFwiIHdpbGwgY2F1c2UgYW55IHJlamVjdGlvbiB0byBfbm90XyBiZSBjYXVnaHQgaW4gdGhpcyBibG9jayFcbiAgICByZXR1cm4gYXdhaXQgbGMubG9hZChmaWxlcGF0aCk7XG4gIH0gY2F0Y2ggKC8qKiBAdHlwZSB7dW5rbm93bn0gKi8gZXJyKSB7XG4gICAgaWYgKC8qKiBAdHlwZSB7Tm9kZUpTLkVycm5vRXhjZXB0aW9ufSAqLyAoZXJyKS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgLyoqIEB0eXBlIHtOb2RlSlMuRXJybm9FeGNlcHRpb259ICovIChcbiAgICAgICAgZXJyXG4gICAgICApLm1lc3NhZ2UgPSBgQ29uZmlnIGZpbGUgbm90IGZvdW5kIGF0IHVzZXItcHJvdmlkZWQgcGF0aDogJHtmaWxlcGF0aH1gO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgU3ludGF4RXJyb3IpIHtcbiAgICAgIC8vIGdlbmVyYWxseSBpbnZhbGlkIEpTT05cbiAgICAgIGVyci5tZXNzYWdlID0gYENvbmZpZyBmaWxlIGF0IHVzZXItcHJvdmlkZWQgcGF0aCAke2ZpbGVwYXRofSBpcyBpbnZhbGlkOlxcbiR7ZXJyLm1lc3NhZ2V9YDtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIGEgY29uZmlnIGZpbGVcbiAqIEBwYXJhbSB7TGlsY29uZmlnQXN5bmNTZWFyY2hlcn0gbGMgLSBsaWxjb25maWcgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHtQcm9taXNlPGltcG9ydCgnbGlsY29uZmlnJykuTGlsY29uZmlnUmVzdWx0Pn1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2VhcmNoQ29uZmlnRmlsZShsYykge1xuICByZXR1cm4gYXdhaXQgbGMuc2VhcmNoKCk7XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gYXJyYXkgb2YgZXJyb3JzIGFuZCB0aGUgcmVzdWx0IG9mIGxvYWRpbmcgYSBjb25maWcgZmlsZSwgZ2VuZXJhdGUgYVxuICogaGVscGZ1bCBzdHJpbmcgZm9yIHRoZSB1c2VyLlxuICpcbiAqIC0gSWYgYG9wdHNgIGNvbnRhaW5zIGEgYGpzb25gIHByb3BlcnR5LCB0aGlzIHNob3VsZCBiZSB0aGUgb3JpZ2luYWwgSlNPTlxuICogICBfc3RyaW5nXyBvZiB0aGUgY29uZmlnIGZpbGUuICBUaGlzIGlzIG9ubHkgYXBwbGljYWJsZSBpZiB0aGUgY29uZmlnIGZpbGVcbiAqICAgd2FzIGluIEpTT04gZm9ybWF0LiBJZiBwcmVzZW50LCBpdCB3aWxsIGFzc29jaWF0ZSBsaW5lIG51bWJlcnMgd2l0aCBlcnJvcnMuXG4gKiAtIElmIGBlcnJvcnNgIGhhcHBlbnMgdG8gYmUgZW1wdHksIHRoaXMgd2lsbCB0aHJvdy5cbiAqIEBwYXJhbSB7aW1wb3J0KCdhanYnKS5FcnJvck9iamVjdFtdfSBlcnJvcnMgLSBOb24tZW1wdHkgYXJyYXkgb2YgZXJyb3JzLiBSZXF1aXJlZC5cbiAqIEBwYXJhbSB7UmVhZENvbmZpZ0ZpbGVSZXN1bHRbJ2NvbmZpZyddfGFueX0gW2NvbmZpZ10gLVxuICogQ29uZmlndXJhdGlvbiAmIG1ldGFkYXRhXG4gKiBAcGFyYW0ge0Zvcm1hdENvbmZpZ0Vycm9yc09wdGlvbnN9IFtvcHRzXVxuICogQHRocm93cyB7VHlwZUVycm9yfSBJZiBgZXJyb3JzYCBpcyBlbXB0eVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEVycm9ycyhlcnJvcnMgPSBbXSwgY29uZmlnID0ge30sIG9wdHMgPSB7fSkge1xuICBpZiAoZXJyb3JzICYmICFlcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkgb2YgZXJyb3JzIG11c3QgYmUgbm9uLWVtcHR5Jyk7XG4gIH1cbiAgcmV0dXJuIGJldHRlckFqdkVycm9ycyhnZXRTY2hlbWEob3B0cy5zY2hlbWFJZCksIGNvbmZpZywgZXJyb3JzLCB7XG4gICAganNvbjogb3B0cy5qc29uLFxuICAgIGZvcm1hdDogJ2NsaScsXG4gIH0pO1xufVxuXG4vKipcbiAqIEdpdmVuIGFuIG9wdGlvbmFsIHBhdGgsIHJlYWQgYSBjb25maWcgZmlsZS4gVmFsaWRhdGVzIHRoZSBjb25maWcgZmlsZS5cbiAqXG4gKiBDYWxsIHtAbGluayB2YWxpZGF0ZX0gaWYgeW91IGFscmVhZHkgaGF2ZSBhIGNvbmZpZyBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2ZpbGVwYXRoXSAtIFBhdGggdG8gY29uZmlnIGZpbGUsIGlmIHdlIGhhdmUgb25lXG4gKiBAcGFyYW0ge1JlYWRDb25maWdGaWxlT3B0aW9uc30gW29wdHNdIC0gT3B0aW9uc1xuICogQHB1YmxpY1xuICogQHJldHVybnMge1Byb21pc2U8UmVhZENvbmZpZ0ZpbGVSZXN1bHQ+fSBDb250YWlucyBjb25maWcgYW5kIGZpbGVwYXRoLCBpZiBmb3VuZCwgYW5kIGFueSBlcnJvcnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRDb25maWdGaWxlKGZpbGVwYXRoLCBvcHRzID0ge30pIHtcbiAgY29uc3QgbGMgPSBsaWxjb25maWcoJ2FwcGl1bScsIHtcbiAgICBsb2FkZXJzOiB7XG4gICAgICAnLnlhbWwnOiB5YW1sTG9hZGVyLFxuICAgICAgJy55bWwnOiB5YW1sTG9hZGVyLFxuICAgICAgJy5qc29uJzoganNvbkxvYWRlcixcbiAgICAgIG5vRXh0OiBqc29uTG9hZGVyLFxuICAgIH0sXG4gICAgcGFja2FnZVByb3A6ICdhcHBpdW1Db25maWcnLFxuICB9KTtcblxuICBjb25zdCByZXN1bHQgPSBmaWxlcGF0aCA/IGF3YWl0IGxvYWRDb25maWdGaWxlKGxjLCBmaWxlcGF0aCkgOiBhd2FpdCBzZWFyY2hDb25maWdGaWxlKGxjKTtcblxuICBpZiAocmVzdWx0Py5maWxlcGF0aCAmJiAhcmVzdWx0Py5pc0VtcHR5KSB7XG4gICAgY29uc3Qge3ByZXR0eSA9IHRydWV9ID0gb3B0cztcbiAgICB0cnkge1xuICAgICAgbGV0IGNvbmZpZ1Jlc3VsdDtcbiAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRlKHJlc3VsdC5jb25maWcpO1xuICAgICAgaWYgKF8uaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICAgIGNvbmZpZ1Jlc3VsdCA9IHsuLi5yZXN1bHQsIGVycm9yc307XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZWFzb24gPSBmb3JtYXRFcnJvcnMoZXJyb3JzLCByZXN1bHQuY29uZmlnLCB7XG4gICAgICAgICAganNvbjogcmF3Q29uZmlnLmdldChyZXN1bHQuZmlsZXBhdGgpLFxuICAgICAgICAgIHByZXR0eSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbmZpZ1Jlc3VsdCA9IHJlYXNvbiA/IHsuLi5yZXN1bHQsIGVycm9ycywgcmVhc29ufSA6IHsuLi5yZXN1bHQsIGVycm9yc307XG4gICAgICB9XG5cbiAgICAgIC8vIG5vcm1hbGl6ZSAodG8gY2FtZWwgY2FzZSkgYWxsIHRvcC1sZXZlbCBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgY29uZmlnIGZpbGVcbiAgICAgIGNvbmZpZ1Jlc3VsdC5jb25maWcgPSBub3JtYWxpemVDb25maWcoLyoqIEB0eXBlIHtBcHBpdW1Db25maWd9ICovIChjb25maWdSZXN1bHQuY29uZmlnKSk7XG5cbiAgICAgIHJldHVybiBjb25maWdSZXN1bHQ7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vIGNsZWFuIHVwIHRoZSByYXcgY29uZmlnIGZpbGUgY2FjaGUsIHdoaWNoIGlzIG9ubHkga2VwdCB0byBiZXR0ZXIgcmVwb3J0IGVycm9ycy5cbiAgICAgIHJhd0NvbmZpZy5kZWxldGUocmVzdWx0LmZpbGVwYXRoKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdCA/PyB7fTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IHNjaGVtYSBwcm9wZXJ0eSBuYW1lcyB0byBlaXRoZXIgYSkgdGhlIHZhbHVlIG9mIHRoZSBgYXBwaXVtQ2xpRGVzdGAgcHJvcGVydHksIGlmIGFueTsgb3IgYikgY2FtZWwtY2FzZVxuICogQHBhcmFtIHtBcHBpdW1Db25maWd9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2JqZWN0XG4gKiBAcmV0dXJucyB7Tm9ybWFsaXplZEFwcGl1bUNvbmZpZ30gTmV3IG9iamVjdCB3aXRoIGNhbWVsLWNhc2VkIGtleXMgKG9yIGBkZXN0YCBrZXlzKS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUNvbmZpZyhjb25maWcpIHtcbiAgY29uc3Qgc2NoZW1hID0gZ2V0U2NoZW1hKCk7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FwcGl1bUNvbmZpZ30gY29uZmlnXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbc2VjdGlvbl0gLSBLZXlwYXRoIChsb2Rhc2ggYF8uZ2V0KClgIHN0eWxlKSB0byBzZWN0aW9uIG9mIGNvbmZpZy4gSWYgb21pdHRlZCwgYXNzdW1lIHJvb3QgQXBwaXVtIGNvbmZpZyBzY2hlbWFcbiAgICogQHRvZG8gUmV3cml0ZSBhcyBhIGxvb3BcbiAgICogQHJldHVybnMgTm9ybWFsaXplZCBzZWN0aW9uIG9mIGNvbmZpZ1xuICAgKi9cbiAgY29uc3Qgbm9ybWFsaXplID0gKGNvbmZpZywgc2VjdGlvbikgPT4ge1xuICAgIGNvbnN0IG9iaiA9IF8uaXNVbmRlZmluZWQoc2VjdGlvbikgPyBjb25maWcgOiBfLmdldChjb25maWcsIHNlY3Rpb24sIGNvbmZpZyk7XG5cbiAgICBjb25zdCBtYXBwZWRPYmogPSBfLm1hcEtleXMoXG4gICAgICBvYmosXG4gICAgICAoX18sIHByb3ApID0+IHNjaGVtYS5wcm9wZXJ0aWVzW3Byb3BdPy5hcHBpdW1DbGlEZXN0ID8/IF8uY2FtZWxDYXNlKHByb3ApXG4gICAgKTtcblxuICAgIHJldHVybiBfLm1hcFZhbHVlcyhtYXBwZWRPYmosICh2YWx1ZSwgcHJvcGVydHkpID0+IHtcbiAgICAgIGNvbnN0IG5leHRTZWN0aW9uID0gc2VjdGlvbiA/IGAke3NlY3Rpb259LiR7cHJvcGVydHl9YCA6IHByb3BlcnR5O1xuICAgICAgcmV0dXJuIGlzU2NoZW1hVHlwZU9iamVjdChzY2hlbWEucHJvcGVydGllcz8uW3Byb3BlcnR5XSlcbiAgICAgICAgPyBub3JtYWxpemUoY29uZmlnLCBuZXh0U2VjdGlvbilcbiAgICAgICAgOiB2YWx1ZTtcbiAgICB9KTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHNjaGVtYSBwcm9wIHJlZmVyZW5jZXMgYW4gb2JqZWN0LCBvciBpZiBpdCdzIGFuIG9iamVjdCBpdHNlbGZcbiAgICogQHBhcmFtIHtpbXBvcnQoJ2FqdicpLlNjaGVtYU9iamVjdHxvYmplY3R9IHNjaGVtYSAtIFJlZmVyZW5jaW5nIHNjaGVtYSBvYmplY3RcbiAgICovXG4gIGNvbnN0IGlzU2NoZW1hVHlwZU9iamVjdCA9IChzY2hlbWEpID0+IEJvb2xlYW4oc2NoZW1hPy5wcm9wZXJ0aWVzIHx8IHNjaGVtYT8udHlwZSA9PT0gJ29iamVjdCcpO1xuXG4gIHJldHVybiBub3JtYWxpemUoY29uZmlnKTtcbn1cblxuLyoqXG4gKiBSZXN1bHQgb2YgY2FsbGluZyB7QGxpbmsgcmVhZENvbmZpZ0ZpbGV9LlxuICogQHR5cGVkZWYgUmVhZENvbmZpZ0ZpbGVSZXN1bHRcbiAqIEBwcm9wZXJ0eSB7aW1wb3J0KCdhanYnKS5FcnJvck9iamVjdFtdfSBbZXJyb3JzXSAtIFZhbGlkYXRpb24gZXJyb3JzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2ZpbGVwYXRoXSAtIFRoZSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZSwgaWYgZm91bmRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2lzRW1wdHldIC0gSWYgYHRydWVgLCB0aGUgY29uZmlnIGZpbGUgZXhpc3RzIGJ1dCBpcyBlbXB0eVxuICogQHByb3BlcnR5IHtOb3JtYWxpemVkQXBwaXVtQ29uZmlnfSBbY29uZmlnXSAtIFRoZSBwYXJzZWQgY29uZmlndXJhdGlvblxuICogQHByb3BlcnR5IHtzdHJpbmd8aW1wb3J0KCdAc2lkdmluZC9iZXR0ZXItYWp2LWVycm9ycycpLklPdXRwdXRFcnJvcltdfSBbcmVhc29uXSAtIEh1bWFuLXJlYWRhYmxlIGVycm9yIG1lc3NhZ2VzIGFuZCBzdWdnZXN0aW9ucy4gSWYgdGhlIGBwcmV0dHlgIG9wdGlvbiBpcyBgdHJ1ZWAsIHRoaXMgd2lsbCBiZSBhIG5pY2Ugc3RyaW5nIHRvIHByaW50LlxuICovXG5cbi8qKlxuICogT3B0aW9ucyBmb3Ige0BsaW5rIHJlYWRDb25maWdGaWxlfS5cbiAqIEB0eXBlZGVmIFJlYWRDb25maWdGaWxlT3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFufSBbcHJldHR5PXRydWVdIElmIGBmYWxzZWAsIGRvIG5vdCB1c2UgY29sb3IgYW5kIGZhbmN5IGZvcm1hdHRpbmcgaW4gdGhlIGByZWFzb25gIHByb3BlcnR5IG9mIHRoZSB7QGxpbmsgUmVhZENvbmZpZ0ZpbGVSZXN1bHR9LiBUaGUgdmFsdWUgb2YgYHJlYXNvbmAgaXMgdGhlbiBzdWl0YWJsZSBmb3IgbWFjaGluZS1yZWFkaW5nLlxuICovXG5cbi8qKlxuICogVGhpcyBpcyBhbiBgQXN5bmNTZWFyY2hlcmAgd2hpY2ggaXMgaW5leHBsaWNhYmx5IF9ub3RfIGV4cG9ydGVkIGJ5IHRoZSBgbGlsY29uZmlnYCB0eXBlIGRlZmluaXRpb24uXG4gKiBAdHlwZWRlZiB7UmV0dXJuVHlwZTxpbXBvcnQoJ2xpbGNvbmZpZycpW1wibGlsY29uZmlnXCJdPn0gTGlsY29uZmlnQXN5bmNTZWFyY2hlclxuICovXG5cbi8qKlxuICogVGhlIGNvbnRlbnRzIG9mIGFuIEFwcGl1bSBjb25maWcgZmlsZS4gR2VuZXJhdGVkIGZyb20gc2NoZW1hXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdAYXBwaXVtL3R5cGVzJykuQXBwaXVtQ29uZmlnfSBBcHBpdW1Db25maWdcbiAqL1xuXG4vKipcbiAqIFRoZSBjb250ZW50cyBvZiBhbiBBcHBpdW0gY29uZmlnIGZpbGUgd2l0aCBjYW1lbGNhc2VkIHByb3BlcnR5IG5hbWVzIChhbmQgdXNpbmcgYGFwcGl1bUNsaURlc3RgIHZhbHVlIGlmIHByZXNlbnQpLiBHZW5lcmF0ZWQgZnJvbSB7QGxpbmsgQXBwaXVtQ29uZmlnfVxuICogQHR5cGVkZWYge2ltcG9ydCgnQGFwcGl1bS90eXBlcycpLk5vcm1hbGl6ZWRBcHBpdW1Db25maWd9IE5vcm1hbGl6ZWRBcHBpdW1Db25maWdcbiAqL1xuXG4vKipcbiAqIFRoZSBzdHJpbmcgc2hvdWxkIGJlIGEgcmF3IEpTT04gc3RyaW5nLlxuICogQHR5cGVkZWYge3N0cmluZ30gUmF3SnNvblxuICovXG5cbi8qKlxuICogT3B0aW9ucyBmb3Ige0BsaW5rIGZvcm1hdEVycm9yc30uXG4gKiBAdHlwZWRlZiBGb3JtYXRDb25maWdFcnJvcnNPcHRpb25zXG4gKiBAcHJvcGVydHkge2ltcG9ydCgnLi9jb25maWctZmlsZScpLlJhd0pzb259IFtqc29uXSAtIFJhdyBKU09OIGNvbmZpZyAoYXMgc3RyaW5nKVxuICogQHByb3BlcnR5IHtib29sZWFufSBbcHJldHR5PXRydWVdIC0gV2hldGhlciB0byBmb3JtYXQgZXJyb3JzIGFzIGEgQ0xJLWZyaWVuZGx5IHN0cmluZ1xuICogQHByb3BlcnR5IHtzdHJpbmd9ICBbc2NoZW1hSWRdIC0gU3BlY2lmaWMgSUQgb2YgYSBwcm9wOyBvdGhlcndpc2UgZW50aXJlIHNjaGVtYVxuICovXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFNQSxTQUFTQSxVQUFULENBQW9CQyxRQUFwQixFQUE4QkMsT0FBOUIsRUFB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