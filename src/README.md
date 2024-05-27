# Group Log README


### \*\*_Group Log (3/29/2024)_

**Progress:**
- All functionalities for Owner Profile Page is done.
- All fetches for Post Walks and Walks (via ownerID and tag) is done.
- Inserting and Scheduling Meetups for multiple owners done.
- Inserting tagged dogs in Posts is done.
- Initialization of .sql file 90% done. Missing Media insertions as it needs to know URLs. But you can already use it to prototype and develop different files in the backend and frontend.

Missing: update and delete queries for Post Walk, Walk, Meetups, Schedules, TaggedIn in progress. But templating it should make it easier to finish.

**NOTE: if your db is bugged, you can use drop.sql and create a new one. or just POST _http://localhost:8800/fill-all_.

To test fetch functionalities, try these GET requests. (Must have a filled database)
- _http://localhost:8800/walk/1_, viewing walks based on ownerID = 1
- _http://localhost:8800/posts/5/6_, viewing a post based on ownerID = 5, postID = 6
- _http://localhost:8800/posts/3/3_, viewing a post that is a meetup, ownerID = 3, postID = 3
- _http://localhost:8800/posts/5/fetch-by-owner_, viewing all posts made by ownerID = 5
- _http://localhost:8800/posts/doggers/fetch-by-tag_, viewing all posts with tag **#doggers**
- _http://localhost:8800/notification/walk-task/4_, view lists of notications (walkTasks ONLY), based on ownerID = 4

**NOTE: there currently is no all notification fetch. Prioritized the walkTask to use for the scheduling bar.

<br>

### \*\*_Group Log (3/14/2024)_

service/post-walk WIP.

Post_Walk setup done. For entities that has other dependencies, see
setup and initialization implementation.

Also moved Group Log inside src folder to keep main README file clean.

<br>

### \*\*_Group Log (3/13/2024)_

Approved merge from react-setup into main

FYI Branch Naming Conventions:

- For a back-end service or controller -> service/branch-name
- For a front-end feature -> feature/branch-name

<br>

### \*\*_Group Log (3/11/2024)_

Please review frontend setup 1 pull request. I reorganized the directory.

Please note before merging, save your .env files for the backend and place it in _src/backend_. This is to separate node modules for the backend and the front end.

Also, please install dependencies:

```
npm install

```

In both _src/backend_ and _src/client_.

React will be deployed in localhost:3000, while fetching the data in localhost:8800.
