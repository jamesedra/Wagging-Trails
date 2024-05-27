# Wagging Trails: _project_f6o6r_o4l8z_z1f3s_

A 304 Project by Delsther James Edralin, Sangita Dutta, and Aman Johal. Milestone 4 README below.

## Project Description

The project is a social platform that manages outdoor, dog walking activities. The domain of this project focuses on **pet wellbeing**, which relates to pet care, recreation, and health. This mainly caters for people that are dog owners and want to guarantee their dogs to receive consistent stimulation by regular walks.

### Stack and Libraries Used

> **Backend:** Node.js, Express, PostgreSQL<br><br> 
>**Frontend:** React Native, JavaScript<br><br> 
>**Other Libraries/Packages needed:**
>
> - Nodemon (prototyping)
> - Axios (http request from node.js)
> - Cors (for Connect/Express middleware)


# Milestone 4 README

Here are the notes for using the application.

## Installation:
Upon cloning the repository, please install dependencies:

```
npm i
```

On these directories:
```
project_f6o6r_o4l8z_z1f3s/src
project_f6o6r_o4l8z_z1f3s/src/backend
project_f6o6r_o4l8z_z1f3s/src/frontend
```

## Setting up:

On pgAdmin 4, **create** a new Database if there isn't an existing one already.

Then, create a *.env* file filled with these variables:
```
USER={username in postgres. It's typically postgres}
PASSWORD={your password}
HOST=localhost
PORT=5432
DATABASE={the database name you created in pgAdmin 4}
```
Please store this in *project_f6o6r_o4l8z_z1f3s/src/backend*.


## Booting up the application

In the directory *project_f6o6r_o4l8z_z1f3s/src*, please use:

```
npm start
```

If done correctly, it will launch the application.
<br/>



# Milestone 3 README
## Task/breakdown

This section will first have the development checklist per member, in which the division of task was chosen to be end-to-end. Below it are the timeline and descriptions of the features needed for the application. This can be seen in the _milestone 3.pdf_ as well.

**Frontend Development**

| Aman                                 | Sangita                               | James                            |
| ------------------------------------ | ------------------------------------- | -------------------------------- |
| <ul><li>[x] Owner’s Friend List Page | <ul><li>[x] Home/Newsfeed             | <ul><li>[x] Owner’s Profile Page |
| <ul><li>[x] Dog Modal Window         | <ul><li>[ ] Login Page                | <ul><li>[x] Owner’s Post Page    |
|                                      | <ul><li>[x] Side Menu Bar             | <ul><li>[x] Side Scheduling Bar  |
|                                      | <ul><li>[x] Notification Modal Window |                                  |

**Backend Entity Functions Development**

| Aman                                                        | Sangita                                                        | James                                                 |
| ----------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| <ul><li>[X] `Owner` - for friend list                       | <ul><li>[ ] `Owner` - for login and search                     | <ul><li>[X] `Owner` - for profile page                |
| <ul><li>[X] `Friendship` - for friend list                  | <ul><li>[x] `Walk` - for scheduling bar and post               | <ul><li>[X] `Owns_Dog` - for profile page             |
| <ul><li>[X] `Owns_Dog` - for dog window                     | <ul><li>[x] `Post_Walk` - for post                             | <ul><li>[x] `Walk` - for scheduling bar and post      |
| <ul><li>[X] `Walk` - for dog window                         | <ul><li>[ ] `Friendship` - for posts                           | <ul><li>[x] `Post_Walk` - for scheduling bar and post |
| <ul><li>[X] `Post_Walk` - for dog window                    | <ul><li>[X] `Receives_Notifications` - for notification window | <ul><li>[X] `On_MeetUp` - for scheduling bar and post |
| <ul><li>[X] `WentFor` - for dog window                      | <ul><li>[x] `FriendPost` - for posts                           | <ul><li>[x] `Schedules` - for scheduling bar          |
| <ul><li>[ ] `On_MeetUp` - for dog window                    |                                                                | <ul><li>[X] `TaggedIn` - for post                     |
| <ul><li>[x] `Post_Media`, `Video`, `Photo` - for dog window |                                                                | <ul><li>[x] `Post_Media`, `Video`, `Photo` - for post |
| <ul><li>[ ] `TaggedIn` - for dog window                     |                                                                | <ul><li>[x] `Logs` - for scheduling                   |

