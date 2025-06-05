import { fireEvent, render, waitFor, within } from "@testing-library/react-native";
import * as clusterRepo from "@/src/repositories/clusterRepo";
import MapScreen from "@/app/MapScreen";
import { Alert } from "react-native";
import { router } from "expo-router";

// Mock the clusterRepo module to isolate network logic from UI rendering
jest.mock("@/src/repositories/clusterRepo");

// Sample mocked response from clusterRepo.getClusters()
const mockClusterResponse = {
  masterplan_url: "http://masterplan.jpg",
  clusters: [
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

describe("Test MapScreen", () => {
  // Reset all mock function calls and state before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading indicator while fetching clusters", async () => {
    /**
     * Purpose: Verify that a loading spinner appears while data is being fetched.
     * Expected Outcome: An activity indicator with testID `activity-indicator` is rendered.
     * Assumptions: The fetch is intentionally stalled using a never-resolving Promise.
     */
    jest.spyOn(clusterRepo, "getClusters").mockImplementation(() => new Promise(() => {}));

    const { getByTestId } = render(<MapScreen />);
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders masterplan and hotspots after successful fetch", async () => {
    /**
     * Purpose: Ensure that the masterplan image and hotspots are rendered after a successful fetch.
     * Expected Outcome: Components with testIDs `masterplan-svg` and `hotspot-button` should be found.
     * Assumptions: `getClusters()` resolves with valid cluster data including hotspot coordinates.
     */
    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue(mockClusterResponse);

    const { findByTestId } = render(<MapScreen />);
    expect(await findByTestId("masterplan-svg")).toBeTruthy();
    expect(await findByTestId("hotspot-button")).toBeTruthy();
  });

  it("shows error alert when fetching clusters fails", async () => {
    /**
     * Purpose: Confirm that an error message is shown when cluster fetch fails.
     * Expected Outcome: `Alert.alert()` is called with "Error" and the error message.
     * Assumptions: `getClusters()` rejects with an error object containing a `message` field.
     */
    const alertSpy = jest.spyOn(Alert, "alert");
    jest.spyOn(clusterRepo, "getClusters").mockRejectedValue({ message: "Fetch error" });

    render(<MapScreen />);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Fetch error");
    });
  });

  it("opens modal with cluster info on hotspot press", async () => {
    /**
     * Purpose: Ensure that pressing a hotspot displays the modal with correct cluster information.
     * Expected Outcome: Modal shows name, category, address, and available units of the cluster.
     * Assumptions: The modal is conditionally rendered and is shown only after hotspot is pressed.
     */
    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue(mockClusterResponse);

    const { findByTestId } = render(<MapScreen />);
    const hotspot = await findByTestId("hotspot-button");
    fireEvent.press(hotspot);

    const modal = await findByTestId("cluster-modal");
    const modalScope = within(modal);

    expect(modalScope.getByText("Cluster A")).toBeTruthy();
    expect(modalScope.getByText("Kategori: Residensial")).toBeTruthy();
    expect(modalScope.getByText("Alamat: Address A")).toBeTruthy();
    expect(modalScope.getByText("Unit Tersedia: 5")).toBeTruthy();
  });

  it("navigates to ClusterScreen with correct params on navigation button press", async () => {
    /**
     * Purpose: Check that tapping the navigation button routes to ClusterScreen with correct params.
     * Expected Outcome: `router.push()` is called with `clusterId` and `clusterName`.
     * Assumptions: The navigation button is inside the modal, and tapping it triggers a route push.
     */
    jest.spyOn(clusterRepo, "getClusters").mockResolvedValue(mockClusterResponse);

    const pushSpy = jest.spyOn(router, "push");
    const { findByTestId } = render(<MapScreen />);
    const hotspot = await findByTestId("hotspot-button");
    fireEvent.press(hotspot);

    const navigationButton = await findByTestId("navigation-button");
    fireEvent.press(navigationButton);

    expect(pushSpy).toHaveBeenCalledWith({
      pathname: "/ClusterScreen",
      params: { clusterId: 1, clusterName: "Cluster A" },
    });
  });
});
