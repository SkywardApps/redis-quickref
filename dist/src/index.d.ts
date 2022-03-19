import LRUCache from 'lru-cache';
export declare class AsyncLruCache<K, V> {
    private readonly LruCache;
    constructor(options?: LRUCache.Options<K, Promise<V>>);
    memoizeAsync<T extends (...args: any[]) => Promise<V>>(fn: T, hashFn?: (...args: Parameters<T>) => any): (...args: Parameters<T>) => Promise<V>;
}
