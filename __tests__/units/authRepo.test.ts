import * as storageUtils from "@/src/shared/asyncStorageUtils";
import { register, login } from "@/src/repositories/authRepo";
import * as apiService from "@/src/services/apiService";

// Mocking dependencies to isolate unit tests from external systems
jest.mock("@/src/services/apiService");
jest.mock("@/src/shared/asyncStorageUtils");

const mockedPostRequest = apiService.postRequest as jest.Mock;

describe("Test authRepo", () => {
  // Reset mocks before each test to avoid test pollution
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("/auth/register endpoint", () => {
    /**
     * Purpose: Ensure register() calls postRequest with correct payload
     *          and stores the token and user data to async storage.
     *
     * Expected Outcome:
     * - postRequest() called with correct credentials
     * - saveToStorage() stores token and user data
     *
     * Assumptions:
     * - postRequest() returns an object with token and payload
     * - saveToStorage() is properly mocked
     */
    it("calls postRequest and saves token and user", async () => {
      const mockResponse = {
        token: "mock-token",
        payload: { id: 1, name: "Test User", email: "test@example.com" },
      };

      mockedPostRequest.mockResolvedValue(mockResponse);

      const saveTokenSpy = jest.spyOn(storageUtils, "saveToStorage");

      await register("Test User", "test@example.com", "password123");

      expect(mockedPostRequest).toHaveBeenCalledWith(
        "/auth/register",
        { name: "Test User", email: "test@example.com", password: "password123" },
        true
      );

      expect(saveTokenSpy).toHaveBeenCalledWith("token", "mock-token");
      expect(saveTokenSpy).toHaveBeenCalledWith("user", mockResponse.payload);
    });

    /**
     * Purpose: Ensure register() correctly throws the first error when postRequest fails.
     *
     * Expected Outcome:
     * - The function rejects with the first error object.
     *
     * Assumptions:
     * - postRequest() throws an array of error objects
     */
    it("throws first error if register fails", async () => {
      mockedPostRequest.mockRejectedValue([{ field: "authentication", message: "User tidak valid" }]);

      await expect(register("User", "email", "pass")).rejects.toEqual({
        field: "authentication",
        message: "User tidak valid",
      });
    });
  });

  describe("/auth/login endpoint", () => {
    /**
     * Purpose: Ensure login() calls postRequest with correct payload
     *          and stores the token and user data to async storage.
     *
     * Expected Outcome:
     * - postRequest() called with correct credentials
     * - saveToStorage() stores token and user data
     *
     * Assumptions:
     * - postRequest() returns an object with token and payload
     * - saveToStorage() is properly mocked
     */
    it("calls postRequest and saves token and user", async () => {
      const mockResponse = {
        token: "mock-token",
        payload: { id: 2, name: "Another User", email: "login@example.com" },
      };

      mockedPostRequest.mockResolvedValue(mockResponse);

      const saveTokenSpy = jest.spyOn(storageUtils, "saveToStorage");

      await login("login@example.com", "password456");

      expect(mockedPostRequest).toHaveBeenCalledWith(
        "/auth/login",
        { email: "login@example.com", password: "password456" },
        true
      );

      expect(saveTokenSpy).toHaveBeenCalledWith("token", "mock-token");
      expect(saveTokenSpy).toHaveBeenCalledWith("user", mockResponse.payload);
    });

    /**
     * Purpose: Ensure login() correctly throws the first error when postRequest fails.
     *
     * Expected Outcome:
     * - The function rejects with the first error object.
     *
     * Assumptions:
     * - postRequest() throws an array of error objects
     */
    it("throws first error if login fails", async () => {
      mockedPostRequest.mockRejectedValue([{ field: "authentication", message: "Invalid credentials" }]);

      await expect(login("fail@example.com", "wrongpass")).rejects.toEqual({
        field: "authentication",
        message: "Invalid credentials",
      });
    });
  });
});
