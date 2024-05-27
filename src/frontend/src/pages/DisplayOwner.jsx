import { useEffect, useState } from "react";
import axios from "axios";

const DisplayOwner = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchAllOwners = async () => {
      try {
        const result = await axios.get("http://localhost:8800/owner");
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllOwners();
  }, []);
  return <div>DisplayOwner</div>;
};
export default DisplayOwner;
