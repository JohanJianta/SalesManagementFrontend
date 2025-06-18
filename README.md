# Sales Property Management (Frontend)

A React Native Expo application to support sales executives in managing and booking property units at the Centre Point of Indonesia (CPI). This app simplifies the sales process by enabling agents to view available property clusters, unit specifications, and current promotions, as well as submit client bookings directly from their mobile device.

## Landing Page

You can visit the public landing page of this application [here](http://ec2-18-139-110-33.ap-southeast-1.compute.amazonaws.com/).

## Features

- User authentication (login & register)
- View property clusters, products, and available units
- Interactive map with zoom & pan features
- Booking form with cascading dropdowns
- Promotion listings
- Mortgage calculator
- Integration with [backend REST API](https://github.com/JohanJianta/SalesManagementBackend)
- Designed for Android devices

## Getting Started

### Prerequisites

- Node.js (recommended: v18 or higher)
- Expo CLI  
  Install globally if not already installed:
  ```bash
  npm install -g expo-cli
  ```

### Clone the repository

```bash
git clone https://github.com/JohanJianta/SalesManagementFrontend.git
cd SalesManagementFrontend
```

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npx expo start
```

Then use the Expo Go app on your Android device or an emulator to preview the app.

## Testing

You can check the testing documentation of this application [here](https://github.com/JohanJianta/SalesManagementFrontend/tree/master/__tests__).
