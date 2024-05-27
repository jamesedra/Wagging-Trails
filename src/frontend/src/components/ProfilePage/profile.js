import { React, Fragment, useState, useEffect } from "react";
import SideBarEdit from "../../components/HomePage/SidebarEdit";
import PostCardForProfile from "./profilePosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import MyDogModal from "./myDogModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile({
  ownerDetails,
  posts,
  friends,
  dogs,
  ownerID,
  walkCount,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postData, setPostData] = useState(posts.data);
  const [ownerInfo, setOwnerInfo] = useState(ownerDetails.data[0]);
  const [dogData, setDogData] = useState(dogs.data);
  const [updatedDogDetails, setUpdatedDogDetails] = useState([]);
  const [profileEditClicked, setProfileEditClicked] = useState(false);
  const [dogEditClicked, setDogEditClicked] = useState(false);
  const [ownerName, setOwnerName] = useState(ownerInfo.owner_name);
  // const [updatedDogData, setUpdatedDogData] = useState(updatedDogDetails.data);

  const [firstName, lastName] = ownerName.split(" ");

  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);

  const [newNumber, setNewNumber] = useState(ownerInfo.phonenumber);
  const [newEmail, setNewEmail] = useState(ownerInfo.email);
  const [selectedDogDetails, setSelectedDogDetails] = useState();

  const handleProfileEditClick = () => {
    setProfileEditClicked(!profileEditClicked);
  };

  const handleDogEditClick = () => {
    setDogEditClicked(!dogEditClicked);
    console.log("dog edit clicked", dogEditClicked);
  };

  const handleFirstNameChange = (e) => {
    setNewFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setNewLastName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleSave = (e) => {
    // update owner name
    fetch(`http://localhost:8800/owner/${ownerID}/update-name`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: newFirstName,
        lastName: newLastName,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Owner name updated successfully:", data);
        let newName = newFirstName + " " + newLastName;
        console.log("new name", newName);
        setOwnerName(newName);
      })
      .catch((error) => {
        console.error("Error updating owner name:", error);
      });

    // update owner contact
    fetch(`http://localhost:8800/owner/${ownerID}/update-contact`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: newEmail,
        phoneNumber: newNumber,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Owner contact updated successfully:", data);
      })
      .catch((error) => {
        console.error("Error updating owner contact:", error);
      });

    // close editing tab
    setProfileEditClicked(!profileEditClicked);
  };

  const handleSelectedDogDetails = (selectedDogDetails) => {
    setUpdatedDogDetails(selectedDogDetails);
  };

  useEffect(() => {
    handleSelectedDogDetails(); // Call it without any arguments to initialize with default or pre-selected details
  }, []);

  console.log("updated dog details", updatedDogDetails);

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      {/* owner details */}
      <div className="flex gap-10">
        <h2 className="sr-only">Profile</h2>
        <div className="rounded-lg grid-cols-2 bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                Profile
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              {profileEditClicked ? (
                <div className="">
                  <dd className="inline-flex  items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 mr-2">
                    <button onClick={handleProfileEditClick}>cancel</button>
                  </dd>
                  <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <button onClick={handleSave}>save</button>
                  </dd>
                </div>
              ) : (
                <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <button onClick={handleProfileEditClick}>edit</button>{" "}
                </dd>
              )}
            </div>
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              <dt className="flex-none">
                <span className="sr-only">name</span>
                <UserCircleIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm font-medium leading-6 text-gray-900">
                {profileEditClicked ? (
                  <>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newFirstName}
                      onChange={handleFirstNameChange}
                      className=" appearance-none  w-20 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    />

                    <input
                      type="text"
                      placeholder="last name"
                      value={newLastName}
                      onChange={handleLastNameChange}
                      className="appearance-none  w-20 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                    />
                  </>
                ) : (
                  ownerName
                )}
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Phone number</span>
                <PhoneIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {profileEditClicked ? (
                  <input
                    type="text"
                    value={newNumber}
                    onChange={handlePhoneNumberChange}
                    className="appearance-none  w-30 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                  />
                ) : (
                  newNumber
                )}
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Email</span>
                <EnvelopeIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {profileEditClicked ? (
                  <input
                    type="text"
                    value={newEmail}
                    onChange={handleEmailChange}
                    className="appearance-none  w-30 px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                  />
                ) : (
                  newEmail
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-6 px-2 py-2"></div>
        </div>

        {/* my dogs */}
        <h2 className="sr-only">My dogs</h2>
        <div className="rounded-lg grid-cols-2 flex-auto bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                My dogs
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              {dogEditClicked ? (
                <div className="">
                  <MyDogModal
                    ownerID={ownerID}
                    onSelectedDogDetails={handleSelectedDogDetails}
                  />
                  <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    <button onClick={handleDogEditClick}>edit</button>
                  </dd>
                </div>
              ) : (
                <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  <button onClick={handleDogEditClick}>edit</button>
                </dd>
              )}
            </div>
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              {updatedDogDetails
                ? updatedDogDetails.data &&
                  updatedDogDetails.data.map((dog, index) => [
                    <dt key={`dt-${index}`} className="flex-none">
                      <span className="sr-only">Dogs</span>
                      <FaceSmileIcon
                        className="h-6 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>,
                    <dd
                      key={`dd-${index}`}
                      className="text-sm font-medium leading-6 text-gray-900"
                    >
                      {dog.name}
                    </dd>,
                    <dd
                      key={`dd-breed-${index}`}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
                    >
                      {dog.breed}
                    </dd>,
                  ])
                : dogData.map((dog, index) => [
                    <dt key={`dt-${index}`} className="flex-none">
                      <span className="sr-only">Dogs</span>
                      <FaceSmileIcon
                        className="h-6 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>,
                    <dd
                      key={`dd-${index}`}
                      className="text-sm font-medium leading-6 text-gray-900"
                    >
                      {dog.name}
                    </dd>,
                    <dd
                      key={`dd-breed-${index}`}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20"
                    >
                      {dog.breed}
                    </dd>,
                  ])}
            </div>
          </dl>
          <div className="mt-6 px-2 py-2"></div>
        </div>

        {/* walk counter */}
        <h2 className="sr-only">Walk Counter</h2>
        <div className="rounded-lg grid-cols-1 flex-auto bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                Walk Participation
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
            </div>
            <div className="mt-6 w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              {walkCount.data.map((count, index) => (
                <div key={`pair-${index}`} className="flex mb-3">
                  <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    {count.num_dogs} dogs in a walk
                  </div>
                  <div className="text-xs ml-5 leading-6 text-gray-900">
                    {count.num_walks} walks
                  </div>
                </div>
              ))}
            </div>
          </dl>
          <div className="mt-6 px-2 py-2"></div>
        </div>
      </div>

      {/* my posts */}
      <div className=" mt-10 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              My Posts
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
          </div>

          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <PostCardForProfile data={postData} />
          </div>
        </dl>
      </div>
    </div>
  );
}
