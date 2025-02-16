"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/config/firebase-config"; // Adjust the path accordingly
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

interface Challenge {
  id: string; // Firestore IDs are strings
  title: string;
  description: string;
  reward: number;
}

export default function ChallengePage() {
  const [activities, setActivities] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [isProcessing, setIsProcessing] = useState<string | null>(null); // Track the challenge being processed

  // Fetch challenges from Firestore
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "challenges"));
        const challenges: Challenge[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Challenge[];

        setActivities(challenges); // Set activities state
      } catch (error) {
        console.error("Error fetching challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Fetch user-specific challenges from Firestore (userChallenges collection)
  useEffect(() => {
    const fetchUserChallenges = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userChallenges"));
        const challenges: Challenge[] = querySnapshot.docs.map((doc) => ({
          id: doc.data().challengeId,
          title: doc.data().title,
          description: doc.data().description,
          reward: doc.data().reward,
        }));

        setUserChallenges(challenges); // Set user challenges state
      } catch (error) {
        console.error("Error fetching user challenges:", error);
      }
    };

    fetchUserChallenges();
  }, []);

  // Handle joining a challenge
  const handleJoin = async (id: string, title: string, description: string, reward: number) => {
    try {
      setIsProcessing(id); // Set the challenge ID to indicate processing
      // Add the challenge to the userChallenges collection in Firestore
      await addDoc(collection(db, "userChallenges"), {
        challengeId: id,
        title,
        description,
        reward,
      });

      // Update local state to reflect the new challenge
      setUserChallenges((prevChallenges) => [
        ...prevChallenges,
        { id, title, description, reward },
      ]);

      console.log(`User joined challenge with ID: ${id}.`);
    } catch (error) {
      console.error("Error joining challenge:", error);
    } finally {
      setIsProcessing(null); // Reset the processing state
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-xl"
            >
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Join Offline Activities & Earn Rewards!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Participate in meaningful offline activities that contribute to your well-being and the community. Once you complete an activity, you will earn rewards!
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <div
            key={activity.id} // Ensure each child has a unique key
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{activity.title}</h2>
            <p className="text-gray-600 mb-4">{activity.description}</p>
            <p className="text-lg font-semibold text-green-500 mb-4">Reward: ${activity.reward}</p>

            {/* Button logic */}
            <button
              onClick={() =>
                handleJoin(activity.id, activity.title, activity.description, activity.reward)
              }
              className={`w-full py-2 rounded-md text-white font-semibold ${
                userChallenges.some((userChallenge) => userChallenge.id === activity.id) || isProcessing === activity.id
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-all duration-300`}
              disabled={userChallenges.some((userChallenge) => userChallenge.id === activity.id) || isProcessing === activity.id}
            >
              {isProcessing === activity.id ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 22c5.522 0 10-4.478 10-10S17.522 2 12 2 2 6.478 2 12s4.478 10 10 10z"
                    />
                  </svg>
                  Joining...
                </span>
              ) : userChallenges.some((userChallenge) => userChallenge.id === activity.id) ? (
                "Joined"
              ) : (
                "Join Now"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
