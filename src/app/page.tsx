import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the home page of our application",
};

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
    </div>
  );
};

export default Home;