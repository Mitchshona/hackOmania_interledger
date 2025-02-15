import { db, storage } from "@/app/config/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const caption = formData.get("caption");

    if (!file) {
      return new Response(JSON.stringify({ success: false, message: "No image uploaded" }), {
        status: 400,
      });
    }

    // Simulated user data (in a real case, retrieve from authentication)
    const userId = "testUser123"; // Replace with actual authenticated user ID
    const userName = "John Doe"; // Replace with authenticated user's name
    const avatarUrl = "/placeholder.svg?height=40&width=40"; // Replace with actual profile image if available

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `posts/${filename}`);
    await uploadBytes(storageRef, buffer);

    // Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    // Save post metadata to Firestore
    const docRef = await addDoc(collection(db, "posts"), {
      user: userName, // User's display name
      userId: userId, // User ID from auth
      avatar: avatarUrl, // User's avatar URL
      image: imageUrl, // Uploaded image URL
      caption: caption || "", // Caption text
      likes: 0, // Default likes count
      comments: 0, // Default comments count
      donations: 0, // Default donations count
      createdAt: new Date(), // Timestamp for sorting
    });

    return new Response(JSON.stringify({ 
      success: true, 
      postId: docRef.id, 
      imageUrl,
      user: userName,
      avatar: avatarUrl,
      caption,
      likes: 0,
      comments: 0,
      donations: 0
    }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
    });
  }
}
