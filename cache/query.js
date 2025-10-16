// import cache from './index.js';

// export async function setJson(key, value, expireAt = null) {
//   const json = JSON.stringify(value);

//   if (expireAt) {
//     const ttlMillis = expireAt.getTime() - Date.now();
//     return cache.set(key, json, { PX: ttlMillis });
//   } else {
//     return cache.set(key, json);
//   }
// }

// export async function getJson(key) {
//   const type = await cache.type(key);
//   if (type !== 'string') return null;

//   const json = await cache.get(key);
//   if (json) return JSON.parse(json);

//   return null;
// }
