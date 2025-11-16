import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This component just redirects to dashboard
    // The dashboard itself handles auth check
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
