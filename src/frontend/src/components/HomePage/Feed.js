import { React } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Function to check if URL is an image
function isImage(url) {
  const extension = url.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension);
}

export default function PostCard({ data }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <>
            {!data.urls[0] || isImage(data.urls[0]) ? (
              // Image
              <div className="relative">
                <a
                  href={`http://localhost:3000/post/${data.ownerid}/${data.postid}`}
                  className="z-10"
                >
                  <img
                    src={
                      data.urls[0]
                        ? `http://localhost:8800/images/${data.urls[0]}`
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
                  href={`http://localhost:3000/post/${data.ownerid}/${data.postid}`}
                  className="z-10"
                >
                  <video
                    src={`http://localhost:8800/videos/${data.urls[0]}`}
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

          <div className="mt-3 px-4 sm:mt-5 sm:px-0 lg:mt-0">
            {/* Post Title */}
            {/* Post Owner */}
            <h2 className="text-lg mt-1 tracking-tight text-gray-700">
              {data.owner_name}
            </h2>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {data.met_up_owners && data.met_up_owners.length > 0 ? (
                <>
                  <div>
                    Met up with{" "}
                    {data.met_up_owners.map((owner, index) => (
                      <span key={index}>
                        {owner}
                        {index !== data.met_up_owners.length - 1 && ", "}{" "}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  Trailing with{" "}
                  {data.dogs.map((dog, index) => (
                    <span key={index}>
                      {dog}
                      {index !== data.dogs.length - 1 && ", "}{" "}
                    </span>
                  ))}
                </div>
              )}
            </h1>

            {/* Walk Details */}
            <div className="mt-0 lg:mt-4">
              <span>{data.location}</span>
            </div>
            {/* Post Tags */}
            <div className="mt-1 xl:mt-8 2xl:mt-16">
              {data.tags.map((tag, index) => (
                <a
                  href={`http://localhost:3000/post/${tag}`}
                  key={index}
                  className="bg-stone-200 text-stone-900 rounded-lg px-2 py-1 mr-2 mt-1"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
