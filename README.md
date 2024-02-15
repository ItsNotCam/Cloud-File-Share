# Google Drive Clone

![Preview](https://github.com/ItsNotCam/GoogleDriveClone/assets/46014191/d9525e95-c1ed-4510-bab3-e84e34985279)


## Overview

This document outlines the design of my Google Drive clone. The project aims to **replicate the fundamental features of Google Drive**. These features include file uploading, and file access management between users. Developed with TypeScript, NodeJS, NextJS, ReactJS, and MySQL, the entire **application is containerized for easy deployment using Docker Compose.**

[Watch the Demo](https://streamable.com/e/c7hyo6)

## Tech Stack
* The frontend is built using **ReactJS with TypeScript**, assisted by NextJS's server side functions and SSR.
* **NodeJS and NextJS** work together to form the backend - these manage **user authentication, file handling, and file access control**
* **MySQL** is used to store **user information, file metadata, access permissions, and comments.**

## Containerization

The entire application is **containerized using Docker** and can be deployed easily using **Docker Compose**. The services include a **MySQL container** and a custom-made **NodeJS container**.

## Features

* **File Uploading** - Users can upload files through the user interface - only the original uploader may delete the file permanently, other users may simply revoke their own access
* **Access Management** - Users can grant and revoke access to their files with other users

# Development Details

## API Structure

More official API structure documentation coming soon

| **Method** | **Route** | **Function** |
| ------- | ------------------ | ------------- |
| **POST** | `/api/files/upload` | upload file |
| **GET / PATCH / DELETE** | `/api/files/[FILE_ID]`| get, update, delete file data |
| **GET** | `/api/files/[FILE_ID]/download` | download file |
| **POST** | `/api/files/[FILE_ID]/share` | grant / revoke access to file |
| **POST** | `/api/files/[FILE_ID]/unshare` | grant / revoke access to file |
| **POST** | `/api/auth/register` | register a new user |
| **POST** | `/api/auth/logout` | logout user |
| **POST** | `/api/auth/login` | login user |

## Database
The database stores information about **users, file objects, file instances, authentication, and user comments**. The **entity relationsip diagram** is shown below:

![ERD](https://github.com/ItsNotCam/GoogleDriveClone/assets/46014191/be1532bd-fe9b-4ccd-a184-bca38b93911f)
