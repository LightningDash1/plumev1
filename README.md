# Plume Pocket

**LOVABLE PROMPT – PLUME (Teen Finance App)**

> Build a **mobile-first fintech application** called **“Plume”**, designed specifically for **teenagers aged 13–19** to help them **understand and manage daily digital spending** in a simple, non-intimidating way.

---

### **App Type**

Mobile app (Android-first, iOS-ready)
Minimalist, youth-friendly UI
Beginner-friendly fintech experience

---

### **Core Problem**

Teenagers use UPI, cards, and subscriptions daily but **lack spending awareness**.
Existing finance apps are **too complex and adult-focused**.

---

### **Core Solution**

Plume automatically tracks expenses, identifies subscriptions, and presents **simple insights** that help teens build healthy money habits early.

---

## **Required Screens & Logic**

### **1. Onboarding Flow**

* Ask age (13–19)
* Ask monthly allowance / income range
* Ask top spending categories (food, shopping, transport, subscriptions)
* Explain privacy in simple language
* Optional parent email (skippable)

---

### **2. Home Dashboard**

Show:

* Today’s spending amount
* One key insight (e.g. “You spent ₹120 on food today 🍔”)
* Weekly spending bar (very simple)
* CTA: “View details”

Logic:

* Pull transaction data from mock API
* Update insights dynamically

---

### **3. Expense Breakdown**

* List of recent transactions
* Auto-categorised expenses
* Filter by day / week
* No complex charts (use cards and lists)

---

### **4. Subscriptions Page**

* Detect recurring transactions
* Show:

  * App name
  * Amount
  * Renewal date
* Alert 3 days before renewal
* Button: “Remind me to cancel”

---

### **5. Savings Goals**

* Create small goals (₹500 / ₹1000 / custom)
* Progress bar
* Encouraging messages (“Almost there 🎯”)
* Streak counter (optional)

---

### **6. Profile & Privacy**

* Toggle parental summary access (read-only)
* Data privacy explanation
* App theme options

---

## **Design Instructions**

* Use soft gradients and friendly colors
* Large typography
* Simple icons and emojis
* Avoid financial jargon
* Teen-friendly microcopy

---

## **Data Model (Simplified)**

* User (age, goals, preferences)
* Transaction (date, amount, category)
* Subscription (name, amount, renewal_date)
* SavingsGoal (target, progress)

---

## **Technical Setup**

* Use mock UPI/bank data for demo
* Local state or simple backend
* Focus on **MVP functionality**
* Scalable structure

---

## **Tone**

Supportive, friendly, confidence-building
Never strict, never judgmental

---

## **Expected Output**

* Functional mobile app prototype
* Clickable flows
* Sample data populated
* Clean UI ready for demo & judging

---

### 🧠 **Lovable Pro Tip (for Zonal Round)**

After generation:

* Rename buttons to **human language** (“Check spending”, not “Analytics”)
* Add **1 insight card per screen**
* Keep navigation to **max 4 tabs**

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://plumev1.lovable.app

Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8ad0db9c-bfd8-43a7-9dce-2e0f26a4f2f7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
