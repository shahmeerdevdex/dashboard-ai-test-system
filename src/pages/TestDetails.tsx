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
    <div className="min-h-screen bg-transparent">
      <div className="space-y-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="hover:bg-blue-50 rounded-xl px-6 py-3 font-semibold shadow-lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                  Test Details - {test.id}
                </h1>
                <p className="text-gray-600 mt-2 text-lg font-medium">
                  Comprehensive test analysis and results
                </p>
              </div>
            </div>
            <Badge
              variant={
                test.status === "pass"
                  ? "default"
                  : test.status === "failed"
                  ? "destructive"
                  : "outline"
              }
              className={`text-xl font-bold px-6 py-3 rounded-xl shadow-lg ${
                test.status === "pass"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : test.status === "failed"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}>
              {test.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Test Overview */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/90 to-green-50/90 border-b border-white/20">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Test Overview
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <h4 className="font-bold text-xl text-gray-800 border-b-2 border-blue-200 pb-3">
                    Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-blue-600 font-bold text-lg">T</span>
                      </div>
                      <div>
                        <strong className="text-lg">Test ID:</strong>{" "}
                        <span className="text-blue-600 font-semibold text-lg">{test.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-blue-700" />
                      </div>
                      <div>
                        <strong className="text-lg">User:</strong>{" "}
                        <span className="text-gray-700 font-semibold text-lg">{test.userName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-blue-800 font-bold text-lg">C</span>
                      </div>
                      <div>
                        <strong className="text-lg">CNIC:</strong>{" "}
                        <span className="text-gray-700 font-semibold text-lg">{test.cnic}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-xl text-gray-800 border-b-2 border-blue-200 pb-3">
                    Test Timing
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <strong className="text-lg">Start:</strong>{" "}
                        <span className="text-gray-700 font-semibold text-lg">
                          {formatDateTime(test.startTime)}
                        </span>
                      </div>
                    </div>
                    {test.endTime && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-lg">
                          <Clock className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <strong className="text-lg">End:</strong>{" "}
                          <span className="text-gray-700 font-semibold text-lg">
                            {formatDateTime(test.endTime)}
                          </span>
                        </div>
                      </div>
                    )}
                    {test.duration && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <strong className="text-lg">Duration:</strong>{" "}
                          <span className="text-gray-700 font-semibold text-lg">
                            {test.duration}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-bold text-xl text-gray-800 border-b-2 border-blue-200 pb-3">
                    Test Status
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-orange-600 font-bold text-lg">S</span>
                      </div>
                      <div>
                        <strong className="text-lg">Status:</strong>{" "}
                        <span className="text-gray-700 font-semibold text-lg">{test.status}</span>
                      </div>
                    </div>
                    {test.currentPhase && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-indigo-600 font-bold text-lg">P</span>
                        </div>
                        <div>
                          <strong className="text-lg">Phase:</strong>{" "}
                          <span className="text-gray-700 font-semibold text-lg">
                            {test.currentPhase}
                          </span>
                        </div>
                      </div>
                    )}
                    {test.failReason && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-red-600 font-bold text-lg">!</span>
                        </div>
                        <div>
                          <strong className="text-lg">Fail Reason:</strong>{" "}
                          <span className="text-gray-700 font-semibold text-lg">
                            {test.failReason}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Test Results */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/90 to-blue-100/90 border-b border-white/20">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Detailed Test Results
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Consistency Check</h5>
                  <Badge
                    variant={test.consResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.consResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.consResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Seatbelt Check</h5>
                  <Badge
                    variant={test.seatbeltResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.seatbeltResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.seatbeltResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Lane Discipline</h5>
                  <Badge
                    variant={test.laneResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.laneResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.laneResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Handbrake Check</h5>
                  <Badge
                    variant={test.handbreakResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.handbreakResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.handbreakResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Backlight Check</h5>
                  <Badge
                    variant={test.backlightResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.backlightResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.backlightResult || "Not Tested"}
                  </Badge>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-lg">
                  <h5 className="font-bold text-xl text-gray-800 mb-4">Overall Result</h5>
                  <Badge
                    variant={test.overallResult === "pass" ? "default" : "destructive"}
                    className={`text-base font-bold px-4 py-2 rounded-xl ${
                      test.overallResult === "pass"
                        ? "bg-green-100 text-green-800 shadow-lg"
                        : "bg-red-100 text-red-800 shadow-lg"
                    }`}>
                    {test.overallResult || "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Images */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50/90 to-blue-100/90 border-b border-white/20">
              <CardTitle className="flex items-center gap-4 text-2xl font-bold">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Test Images
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
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
