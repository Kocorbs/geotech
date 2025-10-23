"use client";

import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex gap-2 items-center cursor-pointer w-full"
    >
      <IconLogout />
      Log out
    </button>
  );
}
