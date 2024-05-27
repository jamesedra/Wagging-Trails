import React, { useState, useEffect } from "react";
import DropdownSelect from "./Dropdown";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

import axios from "axios";

function EditWalk({ visible, onClose, log }) {
  // stub
  const ownerID = 1;

  // data will be for deleting the schedule selected, so we need to
  // receive the taskID

  const MAX_CONTENT_LENGTH = 255;

  // data for form dropdowns
  const [dogs, setDogs] = useState([]);
  const [friends, setFriends] = useState([]);

  // Dog selection
  const [selectedDogs, setSelectedDogs] = useState([]);
  const handleDogsSelected = (item) => {
    if (!selectedDogs.some((selectedItem) => selectedItem.key === item.key)) {
      setSelectedDogs([...selectedDogs, item]);
    }
  };
  const handleDogRemoved = (itemToRemove) => {
    if (selectedDogs.length === 1) {
      // If there's only one dog selected, do not allow removal
      alert("You cannot remove the last dog selected.");
      return;
    }
    const updatedSelectedDogs = selectedDogs.filter(
      (item) => item.key !== itemToRemove.key
    );
    setSelectedDogs(updatedSelectedDogs);
  };

  // Friend selection
  const [selectedFriends, setSelectedFriends] = useState([]);
  const handleFriendsSelected = (item) => {
    if (
      !selectedFriends.some((selectedItem) => selectedItem.key === item.key)
    ) {
      setSelectedFriends([...selectedFriends, item]);
    }
  };
  const handleFriendRemoved = (itemToRemove) => {
    const updatedSelectedFriends = selectedFriends.filter(
      (item) => item.key !== itemToRemove.key
    );
    setSelectedFriends(updatedSelectedFriends);
  };

  // other selections
  const [rating, setRating] = useState(log.rating);
  const [location, setLocation] = useState(log.location);
  const [date, setDate] = useState(log.date);
  const [distance, setDistance] = useState(log.distance);
  const [time, setTime] = useState(log.time);

  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
  };

  const handleLocationChange = (e) => {
    const inputContent = e.target.value;

    // Check if inputContent exceeds the maximum length
    if (inputContent.length <= MAX_CONTENT_LENGTH) {
      // Update state if within the limit
      setLocation(inputContent);
    }
  };

  const handleDistanceChange = (e) => {
    const inputContent = e.target.value;

    // Check if inputContent exceeds the maximum length
    if (inputContent.length <= MAX_CONTENT_LENGTH) {
      // Update state if within the limit
      setDistance(inputContent);
    }
  };

  const handleTimeChange = (e) => {
    const inputContent = e.target.value;

    // Check if inputContent exceeds the maximum length
    if (inputContent.length <= 8) {
      // Update state if within the limit
      setTime(inputContent);
    }
  };

  // for dog data fetching
  useEffect(() => {
    fetch(`http://localhost:8800/dog/${ownerID}/fetch-all-dog-friends`)
      .then((response) => response.json())
      .then((data) => {
        const parsedDogs = data.data.map((dog) => ({
          key: dog.dogid,
          text: dog.name,
          value: dog.dogid,
        }));
        setDogs(parsedDogs);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [ownerID]);

  // for friends fetching
  useEffect(() => {
    fetch(`http://localhost:8800/friend-list/${ownerID}/fetch-friendship`)
      .then((response) => response.json())
      .then((data) => {
        const parsedFriends = data.data.map((friend) => ({
          key: `${friend.ownerid2}`,
          text: friend.owner_name,
          value: `${friend.ownerid2}`,
        }));
        setFriends(parsedFriends);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [ownerID]);

  // after receiving log, store necessary data (basically an autofill)
  // Update selectedDogs and dates when log changes
  useEffect(() => {
    if (log && log.dogs && dogs.length > 0) {
      const selected = dogs.filter((dog) => log.dogs.includes(dog.text));
      setSelectedDogs(selected);
    }
  }, [log, dogs]);

  // do the same for friends
  useEffect(() => {
    if (log && log.met_up_owners && friends.length > 0) {
      const selected = friends.filter((friend) =>
        log.met_up_owners.includes(friend.text)
      );
      setSelectedFriends(selected);
    }
  }, [log, friends]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedFriends.length);

    try {
      // update the meetups first
      // remove current meetups in the meetupID then make a new one
      // prepare data for upload
      if (log.meetupid !== null && selectedFriends.length > 0) {
        let meetupID = log.meetupid;
        // remove all meetups from schedule
        for (const friend of log.met_up_ownerids) {
          await axios.delete(
            `http://localhost:8800/schedules/${meetupID}/${friend}/delete-schedule`
          );
          console.log("Schedule deleted for ownerid", friend);
        }

        // create meetups
        selectedFriends.push({ value: ownerID });
        // do schedules
        for (const friend of selectedFriends) {
          const scheduleData = {
            meetupID: meetupID,
            ownerID: friend.value,
          };

          const response = await axios.post(
            `http://localhost:8800/schedules/insert-schedule`,
            scheduleData
          );
          console.log("Schedule created for ", friend.text, ":", response.data);
        }
      } else if (log.meetupid !== null && selectedFriends.length === 0) {
        // delete the meetup if removed all selected friends.
        await axios.delete(
          `http://localhost:8800/meetup/${log.meetupid}/delete-meetup`
        );
      } else if (selectedFriends.length > 0) {
        // do meetup
        const meetupData = {
          walkID: log.walkid,
          time: time,
          location: location,
          date: date,
        };
        const response = await axios.post(
          `http://localhost:8800/meetup/insert-meetup`,
          meetupData
        );
        console.log("Meetup created:", response.data);

        // prepare data for upload
        let meetupID = response.data.meetupID;
        console.log(meetupID);
        // Check if postID is available
        if (!meetupID) {
          throw new Error("Error on creating a meetup.");
        }

        selectedFriends.push({ value: ownerID });
        // do schedules
        for (const friend of selectedFriends) {
          const scheduleData = {
            meetupID: meetupID,
            ownerID: friend.value,
          };

          const response = await axios.post(
            `http://localhost:8800/schedules/insert-schedule`,
            scheduleData
          );
          console.log("Schedule created for ", friend.text, ":", response.data);
        }
      }

      // Now, edit the walk details.
      await axios.put(
        `http://localhost:8800/walk/${log.walkid}/update-walk-location`,
        { walklocation: location }
      );
      await axios.put(
        `http://localhost:8800/walk/${log.walkid}/update-walk-date`,
        { walkdate: date }
      );
      await axios.put(
        `http://localhost:8800/walk/${log.walkid}/update-walk-distance`,
        { walkdistance: distance }
      );

      // now the dogs.
      await axios.put(
        `http://localhost:8800/went-for/${log.walkid}/update-wentfor`,
        { rating: rating }
      );

      // delete all the went for tuples first
      for (const dog of log.dogids) {
        await axios.delete(
          `http://localhost:8800/went-for/${log.walkid}/${dog}/delete-went-for`
        );
        console.log("Schedule deleted for dogid", dog);
      }

      // add all from the selected dogs
      for (const dog of selectedDogs) {
        await axios.post(`http://localhost:8800/went-for/insert-went-for`, {
          dogID: dog.value,
          walkID: log.walkid,
          rating: rating,
        });
        console.log("Schedule inserted for dogid", dog);
      }

      console.log("Finished correctly.");
      alert("Walk has been edited.");
      window.location.reload();
    } catch (error) {
      console.error("Error creating schedule:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await axios.delete(
        `http://localhost:8800/walk/${log.walkid}/delete-walk`
      );
      alert("Deleted.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting walk:", err);
    }
  };

  // check if user wants to create a post
  if (!visible) return null;

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div
      id="container"
      onClick={handleOnClose}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      {" "}
      {console.log(log)}
      <div className="bg-white p-4 rounded-xl">
        <h2 className="font-semibold text-center text-xl text-gray-700">
          Edit your {log.meetupid !== null ? "Meetup" : "Walk"}
        </h2>

        <div className="flex items-center my-3 mx-1">
          {/* Selecting Dogs */}
          <h3 className="text-gray-800 mr-3">Dogs*:</h3>
          <DropdownSelect
            userSelection={dogs}
            onItemSelected={handleDogsSelected}
          />
          <div className="text-gray-600 ml-5 m-1">
            <ul className="">
              {selectedDogs.map((dog, index) => (
                <span key={index} className="mr-4">
                  {dog.text}
                  <button onClick={() => handleDogRemoved(dog)}>
                    <XMarkIcon className="h-3 w-3 ml-4" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center">
          <h3 className="text-gray-800 mr-3">Date:</h3>

          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 my-3 focus:outline-none focus:ring focus:border-blue-400"
            placeholderText="YYYY-MM-DD"
            isClearable
          />
        </div>

        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Location*"
            value={location}
            onChange={handleLocationChange}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
          />

          <input
            type="text"
            placeholder="00:00:00"
            value={time}
            maxLength={8}
            onChange={handleTimeChange}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
            onKeyDown={(e) => {
              if (time.length >= MAX_CONTENT_LENGTH && e.key !== "Backspace") {
                e.preventDefault();
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <input
            type="text"
            value={distance}
            placeholder="distance (km)"
            onChange={handleDistanceChange}
            className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 mx-1 focus:outline-none focus:ring focus:border-blue-400"
          />

          <div className="flex mx-1 mb-3">
            <span className="text-gray-400 mr-3 mb-1">Rating: </span>
            {[0, 1, 2, 3, 4].map((star) => (
              <StarIcon
                key={star}
                className={classNames(
                  rating > star ? "text-indigo-500" : "text-gray-300",
                  "h-5 w-5 flex-shrink-0 cursor-pointer"
                )}
                onClick={() => handleStarClick(star + 1)}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <div className="flex items-center mx-1">
          {/* Selecting Friends */}
          <h3 className="text-gray-800 mr-3">Select Friends:</h3>
          <DropdownSelect
            userSelection={friends}
            onItemSelected={handleFriendsSelected}
          />
          <div className="text-gray-600 ml-5">
            <ul className="">
              {selectedFriends.map((friend, index) => (
                <span key={index} className="mr-4">
                  {friend.text}
                  <button onClick={() => handleFriendRemoved(friend)}>
                    <XMarkIcon className="h-3 w-3 ml-2" aria-hidden="true" />
                  </button>
                </span>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center">
          <form onSubmit={handleSubmit} className="mt-4">
            <button
              type="submit"
              className="mx-auto w-30 bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
            >
              Submit
            </button>
          </form>
          <a
            className="text-xs text-red-500 py-3 mt-4 ml-5 "
            onClick={handleDelete}
            href="/home"
          >
            delete walk
          </a>
        </div>
      </div>
    </div>
  );
}

export default EditWalk;
