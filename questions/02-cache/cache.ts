import "datejs";

/**
 * This class should implement a standard cache
 */
export class InternalCache {
  private readonly storage: {
    [key: string]: { value: any; expiration: Date };
  } = {};
  public static DefaultExpirationMs: number = 5 * 60 * 1000; // 5 min expiration default

  /**
   * Get a record from the cache
   *
   * If the record does not exist, throw a NotFoundError
   *
   * If the record exists but is expired, throw an ExpiredRecordError and remove the record from the cache
   * @param key key to find in the cache
   * @returns the record from the cache
   */
  get<T>(key: string): T {
    const record = this.storage[key];

    // cache miss - throw immediately
    if (!record) {
      throw new NotFoundError(key);
    }

    // cache expired - remove record and throw
    const now = new Date();
    if (record.expiration <= now) {
      this.storage[key] = undefined;
      throw new ExpiredRecordError(key, record.expiration, now);
    }

    // found the record - return
    return record.value;
  }

  /**
   * Try to get a record from the cache. If a cache miss, add the record to the cache before returning. The loader function
   * should only be called if the cache misses
   * @param key key to find in the cache
   * @param loadFunction the function to load the value if a cache miss occurs
   * @param options optional settings for the get/add function
   * @returns the cache value and a flag specifying if the value was added to the cache on this call
   */
  async getOrAdd<T>(
    key: string,
    loadFunction: () => T | Promise<T>,
    options?: ExpirationOptions
  ): Promise<{ value: T; isNew: boolean }> {
    try {
      const record = this.get<T>(key);
      return { value: record, isNew: false };
    } catch (e) {
      // if not found or expired, add the record
      if (e instanceof NotFoundError || e instanceof ExpiredRecordError) {
        const value = await loadFunction();
        this.storage[key] = {
          value,
          expiration: new Date().addMilliseconds(
            options?.expirationInMs ?? InternalCache.DefaultExpirationMs
          ),
        };
        return { value, isNew: true };
      }
      throw e;
    }
  }

  /**
   * Add or update a record to/in the cache, updating the expiration date
   * @param key key to find in the cache
   * @param value value to load into the cache
   * @param options optional settings for the get/add function
   */
  addOrUpdate<T>(key: string, value: T, options?: ExpirationOptions) {
    this.storage[key] = {
      value,
      expiration: new Date().addMilliseconds(
        options?.expirationInMs ?? InternalCache.DefaultExpirationMs
      ),
    };
  }

  /**
   * Get all keys of non-expired records in the cache
   * @returns array of all key names;j
   */
  getAllValidKeys<T>(options?: FilterOptions<T>): string[] {
    const result = [];
    const filter = options?.filter ?? (() => true);

    for (const key in this.storage) {
      const data = this.storage[key];

      // if record is undefined then skip
      if (!data) {
        continue;
      }

      const now = new Date();
      if (data.expiration > now && filter(data.value)) {
        result.push(key);
      }
    }

    return result;
  }

  /**
   * Get generator of all non-expired key/value/expiration records in the cache
   */
  *getAllValidKeysEnumerator<T>(options?: FilterOptions<T>): Generator<{
    key: string;
    value: T;
    expiration: Date;
  }> {
    const filter = options?.filter ?? (() => true);

    for (const key in this.storage) {
      const { value, expiration } = this.storage[key];
      const now = new Date();
      if (expiration > now && filter(value)) {
        yield { key, value, expiration };
      }
    }
  }
}

export interface ExpirationOptions {
  expirationInMs?: number;
}

export interface FilterOptions<T> {
  filter?: (input: T) => boolean;
}

export class NotFoundError extends Error {
  constructor(key: string) {
    super(`Cache record with key "${key} was not found"`);
    Object.setPrototypeOf(this.message, NotFoundError.prototype);
  }
}

export class ExpiredRecordError extends Error {
  constructor(key: string, expiration: Date, now: Date) {
    super(
      `Cache record with key "${key} expired at ${expiration.toISOString()} - current time is ${now.toISOString()}"`
    );
    Object.setPrototypeOf(this.message, NotFoundError.prototype);
  }
}
