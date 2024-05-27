import React, { useState, useEffect } from "react";
import PostCard from "../components/HomePage/Feed";
import SideBarEdit from "../components/HomePage/SidebarEdit";
import { useParams } from "react-router-dom";

function MultiTagPage() {
  const { tags } = useParams();
  const tagsArray = tags.split("+");
  const [post, setPost] = useState(null);

  useEffect(() => {
    const sendTags = { tags: tagsArray }; // Tags in the format { "tags": ["doggers", "jackAndJohn"] }
    fetch(`http://localhost:8800/tagged-in/posts-with-tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendTags),
    })
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));
  });

  if (!post) {
    return <div>Loading...</div>;
  }

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
export default MultiTagPage;
