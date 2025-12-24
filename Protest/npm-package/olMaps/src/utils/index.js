/**
 * 深度合并对象
 * @param {*} target 目标对象
 * @param {*} source 源对象
 * @returns 
 */
function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) && !Array.isArray(target[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
export {
  deepMerge
}