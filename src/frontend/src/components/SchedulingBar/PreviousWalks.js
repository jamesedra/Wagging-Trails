import { useState, useEffect } from "react";
import CreatePost from "../ModalWindow/NewPostForm";
import EditWalk from "../ModalWindow/EditWalkForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PreviousWalks() {
  const ownerID = 1; // stub

  // Walk states
  const [walks, setWalks] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/walk/${ownerID}`)
      .then((response) => response.json())
      .then((data) => setWalks(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [ownerID]);

  // Creating a Post from Walk will pop up a window
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Carry Walk states
  // has: walkID, meetupID, doglist, meetup ownerlist,
  const [walk, setWalk] = useState(null);

  // Validation
  if (!walks) {
    return <div>Loading...</div>;
  }

  return (
    <li>
      <div className="text-sm font-semibold leading-6 text-indigo-200">
        Previous Walks
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {walks.data.map((walk) => (
          <li key={walk.walkid} className="flex items-center">
            <button
              onClick={() => {
                setWalk(walk);
                setShowEditForm(true);
                console.log(walk);
              }}
              className={classNames(
                "text-indigo-200 hover:text-white hover:bg-indigo-700 w-full",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
            >
              {/*Check if it's a meetup or not*/}
              {walk.meetupid !== null ? (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                    {walk.num_dogs}
                  </span>
                  <span className="truncate">
                    {new Date(walk.date).toLocaleDateString()} meetup
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                    {walk.num_dogs}
                  </span>
                  <span className="truncate">
                    {new Date(walk.date).toLocaleDateString()}{" "}
                    {walk.dogs.join(", ")}
                  </span>
                </>
              )}
            </button>
            {/*check if it has a post already*/}
            {walk.postid !== null ? (
              <a
                href={`/post/${walk.ownerid}/${walk.postid}`}
                className="ml-auto hover:text-gray-100 text-gray-300 font-bold py-1 px-2 text-xs text-right"
              >
                View
              </a>
            ) : (
              <button
                onClick={() => {
                  setWalk(walk);
                  setShowForm(true);
                }}
                className="ml-auto hover:text-gray-100 text-gray-300 font-bold py-1 px-2 text-xs"
              >
                Post
              </button>
            )}
          </li>
        ))}
      </ul>
      {showForm && (
        <CreatePost
          onClose={() => {
            setWalk(null);
            setShowForm(false);
          }}
          data={walk} // Pass the current walk data to CreatePost
          visible={true}
        />
      )}
      {showEditForm && (
        <EditWalk
          onClose={() => {
            setWalk(null);
            setShowEditForm(false);
          }}
          log={walk} // Pass the current walk data to CreatePost
          visible={true}
        />
      )}
    </li>
  );
}
