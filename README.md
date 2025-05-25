
> Admin credentials (for demo):
> - *Username*: admin
> - *Password*: admin123

---

## 📌 Features

### 👤 Profile Display
- Lists user profiles with name, photo, and short description.
- Each profile has an adjacent *Summary* button.

### 🗺️ Interactive Mapping
- Integrates a dynamic map to show profile addresses using Mapbox or similar service.
- Marker highlights the exact location for a selected profile.
- Profile cards trigger map updates when interacted with.

### 🔍 Search & Filter
- Real-time filtering of profiles by name or location.
- Smooth UX to quickly locate specific users.

### 📋 Profile Detail View
- Clicking on a profile opens a detailed view with:
  - Full name
  - Bio
  - Address
  - Interests (optional)
  - Contact information

### ⚙️ Admin Panel
- Secure admin login.
- Create, update, or delete profiles.
- Form validation for profile management.
- Authenticated routes protect the dashboard.

### 📱 Responsive UI
- Mobile-first design principles.
- Optimized for desktop, tablet, and smartphone devices.

### ⚠️ Error Handling & UX Enhancements
- Graceful handling of:
  - Invalid addresses
  - API failures
  - Empty data states
- Uses loading spinners during map rendering or API calls.

---

## 🧱 Tech Stack

| Category        | Stack                                                                 |
|----------------|-----------------------------------------------------------------------|
| *Framework*   | React.js                                                             |
| *State Mgmt*  | React Context (or Redux if applicable)                               |
| *Routing*     | React Router                                                         |
| *Map*         | Mapbox GL JS or Google Maps API                                      |
| *Styling*     | CSS Modules / Tailwind / Styled Components (based on implementation) |
| *Deployment*  | Vercel                                                               |
| *Auth*        | Simple form-based authentication (non-production)                   |

---

## 🛠️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/garimas24/profile-map-app.git
cd profile-map-app

# Install dependencies
npm install

# Run locally
npm start
