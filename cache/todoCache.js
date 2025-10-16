// import cache from './index.js';
// import { caching } from "../config/config.js";
// import { getUserTodosKey } from "./keys.js";
// import { getJson, setJson } from "./query.js";

// async function saveUserTodos(userId, todos) {
//   const key = getUserTodosKey(userId);
//   return setJson(
//     key,
//     { data: todos },
//     new Date(Date.now() + Number(caching.contentCacheDuration))
//   );
// }

// async function fetchUserTodos(userId) {
//   const key = getUserTodosKey(userId);
//   return getJson(key);
// }

// async function invalidateUserTodos(userId) {
//   const key = getUserTodosKey(userId);
//   await cache.del(key);
// }

// export default {
//   saveUserTodos,
//   fetchUserTodos,
//   invalidateUserTodos,
// };
