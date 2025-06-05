import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import MapScreen from "../../app/MapScreen";
import * as clusterRepo from "../../src/repositories/clusterRepo";

// Mock the clusterRepo module
jest.mock("../../src/repositories/clusterRepo");

// Optionally mock HotspotRenderer for simplicity
jest.mock("@/src/components/HotspotRenderer", () => {
  const { Text } = require("react-native");
  return ({ name, onPress }: any) => <Text onPress={onPress}>{name}</Text>;
});

describe("Test MapScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Purpose: Verify the loading indicator shows while data is being fetched
  // Expected Outcome: <ActivityIndicator> is rendered when `loading` is true
  // Prerequisites: Mocks should return a Promise that doesn't resolve immediately
  it("displays loading indicator while fetching clusters", async () => {
    jest.spyOn(clusterRepo, "getClusters").mockImplementation(() => new Promise(() => {}));

    const { getByTestId } = render(<MapScreen />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  // Purpose: Ensure clusters and masterplan image are rendered after data fetch
  // Expected Outcome: SVG image and Hotspot components should appear
  // Prerequisites: Mock API returns valid cluster data
  it("renders masterplan and hotspots after successful fetch", async () => {
    const mockClusters = [
      {
        id: 1,
        name: "Cluster A",
        address: "Address A",
        category: "residential",
        is_apartment: false,
        available_unit: 5,
        thumbnail_url: "http://thumbnail.jpg",
        image_hotspots: [
          {
            shape: "rectangle" as "rectangle", // WTF IS THIS??!! WHYY??!!
            x: 100,
            y: 100,
            width: 100,
            height: 100,
          },
        ],
      },
    ];

    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue({
      clusters: mockClusters,
      masterplan_url: "http://masterplan.jpg",
    });

    const { findByText } = render(<MapScreen />);
    expect(await findByText("Cluster A")).toBeTruthy();
  });

  // Purpose: Ensure error alert is shown when fetchClusters fails
  // Expected Outcome: Alert with error message is triggered
  // Prerequisites: getClusters rejects with an error
  it("shows error alert if fetching clusters fails", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    jest.spyOn(clusterRepo, "getClusters").mockRejectedValue(new Error("Fetch error"));

    render(<MapScreen />);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Fetch error");
    });
  });

  // Purpose: Ensure modal opens with correct cluster data when hotspot is pressed
  // Expected Outcome: Modal content appears with cluster details
  // Prerequisites: Mock cluster data with hotspots
  it("opens modal with cluster info on hotspot press", async () => {
    const mockClusters = [
      {
        id: 1,
        name: "Cluster B",
        address: "Address B",
        category: "commercial",
        is_apartment: false,
        available_unit: 10,
        thumbnail_url: "http://thumbnail.jpg",
        image_hotspots: [
          {
            shape: "rectangle" as "rectangle", // WTF IS THIS??!! WHYY??!!
            x: 100,
            y: 100,
            width: 100,
            height: 100,
          },
        ],
      },
    ];

    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue({
      clusters: mockClusters,
      masterplan_url: "http://test.image",
    });

    const { findByText, getByText } = render(<MapScreen />);
    const hotspot = await findByText("Cluster B");
    fireEvent.press(hotspot);

    expect(getByText("Cluster B")).toBeTruthy();
    expect(getByText("Kategori: Komersial")).toBeTruthy();
    expect(getByText("Alamat: Address B")).toBeTruthy();
    expect(getByText("Unit Tersedia: 10")).toBeTruthy();
  });

  // Purpose: Ensure navigation is triggered with correct params when button is pressed
  // Expected Outcome: router.push is called with cluster ID and name
  // Prerequisites: Modal must be open and cluster selected
  it("navigates to ClusterScreen with correct params", async () => {
    const mockClusters = [
      {
        id: 99,
        name: "Cluster Z",
        address: "Z Street",
        category: "residential",
        is_apartment: false,
        available_unit: 20,
        thumbnail_url: "http://thumbnail.jpg",
        image_hotspots: [
          {
            shape: "rectangle" as "rectangle", // WTF IS THIS??!! WHYY??!!
            x: 100,
            y: 100,
            width: 100,
            height: 100,
          },
        ],
      },
    ];

    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue({
      clusters: mockClusters,
      masterplan_url: "http://masterplan.jpg",
    });

    const pushSpy = jest.spyOn(router, "push");
    const { findByText } = render(<MapScreen />);
    const hotspot = await findByText("Cluster Z");
    fireEvent.press(hotspot);

    const navigateButton = await findByText("Lihat Daftar Produk");
    fireEvent.press(navigateButton);

    expect(pushSpy).toHaveBeenCalledWith({
      pathname: "/ClusterScreen",
      params: { clusterId: mockCluster.id, clusterName: mockCluster.name },
    });
  });
});
