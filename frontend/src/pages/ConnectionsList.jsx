import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, University, BookOpen, MessageCircle, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ConnectionsList = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:3000/api/v1/users";
  const token = localStorage.getItem("token");

  // Fetch current user data 
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data.user);
      
      // Fetch connections with details
      await fetchConnections();
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError("Failed to load user data. Please try again.");
      setLoading(false);
    }
  };

  // Fetch connections with full details
  const fetchConnections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/connections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConnections(response.data.connections || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setError("Failed to load connections. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchCurrentUser();
    }
  }, [token, navigate]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleBack = () => {
    navigate("/connections");
  };

  const viewProfile = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleMessage = (userId) => {
    // For future implementation - could navigate to a chat view
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-lg">Loading your connections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={fetchCurrentUser}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Connections</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-200"
          onClick={handleBack}
        >
          <span>←</span> Back to Networking
        </Button>
      </div>

      {/* Connections List */}
      {connections.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-200px)] rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {connections.map((connection) => (
              <Card
                key={connection._id}
                className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white"
              >
                <CardHeader className="flex items-center gap-4 border-b border-gray-200 p-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={connection.profileImage}
                      alt={`${connection.firstName} ${connection.lastName}`}
                    />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(connection.firstName, connection.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {connection.firstName} {connection.lastName}
                    </CardTitle>
                    <p className="text-sm text-blue-600 flex items-center gap-1">
                      <University className="h-4 w-4" />
                      {connection.instituteName}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Bio Snippet */}
                  {connection.shortBio && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <User className="h-4 w-4 text-blue-600" />
                        About
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {connection.shortBio}
                      </p>
                    </div>
                  )}

                  {/* Interests */}
                  {connection.interests && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        Interests
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {connection.interests.split(",").map((interest, idx) => (
                          <Badge
                            key={idx}
                            className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 text-xs px-2 py-0.5 rounded-full"
                          >
                            {interest.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="px-4 py-3 border-t border-gray-200 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => viewProfile(connection._id)}
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleMessage(connection._id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-lg mb-4">You haven't connected with anyone yet.</p>
          <Button
            onClick={() => navigate("/connections")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Connecting
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConnectionsList;