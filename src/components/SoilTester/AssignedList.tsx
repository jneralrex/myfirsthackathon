import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSoilTesterStore } from "../../store/soil-tester-store";
import { Activity, Droplets, Thermometer, Plus } from "lucide-react";
import DashboardLayout from "../Layout/DashboardLayout";
import CreateSoilTester from "./CreateSoilTester";
import Thumb from "../../assets/missing-data-vector-49849220-removebg-preview.png";
import farm from "../../assets/images/pexels-photo-259280.jpeg";
import farmer from "../../assets/images/pexels-photo-916406.jpeg";
import { Link } from "react-router-dom";

const AssignedList = () => {

  const base_url = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soilTesters, setSoilTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSoilTesters = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem('SOIL_TESTER') || '{}');
      const response = await axios.get(`${base_url}/agent/request/assigned`, {
        headers: {
          "Authorization": `Bearer ${storedUser.token}`,
        },
      });
      setSoilTesters(response.data.data);
    } catch (err) {
      console.error('Error response:', err.response); 
      setError("Failed to load soil testers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const encodeId = (id) => {
    return btoa(id); 
  };

  useEffect(() => {
    fetchSoilTesters();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800"; 
      case "assigned":
        return "bg-gray-200 text-gray-800"; 
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800"; 
      case "cancelled":
        return "bg-red-100 text-red-800"; 
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {soilTesters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soilTesters.map((tester) => (
              <div key={tester._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col gap-3">
                  <img src={farm} alt="farm image" className="object-cover rounded-md" />
                  <div className="absolute h-16 w-16 rounded-full border border-gray-500 overflow-hidden">
                    <img
                      src={farmer}
                      alt="Farmer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-2xl text-gray-500 font-semibold">
                    {`${tester.farmer.profile.firstName} ${tester.farmer.profile.lastName}`}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-gray-400 text-[16px]">
                      <div>Lat: {tester.land.location.coordinates.latitude}</div>
                      <div>Lon: {tester.land.location.coordinates.longitude}</div>
                    </div>
                    <div className="text-gray-400 text-[16px] line-clamp-1">
                      Location: {tester.land.location.address}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                  <div className="text-gray-400 text-[16px] line-clamp-1">
                      State: {tester?.land?.location?.state || 'N/A'}
                    </div>
                    <div className="text-gray-400 text-[16px]">
                      <div>LGA: {tester?.land?.location?.lga || 'N/A'}</div>
                      <div>ward: {tester?.land?.location?.ward || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-1xl font-semibold text-gray-500">
                    <div>
                      Land size: {tester.land.totalArea.value}{" "}
                      <span className="text-[12px] ml-[-3px]">
                        {tester.land.totalArea.unit}
                      </span>
                    </div>
                    <div>
                      Status:{" "}
                      <span
                        className={`p-1 rounded-xl text-xs ${getStatusColor(
                          tester.status
                        )}`}
                      >
                        {tester.status}
                      </span>
                    </div>
                  </div>
                  <div className="line-clamp-2 text-[13px] font-thin font-gray-500">
                    Additional Note: {tester.additionalNotes}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                  <Link to={`/single/test-request/${encodeId(tester._id)}`}>
                    <button className="border border-1 p-1 rounded-lg text-sm text-gray-500 hover:bg-blue-400 hover:text-white">
                      View More
                    </button>
                  </Link>
                  <p className="text-xs text-gray-500">
                    Request Date:{" "}
                    {new Date(tester.requestDate).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notfound relative h-screen">
            <img
              src={Thumb}
              alt=""
              className="w-44 absolute top-1/4 left-1/2 transform -translate-x-1/2"
            />
            <span>No tester data </span>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-6">
                Add New Soil Tester
              </h2>
              <CreateSoilTester onClose={() => setIsModalOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssignedList;
