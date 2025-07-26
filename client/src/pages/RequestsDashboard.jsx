import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api.js";

const API_BASE_URL = "http://localhost:5001/api";

const RequestsDashboard = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  const fetchRequests = async () => {
    if (!userInfo) {
      setLoading(false); 
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await api.get(`${API_BASE_URL}/requests/sent`, config); 
      const { data: receivedData } = await api.get(
        `${API_BASE_URL}/requests/received`,
        config
      );
      setSentRequests(sentData);
      setReceivedRequests(receivedData);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userInfo]); 
  const handleUpdateStatus = async (requestId, status) => {
    if (!userInfo) {
      alert("You must be logged in to update request status.");
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.put(`/api/requests/${requestId}`, { status }, config);

      await axios.put(`${API_BASE_URL}/requests/${requestId}`, { status }, config); 

      fetchRequests();
      alert("Request status updated successfully!"); 
    } catch (error) {
      console.error("Failed to update request status:", error);
      alert(error.response?.data?.message || "Failed to update status. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading requests...</p>;
  }


  if (!userInfo) {
    return (
      <p className="text-center mt-8 p-4 bg-yellow-100 text-yellow-800 rounded-md max-w-md mx-auto">
        Please <Link to="/login" className="font-semibold hover:underline">log in</Link> to view your requests.
      </p>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Requests Dashboard
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Requests for Your Items
          </h2>
          {receivedRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {receivedRequests.map((req) => (
                <li
                  key={req._id}
                  className="py-4 flex justify-between items-center"
                >
                  {req.item ? (
                    <div>
                      <p className="text-md">
                        <span className="font-bold">{req.requester.name}</span>{" "}
                        requested your{" "}
                        <Link
                          to={`/item/${req.item._id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {req.item.name}
                        </Link>
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          req.status === "Accepted"
                            ? "text-green-600"
                            : req.status === "Declined"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Status: {req.status}
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <p>A request was made for an item that is now deleted.</p>
                      <p
                        className={`text-sm font-bold ${
                          req.status === "Accepted"
                            ? "text-green-600"
                            : req.status === "Declined"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        Status: {req.status}
                      </p>
                    </div>
                  )}

                  {req.status === "Pending" && req.item && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(req._id, "Accepted")}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, "Declined")}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No one has requested your items yet.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Sent Requests</h2>
          {sentRequests.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {sentRequests.map((req) => (
                <li key={req._id} className="py-4">
                  {req.item ? (
                    <p className="text-md">
                      You requested{" "}
                      <Link
                        to={`/item/${req.item._id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {req.item.name}
                      </Link>{" "}
                      from <span className="font-bold">{req.owner.name}</span>
                    </p>
                  ) : (
                    <p className="text-md text-gray-500">
                      You requested an item that is no longer available.
                    </p>
                  )}
                  <p
                    className={`text-sm font-bold ${
                      req.status === "Accepted"
                        ? "text-green-600"
                        : req.status === "Declined"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    Status: {req.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You haven't requested any items.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsDashboard;
