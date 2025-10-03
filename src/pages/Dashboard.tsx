import { useState, useEffect } from "react";
import { Search, Eye, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { PunjabBrandBanner } from "@/components/dashboard/PunjabBrandBanner";
import { fetchTestRecords, TestRecord } from "@/lib/testService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCnic, setCopiedCnic] = useState<string | null>(null);

  // Fetch test records from Supabase
  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const data = await fetchTestRecords();
        setTests(data);
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  // Filter tests based on CNIC search, excluding test records with CNIC "99999-9999999-9"
  const filteredTests = tests.filter(
    (test) =>
      test.cnic !== "99999-9999999-9" &&
      (test.cnic.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        test.userName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const copyToClipboard = async (cnic: string) => {
    try {
      await navigator.clipboard.writeText(cnic);
      setCopiedCnic(cnic);
      setTimeout(() => setCopiedCnic(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy CNIC:", err);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="space-y-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent leading-normal">
              Driving Test Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Punjab Traffic Police - AI-powered driving test monitoring and management
            </p>
          </div>

          {/* Test Records Table */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/90 to-green-50/90 border-b border-white/20">
              <CardTitle className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Test Records
                  </span>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold shadow-lg">
                  {filteredTests.length} Records
                </div>
              </CardTitle>

              {/* Search Section */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by CNIC or Name..."
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
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Test ID
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Candidate Name
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">CNIC</TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Test Time
                      </TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">Status</TableHead>
                      <TableHead className="font-bold text-gray-800 py-6 text-lg">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading &&
                      filteredTests.map((test, index) => (
                        <TableRow
                          key={test.id}
                          className={`hover:bg-blue-50/80 transition-all duration-300 border-b border-gray-100/50 ${
                            index % 2 === 0 ? "bg-white/80" : "bg-gray-50/40"
                          }`}>
                          <TableCell className="font-bold text-blue-600 py-6 text-lg">
                            {test.id}
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg">
                                  {test.userName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800 text-lg">
                                  {test.userName}
                                </div>
                                {/* <div className="text-sm text-gray-500">{test.email}</div> */}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base text-gray-700 font-semibold">
                                {test.cnic}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(test.cnic)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 rounded-lg"
                                title="Copy CNIC">
                                {copiedCnic === test.cnic ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="text-base space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-semibold text-gray-700">
                                  <strong>Start:</strong> {formatDate(test.startTime)}{" "}
                                  {formatTime(test.startTime)}
                                </span>
                              </div>
                              {test.endTime ? (
                                <div className="flex items-center gap-3">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <span className="font-medium text-gray-600">
                                    <strong>End:</strong> {formatDate(test.endTime)}{" "}
                                    {formatTime(test.endTime)}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-blue-600">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium">
                                      <strong>Duration:</strong> {test.duration || "N/A"}
                                    </span>
                                  </div>
                                  {test.currentPhase && (
                                    <div className="mt-2 text-sm font-medium text-blue-700">
                                      <strong>Phase:</strong> {test.currentPhase}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <div className="space-y-3">
                              <Badge
                                variant={
                                  test.status === "pass"
                                    ? "default"
                                    : test.status === "fail"
                                    ? "destructive"
                                    : "outline"
                                }
                                className={`text-base font-bold px-4 py-2 rounded-xl ${
                                  test.status === "pass"
                                    ? "bg-green-100 text-green-800 border-green-200 shadow-lg"
                                    : test.status === "fail"
                                    ? "bg-red-100 text-red-800 border-red-200 shadow-lg"
                                    : "bg-blue-100 text-blue-800 border-blue-200 shadow-lg"
                                }`}>
                                {test.status === "in-progress" && (
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                )}
                                {test.status.replace("-", " ").toUpperCase()}
                              </Badge>
                              {test.failReason && (
                                <div
                                  className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg max-w-40 truncate font-medium"
                                  title={test.failReason}>
                                  {test.failReason}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-6">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/test/${test.id}`)}
                              className="hover:bg-blue-50 rounded-xl px-4 py-2 font-semibold shadow-lg">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </TableCell>
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
                  <p className="text-gray-600 text-xl font-semibold">Loading test records...</p>
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-xl font-semibold">
                    No test records found matching your search criteria.
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
