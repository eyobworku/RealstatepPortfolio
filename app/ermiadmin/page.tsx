"use client";
import { Post } from "@/models/post";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Sample data
interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  phone: string;
  date: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showDialog, setShowDialog] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    shortDescription: string;
    detailDescription: string;
  }>({
    title: "",
    shortDescription: "",
    detailDescription: "",
  });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/properties");
      const data = await res.json();
      setPosts(data);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    };

    fetchData();
  }, []);
  // Handle form inputs change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle cover image change
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setCoverImage(files[0]);
    }
  };

  // Handle additional images change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files).slice(0, 4);
      setAdditionalImages(filesArray);
    }
  };

  // Handle video change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setVideo(files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverImage || !formData.title || !formData.shortDescription) {
      alert(
        "Please fill in all required fields (cover image, title, short description)"
      );
      return;
    }
    setLoading(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append("coverImage", coverImage);
      additionalImages.forEach((image) => {
        formDataObj.append("additionalImages", image);
      });
      if (video) formDataObj.append("video", video);
      formDataObj.append("title", formData.title);
      formDataObj.append("shortDescription", formData.shortDescription);
      formDataObj.append("detailDescription", formData.detailDescription);

      const response = await fetch("/api/properties", {
        method: "POST",
        body: formDataObj,
      });
      const data = await response.json();
      if (data.success) {
        alert("You added property successfully.");
      } else {
        alert(
          `An error occurred while adding the property. Please try again.${data.message}`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while adding the property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setShowDialog(true);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowDialog(false);
    } else {
      alert("Invalid password");
    }
  };

  const handleDeleteMessage = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`/api/messages/${id}`, {
        method: "DELETE",
      }).then(() => {
        setMessages(messages.filter((message) => message.id !== id));
      });
    }
  };

  const handleDeletePost = (id: string) => {
    //ask for confirmation by alerting the user
    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`/api/properties/${id}`, {
        method: "DELETE",
      }).then(() => {
        setPosts(posts.filter((post) => post.id !== id));
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button
              className="w-full bg-[#89ca28] hover:bg-[#78b122] text-white"
              onClick={handleLogin}
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>

      {/* Messages Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Messages</h2>
        <div className="grid gap-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{message.name}</h3>

                  {message.email && (
                    <p className="text-sm text-gray-600">{message.email}</p>
                  )}
                  {message.phone && (
                    <p className="text-sm text-gray-600">{message.phone}</p>
                  )}
                  <p className="mt-2">{message.message}</p>
                  <p className="text-sm text-gray-500 mt-2">{message.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Forms */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Property Upload */}
        <div className="p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cover Image (Main property image)
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
              {coverImage && (
                <p className="text-sm text-green-600">
                  Selected: {coverImage.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images (Up to 3 images)
              </label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {additionalImages.length > 0 && (
                <p className="text-sm text-green-600">
                  Selected: {additionalImages.length} image(s)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Property Video
              </label>
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />
              {video && (
                <p className="text-sm text-green-600">Selected: {video.name}</p>
              )}
            </div>

            <Input
              name="title"
              placeholder="Title"
              onChange={handleInputChange}
              value={formData.title}
            />
            <Input
              name="shortDescription"
              placeholder="Short Description (less than 8 words)"
              onChange={handleInputChange}
              value={formData.shortDescription}
            />
            <Textarea
              name="detailDescription"
              placeholder="Detail Description"
              onChange={handleInputChange}
              value={formData.detailDescription}
            />
            <Button
              className="w-full bg-[#89ca28] hover:bg-[#78b122] text-white"
              disabled={loading}
            >
              Add Property
            </Button>
          </form>
        </div>

        {/* Existing Properties */}
        <div className="p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-6">Existing Properties</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600">
                    {post.shortDescription}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="outline"
        className="mt-8"
        onClick={() => setIsAuthenticated(false)}
      >
        Logout
      </Button>
    </div>
  );
}