**Misc. Checklist**

| Aman | Sangita                                     | James                                                                    |
| ---- | ------------------------------------------- | ------------------------------------------------------------------------ |
|      | <ul><li>[x] Service rerouting to PostgreSQL | <ul><li>[x] Server, controller, and service file setup and documentation |
|      | <ul><li>[x] Frontend/Tailwind Layouting     | <ul><li>[x] Frontend setup                                               |
|      | <ul><li>[ ] Persistent Storage Integration  | <ul><li>[x] Media Storage Integration                                    |

## Timeline

**Week 1 [Mar 4 - 10]:** Setting up the code base.

- Initial setup of PostgreSQL and React. Integration of the database to Node.js and Express.
- Templating controller and service files.
- Media storage integration I (documenting how to develop).

**Week 2 [Mar 11-17]:** Easy tasks to gradually get in through development. More on functionalities.

- Home Page (as it only needs to fetch the user’s owner and its friends posts then sort it to recent)
- Owner’s friend list (also easy fetching and crud operations)
- Side Menu Bar - Basic functionalities. Mainly working on search.
- Notification Modal Window (to complement the menu bar)
- Owner’s Post Page I - more for data retrieval and not media storage fetching.
- The needed controller and service files for these functions.

**Week 3 [Mar 18- 24]**: Developing the harder parts.

- Owner’s Profile page I (Finish edit profile, add friend, and link to friend list)
- Media storage integration II (implementation)
- Owner’s Post Page II (should be complete with media integration. Will also reflect on homepage)
- Side Scheduling Bar I (Finish upcoming walks, plan forms and past walk with dropdown features)
- Login page and functionality through persistent storage integration
- Dog Modal Window I (Display needed data in a window)
- The needed controller and service files for these functions

**Week 4 [Mar 25 - 31]:** We should probably be nearly done at this point. Design stage.

- Owner’s profile page II (finish this)
- Scheduling Bar II (finish this)
- Dog Modal Window II (finish this)
- Styling

**April 1 - 5:** Extra buffer days to catch up with pitfalls. Other than that: fix bugs, tasks, and more styling.

## Website Main Features Breakdown

### Pages

**Owner’s Profile Page**

The URL will be based on the owner’s ID. Whether the user is the owner or not.

Example URL: _http://localhost:8800/owner/23_ where 23 is the ownerID of Owner.

- Shows an owner’s name and contact details
- Edit profile button - edits name and contact. Hidden when the user is not the owner.
- Add friend button - automatically creates a friendID. Hidden when the profile page is the user’s.
- Friend List - shows 6 friends with a button that directs to the friends page to view more.
- Dog display - shows a few dogs’ names and icons the owner owns. Once a dog is clicked, it will show a modal window. (See Dog Modal Window component below).
- Owner’s posts - shows either media or walk details via a card shaped component sorted by most recent date. Which when clicked, will go to the link of the post. (See Owner’s Post Page)
  <br>

**Owner’s Friend List**

The URL will also be based on ownerID.

Example URL: _http://localhost:8800/owner/friend-list/23_ where 23 is the ownerID.

- Shows the list of friends, date where they became friends, and how many meetups they had together (we can use meetup IDs for this. If they have the same meetupID, it will be noted via count.)
- Hyperlinks of these friends, to go to their profile pages.
- If the user is the owner in the friend list, they can unfriend them (Should also remove the friend’s friendship with the user. Eg. Friendship(1,2,DATE) is removed, then Friendship(2,1,DATE) is also removed.)
- Sorted by the most recent friend. If possible maybe add a sort selection feature.

```
Example:
{John Doe	1/11/23	Meetups: 5	[unfriend][view profile]}
```

Where the view profile button is a link to his page and the unfriend button is shown if it’s the user’s friend list.
<br>

**Home/Newsfeed**

URL: _http://localhost:8800/_

- Shows a list of the owner’s (the user’s owner in particular), and their friends’ posts sorted in most recent.
- If there is no user logged in, it should redirect to the Login Page.
  > Note that it should not redirect to the log-in page if the link was not the home’s URL. (A non-logged-in user should be able to check post pages, friend list, and profile pages).
  > <br>

**Login Page**
URL: _http://localhost:8800/log-in-sign-up/_

- Users should fill up their email, name, and phone number (allowed to be null) if they do not have an account. Otherwise, login.
  <br>

