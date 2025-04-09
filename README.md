## Real Estate Portfolio

A modern website built for real estate agents to manage property listings and receive messages from potential clients. It allows agents to upload images and videos of properties, which are stored on [Cloudinary](https://cloudinary.com/) (free tier available).

### 🛠️ Technologies Used

- **Next.js 15**
- **Node.js 22.14**

---

### 🚀 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

---

### ☁️ Cloudinary Setup

This project uses [Cloudinary](https://cloudinary.com/) to handle image and video uploads. You'll need a Cloudinary account (free tier available).

1. Create a free account: [https://cloudinary.com/](https://cloudinary.com/)
2. Get your Cloudinary credentials:
   - **Cloud name**
   - **API key**
   - **API secret**
3. Add them to your `.env.local` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 🔐 Environment Variables

Create a `.env.local` file in the root of your project and include all the environment variables listed in `env.example`.

```bash
cp env.example .env.local
```

---

### 👨‍💻 Made By

Built with ❤️ by Eyob Worku

For any questions or feedback, feel free to reach out!
