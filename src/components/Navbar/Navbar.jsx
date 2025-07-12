import React from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { getUserRole } from "../../utils/roleCheck";

const Navbar = () => {
  const { user } = useUser();
  const role = getUserRole(user);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>StackIt</div>
      <div className={styles.links}>
        <Link to="/">Home</Link>

        <SignedIn>
          {role === "user" && (
            <button className={styles.ask}>Ask Question</button>
          )}
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className={styles.signin}>Sign In / Sign Up</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
