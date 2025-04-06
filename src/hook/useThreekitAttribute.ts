// hooks/useThreekitAttribute.js
import { useEffect, useState } from "react";
import { ThreekitService } from "../services/ThreekitService";

export const useThreekitAttribute = (optionName) => {
  const [attribute, setAttribute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAttribute = async () => {
      try {
        const attr = await ThreekitService.getAttribute(optionName);
        setAttribute(attr);
      } catch (err) {
        setError(err);
        console.error("Помилка при отриманні атрибуту:", err);
      } finally {
        setLoading(false);
      }
    };
    initAttribute();
  }, [optionName]);

  return { attribute, loading, error };
};
