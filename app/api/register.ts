import { BASE_URL } from '@/lib/constants'

export interface RegisterData {
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  email: string;
  phone_number: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
  };
}

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
		console.log(errorData);
    throw new Error(errorData || "Registration failed");
  }

  return response.json();
}