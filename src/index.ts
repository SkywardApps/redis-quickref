import LRUCache from 'lru-cache';

// Type for unwrapping a promise
type PromiseInnerType<T> = T extends Promise<infer RT> ? RT : never;

export class AsyncLruCache<K, V>
{
	private readonly LruCache: LRUCache<K, Promise<V>>;

	public constructor(options?: LRUCache.Options<K, Promise<V>>)
	{
		this.LruCache = new LRUCache<K, Promise<V>>(options);
	}
	
	public memoizeAsync<T extends (...args: any[]) => Promise<V>>(
        fn: T,
        hashFn?: (...args: Parameters<T>) => any
    )
    {
		const internalFn = async (...args: Parameters<T>): Promise<V> =>
		{
			let key;
			if (hashFn)
			{
				key = hashFn(...args);
			}
			else
			{
				key = args[0];
			}
			const existingValue = this.LruCache.get(key);
			if (existingValue)
			{
				return await existingValue;
			}
			else
			{
				// create the promise
				const promise = fn(...args);
				// save the promise
				this.LruCache.set(key, promise);

				try
				{
					return await promise;
				}
				catch (e)
				{
					this.LruCache.del(key);
					throw e;
				}
			}
		};

		return internalFn;
	}
}