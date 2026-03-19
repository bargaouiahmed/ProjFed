import { useState, useEffect } from "react";
import { api } from "./axios";

export default function useActivateStudentAccount({
  id,
  token,
}: {
  id: string;
  token: string;
}) {
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [data, setData] = useState<string>();

  useEffect(() => {
    if (!id || !token) return;

    const activateAccount = async () => {
      setStatus("pending");
      try {
        const response = await api.get("/student/auth/activate-account", {
          params: { token, id },
        });
        setData(response.data);
        setStatus("success");
      } catch (error) {
        console.error("Activation error:", error);
        setStatus("error");
      }
    };

    activateAccount();
  }, [id, token]);

  return { status, data };
}
