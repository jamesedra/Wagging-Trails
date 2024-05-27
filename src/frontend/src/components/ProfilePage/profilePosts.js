import React from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Function to check if URL is an image
function isImage(url) {
  const extension = url.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension);
}

export default function PostCardForProfile({ data }) {
  console.log("post card Data:", data); // Log data to inspect its structure

  if (!data || !Array.isArray(data)) {
    return <div>No data available.</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 lg:max-w-7xl lg:px-8">
        {data.map((post, index) => (
          <div
            className="lg:grid lg:grid-cols-2 py-5 lg:items-start lg:gap-x-8"
            key={index}
          >
            <>
              {!post.url || isImage(post.url) ? (
                // Image
                <div className="relative">
                  <a
                    href={`http://localhost:3000/post/${post.ownerid}/${post.postid}`}
                    className="z-10"
                  >
                    <img
                      src={
                        post.url
                          ? `http://localhost:8800/images/${post.url}`
                          : "/walkingdog.jpeg"
                      }
                      alt=""
                      className="h-full w-full object-cover object-center rounded-lg relative"
                      style={{ aspectRatio: "21/9", width: "100%" }}
                    />
                    <div className="absolute inset-0 bg-gray-700 opacity-0 transition-opacity duration-300 hover:opacity-40 rounded-lg"></div>
                  </a>
                </div>
              ) : (
                // Video
                <div className="relative">
                  <a
                    href={`http://localhost:3000/post/${post.ownerid}/${post.postid}`}
                    className="z-10"
                  >
                    <video
                      src={`http://localhost:8800/videos/${post.url}`}
                      alt=""
                      className="h-full w-full object-cover object-center rounded-lg"
                      style={{ aspectRatio: "21/9", width: "100%" }}
                      controls
                    />
                    <div className="absolute inset-0 bg-gray-700 opacity-0 transition-opacity duration-300 hover:opacity-40 rounded-lg"></div>
                  </a>
                </div>
              )}
            </>

            <div className="mt-6 px-4 py-5 sm:mt-5 sm:px-0 lg:mt-0">
              <h2 className="text-lg mt-5 py-5 tracking-tight text-gray-700">
                {post.content}
              </h2>
              <div className="mt-0 lg:mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
