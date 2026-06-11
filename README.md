# BrainBreak

BrainBreak is a student productivity and burnout-prevention web app designed to help students organize assignments, plan study sessions, take healthier breaks, and manage schoolwork without feeling overwhelmed.

## Overview

Many students struggle with procrastination, stress, screen fatigue, and burnout when completing homework or studying for long periods of time. BrainBreak helps solve this problem by combining task planning, focus timers, personalized breaks, and a supportive study coach in one simple app.

BrainBreak is built as a front-end web app using HTML, CSS, and JavaScript.

## Purpose

BrainBreak is not just a regular to-do list. Its goal is to help students study in a healthier way by reminding them to take breaks before they burn out.

The app helps students:

* organize assignments by priority
* plan what to work on first
* use focus timers based on their tasks
* take breaks based on assignment type
* avoid too much screen time
* create smaller to-do lists
* save basic profile and study settings
* personalize the look of the app

## Current Features

### Smart Task Planning

Students can add school assignments with:

* task name
* class name
* estimated time
* priority level
* assignment type

Assignment types include:

* online / screen-based
* paper / offline
* mixed

BrainBreak uses this information to help decide what the student should work on first.

### Study Plan Generator

BrainBreak creates a recommended study order based on task priority. High-priority tasks are shown first so students can focus on the most important work before moving to easier tasks.

### Focus Timer

The focus timer is based on the highest-priority task in the student’s list. BrainBreak chooses a focus session length and recommended break length based on the task’s priority and estimated time.

For example, a longer high-priority task may get a longer focus session and a longer break, while a shorter low-priority task may get a shorter session.

### Smart Break Suggestions

BrainBreak suggests break ideas based on the student’s break preferences, energy level, location, and assignment type.

The app also considers whether the student was working online or on paper:

* If the assignment is online, BrainBreak recommends offline breaks to reduce screen fatigue.
* If the assignment is on paper, a short online break may be allowed with a timer.
* If the assignment is mixed, BrainBreak encourages an offline break first.

### BrainBreak Coach

BrainBreak Coach is a simple built-in chatbot-style study helper. It can respond to common student situations such as:

* feeling tired
* feeling stressed
* feeling overwhelmed
* needing motivation
* procrastinating
* not knowing what to do first
* wondering whether an online break is a good idea

The coach gives supportive, practical suggestions to help students reset and keep going.

### To-Do List

BrainBreak includes a separate to-do list for smaller reminders or steps inside larger assignments.

Students can:

* add to-do items
* press Enter to add an item quickly
* mark items complete
* undo completed items
* delete items

The to-do list is saved in the browser using localStorage.

### Profile & Settings

The Profile & Settings section allows students to personalize their BrainBreak experience.

Students can save:

* email for local sign-in
* name
* grade level
* study goal
* saved classes
* preferred focus length
* preferred break length
* study style
* app theme

This information is saved locally in the browser.

### Local Email Sign-In

BrainBreak currently includes a simple local email sign-in feature. A student can enter their email, and the app will remember it on that device.

This is not a real account login yet. It does not use a password or database. It is a local sign-in experience using browser storage.

### Theme Customization

Students can choose different app themes, including:

* Calm Blue
* Lavender Focus
* Mint Energy
* Sunset
* Dark Mode

The selected theme is saved after refresh.

### Enter Key Shortcuts

BrainBreak supports pressing Enter to quickly submit certain inputs, such as:

* adding a task
* adding a break activity
* adding a class
* signing in locally
* adding a to-do item
* sending a BrainBreak Coach message

## Technologies Used

* HTML
* CSS
* JavaScript
* LocalStorage
* GitHub Pages

## How to Use

1. Open the BrainBreak website.
2. Go to Profile & Settings.
3. Enter your email, profile information, classes, and study preferences.
4. Add assignments in the Add Tasks section.
5. Generate a study plan.
6. Use the Focus Timer to begin studying.
7. Take a recommended BrainBreak when the timer ends.
8. Use BrainBreak Coach when you feel stuck, tired, or overwhelmed.
9. Use the To-Do List for smaller checklist items.

## Project Status

BrainBreak is currently a front-end prototype. It works in the browser and saves data locally using localStorage.

Current version includes:

* task management
* study planning
* smart break recommendations
* focus timer
* BrainBreak Coach
* to-do list
* profile and settings
* local email sign-in
* theme customization

## Future Improvements

Possible future features include:

* real account sign-in with Firebase Authentication
* saving data across multiple devices
* Firestore database for user profiles and tasks
* friend groups or study groups
* rewards, points, and badges
* leaderboards
* calendar integration
* image upload for handwritten to-do lists
* AI-powered task extraction from uploaded images
* real AI study coach
* better mobile layout
* notifications or alarm sounds for break reminders

## Why BrainBreak Matters

BrainBreak is designed to help students manage schoolwork in a healthier way. Instead of encouraging students to work nonstop, it helps them balance focus and rest.

The main goal of BrainBreak is simple:

Study smarter. Take better breaks. Prevent burnout.
