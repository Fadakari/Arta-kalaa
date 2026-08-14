import { cookies } from "next/headers";
import api from "./api";

export async function GetUserDashboard() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("access_token")?.value;

    console.log("SERVER TOKEN:", accessToken);

    if (!accessToken) {
      console.log("NO TOKEN");
      return null;
    }

    const response = await api.get("/users/dashboard/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;

  } catch (error: any) {
    console.log(
      "Dashboard Error:",
      error?.response?.data || error.message
    );

    return null;
  }
}