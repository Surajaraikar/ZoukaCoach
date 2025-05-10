'use client';

import { useState, useEffect } from "react";
import Papa from "papaparse";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import emailjs from "@emailjs/browser";

export default function Home() {
  // — Clerk user
  const { user } = useUser();
  const username = user?.username || user?.firstName || "User";
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";


    // ── Log user email to console whenever it changes ──
  useEffect(() => {
    if (userEmail) {
      console.log("Logged-in user email:", userEmail);
   }
 }, [userEmail]);


  // — Tabs
  const [activeTab, setActiveTab] = useState("classes");

  // — Google Sheets data
  const [posts, setPosts] = useState([]);

  // — EmailJS init
  useEffect(() => {
    emailjs.init("8jK9d-6bvKySCa7oB");
  }, []);

  // — Load CSV from Google Sheets
  useEffect(() => {
    const CSV_URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPkxnGc0F_waHNbZv5-aINw-9-dhRDEamrR-KP-qaBbV5wWj4J2yCdXhTPIQ_BeP6_W4FcyCGK-U-s/pub?output=csv";

    fetch(CSV_URL)
      .then((r) => r.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data }) => setPosts(data),
        });
      })
      .catch((err) => console.error("Failed to load sheet:", err));
  }, []);

  // — Send registration email + open link
  const handleRegister = async (post) => {
    const templateParams = {
      session_title: post.Title,
      session_date: new Date(post.data).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
      }),
      session_time: post.Time,
      student_name: username,
      student_email: userEmail,
      coach_name: post.Name,
      session_link: post.Link,        // <-- pass the link to your EmailJS template
    };

    // disable button while sending
    setSendingId(post.Link);

    try {
      await emailjs.send(
        "service_vjgz4sn",    // your EmailJS Service ID
        "template_61e5wss",   // your EmailJS Template ID
        templateParams
      );
      alert("Registration email sent!");

      // then navigate the user to the registration URL
      window.open(post.Link, "_blank");
    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Failed to send registration email. Please try again.");
    } finally {
      setSendingId(null);
    }
  };

  // track which post (by Link) is being sent
  const [sendingId, setSendingId] = useState(null);

  return (
    <div className="flex xl:max-w-screen-2xl md:w-5/6 mx-auto justify-center">
      {/* Sidebar */}
      <div className="w-64 bg-white text-black p-6 border-r border-gray-300">
        <div className="text-xl font-semibold mb-8">ZOUKACOACH</div>
        <div className="space-y-4">
          <div className="text-sm">GENERAL</div>
          <ul className="space-y-2">
            {[
              { key: "classes", label: "Classes" },
              { key: "games", label: "Games (coming soon)" },
              { key: "cohorts", label: "Cohorts (coming soon)" },
            ].map((tab) => (
              <li
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

      {/* Main Content */}
      <div className="flex-1 p-8 text-black">
        {/* Header */}
        <div className="mb-12">
          <SignedIn>
            <h4 className="font-normal">Welcome, {username}</h4>
          </SignedIn>
          <SignedOut>
            <h4 className="font-normal">Welcome, Guest</h4>
          </SignedOut>
          <p className="text-[#535862]">
            The heart of your brand. Captured, summarized, and ready to guide creation.
          </p>

          <div className="flex items-center space-x-4 bg-gradient-to-bl from-[#4D2E82] to-[#654D8E] p-4 gap-20 rounded-xl mt-10">
            <Image
              src="/images/dashBoard/session.svg"
              alt="Session Preview"
              width={400}
              height={400}
              className="w-1/3 h-80"
            />
            <div className="w-2/3 space-y-2">
              <h2 className="text-white">Book 1 v 1 session</h2>
              <p className="text-white">
                Empower students and reduce institutional burdens through a comprehensive placement management system. Ken42 believes in an education system that inspires and paves pathways for students to a future of possibilities.
              </p>
              <button className="flex items-center gap-2 bg-white p-2 text-[#654D8E]">
                See more <FaArrowRightLong />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === "classes" && (
            <div>
              <h4 className="mb-4">Upcoming live classes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {posts.length > 0 ? (
                  posts.map((post, i) => (
                    <div key={i} className="bg-[#EFEBF7] p-5 rounded-xl">
                      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4 border border-gray-200">
                        <h4 className="font-normal">
                          {post.Title || "Untitled Session"}
                        </h4>
                        <p className="text-[#535862] text-base">
                          {post.Description || "No description available."}
                        </p>

                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div>
                            Date:{" "}
                            <span className="font-medium">
                              {new Date(post.data).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div>
                            Time: <span className="font-medium">{post.Time}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(post.Skills?.split(",") || []).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <div>
                            <p className="font-semibold">{post.Name}</p>
                            {/* <p className="text-xs text-gray-500">{post.Email}</p> */}
                          </div>
                          {post.Link && (
                            <button
                              onClick={() => handleRegister(post)}
                              disabled={sendingId === post.Link}
                              className="bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                            >
                              {sendingId === post.Link ? "Sending…" : "Register"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Loading classes…</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Games (coming soon)
              </h2>
              <p>Stay tuned for upcoming games content.</p>
            </div>
          )}

          {activeTab === "cohorts" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Cohorts (coming soon)
              </h2>
              <p>More details about cohorts will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
