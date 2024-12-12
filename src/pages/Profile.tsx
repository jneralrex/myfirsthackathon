import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";

const Profile = () => {
  const storedData = JSON.parse(localStorage.getItem("SOIL_TESTER") || "{}");
  const user = storedData?.user;
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-gray-700">User Profile</h1>
        <div className="mt-4">
          <p>
            <strong>Name:</strong>{" "}
            {`${user?.profile?.firstName || ""} ${
              user?.profile?.middleName || ""
            } ${user?.profile?.lastName || ""}`}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Address:</strong> {user?.profile?.address || "N/A"}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
