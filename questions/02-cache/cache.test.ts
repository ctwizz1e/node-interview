import { ExpiredRecordError, InternalCache, NotFoundError } from "./cache";

describe("cache tests", () => {
  let cache: InternalCache;
  const key = "k1";
  const dto = { value: "abc" };

  beforeEach(() => {
    cache = new InternalCache();
  });

  describe("testing cache get", () => {
    test("get - with missing record - throws NotFoundError", () => {
      expect(() => cache.get(key)).toThrow(NotFoundError);
    });

    test("get - with expired record - throws ExpiredRecordError", () => {
      cache.addOrUpdate(key, {}, { expirationInMs: -1500 });
      expect(() => cache.get(key)).toThrow(ExpiredRecordError);
    });

    test("get - with non-expired record - returns record", () => {
      cache.addOrUpdate(key, dto);
      expect(cache.get(key)).toEqual(dto);
    });
  });

  describe("testing cache getOrAdd", () => {
    test("getOrAdd - with missing record - adds record and returns it", async () => {
      const loadFunction = jest.fn(() => dto);
      await expect(cache.getOrAdd(key, loadFunction)).resolves.toEqual({
        value: dto,
        isNew: true,
      });
      expect(loadFunction).toHaveBeenCalledTimes(1);
    });

    test("getOrAdd - with expired record - adds record and returns it", async () => {
      cache.addOrUpdate(key, dto, { expirationInMs: -1500 });

      const loadFunction = jest.fn(() => dto);
      await expect(cache.getOrAdd(key, loadFunction)).resolves.toEqual({
        value: dto,
        isNew: true,
      });

      expect(loadFunction).toHaveBeenCalledTimes(1);
    });

    test("getOrAdd - with valid record - returns it without calling function", async () => {
      cache.addOrUpdate(key, dto, { expirationInMs: 1500 });

      const loadFunction = jest.fn(() => dto);
      await expect(cache.getOrAdd(key, loadFunction)).resolves.toEqual({
        value: dto,
        isNew: false,
      });

      expect(loadFunction).toHaveBeenCalledTimes(0);
    });

    test("getOrAdd - with expiration options - uses expiration options", async () => {
      const loadFunction = jest.fn(() => dto);
      await expect(
        cache.getOrAdd(key, loadFunction, { expirationInMs: -2000 })
      ).resolves.toEqual({
        value: dto,
        isNew: true,
      });

      expect(loadFunction).toHaveBeenCalledTimes(1);

      // if you get the object it should already be expired
      expect(() => cache.get(key)).toThrow(ExpiredRecordError);
    });
  });

  describe("testing cache addOrUdpate", () => {
    test("addOrUpdate - resets expiration", async () => {
      // setup with expired record
      await cache.getOrAdd(key, () => dto, { expirationInMs: -2000 });
      expect(() => cache.get(key)).toThrow(ExpiredRecordError);

      // call add/update
      cache.addOrUpdate(key, dto);

      // validate get doesn't throw anymore
      expect(cache.get(key)).toEqual(dto);
    });
  });

  describe("testing cache getAllValidKeys", () => {
    test("getAllValidKeys - no records - returns empty array", () => {
      expect(cache.getAllValidKeys()).toEqual([]);
    });

    test("getAllValidKeys - expired records - returns empty array", () => {
      cache.addOrUpdate(key, dto, { expirationInMs: -2000 });
      expect(cache.getAllValidKeys()).toEqual([]);
    });

    test("getAllValidKeys - valid records - returns expected result", () => {
      cache.addOrUpdate(key, dto);
      expect(cache.getAllValidKeys()).toEqual([key]);
    });

    test("getAllValidKeys - valid records with filter - applies filter", () => {
      cache.addOrUpdate(key, dto);
      cache.addOrUpdate("k2", { value: "xyz" });

      expect(
        cache.getAllValidKeys({
          filter: (r: any) => r.value === dto.value,
        })
      ).toEqual([key]);
    });
  });

  describe("testing cache getAllValidKeysEnumerator", () => {
    test("getAllValidKeysEnumerator - empty cache - returns blank", () => {
      for (const r of cache.getAllValidKeysEnumerator()) {
        fail("should not iterate through empty cache");
      }
    });

    test("getAllValidKeysEnumerator - with records - returns records", () => {
      let count = 0;

      // keys and values will match count per iteration
      cache.addOrUpdate("0", 0);
      cache.addOrUpdate("1", 1);
      cache.addOrUpdate("2", 2);

      for (const r of cache.getAllValidKeysEnumerator()) {
        expect(r).toMatchObject({ key: `${count}`, value: count });
        count++;
      }
    });

    test("getAllValidKeysEnumerator - applies filters", () => {
      // keys and values will match count per iteration
      cache.addOrUpdate("0", 0);
      cache.addOrUpdate("1", 1);
      cache.addOrUpdate("2", 2);

      // apply filter - should only match the 1 iteration
      for (const r of cache.getAllValidKeysEnumerator({
        filter: (r: any) => r % 2 === 1,
      })) {
        expect(r).toMatchObject({ key: `1`, value: 1 });
      }

      // apply filter that should never match anything
      for (const r of cache.getAllValidKeysEnumerator({
        filter: (r: any) => false,
      })) {
        fail("should not iterate through empty array");
      }
    });

    test("getAllValidKeysEnumerator - with expired records - return empty results", () => {
      // keys and values will match count per iteration
      cache.addOrUpdate(key, dto, { expirationInMs: -2000 });

      for (const r of cache.getAllValidKeysEnumerator({
        filter: (r: any) => false,
      })) {
        fail("should not iterate through empty array");
      }
    });
  });
});
