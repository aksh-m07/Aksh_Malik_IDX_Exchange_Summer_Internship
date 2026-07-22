import { fetchProperties, fetchPropertyDetail, fetchOpenHouses } from "./client";
beforeEach(()=>{global.fetch=jest.fn()});
afterEach(() => {
  jest.resetAllMocks();
});

test("fetchProperties calls the API with default limit and offset", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ results: [], total: 0 }),
  });

  await fetchProperties();

  expect(global.fetch).toHaveBeenCalledWith("/api/properties?limit=20&offset=0");
});

test("fetchProperties includes only the filters that are provided",async ()=>{
    global.fetch.mockResolvedValueOnce({
        ok:true,
        json: async () => ({ results: [], total: 0 }),
    });
    await fetchProperties({ limit: 20, offset: 0, city: "San Diego", beds: 3 });

    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain("city=San+Diego");
    expect(calledUrl).toContain("beds=3");
    expect(calledUrl).not.toContain("minPrice");
    expect(calledUrl).not.toContain("maxPrice");
});

test("fetchProperties throws a formatted error when the response is not ok",async ()=>{
    global.fetch.mockResolvedValueOnce({
        ok: false, 
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ error: "Database connection failed" }),
    });
    await expect(fetchProperties()).rejects.toThrow("Request failed (500): Database connection failed");
})