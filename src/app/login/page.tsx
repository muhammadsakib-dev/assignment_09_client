import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Log In",
  description: "Fill in your credentials to log in to your account",
};

const LogIn = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>

            {/* Login Component */}
            
        </Suspense>
    );
};

export default LogIn;