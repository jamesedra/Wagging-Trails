import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import UpcomingSchedules from "../SchedulingBar/UpcomingSchedules";
import PreviousWalks from "../SchedulingBar/PreviousWalks";
import MainNavBar from "../SchedulingBar/MainNavBar";
import ProfileDropDown from "../TopBar/ProfileDropDown";
// import Search from "../TopBar/SearchBar";
import Directories from "../SchedulingBar/Directories";
import SettingsButton from "../SchedulingBar/Settings";
import Logo from "../SchedulingBar/Logo";
import NotificationDropDown from "./NotifDropDown";
import Search from "../TopBar/Search";

export default function SideBarEdit({ mainFeed, ownerID, onChange, value }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const conds = {
    one: "--",
    two: "HAVING COUNT(DISTINCT od.dogid) >= 2",
    three: "HAVING COUNT(DISTINCT own1.ownerid) > 1",
  };

  const handleDropDownClick = () => {
    console.log("Dropdown clicked");
  };

  const handleCondChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                    <Logo />
                    <nav className="flex flex-1 flex-col">
                      <ul className="flex flex-1 flex-col gap-y-7">
                        <Directories ownerID={ownerID} />
                        <UpcomingSchedules />
                        <PreviousWalks />
                        <SettingsButton />
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto text-white bg-indigo-600 px-6 pb-4">
            <Logo />
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <Directories />
                <UpcomingSchedules />
                <PreviousWalks />
                <SettingsButton />
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <Search />
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <NotificationDropDown
                  handleDropDownClick={handleDropDownClick}
                />

                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <ProfileDropDown />
                  <MainNavBar />
                </Menu>
              </div>
            </div>
          </div>

          {value && (
            <div className="flex items-center justify-center mt-10 gap-3">
              <input
                type="radio"
                value={conds.one}
                checked={value === conds.one}
                onChange={handleCondChange}
              />
              <label className="text-gray-500">all</label>
              <br />

              <input
                type="radio"
                value={conds.two}
                checked={value === conds.two}
                onChange={handleCondChange}
              />
              <label className="text-gray-500">group dog walks</label>
              <br />

              <input
                type="radio"
                value={conds.three}
                checked={value === conds.three}
                onChange={handleCondChange}
              />
              <label className="text-gray-500">meetups</label>
              <br />
            </div>
          )}

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{mainFeed}</div>
          </main>
        </div>
      </div>
    </>
  );
}
