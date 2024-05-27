import { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { CommandLineIcon } from "@heroicons/react/20/solid";

const dogDetails = [
  { id: 1, detail: "name" },
  { id: 2, detail: "breed" },
];
export default function MyDogModal({ ownerID, onSelectedDogDetails }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const defaultIds = dogDetails.map((detail) => detail.id);
    setSelectedIds(defaultIds);
  }, []);

  const handleCheckboxChange = (detailID) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(detailID)) {
        return prevIds.filter((id) => id !== detailID); // If ID exists, remove it
      } else {
        return [...prevIds, detailID]; // If ID doesn't exist, add it
      }
    });
  };

  useEffect(() => {
    console.log(selectedIds);
  }, [selectedIds]);

  const generateCond = (selectedIds) => {
    let cond = "";
    if (selectedIds.includes(1)) {
      cond += "name";
    }
    if (selectedIds.includes(2)) {
      cond += (cond ? ", " : "") + "breed";
    }
    return cond;
  };

  let cond = generateCond([...selectedIds]);
  console.log("cond", cond);

  const fetchSelectedDogDetails = () => {
    fetch(`http://localhost:8800/dog/${ownerID}/${cond}`)
      .then((response) => response.json())
      .then((data) => setSelectedOptions(data))
      .catch((error) => console.error("Error fetching dogs:", error));
    setOpen(false);
  };

  useEffect(() => {
    onSelectedDogDetails(selectedOptions);
    console.log("selected details", selectedOptions);
  }, [onSelectedDogDetails, selectedOptions]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Dog Details
                    </Dialog.Title>
                    <div className="mt-2">
                      <fieldset>
                        <div className="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                          {dogDetails.map((detail, detailId) => (
                            <div
                              key={detailId}
                              className="relative flex items-start py-4"
                            >
                              <div className="min-w-0 flex-1 text-sm leading-6">
                                <label
                                  htmlFor={`person-${detail.id}`}
                                  className="select-none font-medium text-gray-900"
                                >
                                  {detail.detail}
                                </label>
                              </div>
                              <div className="ml-3 flex h-6 items-center">
                                <input
                                  id={`detail-${detail.id}`}
                                  name={`detail-${detail.id}`}
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                  onChange={() =>
                                    handleCheckboxChange(detail.id)
                                  }
                                  checked={selectedIds.includes(detail.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={fetchSelectedDogDetails}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
