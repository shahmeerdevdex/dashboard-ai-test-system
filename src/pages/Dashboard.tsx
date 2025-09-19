import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
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

  // Filter tests based on CNIC search
  const filteredTests = tests.filter(
    (test) =>
      test.cnic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.userName.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 p-6">
       

        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live System</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
              Driving Test Management System
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Punjab Traffic Police - AI-powered driving test monitoring and management
            </p>
          </div>

          {/* Search Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                Search Test Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by CNIC or Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white/50 backdrop-blur-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Records Table */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  </div>
                  <span className="text-xl">Test Records</span>
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
                  {filteredTests.length} Records
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-gray-700 py-4">Test ID</TableHead>
                      <TableHead className="font-bold text-gray-700 py-4">CNIC</TableHead>
                      <TableHead className="font-bold text-gray-700 py-4">Test Time</TableHead>
                      <TableHead className="font-bold text-gray-700 py-4">Status</TableHead>
                      <TableHead className="font-bold text-gray-700 py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading &&
                      filteredTests.map((test, index) => (
                        <TableRow
                          key={test.id}
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}>
                          <TableCell className="font-bold text-blue-600 py-4">{test.id}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-600 py-4">
                            {test.cnic}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="font-medium">
                                  <strong>Start:</strong> {formatDate(test.startTime)}{" "}
                                  {formatTime(test.startTime)}
                                </span>
                              </div>
                              {test.endTime ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span>
                                    <strong>End:</strong> {formatTime(test.endTime)}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-blue-600">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>
                                      <strong>Duration:</strong> {test.duration || "N/A"}
                                    </span>
                                  </div>
                                  {test.currentPhase && (
                                    <div className="mt-1 text-sm">
                                      <strong>Phase:</strong> {test.currentPhase}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="space-y-2">
                              <Badge
                                variant={
                                  test.status === "passed"
                                    ? "default"
                                    : test.status === "failed"
                                    ? "destructive"
                                    : "outline"
                                }
                                className={`text-sm font-semibold px-3 py-1 ${
                                  test.status === "passed"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : test.status === "failed"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }`}>
                                {test.status === "in-progress" && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                )}
                                {test.status.replace("-", " ").toUpperCase()}
                              </Badge>
                              {test.failReason && (
                                <div
                                  className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-md max-w-40 truncate"
                                  title={test.failReason}>
                                  {test.failReason}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/test/${test.id}`)}
                              className="hover:bg-blue-50">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-gray-500 text-lg">Loading test records...</p>
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">
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
