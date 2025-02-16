"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios"; // ✅ Import axios for API request

interface Post {
  id: string;
  user: string;
  avatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  donations: number;
}

interface FeedPostProps {
  post: Post;
}

export function FeedPost({ post }: FeedPostProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKeyPath, setPrivateKeyPath] = useState("");
  const [keyId, setKeyId] = useState("");
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Disable button while processing

  // ✅ Handle Donation API Call
  const handleDonate = async () => {

    const WALLET_ADDRESS = "https://ilp.interledger-test.dev/hackomania";
    const PRIVATE_KEY_PATH =  "./config/private1.key";
    const KEY_ID =  "3c7b5ba0-f3d1-47de-be80-b0e9c7ed3a65";
    const RECEIPIENT_UID =  "KMK5wh9SqXPWz2EhE7zv5AKpbD73";


    if (!WALLET_ADDRESS || !PRIVATE_KEY_PATH || !KEY_ID || !donationAmount) {
      alert("Please fill in all required fields before donating.");
      return;
    }

    setIsProcessing(true); // ✅ Disable button while processing

    // const payload = {
    //   WALLET_ADDRESS: walletAddress,
    //   PRIVATE_KEY_PATH: privateKeyPath,
    //   KEY_ID: keyId,
    //   PAYMENTID: `donation-${Date.now()}`, // ✅ Unique Payment ID
    



    // console.log("🔹 Sending Outgoing Donation Request:", payload);

    try {
      const response = await axios.post(
        "http://localhost:5600/api/userCreateOutGoingDonation",
        {
          WALLET_ADDRESS: WALLET_ADDRESS,
          PRIVATE_KEY_PATH: PRIVATE_KEY_PATH,
          KEY_ID: KEY_ID,
          RECEIPIENT_UID: RECEIPIENT_UID
        }
      );

      // console.log("✅ Donation Successful:", response.data);
      // alert("Donation successfully processed!");

      window.location.href = response.data.interactionUrl;
      // ✅ Reset fields and close modal after success
      setDonationSuccess(true);
      setTimeout(() => {
        setDonationSuccess(false);
        setIsOpen(false);
        setDonationAmount("");
        setWalletAddress("");
        setPrivateKeyPath("");
        setKeyId("");
      }, 2000);
    } catch (error: any) {
      console.error("❌ Error Processing Donation:", error);
      alert(`Failed to process donation. ${error.response?.data?.error || "Try again later."}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
      <div className="p-4 flex items-center">
        <Image
          src={post.avatar || "/placeholder.svg"}
          alt={post.user}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <Link href={`/user/${post.user}`} className="font-semibold hover:underline">
          {post.user}
        </Link>
      </div>
      <Image
        src={post.image || "/placeholder.svg"}
        alt="Post image"
        width={400}
        height={400}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <p className="mb-4">{post.caption}</p>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-5 h-5 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-5 h-5 mr-1" />
              {post.comments}
            </Button>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <DollarSign className="w-5 h-5 mr-1" />
                Donate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make a Donation</DialogTitle>
              </DialogHeader>
              {!donationSuccess ? (
                <>
                  <Input
                    type="number"
                    placeholder="Enter amount (SGD)"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="mb-4"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="mb-4"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your private key path"
                    value={privateKeyPath}
                    onChange={(e) => setPrivateKeyPath(e.target.value)}
                    className="mb-4"
                  />
                  <Input
                    type="text"
                    placeholder="Enter your key ID"
                    value={keyId}
                    onChange={(e) => setKeyId(e.target.value)}
                    className="mb-4"
                  />
                  <Button onClick={handleDonate} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Donate"}
                  </Button>
                </>
              ) : (
                <div className="text-center text-green-600 font-bold">
                  Donation Success!
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm text-gray-500">
          Donations encourage less screen time and support digital well-being initiatives.
        </div>
      </div>
    </div>
  );
}
