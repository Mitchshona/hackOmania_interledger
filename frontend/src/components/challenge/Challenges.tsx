"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/config/firebase-config"; // Import your Firebase configuration file

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: "pending" | "completed";
}

export default function Challenges() {
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);

  // Fetch user-specific challenges from Firestore (userChallenges collection)
  useEffect(() => {
    const fetchUserChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userChallenges"));
        const challenges: Challenge[] = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Use Firestore's document ID as the unique identifier
          title: doc.data().title,
          description: doc.data().description,
          reward: doc.data().reward,
          status: doc.data().status || "pending", // Ensure `status` is included, default to 'pending'
        }));

        setUserChallenges(challenges); // Set user challenges state
      } catch (error) {
        console.error("Error fetching user challenges:", error);
      }
    };

    fetchUserChallenges();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Challenges</h2>
      
      <div className="space-y-4">
        {userChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 rounded-lg border border-gray-200 bg-gray-50 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-700">{challenge.title}</h3>
            <p className="text-gray-600 text-sm">{challenge.description}</p>
            <p className="text-green-600 font-semibold mt-2">Reward: ${challenge.reward}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                challenge.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
              }`}
            >
              {challenge.status === "pending" ? "Pending" : "Completed"}
            </span>
          </div>
        ))}
      </div>

      {/* You can add another section here if you want to display other user-specific challenges */}
      {/* Example, if you need another display for challenges that are 'pending' or 'completed' */}
      {/* <div className="mt-12"> */}
      {/*   <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Your Pending Challenges</h2> */}
      {/*   <div className="space-y-4"> */}
      {/*     {userChallenges.filter((challenge) => challenge.status === "pending").map((challenge) => ( */}
      {/*       <div key={challenge.id} className="bg-white p-6 rounded-xl shadow-md"> */}
      {/*         <h3 className="text-lg font-semibold text-gray-700">{challenge.title}</h3> */}
      {/*         <p className="text-gray-600">{challenge.description}</p> */}
      {/*         <p className="text-lg font-semibold text-green-500">Reward: ${challenge.reward}</p> */}
      {/*       </div> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </div> */}
    </div>
  );
}
