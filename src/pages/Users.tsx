import { useState, useEffect } from "react";
import { Search, User, Mail, Phone, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase, Profile } from "@/lib/supabase";

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching users:", error);
        } else {
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and exclude specific CNIC
  const filteredUsers = users.filter(
    (user) =>
      user.cnic_id !== "99999-9999999-9" &&
      (user.full_name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        user.cnic_id.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.trim().toLowerCase())) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.trim().toLowerCase())))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (user: Profile) => {
    // Check if user has fingerprint enrolled
    if (user.fingerprint_enrolled_at) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Enrolled</Badge>;
    }
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Pending
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="space-y-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent leading-normal">
              User Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Manage and monitor all registered users in the Punjab Traffic Police system
            </p>
          </div>

          {/* Users Table */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/90 to-green-50/90 border-b border-white/20">
              <CardTitle className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Registered Users
                  </span>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-lg">
                  {filteredUsers.length} Users
                </div>
              </CardTitle>

              {/* Search Section */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name, CNIC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-5 h-12 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-50/80 to-green-50/80 border-b-2 border-blue-200/50">
                      {/* <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        User ID
                      </TableHead> */}
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Full Name
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">CNIC</TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Contact
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">Status</TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Registered
                      </TableHead>
                      {/* <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Actions
                      </TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading &&
                      filteredUsers.map((user, index) => (
                        <TableRow
                          key={user.id}
                          className={`hover:bg-blue-50/80 transition-all duration-300 border-b border-gray-100/50 ${
                            index % 2 === 0 ? "bg-white/80" : "bg-gray-50/40"
                          }`}>
                          {/* <TableCell className="font-bold text-blue-600 py-6 text-lg">
                            {user.id.slice(0, 8)}...
                          </TableCell> */}
                          <TableCell className="py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 text-lg">
                                  {user.full_name}
                                </div>
                                {user.fingerprint_enrolled_at && (
                                  <div className="text-sm text-green-600 font-medium">
                                    Fingerprint Enrolled
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-base text-gray-700 py-6 font-semibold">
                            {user.cnic_id}
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="space-y-2">
                              {user.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">{user.email}</span>
                                </div>
                              )}
                              {user.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-600">{user.phone}</span>
                                </div>
                              )}
                              {!user.email && !user.phone && (
                                <span className="text-gray-400 text-sm">No contact info</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">{getStatusBadge(user)}</TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">
                                {user.created_at ? formatDate(user.created_at) : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          {/* <TableCell className="py-6">
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 rounded-xl px-4 py-2 font-semibold shadow-lg">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell> */}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-600 text-xl font-semibold">Loading users...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-xl font-semibold">
                    {searchTerm
                      ? "No users found matching your search criteria."
                      : "No users registered yet."}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
