import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'


function extractInitials(name) {
    const names = name.split(' ');
    const initials = names.map(n => n.charAt(0));
    return initials.join('').toUpperCase();
  }

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function MyFriends({friends}) {

console.log(friends);
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
    <div className="-ml-4 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
      <div className="ml-4 mt-2">
        <h3 className="text-base font-semibold leading-6 text-gray-900">My Friends</h3>
      </div>
      <div className="ml-4 mt-2 mb-4 flex-shrink-0">
        <button
          type="button"
          className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add friend
        </button>
      </div>
    </div>
    <ul role="list" className="divide-y divide-gray-100">
      {friends.map((friend) => (
        <li key={friend.ownerid2} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
        <span className="font-medium leading-none text-white">{friend.owner_name? extractInitials(friend.owner_name): ""}</span>
      </span>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                <a href={friend.href} className="hover:underline">
                  {friend.owner_name}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                <a href={`mailto:${friend.email}`} className="truncate hover:underline">
                  email: {friend.email}
                 
                </a>
            
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
              number: {friend.phonenumber}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
              friends since: {friend.dateoffriendship ? friend.dateoffriendship.substring(0, 10) : '0000-00-00'}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              {friend.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time dateTime={friend.lastSeenDateTime}>{friend.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
            <Menu as="div" className="relative flex-none">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        View profile<span className="sr-only">, {friend.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Message<span className="sr-only">, {friend.name}</span>
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </li>
      ))}
    </ul>
    </div>
  )
}
