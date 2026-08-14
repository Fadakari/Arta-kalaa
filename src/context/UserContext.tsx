"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User } from "@/types/user";

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) => {
  const user = initialUser || null;
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

