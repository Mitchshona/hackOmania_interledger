# hackOmania_interledger

## Problem Statement
As technology becomes more embedded in daily life, concerns about its impact on mental health and well-being are growing. Teenagers, in particular, are highly susceptible to digital device addiction, which can negatively affect their physical activity, social interactions, and mental health. **hackOmania_interledger** aims to combat teenage addiction to digital devices by rewarding healthier habits, such as reduced screen time and increased offline activities.

## Features

### 1. **Screen Time Monitoring & AI Analysis**
   - Users are encouraged to upload screenshots of their screen time.
   - OpenAI's image analysis scans the uploaded screenshots to track screen time.
   - The goal is to keep the screen time under **2 hours** per day.
   - Streaks are maintained for consistent reduction in screen time.

### 2. **Offline Activity Challenges**
   - Users can participate in challenges that promote offline activities, such as outdoor exercises, social interactions, and more.
   - Completing challenges rewards users with money and public donations.

### 3. **Public Donations via OpenPayment API**
   - Teenagers who reduce their screen time and engage in offline activities are eligible for public donations.
   - Donations are facilitated via the **OpenPayment API**. Contributors can support users by donating to their accounts.
   - The system allows donations to be received and processed securely.
   
### 4. **Streak Multiplier Rewards**
   - Users can earn **streak multipliers** based on consistent screen time reduction and engagement in offline activities.
   - Streaks increase rewards from both challenges and donations.

## Tech Stack
- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express.js
- **API Integration**: 
   - **OpenPayment API** for donations (Main API to receive and make donations).
- **AI Integration**: OpenAI for screen time image scanning.
- **Database**: MongoDB (for user data, challenge tracking, streaks, etc.).

## Installation

### 1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hackOmania_interledger.git
   cd hackOmania_interledger
