Travel Website

A responsive travel website built using HTML, CSS, and JavaScript.

The website includes a main travel landing page along with login and signup functionality. User login information is handled on the frontend using LocalStorage, so users can sign up, log in, and log out without needing a backend.

Live Website: [https://brilliant-dusk-18da0e.netlify.app/](https://travel-website-sp-propelius.netlify.app/)

About the Project

This project is designed as a simple travel website where users can explore different sections of the website and interact with the available features.

The main page includes sections for destinations, services, trip booking, testimonials, subscriptions, and more. The website also has separate **Login** and **Signup** pages.

The authentication flow is handled using JavaScript and browser **LocalStorage**. When a user signs up, their information is stored locally in the browser. The login page then checks the entered credentials against the stored information.

The website also updates the navigation depending on whether the user is logged in or logged out.

---

Features

Travel Landing Page

The main page contains several sections:

- Hero section
- Travel services
- Popular destinations
- Book a trip section
- Testimonials
- Partner/company logos
- Subscription section
- Footer

Login & Signup

The project includes separate pages for user authentication:

- User signup
- User login
- Password and confirm-password validation
- Login/logout functionality
- Login state management
- Navigation changes based on login status

LocalStorage

User authentication is handled on the frontend using the browser's **LocalStorage**.

The project uses LocalStorage to:

- Store signup information
- Check login credentials
- Keep track of the user's login state
- Maintain the login state after refreshing the page
- Handle logout

Note: This is a frontend learning project, so LocalStorage is being used instead of a real authentication system or database. It should not be used for storing real passwords or sensitive user information in a production application.

Responsive Design

The website is designed to work across different screen sizes, including:

- Desktop
- Tablet
- Mobile

Responsive CSS is separated into different files to keep the styles organized.

---

Technologies

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Netlify

---

Project Structure

```text
Travel-website/
│
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── mobile.css
│   │   └── tablet.css
│   │
│   └── images/
│       ├── header/
│       ├── book_trip-section/
│       ├── destination-section/
│       ├── hero-section/
│       ├── logos-section/
│       ├── service-section/
│       ├── subscription-section/
│       ├── testimonials-section/
│       └── footer/
│
├── pages/
│   ├── login.html
│   └── signup.html
│
├── js/
│   ├── login.js
│   ├── signup.js
│   └── utilities.js
│
└── index.html
```

---

How Authentication Works

The authentication flow is completely handled on the client side.

Signup

1. User opens the Signup page.
2. User enters their details.
3. JavaScript validates the input.
4. The signup information is stored in LocalStorage.
5. The user can then log in using the registered credentials.

Login

1. User enters their email/username and password.
2. JavaScript retrieves the stored information from LocalStorage.
3. The entered credentials are checked against the stored data.
4. If the credentials are correct, the user is considered logged in.
5. The website updates the navigation accordingly.

Logout

When the user logs out, the login state is removed and the navigation changes back to the logged-out state.

---

Run the Project Locally

Clone the repository:

```bash
git clone https://github.com/Sneh1227/travel-website.git
```

Open the project in VS Code.

You can then run `index.html` using Live Server.

No backend setup or database is required to run the current version.

---

Deployment

The website is deployed using Netlify.

Live Demo

[https://brilliant-dusk-18da0e.netlify.app/](https://travel-website-sp-propelius.netlify.app/)

---

Future Improvements

Some features that could be added in future versions:

- Real backend authentication
- Database integration
- Supabase/Firebase authentication
- Real trip booking functionality
- Destination search and filtering
- User profiles
- Saved/favourite destinations
- Real newsletter subscription
- Better form validation
- Improved accessibility

---

Author

Sneh Prajapati

A frontend project built with HTML, CSS, and JavaScript.

Feel free to explore the project and check out the live website!
