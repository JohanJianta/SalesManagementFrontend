import { getClusterById, getClusters } from "../../src/repositories/clusterRepo";
import * as storageUtils from "../../src/shared/asyncStorageUtils";
import * as apiService from "../../src/services/apiService";

// Mocking dependencies to isolate unit tests from external systems
jest.mock("../../src/services/apiService");
jest.mock("../../src/shared/asyncStorageUtils");

const mockedGetRequest = apiService.getRequest as jest.Mock;

describe("Test clusterRepo", () => {
  // Reset mocks before each test to avoid test pollution
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("/clusters endpoint", () => {
    it("returns all cluster data on success", async () => {
      /**
       * Purpose: To verify that `getClusters()` correctly returns data when API call is successful.
       *
       * Expected Outcome:
       * - The function returns the mocked cluster data.
       *
       * Assumptions:
       * - `getFromStorage` returns a valid token.
       * - `getRequest` returns a successful mock response.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockResponse = {
        masterplan_url: "http://masterplan.jpg",
        clusters: [{ id: 1, name: "Cluster A" }],
      };
      mockedGetRequest.mockResolvedValue(mockResponse);

      const result = await getClusters();

      expect(mockedGetRequest).toHaveBeenCalledWith("/clusters");
      expect(result).toEqual(mockResponse);
    });

    it("throws the first error if request fails", async () => {
      /**
       * Purpose: To verify that `getClusters()` throws the first error when the API call fails.
       *
       * Expected Outcome:
       * - The thrown error is the first string in the mocked error array.
       *
       * Assumptions:
       * - `getRequest` rejects with an array of error strings.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      mockedGetRequest.mockRejectedValue(["Something went wrong"]);

      await expect(getClusters()).rejects.toBe("Something went wrong");
    });
  });

  describe("/clusters/{id} endpoint", () => {
    it("returns detailed cluster data on success", async () => {
      /**
       * Purpose: To verify that `getClusterById()` returns the correct data when given a valid ID.
       *
       * Expected Outcome:
       * - The function returns the mocked cluster detail.
       *
       * Assumptions:
       * - `getFromStorage` returns a valid token.
       * - `getRequest` returns a successful mock response with cluster details.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      const mockResponse = {
        name: "Cluster A",
        address: "Cluster A address",
      };
      mockedGetRequest.mockResolvedValue(mockResponse);

      const result = await getClusterById(1);

      expect(mockedGetRequest).toHaveBeenCalledWith("/clusters/1");
      expect(result).toEqual(mockResponse);
    });

    it("throws the first error if request fails", async () => {
      /**
       * Purpose: To verify that `getClusterById()` throws the first error when the API call fails.
       *
       * Expected Outcome:
       * - The thrown error is the first string in the mocked error array.
       *
       * Assumptions:
       * - `getRequest` rejects with an array of error strings.
       */

      jest.spyOn(storageUtils, "getFromStorage").mockResolvedValue("mock-token");

      mockedGetRequest.mockRejectedValue(["Something went wrong"]);

      await expect(getClusterById(1)).rejects.toBe("Something went wrong");
    });
  });
});
