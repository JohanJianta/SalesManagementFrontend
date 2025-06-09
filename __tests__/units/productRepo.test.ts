// __tests__/productRepo.test.ts
import { getAvailableProperties, getProductById } from "@/src/repositories/productRepo";
import * as storageUtils from "@/src/shared/asyncStorageUtils";
import * as apiService from "@/src/services/apiService";

// Mock external dependencies so we can unit-test in isolation
jest.mock("@/src/services/apiService");
jest.mock("@/src/shared/asyncStorageUtils");

const mockedGetRequest = apiService.getRequest as jest.Mock;

describe("Test productRepo", () => {
  // Ensure a clean slate for every test case
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("/products endpoint", () => {
    it("returns available properties on success", async () => {
      /**
       * Purpose: Verify getAvailableProperties() resolves with data
       *          when the API request succeeds.
       *
       * Expected:
       *  • getRequest("/products") is invoked.
       *  • Function resolves with the mocked response.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockResponse = {
        products: [
          { id: 101, name: "Rumah Type 45" },
          { id: 102, name: "Rumah Type 60" },
        ],
      };
      mockedGetRequest.mockResolvedValue(mockResponse);

      const result = await getAvailableProperties();

      expect(mockedGetRequest).toHaveBeenCalledWith("/products");
      expect(result).toEqual(mockResponse);
    });

    it("throws the first error if request fails", async () => {
      /**
       * Purpose: Ensure getAvailableProperties() surfaces the first
       *          error object when the API call rejects with an array.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockError = [{ field: "authentication", message: "Invalid credentials" }];
      mockedGetRequest.mockRejectedValue(mockError);

      await expect(getAvailableProperties()).rejects.toEqual(mockError[0]);
    });
  });

  describe("/products/{id} endpoint", () => {
    it("returns product detail on success", async () => {
      /**
       * Purpose: Verify getProductById() returns detail for a valid ID.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockResponse = {
        id: 101,
        name: "Rumah Type 45",
        default_price: 750000000,
      };
      mockedGetRequest.mockResolvedValue(mockResponse);

      const result = await getProductById(101);

      expect(mockedGetRequest).toHaveBeenCalledWith("/products/101");
      expect(result).toEqual(mockResponse);
    });

    it("throws the first error if request fails", async () => {
      /**
       * Purpose: Ensure getProductById() surfaces the first error object
       *          when the API call rejects with an array.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockError = [{ field: "id", message: "Product not found" }];
      mockedGetRequest.mockRejectedValue(mockError);

      await expect(getProductById(0)).rejects.toEqual(mockError[0]);
    });
  });
});
