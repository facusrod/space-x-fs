import axios from "utils/axios";

export const login = async () => {
  const { data } = await axios.post("/admin/token", {
    // Mock user ID for demo purposes
    userId: 1
  });

  return data.token as string;
};