**Owner’s Post Page**

Example: _http://localhost:8800/owner/post/12/_ where 12 is the postID from Post_Walk entity.

- Shows the Post with the media, content, and tags.
- Shows the Walk’s (or MeetUp’s) details particular to that post (time, location, date, dog, etc.)
- If the user is the owner of the post, they can edit and delete this page.
- Once deleted, it should redirect back to the user’s profile page.

```
Example:
{                         [x]
[photo]
Alberta Pond
10/25/23

Walked with Peggy.
Went to the pond today with this doggers right here.
#pond #doggers						}
```

<br>

### Panels/Components

**Side Menu Bar**

- Always shown (I propose to put this at the left like instagram’s webpage). Functions below are listed in order from top to bottom for the icons. (Can be rearranged though)
- Home Icon - sends the user back to Home’s URL
- Search - This function would be searching all the owners’ names via a query. For example, if the search value was “Ja”, it should show owners like “Jake”, “Janice” “Jajaja”, etc.
- Minimize the number of results. Meaning the user has to search the full name to find out the results. We will also not have a search page to view all owners to make it simpler.
- Notification Icon - pops up a modal window (See Notification Modal Window Component).
- Profile Icon - sends the user to the user’s owner profile page.
- Logout button - logs the user out.

**Side Scheduling Bar**

- Only shown when the URL is at the home page. (Right side). Also in order.
- User’s upcoming walks or meetups - will show a maximum of 4 with a dropdown toggle. Sorted in the closest upcoming walk with a brief description of each.
- Delete and Edit button beside. They can also remove or edit a walk if they want.

```
  Example: {Walk with Peggy. 10/11/24}
  	   {MeetUp with Perry and Peggy. 10/23/24}
      {Walk with Edgar. 5.0 km goal!}
  	   	{[see more]}
```

- Schedule Button - provides a dropdown form once the schedule button is clicked..

```
Example of the form:
Location*: [Pond in Alberta]		Date: [DD:MM:YY]
Dogs Participating*: [Peggy] [Jake]	Owners Participating: [---------]
Time: [--:--:--]				Distance Goal: [---------]

[submit][cancel]
```

- Past walks/meetup list (also max. 4 with a see more button), shows a brief description of each
  If the walk/meetup was posted, it shows a [VIEW] button that hyperlinks to the post URL.

```
Example:
{Walk with Peggy. 3/11/24 [view]}
{Walk with Peggy. 3/11/24 [post]}
	{[see more]}
```

- If the walk/meetup was not posted, it shows a [POST] button which provides a form.

```
Example of the form:
Post your previous walk with Peggers.

Media: [upload file] or [add link]
Content: [---------]
Tags: [---------]
[submit][cancel]
```

- The post should always be connected to some WalkID.
- See Media Storage for details on media uploading.

**Notification Modal Window**

- Shows notifications that are either walks or meetups (unclickables), and friend posts (links the user to the post url).

```
Example:
{It’s time to walk Peggy!}
{Janice just shared her recent walk.}
```

- Has an exit button which will slide the window to the left to hide.
  <br>

**Dog Modal Window**

- A window when a user clicks a dog icon in some owner’s profile page. Shows their walk histories. Users will be able to edit the dog’s details.
- Dog’s are shown through pre-built icons.

```
	Example:
	[icon clicked]
	{				[x]
	Peggers		3 years, 4 months
	Pug
	[photo1][photo2][photo3][photo4]}
```

> Note that the photo will come from the media from the post that is connected to the walkID and dogID. There would be some algebra to get it, but not too hard.

## Other Features

**Persistent Storage** - helps to know who the current user’s owner is. We will implement this using a barebones mechanic in firebase.

**Media Storage** - used mostly for posts. We need some sort of place to store these images so we only store links in the database. It should generate a link as well after uploading a photo.

**Header and Footer components** - extra, can be done in later times.

## SQL Integration

We will be using PostgreSQL, instead of the planned DBMS MySQL. It was changed due to an authentication bug from version 8.1.0. It will be integrated using Node.js and Express with React as the frontend framework.

Each entity from our milestone 1/2 will have their own controller and service .js file to connect to the database. The functions that will be implemented will be based on our current needs for the features in our webpage. Current files will be in the backend folder of our repository.
The controller file would handle the calls to the service file.
The service file would send the queries to the server.
