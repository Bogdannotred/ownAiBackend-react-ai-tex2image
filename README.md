
# 🧠 Text-to-Image AI Generator with Firebase

This project is a **React + Firebase** application that allows users to generate images from text prompts using an external AI model (e.g., DeepAI, Replicate, or Stability AI). Generated images are stored in Firebase Storage and can be viewed later via Firestore history.

---

## 📸 Demo

Watch a live demo: [YouTube Demo](https://youtu.be/6g4HcdH5mWQ)

---

## ✨ Features

- 🔤 Text-to-image generation using AI API (DeepAI / Stable Diffusion)
- ☁️ Firebase Functions handle backend logic
- 🗂 Generated images are stored in Firebase Storage
- 🕓 User prompt history saved in Firestore
- 🔐 Optional: Firebase Authentication for personalized access
- 🌐 Responsive UI built with React + TypeScript + Vite

---

## 🛠 Tech Stack

| Layer     | Technology                 |
|-----------|----------------------------|
| Frontend  | React, TypeScript, Vite    |
| Backend   | Firebase Functions (Node.js) |
| Storage   | Firebase Storage           |
| Database  | Firestore                  |
| AI Model  | DeepAI / Stability AI / Replicate |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up Firebase

- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable:
  - Firebase Functions
  - Firestore
  - Storage
  - (Optional) Authentication
- Install Firebase CLI if needed:
  ```bash
  npm install -g firebase-tools
  ```

### 4. Deploy Cloud Function

Inside the `functions/` folder:

```bash
cd functions
npm install
firebase deploy --only functions
```

> Make sure to add your AI API key in a secure way (e.g., using Firebase config or environment variables).

---

## 🧪 Run Locally

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Firebase Function Example

```ts
export const generateImage = functions.https.onCall(async (data, context) => {
  const prompt = data.prompt;
  const response = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: {
      'Api-Key': 'YOUR_DEEPAI_API_KEY',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `text=${encodeURIComponent(prompt)}`
  });

  const result = await response.json();
  const imageUrl = result.output_url;

  await admin.firestore().collection('images').add({
    prompt,
    imageUrl,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { imageUrl };
});
```

---

## ✅ TODO / Improvements

- [ ] Add Firebase Authentication for users
- [ ] Paginate image history
- [ ] Allow image download/share
- [ ] Add model selection (Stable Diffusion, DALL·E, etc.)
- [ ] Add environment variable support for API keys

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
