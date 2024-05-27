import { React, useState, forwardRef, useImperativeHandle } from "react";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

// Function to check if URL is an image
function isImage(url) {
  const extension = url.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension);
}

const EditPostMedia = forwardRef(({ postid, data }, ref) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async () => {
    const fileFormData = new FormData();
    for (const file of files) {
      fileFormData.append("files", file);
    }
    fileFormData.append("postID", postid); // Append postID here

    console.log(files);
    if (files.length > 0) {
      const uploadResponse = await axios.post(
        "http://localhost:8800/media/upload",
        fileFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded:", uploadResponse.data);
    }
  };

  const handleDelete = async (url) => {
    console.log(url);
    try {
      await axios.delete(`http://localhost:8800/media/${url}/delete-media`);
      alert("image deleted. Please click edit post to continue editing.");
      window.location.reload();
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit,
  }));

  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-2 gap-6">
          {data[0] !== null &&
            data.map((url, index) => (
              <Tab
                key={index}
                className="relative flex h-36 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
              >
                {({ selected }) => (
                  <>
                    <span className="sr-only">{`Media ${index + 1}`}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      {isImage(url) ? (
                        // Image
                        <img
                          src={`http://localhost:8800/images/${url}`}
                          alt={`Media ${index + 1}`}
                          className="h-full w-full object-cover object-center"
                        />
                      ) : (
                        // Video
                        <div className="h-full w-full relative">
                          <video
                            src={`http://localhost:8800/videos/${url}`}
                            alt={`Media ${index + 1}`}
                            className="h-full w-full object-cover object-center rounded-lg"
                            controls
                          />
                          <div className="absolute inset-0 bg-transparent"></div>
                        </div>
                      )}
                    </span>
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(url)} // Assuming handleDelete is a function to handle deletion
                      className="absolute top-0 right-0 m-2 p-2 text-white rounded-full hover:bg-red-400 focus:outline-none"
                    >
                      <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </>
                )}
              </Tab>
            ))}
        </Tab.List>
      </div>

      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="w-full border border-gray-300 text-gray-900 rounded-md py-2 px-3 mb-3 focus:outline-none focus:ring focus:border-blue-400"
      />
    </Tab.Group>
  );
});
export default EditPostMedia;
