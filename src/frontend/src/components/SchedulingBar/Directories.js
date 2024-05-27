import { useState, useEffect } from "react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Newsfeed",
    href: "/home",
    icon: HomeIcon,
    current: true,
  },
  { name: "Profile", href: "/profile", icon: UserIcon, current: false },
  { name: "Friends", href: "/friends", icon: UserGroupIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function Directories({ownerID}) {

  return (
    <li>
      <ul className="-mx-2 space-y-1">
        {navigation.map((item, index) => (
          <li key={item.name}>
            <a
              href={item.href+'/1'}
              className={classNames(
                item.current
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? "text-white"
                    : "text-indigo-200 group-hover:text-white",
                  "h-6 w-6 shrink-0"
                )}
                aria-hidden="true"
              />
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
