// Copyright © Tomasz Miotk, Crystalen Project TM.
// This code is proprietary and for viewing purposes only.
// Copying, editing, or distributing any part of this code
// is strictly prohibited without explicit permission from the author.

type WelcomeProps = {};

export default function Welcome(_: WelcomeProps) {
  return (
    <div className="welcome-center">
      <h1>Welcome to the App!</h1>
      <p>Get started by exploring the features.</p>
      <button onClick={() => alert("Getting Started!")}>Get Started</button>
    </div>
  );
}
