import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as productRepo from "@/src/repositories/productRepo";
import DetailPropertyScreen from "@/app/DetailPropertyScreen";
import { Alert, Linking } from "react-native";
import { router } from "expo-router";
import React from "react";

// Mock the productRepo module
jest.mock("@/src/repositories/productRepo");

// Mock expo-router hooks and router to prevent missing implementation errors
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({
    productId: "1",
    propertyName: "Rumah Type 45",
  }),
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
  router: {
    push: jest.fn(),
  },
}));

// Spy on Linking to prevent opening the browser
jest.spyOn(Linking, "openURL").mockImplementation(jest.fn());

// Sample mocked response from productRepo.getProductById()
const mockDetailProduct: DetailProduct = {
  id: 1,
  name: "Rumah Type 45",
  default_price: 1_000_000_000,
  corner_price: 1_500_000_000,
  product_images: ["https://via.placeholder.com/300x200.png?text=Image1"],
  product_features: [
    { name: "Tanah", total: "90" },
    { name: "Bangunan", total: "45" },
    { name: "Kamar Tidur", total: "2" },
  ],
  product_specifications: [
    { name: "Pondasi", detail: "Cakar ayam" },
    { name: "Atap", detail: "Genteng beton" },
  ],
  product_units: [
    { id: 1, name: "A-01", type: "standard" },
    { id: 2, name: "A-02", type: "corner" },
  ],
  cluster_ref: {
    id: 1,
    name: "Cluster A",
    brochure_url: "https://example.com/brochure.pdf",
    promotions: [
      {
        id: 1,
        title: "Diskon Biaya KPR 10%",
        created_at: new Date(),
        thumbnail_url: "",
      },
    ],
  },
};

describe("<DetailPropertyScreen />", () => {
  // Make sure every test starts with a clean slate
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Purpose: Verify that a spinner is rendered while data is still in‑flight.
   *
   * Expected outcome:
   * - <ActivityIndicator testID="activity-indicator" /> is present in the tree.
   *
   * Assumptions:
   * - getProductById never resolves (Promise pending) so the component remains in its loading state.
   */
  it("shows a loading indicator while fetching detail product", async () => {
    jest.spyOn(productRepo, "getProductById").mockImplementation(() => new Promise(() => {}));

    const { findByTestId } = render(<DetailPropertyScreen />);
    expect(await findByTestId("activity-indicator")).toBeTruthy();
  });

  /**
   * Purpose: Confirm main UI elements render after a successful fetch.
   *
   * Expected outcome:
   * - Image carousel, feature chips, price texts, and unit list appear with correct values.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("renders product data after successfully fetch detail product", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId, findByText } = render(<DetailPropertyScreen />);

    // Image carousel rendered
    expect(await findByTestId("image-carousel")).toBeTruthy();

    // Main features rendered
    expect(findByText("Tanah")).toBeTruthy();
    expect(findByText("Bangunan")).toBeTruthy();

    // Prices rendered
    expect(findByText("Rp 1.000.000.000 [Standar]")).toBeTruthy();
    expect(findByText("Rp 1.500.000.000 [Sudut]")).toBeTruthy();

    // Units list rendered
    expect(findByText("•  A-01 [Standar]")).toBeTruthy();
    expect(findByText("•  A-02 [Sudut]")).toBeTruthy();
  });

  /**
   * Purpose: Ensure the screen surfaces API errors to the user via an Alert.
   *
   * Expected outcome:
   * - Alert.alert("Error", "Fetch error") gets called.
   *
   * Assumptions:
   * - getProductById rejects with an error object having a message property.
   */
  it("shows error alert when fetching detail product fails", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    jest.spyOn(productRepo, "getProductById").mockRejectedValue({ message: "Fetch error" });

    render(<DetailPropertyScreen />);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Error", "Fetch error");
    });
  });

  /**
   * Purpose: Validate the accordion toggling for the *Spesifikasi* section.
   *
   * Expected outcome:
   * - Spec text hidden by default, shown after first press, hidden again after second press.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("expands and collapses the Spesifikasi section", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId, queryByText } = render(<DetailPropertyScreen />);
    const toggle = await findByTestId("toggle-button");

    // Initially collapsed – spec text absent
    expect(queryByText("Atap: Genteng beton")).toBeNull();

    // Expand
    fireEvent.press(toggle);
    expect(queryByText("Atap: Genteng beton")).toBeTruthy();

    // Collapse
    fireEvent.press(toggle);
    expect(queryByText("Atap: Genteng beton")).toBeNull();
  });

  /**
   * Purpose: Check that tapping the E‑Brosur button opens the brochure URL.
   *
   * Expected outcome:
   * - Linking.openURL is invoked with the brochure URL.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("opens brochure link when the brochure button is pressed", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId } = render(<DetailPropertyScreen />);
    fireEvent.press(await findByTestId("brochure-button"));

    expect(Linking.openURL).toHaveBeenCalledWith(mockDetailProduct.cluster_ref.brochure_url);
  });

  /**
   * Purpose: Verify promo modal visibility toggles correctly via its open/close controls.
   *
   * Expected outcome:
   * - Modal appears after tapping *Cek Promo* and disappears after tapping the close icon.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("opens and closes the promo modal", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId, queryByTestId } = render(<DetailPropertyScreen />);

    // Initially not visible
    expect(queryByTestId("promo-modal")).toBeNull();

    // Open modal
    fireEvent.press(await findByTestId("open-modal"));
    expect(await findByTestId("promo-modal")).toBeTruthy();

    // Close modal
    fireEvent.press(await findByTestId("close-modal"));
    expect(queryByTestId("promo-modal")).toBeNull();
  });

  /**
   * Purpose: Ensure *Lihat Detail* inside the promo modal navigates to PromoDetail with correct params.
   *
   * Expected outcome:
   * - router.push is called with pathname "/PromoDetail" and promoId param.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("navigates to PromoDetail when the promo detail button is pressed", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId } = render(<DetailPropertyScreen />);

    fireEvent.press(await findByTestId("open-modal"));
    fireEvent.press(await findByTestId("promo-button"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/PromoDetailScreen",
      params: { promoId: mockDetailProduct.cluster_ref.promotions[0].id },
    });
  });

  /**
   * Purpose: Validate navigation to the KPR calculator screen with correct price params.
   *
   * Expected outcome:
   * - router.push called with pathname "/KalkulatorKPR" and price params.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("navigates to KalkulatorKPR when the kpr button is pressed", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId } = render(<DetailPropertyScreen />);
    fireEvent.press(await findByTestId("kpr-button"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/KalkulatorKPRScreen",
      params: { defaultPrice: mockDetailProduct.default_price, cornerPrice: mockDetailProduct.corner_price },
    });
  });

  /**
   * Purpose: Verify navigation to the booking screen passes the correct identifiers.
   *
   * Expected outcome:
   * - router.push called with pathname "/AddBookingScreen" and clusterId/productId params.
   *
   * Assumptions:
   * - getProductById resolves with mockDetailProduct.
   */
  it("navigates to AddBookingScreen when the booking button is pressed", async () => {
    jest.spyOn(productRepo, "getProductById").mockResolvedValue(mockDetailProduct);

    const { findByTestId } = render(<DetailPropertyScreen />);
    fireEvent.press(await findByTestId("navigation-button"));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/AddBookingScreen",
      params: { clusterId: mockDetailProduct.cluster_ref.id, productId: mockDetailProduct.id },
    });
  });
});
