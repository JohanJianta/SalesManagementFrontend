interface AuthResponse {
  token: string;
  payload: User;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

enum UserRole {
  admin,
  manager,
  sales,
}
