"use client";

import { useState } from "react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  reward: number;
}

const activities: Challenge[] = [
  {
    id: 1,
    title: "Join a Community Cleanup",
    description: "Help clean up your local park or beach. Improve your environment and mental well-being while earning rewards!",
    reward: 2,
  },
  {
    id: 2,
    title: "Attend a Local Fitness Class",
    description: "Join a local fitness class such as yoga, pilates, or HIIT to boost your physical and mental health.",
    reward: 1,
  },
  {
    id: 3,
    title: "Volunteer at a Charity Event",
    description: "Volunteer at a local charity event. Helping others is a great way to improve mental health and earn rewards!",
    reward: 3,
  },
  {
    id: 4,
    title: "Attend a Mental Health Workshop",
    description: "Join a mental health awareness workshop to learn about managing stress, anxiety, and improving overall well-being.",
    reward: 2.5,
  },
  {
    id: 5,
    title: "Participate in a Charity Run",
    description: "Sign up for a charity run. Run for a cause and improve both your physical and mental well-being while earning rewards.",
    reward: 1.5,
  },
];

export default function ChallengePage() {
  const handleJoin = (id: number) => {
    // Here you can add any logic to handle what happens when a user joins an activity.
    console.log(`User joined activity with ID: ${id}. Activity completed!`);
  };

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
            key={activity.id}
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{activity.title}</h2>
            <p className="text-gray-600 mb-4">{activity.description}</p>
            <p className="text-lg font-semibold text-green-500 mb-4">Reward: ${activity.reward}</p>

            <button
              onClick={() => handleJoin(activity.id)}
              className="w-full py-2 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
