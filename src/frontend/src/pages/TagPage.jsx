import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../components/HomePage/Sidebar";
import PostCard from "../components/HomePage/Feed";
import SideBarEdit from "../components/HomePage/SidebarEdit";

function TagPage() {
  const { tag } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/posts/${tag}/fetch-by-tag`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [tag]);

  if (!post) {
    return <div>Loading...</div>;
  }

  console.log("Post state:", post);
  return (
    <div>
      <SideBarEdit
        mainFeed={post.data.map((postData) => (
          <PostCard data={postData} />
        ))}
      />
    </div>
  );
}

export default TagPage;
