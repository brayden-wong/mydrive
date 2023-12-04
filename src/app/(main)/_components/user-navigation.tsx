"use client";

import { UserProfile } from "../_types";
import Image from "next/image";
import { User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type UserNavigationProps = UserProfile;

const UserNavigation = ({ id, username, profile }: UserNavigationProps) => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center justify-start gap-x-2">
      {profile?.avatar ? (
        <Image width={32} height={32} src={profile.avatar} alt="profile" />
      ) : (
        <DropdownMenu open={dropdownMenu} onOpenChange={setDropdownMenu}>
          <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full">
            <User2Icon className="h-8 w-8" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="right-2" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link
              className="flex w-full cursor-pointer items-center justify-between"
              href="/settings/profile"
            >
              <DropdownMenuItem className="w-full">
                Profile
                <DropdownMenuShortcut>⌘⇧P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export { UserNavigation };
