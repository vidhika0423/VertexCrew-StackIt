import React from "react";
import styles from "./Home.module.css";
import { useUser, SignInButton, SignedOut, SignedIn } from "@clerk/clerk-react";

const Home = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to StackIt</h1>

      {/* Show if user is signed in AND loaded AND not null */}
      {isLoaded && user ? (
        <div>
          <p className={styles.subtext}>
            Hello, {user.fullName || user.username} 👋
          </p>
          <p className={styles.subtext}>
            This is your homepage. Questions will appear here.
          </p>
        </div>
      ) : (
        // Show this to guests (SignedOut)
        <SignedOut>
          <p className={styles.subtext}>Sign up to ask and answer questions.</p>
          <SignInButton mode="modal">
            <button className={styles.joinBtn}>Join StackIt</button>
          </SignInButton>
        </SignedOut>
      )}
    </div>
  );
};

export default Home;
