"use client";

import { useState } from "react";

import { AuthModal } from "./AuthModal";
import { LogIn } from "lucide-react";
import { LogOut } from "lucide-react";
// import { signOut } from "@/app/action";
import { Button } from "./ui/button";
import { signOut } from "@/app/auth/callback/action";

type AuthButtonProps = {
  user: string | null;
};

const AuthButton = ({ user }: AuthButtonProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  // console.log(showAuthModal);

  if (user) {
    return (
      <form action={signOut}>
        <Button variant="ghost" size="sm" type="submit" className="gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </form>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="default"
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AuthButton;
