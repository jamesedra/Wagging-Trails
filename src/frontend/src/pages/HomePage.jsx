import SideBar from "../components/HomePage/Sidebar";
import ActivityFeed from "../components/HomePage/ActivityFeed";

function HomePage() {
    return (
        <div>
        <SideBar mainFeed={<ActivityFeed />} />
    </div>

    );
}

export default HomePage;