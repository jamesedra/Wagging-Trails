import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyFriends from "../components/FriendsPage/myFriends";
import SideBar from "../components/HomePage/Sidebar";
import SideBarEdit from "../components/HomePage/SidebarEdit";
import Profile from "../components/ProfilePage/profile.js";


function MyFriendsPage() {
  const { ownerID } = useParams();
  const [friendsData, setFriendsData] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);


  // fetches friend list
  useEffect(() => {
    fetch(`http://localhost:8800/friend-list/${ownerID}/fetch-friendship`)
      .then((response) => response.json())
      .then((data) => setFriendsData(data))
      .catch((error) => console.error("Error fetching friends:", error));
  }, [ownerID]);


  if (!friendsData) {
    return <div>Loading...</div>;
  }

  console.log("Friend Data:", friendsData);
  
  return (
    <div>
        <SideBarEdit
        mainFeed={ <MyFriends friends={friendsData.data}/>}
      />
     
    </div>
  );
}

export default MyFriendsPage;