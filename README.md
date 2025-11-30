# PhotoSprout 📸  
**Angular + Firebase social/photo-sharing app (SoftUni course project)**

PhotoSprout is a simple photo-sharing application built with Angular where users can browse a catalog of photos, comment, like and customize their own profiles.
It's a course project @SoftUni.

---

## 📝 Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Setup & Installation](#setup-and-installation)  
- [Configuration & Environment Variables](#configuration-environment-variables)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Security & Privacy Notes](#security-privacy-notes)  
- [License](#license)  

---

## 🔧 Features

- Browse a catalog of photos / posts  
- Detailed view for each photo: title, image, description, author  
- Like / unlike functionality  
- Commenting system (authenticated users can post comments)  
- Real-time updates for likes & comments  
- User authentication (Firebase Auth)  
- User profile customization

---

## 🛠️ Tech Stack

| Part                | Technology / Library |
|---------------------|----------------------|
| Front-end Framework | Angular (standalone components, TypeScript) |
| Backend / Database  | Firebase Firestore & Authentication |
| Hosting / Storage   | Firebase (for images / data storage) |
| State Management    | RxJS / Angular services |
| Styling / Layout    | CSS / basic global styles |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.x recommended)  
- npm (or yarn)  
- A Firebase project with Firestore and Authentication configured  

### Setup & Installation

```bash
# 1. Clone the repo
git clone https://github.com/BozTsvetkov03/PhotoSprout.git
cd PhotoSprout

# 2. Install dependencies
npm install

# 3. Create environment file
# Copy the env file under Configuration & Environment Variables with your firebase config

# 4. Run development server
ng serve
```
## Configuration & Environment Variables
Because this repository is public, the real Firebase configuration (API key, auth domain, project ID, etc.) is not included.
To run locally, create your own environment file (src/environment/environment.ts) and fill in with your Firebase config.

```bash
    export const environment = {
        production: false,
        firebaseConfig: {
            apiKey: "...",
            authDomain: "...",
            projectId: "...",
            storageBucket: "...",
            messagingSenderId: "...",
            appId: "..."
        }
    }
```

## Usage

Browse catalog of photos on home page.

Click a post to view details: title, image, description, author.

If logged in: you can like/unlike posts (heart icon), leave comments.

Comments appear in real-time without needing full page refresh.

Add your own photos / posts and edit them.

## Project Structure

```bash
PhotoSprout/
  ├─ src/
      ├─ app/
      │    ├─ components/   # Angular components (catalog, item-details, etc.)
      │    ├─ services/     # Firebase services (catalog, auth, like, comment)
      │    ├─ types/        # TypeScript interfaces (CatalogItem, UserComment, etc.)
      ├─ environment/       # environment.ts (not committed)
  ├─ public/                # static assets (icons, svg, css)
  ├─ README.md              # ← you are here
  ├─ package.json  
  └─ ...  
```

## Security & Privacy Notes
- Firebase configuration API keys are not committed.

- Firestore security rules protect read/write access only authenticated users can write likes/comments; only author can edit/delete their own content.

## License
This project is for educational purposes (SoftUni course). Feel free to use it for learning.