"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncLruCache = void 0;
const lru_cache_1 = __importDefault(require("lru-cache"));
class AsyncLruCache {
    constructor(options) {
        this.LruCache = new lru_cache_1.default(options);
    }
    memoizeAsync(fn, hashFn) {
        const internalFn = (...args) => __awaiter(this, void 0, void 0, function* () {
            let key;
            if (hashFn) {
                key = hashFn(...args);
            }
            else {
                key = args[0];
            }
            const existingValue = this.LruCache.get(key);
            if (existingValue) {
                return yield existingValue;
            }
            else {
                // create the promise
                const promise = fn(...args);
                // save the promise
                this.LruCache.set(key, promise);
                try {
                    return yield promise;
                }
                catch (e) {
                    this.LruCache.del(key);
                    throw e;
                }
            }
        });
        return internalFn;
    }
}
exports.AsyncLruCache = AsyncLruCache;
