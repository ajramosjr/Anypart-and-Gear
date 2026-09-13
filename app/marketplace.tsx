import React from "react";

interface User {
  name: string;
  email: string;
}

interface MarketplaceProps {
  user: User | null;
  signInPath: string;
  signOutPath: string;
}

export default function Marketplace({
  user,
  signInPath,
  signOutPath,
}: MarketplaceProps) {
  return (
    <main>
      <div className="marketplace-container">
        <h1>Welcome to Anypart and Gear</h1>
        <p>Buy, Sell and Trade Marketplace</p>
        
        {user ? (
          <div className="user-section">
            <p>Welcome, {user.name}!</p>
            <a href={signOutPath}>Sign Out</a>
          </div>
        ) : (
          <div className="auth-section">
            <p>Sign in to start buying, selling, or trading</p>
            <a href={signInPath}>Sign In</a>
          </div>
        )}
      </div>
    </main>
  );
}
