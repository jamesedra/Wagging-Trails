import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/HomePage/Sidebar";
import Post from "../components/PostPage/Post";
import SideBarEdit from "../components/HomePage/SidebarEdit";

function PostPage() {
  const { ownerID, postID } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/posts/${ownerID}/${postID}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [ownerID, postID]);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", post);
  return (
    <div>
      <SideBarEdit mainFeed={<Post data={post.data[0]} />} />
    </div>
  );
}

export default PostPage;
