import React, { useState, useEffect } from "react";
import SideBar from "../components/HomePage/Sidebar";
import PostCard from "../components/HomePage/Feed";
import SideBarEdit from "../components/HomePage/SidebarEdit";

function FeedPage() {
  let ownerID = 1;
  const [post, setPost] = useState(null);
  const [cond, setCond] = useState("--"); // this will render as a comment in pg

  const handleCond = (newCond) => {
    setCond(newCond);
  };

  useEffect(() => {
    fetch(`http://localhost:8800/posts/all/${cond}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [cond]);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", post);
  return (
    <div>
      <SideBarEdit
        ownerID={ownerID}
        value={cond}
        onChange={handleCond}
        mainFeed={post.data.map((postData) => (
          <PostCard key={postData.postid} data={postData} />
        ))}
      />
    </div>
  );
}

export default FeedPage;
