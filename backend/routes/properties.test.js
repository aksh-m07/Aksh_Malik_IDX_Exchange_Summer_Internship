const request = require("supertest");
jest.mock("../db", () => ({
  query: jest.fn(),
}));
const app = require("../App");
const db = require("../db");

beforeEach(() => {
  db.query.mockReset();
});
describe("GET /api/properties", () => {
    test("returns paginated results with default limit/offset", async () => {
        db.query.mockResolvedValueOnce([[{ total: 2 }]]);
        db.query.mockResolvedValueOnce([
            [
            { L_ListingID: "1", L_City: "San Diego" },
            { L_ListingID: "2", L_City: "La Jolla" },
            ],
        ]);
        const res = await request(app).get("/api/properties");
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(2);
        expect(res.body.limit).toBe(10);
        expect(res.body.offset).toBe(0);
        expect(res.body.results).toHaveLength(2);
        expect(db.query).toHaveBeenCalledTimes(2);
      });
    test("respects limit and offset query params", async () => {
        db.query.mockResolvedValueOnce([[{ total: 50 }]]);
        db.query.mockResolvedValueOnce([[{ L_ListingID: "11" }]]);
        const res = await request(app).get("/api/properties?limit=5&offset=10");
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(50);
        expect(res.body.limit).toBe(5);
        expect(res.body.offset).toBe(10);
        expect(res.body.results).toHaveLength(1);
        expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.arrayContaining([5, 10])
        );      
    });
    test("filters by city", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", L_City: "San Diego" }]]);

      const res = await request(app).get("/api/properties?city=San Diego");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("LOWER(TRIM(L_City))"),
        expect.arrayContaining(["San Diego"])
      );
    });

    test("filters by zipcode", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", L_Zip: "92101" }]]);

      const res = await request(app).get("/api/properties?zipcode=92101");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("L_Zip = ?"),
        expect.arrayContaining(["92101"])
      );
    });

    test("filters by minPrice", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", L_SystemPrice: 500000 }]]);

      const res = await request(app).get("/api/properties?minPrice=300000");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("L_SystemPrice >= ?"),
        expect.arrayContaining([300000])
      );
    });

    test("filters by maxPrice", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", L_SystemPrice: 400000 }]]);

      const res = await request(app).get("/api/properties?maxPrice=600000");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("L_SystemPrice <= ?"),
        expect.arrayContaining([600000])
      );
    });

    test("filters by beds", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", L_Keyword2: 3 }]]);

      const res = await request(app).get("/api/properties?beds=3");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("L_Keyword2 = ?"),
        expect.arrayContaining([3])
      );
    });

    test("filters by baths", async () => {
      db.query.mockResolvedValueOnce([[{ total: 1 }]]);
      db.query.mockResolvedValueOnce([[{ L_ListingID: "1", LM_Dec_3: "2" }]]);

      const res = await request(app).get("/api/properties?baths=2");

      expect(res.status).toBe(200);
      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("LM_Dec_3 = ?"),
        expect.arrayContaining([2])
      );
    });
    
    test("returns 400 for invalid limit", async () => {
      const res = await request(app).get("/api/properties?limit=0");
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/limit/);
      expect(db.query).not.toHaveBeenCalled();
    });

   


});

describe("GET /api/properties/:id",()=>{
    test("returns property with id ",async()=>{
        db.query.mockResolvedValueOnce([[{ L_ListingID: "11" }]]);
        const res=await request(app).get("/api/properties/11");
        expect(res.status).toBe(200);
        expect(res.body.L_ListingID).toBe("11");
        expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining("L_ListingID = ?"),
        expect.arrayContaining(["11"]));
    })
    test("returns 400 for invalid id", async () => {
      const res = await request(app).get("/api/properties/abc!123");
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid listing ID/);
      expect(db.query).not.toHaveBeenCalled();
    });
    test("returns 404 when property does not exist", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/properties/999");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Property not found");
        expect(db.query).toHaveBeenCalledTimes(1);
    });
});

describe("GET /api/properties/:id/openhouses",()=>{
    test("returns openhouses of property with id ",async()=>{
        db.query.mockResolvedValueOnce([[{ id: 1 }]]); // property existence check
        db.query.mockResolvedValueOnce([
            [
            { OpenHouseDate: "2026-09-01", OH_StartTime: "10:00" },
            { OpenHouseDate: "2026-09-08", OH_StartTime: "13:00" },
            ],
        ]);
        const res=await request(app).get("/api/properties/11/openhouses");
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(db.query).toHaveBeenNthCalledWith(
          2,
          expect.stringContaining("rets_openhouse"),
          expect.arrayContaining(["11"])
        );
    })
    test("returns 400 for invalid id", async () => {
      const res = await request(app).get("/api/properties/abc!123/openhouses");
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid listing ID/);
      expect(db.query).not.toHaveBeenCalled();
    });
    test("returns 404 when property does not exist", async () => {
        db.query.mockResolvedValueOnce([[]]);
        const res = await request(app).get("/api/properties/999/openhouses");
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("Property not found");
        expect(db.query).toHaveBeenCalledTimes(1);
    });
    test("returns an empty array when no open houses are scheduled", async () => {
        db.query.mockResolvedValueOnce([[{ id: 1 }]]); 
        db.query.mockResolvedValueOnce([[]]);           

        const res = await request(app).get("/api/properties/11/openhouses");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});