import React, { useState } from "react";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

export default function DropdownSelect({ userSelection, onItemSelected }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    onItemSelected(item); // Pass selected item back to parent
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button
          className="text-gray-700"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedItem ? selectedItem.text : "Select"}
        </Menu.Button>
        <Transition
          as={Fragment}
          show={dropdownOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute left-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
            onClick={() => setDropdownOpen(false)} // Close dropdown on click outside
          >
            {userSelection.map((item) => (
              <Menu.Item key={item.text}>
                {({ active }) => (
                  <span
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900"
                    )}
                    onClick={() => handleItemClick(item)}
                  >
                    {item.text}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
