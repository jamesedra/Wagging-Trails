import { useState, useEffect } from "react";
import CreateSchedule from "../ModalWindow/NewSchedulingFormEdit";
import CreateWalk from "../ModalWindow/NewWalkForm";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingSchedules() {
  const ownerID = 1; // stub

  // Schedule states
  const [schedules, setSchedules] = useState(null);

  // Creating a schedule will pop up a window
  const [showFormSchedule, setShowFormSchedule] = useState(false);
  const [showFormWalk, setShowFormWalk] = useState(false);
  const [log, setLog] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/notification/walk-task/${ownerID}`)
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error fetching walk task:", error));
  }, [ownerID]);

  const handleDelete = async (logData) => {
    console.log(logData);

    // delete the logs, then walk-task, then walk-alert.
    for (const notifIDs of logData.notificationids) {
      const deleteResponse = await axios.delete(
        `http://localhost:8800/notification/${notifIDs}/${logData.taskid}/delete-log`
      );
      console.log("Deleted response: ", deleteResponse);
    }

    // delete walk-task
    const deleteTaskResponse = await axios.delete(
      `http://localhost:8800/notification/${logData.taskid}/delete-organizes-walk`
    );
    console.log("Deleted walktask: ", deleteTaskResponse);

    // delete walk-alert
    for (const notifIDs of logData.notificationids) {
      const deleteAlertResponse = await axios.delete(
        `http://localhost:8800/notification/${notifIDs}/delete-walk-alert`
      );
      console.log("Deleted response: ", deleteAlertResponse);
    }
    // all done.
    console.log("Finished correctly.");
  };

  if (!schedules) {
    return <div>Loading...</div>;
  }

  return (
    <li>
      <div className="flex justify-center mb-6">
        {" "}
        <button
          onClick={() => setShowFormSchedule(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-lg"
        >
          {" "}
          Schedule a Task!
        </button>
      </div>
      <div className="text-sm font-semibold leading-6 text-indigo-200">
        Upcoming Tasks
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {schedules.data.map((walk) => (
          <li key={walk.taskid} className="flex items-center">
            <a
              href={`#task-${walk.taskid}`}
              className={classNames(
                "text-indigo-200 hover:text-white hover:bg-indigo-700 w-full",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
              onClick={() => {
                setLog(walk);
                setShowFormWalk(true);
              }}
            >
              <span className="flex px-3 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                {walk.walkeventtype !== null ? ` ${walk.walkeventtype}` : "act"}
              </span>
              {walk.date !== null ? (
                <span className="truncate">
                  {new Date(walk.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                </span>
              ) : (
                ""
              )}
              <span className="truncate">{walk.dognames.join(", ")}</span>
            </a>
            <button
              onClick={() => {
                handleDelete(walk);
              }}
              className="ml-auto hover:text-gray-100 text-gray-300 font-bold py-1 px-2 text-xs"
            >
              cancel
            </button>
          </li>
        ))}
      </ul>
      {showFormSchedule && (
        <CreateSchedule
          onClose={() => {
            setShowFormSchedule(false);
          }}
          visible={true}
        />
      )}
      {showFormWalk && (
        <CreateWalk
          onClose={() => {
            setShowFormWalk(false);
          }}
          log={log}
          visible={true}
        />
      )}
    </li>
  );
}
