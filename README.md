# Google Drive Clone Design Documentation

Mass File Uploading
![Mass File Uploading](https://github.com/ItsNotCam/GoogleDriveClone/assets/46014191/ddeb643c-c162-4b98-af00-afc73ed0b0cf)

## Overview

This document outlines the design and both high level and low level architecture of my Google Drive clone. The project aims to **replicate the fundamental features of Google Drive**. These features include file uploading, file access management between users, and collaborate through shared comments. Developed with TypeScript, NodeJS, NextJS, ReactJS, and MySQL, the entire **application is containerized for easy deployment using Docker Compose.**

**This application is in active development**

## Tech Stack
* The frontend is built using **ReactJS with TypeScript**, assisted by NextJS's server side functions and SSR.
* **NodeJS and NextJS** work together to form the backend - these manage **user authentication, file handling, and file access control**
* **MySQL** is used to store **user information, file metadata, access permissions, and comments.**

## Containerization

The entire application is **containerized using Docker** and can be deployed easily using **Docker Compose**. The services include a **MySQL container** and a custom-made **NodeJS container**.

## Features

* **File Uploading** - Users can upload files through the user interface - only the original uploader may delete the file permanently, other users may simply revoke their own access
* **Access Management** - Users can grant and revoke access to their files with other users
* **Collaborative Comments** - Users can write comments on the files that they have access to - the owner and the user can delete these comments

# Development Details

## Database
The database stores information about **users, files, user-file ownership, and user comments**. The **entity relationsip diagram** is shown below:
![ERD](https://github.com/ItsNotCam/GoogleDriveClone/assets/46014191/14aa072f-5c42-4396-8c3b-3828bfe46aac)

## API Structure

More official API structure documentation coming soon

| **Method** | **Route** | **Function** |
| ------- | ------------------ | ------------- |
| **POST** | `/api/files/upload` | upload file |
| **GET / PATCH / DELETE** | `/api/files/[FILE_ID]`| get, update, delete file data |
| **GET** | `/api/files/[FILE_ID]/download` | download file |
| **POST** | `/api/files/[FILE_ID]/share` | grant / revoke access to file |
| **POST** | `/api/comments` | add comment |
| **GET** | `/api/comments?user=<user_id>?file=<file_id>` | get comments from user, get comments on file |
| **GET / PATCH / DELETE** | `/api/comments/[COMMENT_ID]` | get, update, delete comment |
| **POST** | `/api/auth/register` | register a new user |
| **POST** | `/api/auth/logout` | logout user |
| **POST** | `/api/auth/login` | login user |
| **GET / PATCH / DELETE** | `/api/users/[USER_ID]` | get, update, delete user data |
