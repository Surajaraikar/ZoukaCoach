'use client';

import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";

// Define interfaces for TypeScript
interface Post {
  Title?: string;
  Description?: string;
  Date?: string;
  date?: string;
  data?: string;
  Time?: string;
  Duration?: string;
  Skills?: string;
  Session?: string;
  Name?: string;
  Link?: string;
}

interface TabItem {
  key: string;
  label: string;
}

// Use Record<string, unknown> to satisfy EmailJS parameter requirements
interface TemplateParams extends Record<string, unknown> {
  session_title: string;
  session_date: string;
  session_time?: string;
  student_name: string;
  student_email: string;
  coach_name?: string;
  session_link: string;
}

interface ButtonProps {
  text: string;
  colorClass: string;
  disabled: boolean;
}

export default function Home() {
  const { user } = useUser();
  const username = user?.username || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const [activeTab, setActiveTab] = useState<string>("classes");
  const [posts, setPosts] = useState<Post[]>([]);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [registeredSessions, setRegisteredSessions] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [hiddenSessions, setHiddenSessions] = useState<string[]>([]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Load registered and hidden sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem('registeredSessions');
      if (saved) setRegisteredSessions(JSON.parse(saved));
      const hidden = localStorage.getItem('hiddenSessions');
      if (hidden) setHiddenSessions(JSON.parse(hidden));
    } catch (e) {
      console.error("Load error:", e);
    }
  }, []);

  // Persist registered sessions
  useEffect(() => {
    localStorage.setItem('registeredSessions', JSON.stringify(registeredSessions));
  }, [registeredSessions]);

  // Persist hidden sessions
  useEffect(() => {
    localStorage.setItem('hiddenSessions', JSON.stringify(hiddenSessions));
  }, [hiddenSessions]);

  // Parse time strings like "2:00 PM"
  const parseTimeString = (timeString: string): Date | null => {
    if (!timeString) return null;
    const parts = timeString.match(/(\d+):(\d+)\s?(AM|PM|am|pm)/i);
    if (!parts) return null;
    let hour = parseInt(parts[1], 10);
    const minute = parseInt(parts[2], 10);
    const ampm = parts[3].toLowerCase();
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  // Duration to minutes - Converts hours to minutes
  const getDurationInMinutes = useCallback((durationString?: string): number => {
    if (!durationString) return 60; // Default to 60 minutes

    // Try to extract hours
    const hourMatch = durationString.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr|h)/i);
    if (hourMatch) {
      return parseFloat(hourMatch[1]) * 60;
    }

    // Try to extract minutes
    const minuteMatch = durationString.match(/(\d+)\s*(?:minute|min|m)/i);
    if (minuteMatch) {
      return parseInt(minuteMatch[1], 10);
    }

    // If no pattern matches but there's a number, assume it's minutes
    const numericMatch = durationString.match(/(\d+)/);
    if (numericMatch) {
      return parseInt(numericMatch[1], 10);
    }

    return 60; // Default fallback
  }, []);

  // Time to join window
  const isTimeToJoin = useCallback((post: Post): boolean => {
    const dateField = post.Date || post.date || post.data;
    if (!dateField || !post.Time) return false;
    const sessionDate = new Date(dateField);
    if (isNaN(sessionDate.getTime())) return false;
    const timeObj = parseTimeString(post.Time);
    if (!timeObj) return false;
    sessionDate.setHours(timeObj.getHours(), timeObj.getMinutes());

    // 15 minutes before session starts until session ends (using post.Session for duration)
    const startWindow = new Date(sessionDate);
    startWindow.setMinutes(startWindow.getMinutes() - 15);

    // Use post.Session for duration if available
    const durationString = post.Session || post.Duration;
    const duration = getDurationInMinutes(durationString);
    const endWindow = new Date(sessionDate);
    endWindow.setMinutes(endWindow.getMinutes() + duration);

    return currentTime >= startWindow && currentTime <= endWindow;
  }, [currentTime, getDurationInMinutes]);

  // Check if session ended
  const isSessionEnded = useCallback((post: Post): boolean => {
    const dateField = post.Date || post.date || post.data;
    if (!dateField || !post.Time) return false;
    const sessionDate = new Date(dateField);
    if (isNaN(sessionDate.getTime())) return false;
    const timeObj = parseTimeString(post.Time);
    if (!timeObj) return false;
    sessionDate.setHours(timeObj.getHours(), timeObj.getMinutes());

    // Use post.Session for duration if available, otherwise fall back to Duration
    const durationString = post.Session || post.Duration;
    const duration = getDurationInMinutes(durationString);
    const endTime = new Date(sessionDate);
    endTime.setMinutes(endTime.getMinutes() + duration);

    return currentTime > endTime;
  }, [currentTime, getDurationInMinutes]);

  // Hide ended sessions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      posts.forEach(post => {
        if (
          post.Link &&
          registeredSessions.includes(post.Link) &&
          isSessionEnded(post) &&
          !hiddenSessions.includes(post.Link)
        ) {
          setHiddenSessions(prev => [...prev, post.Link!]);
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [posts, registeredSessions, hiddenSessions, isSessionEnded]);

  // Init EmailJS
  useEffect(() => { emailjs.init("8jK9d-6bvKySCa7oB"); }, []);

  // Load CSV
  useEffect(() => {
    const CSV_URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vReuoQ20VQ5IpBH9CGtdYf_rzxySB1u4K7jK3ou36GktAcWmvmMnt6KcPhqPmu4iXT7vHeBcLTgb3AY/pub?output=csv";
    fetch(CSV_URL)
      .then(r => r.text())
      .then(csvText => {
        Papa.parse<Post>(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: h => h.trim(),
          complete: ({ data }) => setPosts(data),
        });
      })
      .catch(err => console.error("CSV load error:", err));
  }, []);

  // Format date safely
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Date not available";
    const clean = dateString.trim();
    let d = new Date(clean);
    if (isNaN(d.getTime())) {
      const m = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (m) d = new Date(+m[1], +m[2] - 1, +m[3]);
    }
    if (isNaN(d.getTime())) return "Invalid date";
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Handle registration
  const handleRegister = async (post: Post) => {
    const dateField = post.Date || post.date || post.data;
    if (!dateField) {
      alert("Error: Date missing.");
      return;
    }
    const formatted = formatDate(dateField);
    if (formatted === "Invalid date") {
      alert("Error: Invalid date format.");
      return;
    }

    // If already registered, do nothing
    if (post.Link && registeredSessions.includes(post.Link)) {
      return;
    }

    // Send registration email
    const params: TemplateParams = {
      session_title: post.Title || "Untitled Session",
      session_date: formatted,
      session_time: post.Time,
      student_name: username,
      student_email: userEmail,
      coach_name: post.Name,
      session_link: post.Link || "",
    };

    if (post.Link) setSendingId(post.Link);
    try {
      await emailjs.send("service_vjgz4sn", "template_61e5wss", params);
      alert("Registration email sent!");

      // Add to registered sessions if link exists
      if (post.Link) {
        setRegisteredSessions(prev => {
          // Ensure no duplicates
          if (!prev.includes(post.Link!)) {
            return [...prev, post.Link!];
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send email.");
    } finally {
      setSendingId(null);
    }
  };

  // Tabs
  const tabs: TabItem[] = [
    { key: "classes", label: "Classes" },
    { key: "games", label: "Games (coming soon)" },
    { key: "cohorts", label: "Cohorts (coming soon)" },
  ];

  // Get button properties based on post state
  const getButtonProps = useCallback((post: Post): ButtonProps => {
    const link = post.Link;
    // Check if this post is currently being processed
    const isSending = sendingId === link;
    // Check if already registered
    const isRegistered = !!(link && registeredSessions.includes(link));
    const isJoinTime = isTimeToJoin(post);

    // Handling sending state
    if (isSending) {
      return {
        text: "Sending...",
        colorClass: "bg-yellow-500",
        disabled: true,
      };
    }

    // If registered and it's time to join
    if (isRegistered && isJoinTime) {
      return {
        text: "Join Now",
        colorClass: "bg-green-600 hover:bg-green-700",
        disabled: false,
      };
    }

    // If registered but not yet time to join
    if (isRegistered) {
      return {
        text: "Registered",
        colorClass: "bg-gray-400 hover:bg-gray-500",
        disabled: false, // Keep it enabled as per requirement
      };
    }

    // Default - not registered
    return {
      text: "Register",
      colorClass: "bg-purple-600 hover:bg-purple-700",
      disabled: false,
    };
  }, [registeredSessions, isTimeToJoin, sendingId]);

  // Return statement and render method
  return (
    <div className="flex flex-col min-h- bg-white xl:max-w-screen-2xl md:w-5/6 mx-auto px-5">


      <div className="flex justify-between items-center mt-5 align-middle">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={toggleSidebar}
          // className={isSidebarOpen ? "" : "bg-black rounded-md shadow-md bg-"}
          >
            {isSidebarOpen ? "" : <RxHamburgerMenu className="w-8 h-8 text-black" />
            }
          </button>
        </div>

        <div className="lg:hidden top-4 left-4 z-50">
          <div>
            <SignedIn>

            </SignedIn>
            <SignedOut>
            </SignedOut>

          </div>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>


      <div className="lg:hidden my-4 ">
        <div className="flex items-center gap-3">
          <h4 className="font-normal text-black">Welcome, {username}</h4>
        </div>
        <p className="text-[#535862] text-sm md:text-base">
          The heart of your brand. Captured, summarized, and ready to guide creation.
        </p>
      </div>



      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar - hidden on mobile by default */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-white text-black pb-6 pr-6 shadow-lg lg:shadow-none pl-5 lg:pl-0
          overflow-y-auto lg:border-r border-gray-300
        `}>
          <div className="text-xl font-semibold mb-8 flex items-center justify-between pt-1">
            <Link href="/">
              <Image
                src="/images/home/logo.svg"
                width={100}
                height={100}
                alt="logo"
              />
            </Link>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-500">GENERAL</div>
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`cursor-pointer p-2 rounded ${activeTab === tab.key
                    ? "bg-[#F2F3FD] text-black"
                    : "hover:bg-purple-100 text-gray-400"
                    }`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <div className="flex-1 lg:pb-6 lg:pl-6 text-black w-full lg:w-auto lg:mt-2">
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <div className="lg:flex items-center justify-between mb-2 hidden">
              <div>
                <SignedIn>
                  <div className="flex items-center gap-3">
                    <h4 className="font-normal">Welcome, {username}</h4>
                  </div>
                </SignedIn>
                <SignedOut>
                  <h4 className="font-normal">Welcome, Guest</h4>
                </SignedOut>
                <p className="text-[#535862] text-sm md:text-base">
                  The heart of your brand. Captured, summarized, and ready to guide creation.
                </p>
              </div>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 bg-gradient-to-bl from-[#4D2E82] to-[#654D8E] p-4 md:p-6 rounded-xl mt-2 md:mt-10">
              <div className="w-full lg:w-1/3 flex justify-center">
                <Image
                  src="/images/dashBoard/session.svg"
                  alt="Session Preview"
                  width={400}
                  height={400}
                  className="h-60 md:h-80 object-contain"
                />
              </div>
              <div className="w-full lg:w-2/3 space-y-2 md:space-y-4">
                <h2 className="text-white text-xl md:text-2xl font-semibold">Book 1 v 1 session</h2>
                <p className="text-white text-sm md:text-base">
                  Empower students and reduce institutional burdens through a comprehensive placement management system. Ken42 believes in an education system that inspires and paves pathways for students to a future of possibilities.
                </p>
                <button className="flex items-center gap-2 bg-white p-2 md:p-3 text-[#654D8E] rounded hover:bg-gray-100 transition-colors">
                  See more <FaArrowRightLong />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8 md:mb-12">
            {activeTab === "classes" && (
              <div>
                <h4 className="mb-4 text-lg md:text-xl font-medium">Upcoming live classes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
                  {posts.length > 0 ? (
                    posts.map((post, i) => {
                      // Skip rendering this card if it's in the hidden sessions list
                      if (post.Link && hiddenSessions.includes(post.Link)) {
                        return null;
                      }

                      const buttonProps = getButtonProps(post);

                      return (
                        <div key={i} className="bg-[#EFEBF7] px-5 pt-5 pb-3 rounded-xl">
                          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col">
                            <h4 className="font-normal text-lg mb-3 line-clamp-2">
                              {post.Title || "Untitled Session"}
                            </h4>
                            <p className="text-[#535862] text-sm md:text-base mb-4 flex-grow overflow-hidden line-clamp-3">
                              {post.Description || "No description available."}
                            </p>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs md:text-sm text-gray-500 mb-3">
                              <div className="mb-1 sm:mb-0">
                                Date:{" "}
                                <p className="font-medium text-[#535862] text-sm md:text-base mb-4 flex-grow overflow-hidden line-clamp-3">
                                  {formatDate(post.Date || post.date || post.data || "")}
                                </p>
                              </div>
                              <div>
                                Time: <span className="font-medium">{post.Time}</span>
                              </div>
                            </div>

                            {post.Duration && (
                              <div className="text-xs md:text-sm text-gray-500 mb-3">
                                Duration: <span className="font-medium">{post.Duration}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.Skills?.split(",").map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>

                            {post.Session && (
                              <div className="text-xs md:text-sm text-gray-500 mb-3">
                                Session: <span className="font-medium">{post.Session}</span>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={'/images/dashBoard/girl.svg'}
                                  alt={"instructor"}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <p className="font-semibold text-sm">{post.Name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-3">
                            {post.Link && (
                              <button
                                onClick={() => {
                                  // If it's join time and already registered, navigate to the link
                                  if (isTimeToJoin(post) && registeredSessions.includes(post.Link!)) {
                                    window.open(post.Link, '_blank');
                                  } else {
                                    // Otherwise handle registration as before
                                    handleRegister(post);
                                  }
                                }}
                                disabled={buttonProps.disabled || isSessionEnded(post)}
                                className={`
                                  ${buttonProps.colorClass}
                                  ${isSessionEnded(post) ? 'bg-gray-300 opacity-50' : ''}
                                  cursor-pointer disabled:opacity-50 text-white px-3 py-2 text-sm rounded-lg w-full sm:w-auto transition-colors
                                `}
                              >
                                {isSessionEnded(post) ? "Session Ended" : buttonProps.text}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }).filter(Boolean) // Filter out null elements (hidden sessions)
                  ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading classes…</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "games" && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Games (coming soon)
                </h2>
                <p className="text-gray-600">Stay tuned for upcoming games content.</p>
              </div>
            )}

            {activeTab === "cohorts" && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Cohorts (coming soon)
                </h2>
                <p className="text-gray-600">More details about cohorts will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}