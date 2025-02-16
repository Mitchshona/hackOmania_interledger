"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/app/config/firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { VerifyImageModal } from "./profile/VerifyImageModal";
import axios from "axios";

interface Record {
  id: string;
  username: string;
  imageUrl: string;
  screenTime: string;
  timestamp: any;
}

export default function UserPosts() {
  const { username } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Added missing state

  // ✅ Fetch records from Firestore
  const fetchRecords = async () => {
    if (!username) return;

    setLoading(true);
    try {
      const recordsRef = collection(db, "records");
      const q = query(recordsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      const fetchedRecords: Record[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Record[];

      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [username]);

  // ✅ Refresh records after uploading a new post
  const handlePostUploaded = async () => {
    console.log("✅ Post uploaded! Refreshing records...");
    await fetchRecords();
  };

  // ✅ Check authentication state
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    setIsAuthenticated(!!currentUser);
  }, []);

  // ✅ Accept Donation Request
  const handleAcceptDonation = async () => {
    // ✅ Define required parameters
    const WALLET_ADDRESS = "https://ilp.interledger-test.dev/hackomania2";
    const PRIVATE_KEY_PATH = "/Applications/MAMP/htdocs/hackomania/hackOmania_interledger/frontend/src/components/private2.key";
    const KEY_ID = "1bb21fae-8fcb-4fd6-905f-97c8f0c764ae";
    const AMOUNT = 10; // ❗ Replace with actual donation amount
    const USER_ID = "KMK5wh9SqXPWz2EhE7zv5AKpbD73";
    console.log(PRIVATE_KEY_PATH);

    if (!WALLET_ADDRESS || !PRIVATE_KEY_PATH || !KEY_ID || !AMOUNT) {
      alert("Please provide all required details before accepting the donation.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post("http://localhost:5600/api/userCreateInComingDonation", {
        WALLET_ADDRESS: WALLET_ADDRESS,
        PRIVATE_KEY_PATH: PRIVATE_KEY_PATH,
        KEY_ID: KEY_ID,
        AMOUNT: AMOUNT,
        USER_ID: USER_ID
      });

      console.log("✅ Donation Accepted:", response.data);
      alert("Donation accepted successfully!");

      // ✅ Handle success (update UI if necessary)
    } catch (error: any) {
      console.error("❌ Error Accepting Donation:", error);
      alert(`Failed to accept donation. ${error.response?.data?.error || "Try again later."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div className="w-full h-[200px] bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{username}'s Records</h2>
        {/* Show buttons only if user is authenticated */}
        {isAuthenticated && (
          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Verify Image
            </button>
            <button
              onClick={handleAcceptDonation}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Accept Donation"}
            </button>
          </div>
        )}
      </div>

      {records.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {records.map((record) => (
            <div key={record.id} className="bg-white shadow-md rounded-lg p-6">
              <img
                src={record.imageUrl}
                alt="Uploaded Record"
                className="w-full h-80 object-contain rounded-md mb-4"
              />
              <p className="text-gray-800">Screen Time: {record.screenTime}</p>
              <p className="text-gray-500 text-sm">
                {new Date(record.timestamp.toDate()).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No records found.</p>
      )}

      {/* Modal Component */}
      <VerifyImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostUploaded={handlePostUploaded}
      />
    </div>
  );
}
