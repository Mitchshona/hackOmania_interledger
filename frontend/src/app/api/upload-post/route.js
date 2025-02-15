import { db, storage } from "@/app/config/firebase-config";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const caption = formData.get("caption");
    const avatarUrl = formData.get("avatar"); // ✅ Retrieve avatar URL


    if (!file) {
      return new Response(JSON.stringify({ success: false, message: "No image uploaded" }), { status: 400 });
    }

    // ✅ Retrieve user ID from request headers (sent from frontend)
    const userId = req.headers.get("user-id");
    
    if (!userId) {
      return new Response(JSON.stringify({ success: false, message: "User not authenticated" }), { status: 401 });
    }

    // ✅ Fetch user details from Firestore using the user ID
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return new Response(JSON.stringify({ success: false, message: "User data not found" }), { status: 404 });
    }

    const userData = userDocSnap.data();

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;

    // ✅ Upload image to Firebase Storage
    const storageRef = ref(storage, `posts/${filename}`);
    await uploadBytes(storageRef, buffer);

    // ✅ Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    // ✅ Save post metadata to Firestore
    const docRef = await addDoc(collection(db, "posts"), {
      userId: userData.id,  // ✅ Retrieved from Firestore
      user: userData.userName, // ✅ Retrieved from Firestore
      avatar: avatarUrl || userData.avatar, // ✅ Store avatar from request or Firestore
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
      user: userData.userName,  // ✅ Returning updated user data
      avatar: userData.avatar,
      caption,
      likes: 0,
      comments: 0,
      donations: 0
    }), {
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
