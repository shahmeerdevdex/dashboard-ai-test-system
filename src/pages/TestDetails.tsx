import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, TestTube, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestImageViewer } from "@/components/dashboard/TestImageViewer";
import { PunjabBrandBanner } from "@/components/dashboard/PunjabBrandBanner";
import { fetchTestRecords, TestRecord } from "@/lib/testService";

export default function TestDetailsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestDetails = async () => {
      setLoading(true);
      try {
        const tests = await fetchTestRecords();
        const foundTest = tests.find((t) => t.id === testId);
        setTest(foundTest || null);
      } catch (error) {
        console.error("Error loading test details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      loadTestDetails();
    }
  }, [testId]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-6">
          <PunjabBrandBanner />
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 text-lg">Loading test details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="space-y-8 p-6">
          <PunjabBrandBanner />
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TestTube className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Not Found</h2>
              <p className="text-gray-500 text-lg mb-6">The requested test could not be found.</p>
              <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-8 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/")} className="hover:bg-blue-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                  Test Details - {test.id}
                </h1>
                <p className="text-gray-600 mt-1">Comprehensive test analysis and results</p>
              </div>
            </div>
            <Badge
              variant={
                test.status === "passed"
                  ? "default"
                  : test.status === "failed"
                  ? "destructive"
                  : "outline"
              }
              className={`text-lg px-4 py-2 ${
                test.status === "passed"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : test.status === "failed"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}>
              {test.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Test Overview */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="w-5 h-5 text-blue-600" />
                </div>
                Test Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-gray-800 border-b pb-2">
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">T</span>
                      </div>
                      <div>
                        <strong>Test ID:</strong> {test.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <strong>User:</strong> {test.userName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
                        <span className="text-blue-800 font-bold">C</span>
                      </div>
                      <div>
                        <strong>CNIC:</strong> {test.cnic}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-gray-800 border-b pb-2">Test Timing</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <strong>Start:</strong> {formatDateTime(test.startTime)}
                      </div>
                    </div>
                    {test.endTime && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <strong>End:</strong> {formatDateTime(test.endTime)}
                        </div>
                      </div>
                    )}
                    {test.duration && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-800" />
                        </div>
                        <div>
                          <strong>Duration:</strong> {test.duration}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-lg text-gray-800 border-b pb-2">Test Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">S</span>
                      </div>
                      <div>
                        <strong>Status:</strong> {test.status}
                      </div>
                    </div>
                    {test.currentPhase && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
                          <span className="text-blue-700 font-bold">P</span>
                        </div>
                        <div>
                          <strong>Phase:</strong> {test.currentPhase}
                        </div>
                      </div>
                    )}
                    {test.failReason && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-300 rounded-lg flex items-center justify-center">
                          <span className="text-blue-800 font-bold">!</span>
                        </div>
                        <div>
                          <strong>Fail Reason:</strong> {test.failReason}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Test Results */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TestTube className="w-5 h-5 text-blue-600" />
                </div>
                Detailed Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Consistency Check</h5>
                  <Badge
                    variant={test.consResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.consResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.consResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Seatbelt Check</h5>
                  <Badge
                    variant={test.seatbeltResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.seatbeltResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.seatbeltResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Lane Discipline</h5>
                  <Badge
                    variant={test.laneResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.laneResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.laneResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Handbrake Check</h5>
                  <Badge
                    variant={test.handbreakResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.handbreakResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.handbreakResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Backlight Check</h5>
                  <Badge
                    variant={test.backlightResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.backlightResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.backlightResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <h5 className="font-bold text-lg text-gray-800 mb-3">Overall Result</h5>
                  <Badge
                    variant={test.overallResult === "passed" ? "default" : "destructive"}
                    className={`text-sm font-semibold px-3 py-1 ${
                      test.overallResult === "passed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {test.overallResult || "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Images */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                </div>
                Test Images
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <TestImageViewer
                images={test.images}
                userName={test.userName}
                testDate={formatDate(test.startTime)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
