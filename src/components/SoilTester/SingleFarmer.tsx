import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To access route parameters

import DashboardLayout from "../Layout/DashboardLayout";
import farm from "../../assets/images/pexels-photo-259280.jpeg";
import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import axios from "axios";

const SingleFarmer = () => {
  const { id } = useParams(); // Get the encoded ID from the URL
  const decodedId = atob(id);
  const base_url = import.meta.env.VITE_API_URL;

  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAcc, setLoadingAcc] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    nitrogen: 0,
    potassium: 0,
    iron: 0,
    manganese: 0,
    boron: 0,
    copper: 0,
    zinc: 0,
    cec: 0,
    organicMatter: 0,
    cn: 0,
    texture: "",
    source: "",
  });
  const fetchFarmerData = async () => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("SOIL_TESTER") || "{}"
      );
      const response = await axios.get(
        `${base_url}/agent/test-request/${decodedId}`,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      setFarmerData(response.data.data);
    } catch (err) {
      console.error("Error fetching farmer data:", err.response || err);
      setError("Failed to fetch farmer data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFarmerData();
  }, [decodedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }; 


  console.log(decodedId);
  const handleUpdateStatus = async (e) => {
    const { name, value } = e.target;
    setStatus(value);
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("SOIL_TESTER") || "{}"
      );
      const res = await axios.patch(
        `${base_url}/agent/request/${decodedId}/${value}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      fetchFarmerData();
      console.log("result", res.data.data);
    } catch (err) {
      console.error("Error submitting result:", err.response || err);
      //setError("Failed to submit result.");
    }
  };

  const acceptRequest = async () => {
    setLoadingAcc(true)
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("SOIL_TESTER") || "{}"
      );
      const res = await axios.patch(
        `${base_url}/agent/request/${decodedId}/assigned`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      console.log("result", res.data.data);

      fetchFarmerData();
      alert("Request Accepted")
      
    } catch (err) {
      setLoadingAcc(false)
      console.error("Error submitting result:", err.response || err);
      //setError("Failed to submit result.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData, decodedId);

      const storedUser = JSON.parse(
        localStorage.getItem("SOIL_TESTER") || "{}"
      );
      const res = await axios.post(
        `${base_url}/agent/request/${decodedId}/result`,
        {result:formData},
        {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );
      console.log("result", res);
      // alert("Result submitted successfully!");
    } catch (err) {
      console.error("Error submitting result:", err.response || err);
      //setError("Failed to submit result.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  console.log("Data", formData);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Farmer Header */}
        <div
          className="h-64 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${farm})` }}
        ></div>

        {/* Profile Section */}
        <div className="relative mt-[-40px] flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <img
              src={farmer}
              alt="Farmer"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold mt-3">
            {farmerData?.farmer?.profile?.firstName}{" "}
            {farmerData?.farmer?.profile?.lastName}{" "}
            {farmerData?.farmer?.profile?.middleName}
          </h2>
          <p className="text-gray-500">
            Location: {farmerData?.land?.location?.address}
          </p>
        </div>

        {/* Farmer Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex justify-between items-center">
            <p>
              <strong>
                Land Size: {farmerData?.land?.totalArea?.value}{" "}
                {farmerData?.land?.totalArea?.unit}
              </strong>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-amber-600 px-2 py-1 rounded-lg bg-amber-100">
                {farmerData?.status}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Coordinates:</strong>
            </p>
            <p>
              Latitude: {farmerData?.land?.location?.coordinates?.latitude}°
            </p>
            <p>
              Longitude: {farmerData?.land?.location?.coordinates?.longitude}°
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p>
                <strong>Additional note:</strong>
              </p>
              <p>{farmerData?.additionalNotes}</p>
            </div>

            {farmerData?.status == "pending" ? (
              <button
                onClick={acceptRequest}
                className="bg-green-400 text-white p-1 rounded-md"
              >
                {loadingAcc? "Processing....":"Accept Request"}
              </button>
            ) : (
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm h-10"
                onChange={handleUpdateStatus}
              >
                <option value="" disabled>
                  Update Status
                </option>
 
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>
        </div>

<br />
<br />
        <hr />
        <h2 className="text-2xl font-semibold mt-3">Provide Test Result</h2>
        <small>Fill the result of the test to its assigned fields below</small>
    
        {/* Actions Section */}
       {farmerData?.status == "pending" ? <></>: <div className="mt-6 border-t pt-4">
          <div className="flex justify-between gap-20">
            <div>
              <form
                className="grid grid-col gap-10 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3"
                onSubmit={handleSubmit}
              >
                <label>
                  Nitrogen <br />
                  <input
                    type="number"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Potassium <br />
                  <input
                    type="number"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Iron <br />
                  <input
                    type="number"
                    name="iron"
                    value={formData.iron}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Manganese <br />
                  <input
                    type="number"
                    name="manganese"
                    value={formData.manganese}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Boron <br />
                  <input
                    type="number"
                    name="boron"
                    value={formData.boron}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Copper <br />
                  <input
                    type="number"
                    name="copper"
                    value={formData.copper}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Zinc <br />
                  <input
                    type="number"
                    name="zinc"
                    value={formData.zinc}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  CEC <br />
                  <input
                    type="number"
                    name="cec"
                    value={formData.cec}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Organic Matter <br />
                  <input
                    type="number"
                    name="organicMatter"
                    value={formData.organicMatter}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  C/N <br />
                  <input
                    type="text"
                    name="cn"
                    value={formData.cn}
                    onChange={handleChange}
                    placeholder="Component result"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Texture <br />
                  <input
                    type="text"
                    name="texture"
                    value={formData.texture}
                    onChange={handleChange}
                    placeholder="soil texture"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <label>
                  Source <br />
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="e.g FMAAFS"
                    className="outline-1 border-1 border-green-300 border p-1 rounded-md"
                  />
                </label>
                <button className="bg-green-600 text-white p-1 rounded-md">
                  Submit result
                </button>
              </form>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(formData.updatedAt).toLocaleDateString()}
          </p>
        </div>}
      </div>
    </DashboardLayout>
  );
};

export default SingleFarmer;
