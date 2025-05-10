import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
    return (
        <div className="relative flex h-screen bg-white overflow-hidden">
            {/* Video Background */}
            <div className="absolute top-0 left-0 md:w-2/3 h-full z-10 sm:p-5 p-3">
                <video
                    className="w-full h-full object-cover rounded-2xl"
                    src="/images/home/mailbgvideo.mp4"
                    autoPlay
                    muted
                    loop
                />
            </div>

            {/* Text Content on top of the video */}
            <div className="absolute top-[5%] sm:top-[10%] left-[1%] z-10 p-6 text-white flex flex-col max-w-lg">
                <Image src={"/images/home/whitelogo.svg"} width={100} height={100} alt="zouka logo" />
                <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mt-4 mt-2 w-full">
                    You're not lost. You just need a
                    new perspective.
                </h2>
                <p className="text-sm sm:leading-relaxed">
                    At Zouka Coach, we help you uncover what's holding you back, break
                    patterns that no longer serve you, and rediscover your own power so
                    you can live fully, without guilt, and with clarity.
                </p>
            </div>

            {/* Side Image (Mail Icon) */}
            <div className="absolute top-0 right-0 z-20">
                <img
                    src="/images/home/mail.svg"
                    alt="Mail Icon"
                />
            </div>

            {/* Clerk SignUp Component */}
            <div className="absolute right-1/6 top-1/2 transform -translate-y-1/2 md:w-1/3 z-30 p-6">
                <SignUp
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-[#4D2E82] hover:bg-[#3D2362] text-white",
                            card: "shadow-none",
                            footer: "hidden"
                        }
                    }}
                />
            </div>
        </div>
    );
}