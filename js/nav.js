
"use strict";



/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $("#user-story-actions").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

async function submitStory(e) {
  e.preventDefault(); 
  $allStoriesList.hide();
  $loginForm.hide();
  $signupForm.hide();
  $("#new-story-form").show();  
}

async function showfavorites (e) {
  e.preventDefault();  
  hidePageComponents();
  putfavoritesOnPage();
}

function showMyStories(e) {
  e.preventDefault();
  $allStoriesList.hide();
  hidePageComponents();
  putUserStoriesOnPage();
}

$("#submit-story").on("click", submitStory);
$("#show-favorites").on("click", showfavorites);
$("#my-stories").on("click", showMyStories);





