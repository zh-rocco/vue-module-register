function getType(v) {
  return Object.prototype.toString.call(v);
}

export function isArray(a) {
  return getType(a) === "[object Array]";
}

export function isObject(o) {
  return getType(o) === "[object Object]";
}

export function isFunction(func) {
  return getType(func) === "[object Function]";
}

export function addTimestamp(url) {
  return url.indexOf("?") > -1 ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
}

export function noop() {}
