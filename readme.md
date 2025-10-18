# 🔐 Secure Password Vault

A modern, privacy-first password manager built with **Next.js (frontend)** and **NestJS (backend)**.
It ensures your credentials remain encrypted both in transit and at rest — using a **client-side master key** that never leaves your browser.

---

## 🚀 Features

* **Zero-Knowledge Encryption:**
  All your vault data (username, password, URL, folder, etc.) is **encrypted in the browser** using your master key before being sent to the server.

* **No JWT / No Server-Side Key Storage:**
  The server never sees or stores your master key or raw credentials — making your data inaccessible even to administrators.

* **Next.js Frontend:**
  Smooth and responsive interface to add, view, and organize your vault entries securely.

* **NestJS Backend:**
  Structured, scalable API that stores encrypted vault entries in MongoDB.

* **Password Strength Meter:**
  Helps users create strong and secure passwords by visually indicating password strength.

* **Automatic Password Generator:**
  Instantly generates strong, random passwords with customizable options.

* **Folder Organization:**
  Categorize credentials in folders for better management.

* **Secure by Design:**
  Even if the database is compromised, your data remains safe — everything stored is already encrypted.

---

## 🧠 How It Works

1. **User Login / Signup:**
   The user signs up or logs in using their email. No password is required for authentication in this version.

2. **Master Key Generation:**
   When the user logs in, a **unique master key** is generated **locally in the browser**.
   This key is **never sent to the server**.

3. **Client-Side Encryption:**
   Every credential you save is encrypted in the browser using the master key (AES-256 or similar algorithm).

4. **Server Storage (NestJS + MongoDB):**
   The encrypted data is sent to the backend and stored securely in MongoDB.
   Each vault entry includes fields like:

   ```json
   {
     "username": "encryptedString",
     "url": "encryptedString",
     "password": "encryptedString",
     "folder": "encryptedString"
   }
   ```

5. **Decryption on Browser:**
   When viewing entries, encrypted data is fetched from the server and decrypted locally using the same master key.

---

## 🧩 Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Frontend      | Next.js (TypeScript, React)         |
| Backend       | NestJS (TypeScript, Express)        |
| Database      | MongoDB (Mongoose ODM)              |
| Encryption    | CryptoJS / Web Crypto API (AES-256) |
| Communication | REST API (HTTPS)                    |

---

## 📂 Folder Structure (Simplified)

```
project/
├── client/          # Next.js frontend
│   ├── components/
│   ├── pages/
│   ├── utils/       # encryption / decryption + password generator
│   └── ...
│
├── server/          # NestJS backend
│   ├── src/
│   │   ├── user/
│   │   ├── vault/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── ...
│
└── README.md
```

---

## 💡 Benefits

* **User-First Privacy:** Your master key and credentials never leave your device.
* **Secure Storage:** Data breaches don’t expose sensitive information.
* **Cross-Platform:** Works on any device with a modern browser.
* **Open-Source Transparency:** Code can be audited for security.
* **No Third-Party Dependency for Auth:** Simple yet secure user experience without JWT complexity.

---

## 🛠️ Future Improvements

* Add **browser extension support**
* Add **biometric unlock** for convenience
* Introduce **cloud sync across devices using encrypted blobs**

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a new branch (`feature/new-feature`)
3. Commit changes
4. Open a Pull Request 🎉

---

## ⚖️ License

MIT License © 2025 **Tanmay Joshi**
