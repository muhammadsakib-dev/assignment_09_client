import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

const SignUp = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>

            {/* Sign Up Component */}

        </Suspense>
    );
};

export default SignUp;