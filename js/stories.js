"use strict";


// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let btn = '';
  let removeStoryBtn = '';
  const hostName = story.getHostName(story); 
  if (currentUser) {
    btn = `<button class="make-favorite">Make favorite</button>`;
  }
  if (fromMyStories) {
    removeStoryBtn = `<button class="remove-story">Remove story</button>`;
  }
  
  let element =  $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        ${btn} ${removeStoryBtn}</li>`);  
   return element;   
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $(".make-favorite").on("click", addfavListener);

  $allStoriesList.show();
}

function putUserStoriesOnPage() {
  $allStoriesList.empty();
  if (userStories.length === 0) {
    $allStoriesList.append("<h1>You havn't posted any stories yet.</h1>");
  } else {
    $allStoriesList.append("<h1>My Stories</h1>");
  }
  
  fromMyStories = true;

  // loop through all of the user stories and generate HTML for them
  for (let story of userStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $(".make-favorite").on("click", addfavListener);
  $(".remove-story").on("click", removeStory);

  $allStoriesList.show();
  fromMyStories = false;
}
 
function addfavListener(e) {
  e.preventDefault();
  // get story id from id attribute of containg li
  let storyID = $(this).parent().attr("id");
  let result = currentUser.addOrRemoveFav(currentUser, storyID, "add");
  if (result) {alert("The story was marked as a favorite.")};
  console.log("in the fav listener");
}

async function processNewStory(e) {
  e.preventDefault();
  if ($("#title").val() && $("#author").val() && $("#url").val()) {
    const newlyAddedStory = await storyList.addStory(currentUser, {title :  $("#title").val(),
                                            author : $("#author").val(), 
                                            url : $("#url").val()});  
    $("#new-story-form").hide();
    putUserStoriesOnPage();
  } else {
    alert("All the information in the form is required. Please provide the missing information.");
  }
}

async function removeStory(e) {
  e.preventDefault;
  let result = storyList.removeStoryFromAPI(currentUser, $(this).parent().attr("id"));
  for (let i = 0 ; i < userStories.length; i++) {
    if (userStories[i].storyID = $(this).parent().attr("id")) {
        let deleteStory = userStories.splice(i, 1);
        break;
    }
  }
  $(this).parent().remove();
}

function generatefavMarkup(fav) {
  // console.debug("generateStoryMarkup", story);

  const hostName = fav.url;
  let btn = '';
  if (currentUser) {
    btn = `<button class="remove-favorite">Remove favorite</button>`;
  }
  
  let element =  $(`
      <li id="${fav.storyId}">
        <a href="${fav.url}" target="a_blank" class="story-link">
          ${fav.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${fav.author}</small>
        <small class="story-user">posted by ${fav.username}</small>
        ${btn}</li>`);  
   return element;   
}

function putfavoritesOnPage() {
  console.debug("putfavoritesOnPage");
  $allStoriesList.empty();
  if (currentUser.favorites.length === 0) {
    $allStoriesList.append("<h1>You havn't marked any stories as favorites yet.</h1>");
  } else {
    $allStoriesList.append("<h1>My Favorite Stories</h1>");
  }

  // loop through the current user's favorites and generate HTML for them
  for (let fav of currentUser.favorites) {
    const $fav = generatefavMarkup(fav);
    $allStoriesList.append($fav);
  }
  $(".remove-favorite").on("click", removeFavListener);
  $allStoriesList.show();
}

async function removeFavListener(e) {
  e.preventDefault();
  let res = await currentUser.addOrRemoveFav(currentUser, $(this).parent().attr("id"), "remove");
  putfavoritesOnPage();
}

$newStoryForm.on("submit", processNewStory);



