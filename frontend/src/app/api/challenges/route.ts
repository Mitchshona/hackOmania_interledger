import { NextResponse } from "next/server";
import { db } from "@/app/config/firebase-config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "challenges")); // ✅ Corrected
    const challenges = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(challenges);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}
