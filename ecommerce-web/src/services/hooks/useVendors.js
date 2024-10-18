import { useState, useEffect } from "react";
import axios from "axios";

const useVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [count , setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("api/User/vendors", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const vendorList = response.data.data.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          email: vendor.email,
          phoneNumber: vendor.phoneNumber,
          address: vendor.address,
          active: vendor.active,
        }));
        setVendors(vendorList);
        setCount(vendorList.length);
        
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendors, loading , count};
};

export default useVendors;
