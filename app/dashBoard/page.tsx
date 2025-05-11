'use client';

import { useState, useEffect } from "react";
import Papa from "papaparse";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/nextjs";
import emailjs from "@emailjs/browser";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  const username = user?.username || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  useEffect(() => {
    if (userEmail) {
      console.log("Logged-in user email:", userEmail);
    }
  }, [userEmail]);

  const [activeTab, setActiveTab] = useState("classes");
  const [posts, setPosts] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    emailjs.init("8jK9d-6bvKySCa7oB");
  }, []);

  useEffect(() => {
    const CSV_URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPkxnGc0F_waHNbZv5-aINw-9-dhRDEamrR-KP-qaBbV5wWj4J2yCdXhTPIQ_BeP6_W4FcyCGK-U-s/pub?output=csv";

    fetch(CSV_URL)
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false, // Keep dates as strings for proper handling
          transformHeader: (header) => header.trim(), // Trim whitespace from headers
          complete: ({ data }) => {
            // Log the first row to help with debugging
            if (data.length > 0) {
              console.log("First row sample:", data[0]);
            }
            
            // Process the data before setting it
            const processedData = data.map(row => {
              // Make a copy to avoid modifying the original data
              const processedRow = {...row};
              
              // Make sure Date field exists and is properly formatted
              if (processedRow.Date) {
                processedRow.Date = processedRow.Date.trim();
              }
              
              return processedRow;
            });
            
            setPosts(processedData);
          },
        });
      })
      .catch((err) => console.error("Failed to load sheet:", err));
  }, []);

  const handleRegister = async (post) => {
    // Check if Date field exists in the post object
    const dateField = post.Date || post.date || post.data;
    
    if (!dateField) {
      console.error("Date field not found in post:", post);
      alert("Error: Date information is missing. Please contact support.");
      return;
    }
    
    // Use our robust formatDate function
    const formattedDate = formatDate(dateField);
    if (formattedDate === "Invalid date") {
      console.error("Invalid date format in post:", post);
      alert("Error: The date format is invalid. Please contact support.");
      return;
    }

    const templateParams = {
      session_title: post.Title,
      session_date: formattedDate,
      session_time: post.Time,
      student_name: username,
      student_email: userEmail,
      coach_name: post.Name,
      session_link: post.Link,
    };

    setSendingId(post.Link);

    try {
      await emailjs.send(
        "service_vjgz4sn",
        "template_61e5wss",
        templateParams
      );
      alert("Registration email sent!");
      window.open(post.Link, "_blank");
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Failed to send registration email. Please try again.");
    } finally {
      setSendingId(null);
    }
  };

  // Function to format date safely
  const formatDate = (dateString) => {
    try {
      // Check if the dateString is valid
      if (!dateString) return "Date not available";
      
      // Trim any whitespace that might be causing issues
      const cleanDateString = dateString.toString().trim();
      
      // Try to parse the date directly first
      let date = new Date(cleanDateString);
      
      // If that didn't work, try to parse it as YYYY-MM-DD specifically
      if (isNaN(date.getTime())) {
        // Check if it matches YYYY-MM-DD format
        const dateParts = cleanDateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateParts) {
          // JavaScript months are 0-indexed, so we subtract 1 from the month
          date = new Date(
            parseInt(dateParts[1]), 
            parseInt(dateParts[2]) - 1, 
            parseInt(dateParts[3])
          );
        }
      }
      
      // Check if date is valid after our parsing attempts
      if (isNaN(date.getTime())) {
        console.warn("Unable to parse date:", cleanDateString);
        return "Invalid date";
      }
      
      return date.toLocaleDateString("en-US", {
        // weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white xl:max-w-screen-2xl md:w-5/6 mx-auto">
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-purple-600 text-white rounded-md shadow-md"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar - hidden on mobile by default */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40 
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-white text-black py-6 pr-6 shadow-lg lg:shadow-none
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
              {[
                { key: "classes", label: "Classes" },
                { key: "games", label: "Games (coming soon)" },
                { key: "cohorts", label: "Cohorts (coming soon)" },
              ].map((tab) => (
                <li
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`cursor-pointer p-2 rounded ${
                    activeTab === tab.key
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
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 py-6 lg:pl-6 text-black w-full lg:w-auto">
          {/* Header */}
          <div className="mb-8 md:mb-12 pt-8 lg:pt-1">
            <div className="flex items-center justify-between mb-2 mt-1">
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

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 bg-gradient-to-bl from-[#4D2E82] to-[#654D8E] p-4 md:p-6 rounded-xl mt-6 md:mt-10">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {posts.length > 0 ? (
                    posts.map((post, i) => (
                      <div key={i} className="bg-[#EFEBF7] px-5 pt-5 pb-3 rounded-xl">
                        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg border border-gray-200  flex flex-col">
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
                                {formatDate(post.Date || post.date || post.data)}
                              </p>
                            </div>
                            <div>
                              Time: <span className="font-medium">{post.Time}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {(post.Skills?.split(",") || []).map((skill, idx) => (
                              <span
                                key={idx}
                                className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>

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
                              onClick={() => handleRegister(post)}
                              disabled={sendingId === post.Link}
                              className="bg-[#4D2E82] hover:bg-purple-800 cursor-pointer disabled:opacity-50 text-white px-3 py-2 text-sm rounded-lg w-full sm:w-auto transition-colors"
                            >
                              {sendingId === post.Link ? "Sending…" : "Register"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
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