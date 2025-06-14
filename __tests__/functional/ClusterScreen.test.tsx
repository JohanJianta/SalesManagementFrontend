import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as clusterRepo from "@/src/repositories/clusterRepo";
import ClusterScreen from "@/app/ClusterScreen";
import { Alert, Image } from "react-native";
import { router } from "expo-router";
import React from "react";

// Mock the clusterRepo module
jest.mock("@/src/repositories/clusterRepo");

// Mock expo-router hooks and router to prevent missing implementation errors
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    clusterId: "1",
    clusterName: "Cluster A",
  }),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  router: {
    push: jest.fn(),
  },
}));

// Sample mocked response from clusterRepo.getClusterById()
const mockDetailCluster = {
  id: 1,
  name: "Cluster A",
  address: "Address A",
  category: "residential",
  is_apartment: false,
  map_url: "http://map.jpg",
  products: [
    {
      id: 1,
      name: "Product A",
      default_price: 1000000000,
      corner_price: 1500000000,
      thumbnail_url: "http://thumbnail.jpg",
      product_units: [
        {
          id: 1,
          name: "Unit A",
          type: "standard",
        },
      ],
      image_hotspots: [
        {
          shape: "rectangle" as const,
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
      ],
    },
  ],
};

describe("ClusterScreen", () => {
  // Make sure every test starts with a clean slate
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading indicator while fetching detail cluster", () => {
    /**
     * Purpose: Verify that a spinner is rendered while data is still in-flight.
     *
     * Expected outcome:
     * - <ActivityIndicator testID="activity-indicator" /> is present in the tree.
     *
     * Assumptions:
     * - getClusterById never resolves (Promise pending) so the component
     * - stays in its “loading” state.
     */
    jest.spyOn(clusterRepo, "getClusterById").mockImplementation(() => new Promise(() => {}));

    const { getByTestId } = render(<ClusterScreen />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders map, hotspots, and product cards after successfully fetch detail cluster", async () => {
    /**
     * Purpose: Ensure the UI shows the SVG map, a hotspot, and
     *          a product card once the data fetch succeeds.
     *
     * Expected outcome:
     * - testID "cluster-map-svg" is present
     * - testID "hotspot-button" is present
     * - Text "Product A" (from product card) is rendered
     *
     * Assumptions:
     * - getClusterById resolves with mockDetailCluster
     * - Image.getSize is mocked to bypass native image-sizing
     */
    jest.spyOn(clusterRepo, "getClusterById").mockResolvedValue(mockDetailCluster);
    jest.spyOn(Image, "getSize").mockImplementation((_url, success) => success(400, 700));

    const { findByTestId, findByText } = render(<ClusterScreen />);
    expect(await findByTestId("cluster-map-svg")).toBeTruthy();
    expect(await findByTestId("hotspot-button")).toBeTruthy();
    expect(await findByText("Product A")).toBeTruthy();
  });

  it("shows error alert when fetching detail cluster fails", async () => {
    /**
     * Purpose: Confirm that a user-visible error alert appears when the fetch rejects.
     *
     * Expected outcome:
     * - Alert.alert("Error", "Fetch error") is called exactly once.
     *
     * Assumptions:
     * - getClusterById rejects with { message: "Fetch error" }.
     */
    const alertSpy = jest.spyOn(Alert, "alert");
    jest.spyOn(clusterRepo, "getClusterById").mockRejectedValue({ message: "Fetch error" });

    render(<ClusterScreen />);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Fetch error");
    });
  });

  it("renders ScrollView fallback when map_url is null", async () => {
    /**
     * Purpose: The component should fall back to a plain ScrollView
     *          when no map image is provided.
     *
     * Expected outcome:
     * - map SVG (cluster-map-svg) is NOT rendered
     * - bottom-sheet scrollview (bottomsheet-scrollview) is NOT rendered
     * - fallback scrollview (default-scrollview) IS rendered
     *
     * Assumptions:
     * - Response is identical to mockDetailCluster except map_url=null.
     */
    const fallbackData = { ...mockDetailCluster, map_url: null };
    jest.spyOn(clusterRepo, "getClusterById").mockResolvedValue(fallbackData);

    const { queryByTestId, findByTestId } = render(<ClusterScreen />);
    expect(queryByTestId("cluster-map-svg")).toBeNull();
    expect(queryByTestId("bottomsheet-scrollview")).toBeNull();
    expect(await findByTestId("default-scrollview")).toBeTruthy();
  });

  it("expands and collapses product card on toggle button press", async () => {
    /**
     * Purpose: Ensure the dedicated toggle button switches the card
     *          between collapsed and expanded states.
     *
     * Expected outcome:
     * - After first press → expanded view (testID "expanded-image") exists,
     *     collapsed view (testID "collapsed-image") does not.
     * - After second press → the reverse is true.
     *
     * Assumptions:
     * - getClusterById resolves successfully
     * - Image.getSize mocked to bypass native call
     */
    jest.spyOn(clusterRepo, "getClusterById").mockResolvedValue(mockDetailCluster);
    jest.spyOn(Image, "getSize").mockImplementation((_url, success) => success(400, 700));

    const { queryByTestId, findByTestId } = render(<ClusterScreen />);
    const toggleButton = await findByTestId("toggle-button");

    // Expand
    fireEvent.press(toggleButton);
    expect(await findByTestId("expanded-image")).toBeTruthy();
    expect(queryByTestId("collapsed-image")).toBeNull();

    // Collapse
    fireEvent.press(toggleButton);
    expect(queryByTestId("expanded-image")).toBeNull();
    expect(await findByTestId("collapsed-image")).toBeTruthy();
  });

  it("expands and collapses product card on hotspot press", async () => {
    /**
     * Purpose: Verify that pressing the hotspot (instead of the toggle button)
     *          also expands/collapses the product card.
     *
     * Expected outcome:
     * - Same visual toggling as the previous test, triggered via hotspot.
     *
     * Assumptions:
     * - Mock data has one hotspot that maps to the first product
     * - Image.getSize mocked to bypass native call
     */
    jest.spyOn(clusterRepo, "getClusterById").mockResolvedValue(mockDetailCluster);
    jest.spyOn(Image, "getSize").mockImplementation((_url, success) => success(400, 700));

    const { queryByTestId, findByTestId } = render(<ClusterScreen />);
    const hotspotButton = await findByTestId("hotspot-button");

    // Expand
    fireEvent.press(hotspotButton);
    expect(await findByTestId("expanded-image")).toBeTruthy();
    expect(queryByTestId("collapsed-image")).toBeNull();

    // Collapse
    fireEvent.press(hotspotButton);
    expect(queryByTestId("expanded-image")).toBeNull();
    expect(await findByTestId("collapsed-image")).toBeTruthy();
  });

  it("navigates to DetailProperty when product card is pressed", async () => {
    /**
     * Purpose: Check that tapping the card’s navigation button triggers a route change
     *          to DetailProperty with the correct parameters.
     *
     * Expected outcome:
     * - `router.push()` is called with `productId` and `propertyName`.
     *
     * Assumptions:
     * - router.push is spied on via the expo-router mock
     */
    const pushSpy = jest.spyOn(router, "push");

    jest.spyOn(clusterRepo, "getClusterById").mockResolvedValue(mockDetailCluster);
    jest.spyOn(Image, "getSize").mockImplementation((_url, success) => success(400, 700));

    const { findByTestId } = render(<ClusterScreen />);
    const navigationButton = await findByTestId("navigation-button");
    fireEvent.press(navigationButton);

    expect(pushSpy).toHaveBeenCalledWith({
      pathname: "/DetailPropertyScreen",
      params: { productId: 1, propertyName: "Cluster A - Product A" },
    });
  });
});
