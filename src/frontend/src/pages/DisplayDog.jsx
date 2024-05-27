import { useEffect, useState } from "react";
import axios from "axios";

const DisplayDog = () => {
  const [dogs, setDog] = useState([]);

  useEffect(() => {
    fetch ('http://localhost:8800/dog')
      .then((response) =>response.json())
      .then((data) => setDog(data))
      .catch((error) => console.error("Error fetching dogs:", error));
  }, [dogs, setDog]);

  if (!dogs) {
    return <div>Loading...</div>;
  }

  console.log("Dog state:", dogs);


  return (
    <ul role="list" className="divide-y divide-gray-100">
      {dogs.data?.map((dog) => (
        <li key={dog.id} className="flex justify-between gap-x-6 py-5">
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">{dog.name}</p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">{dog.breed}</p>
              {dog.birthday !== null ? (
                <div>
                  <p className="text-xs">Birthday:</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{dog.birthday}</p>
                </div>
              ) : null}
            </div>
        </li>
      ))}
    </ul>
  )
}

export default DisplayDog;
