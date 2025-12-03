# 🎯 Quiz Master

A modern, interactive quiz application built with vanilla JavaScript that fetches trivia questions from the Open Trivia Database API. Test your knowledge across multiple categories with a beautiful, responsive interface featuring dark mode support.

## 📋 Table of Contents

- [Features](#-features)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Project Structure](#️-project-structure)
- [Technologies Used](#️-technologies-used)
- [Features in Detail](#-features-in-detail)
- [API Information](#-api-information)
- [Browser Compatibility](#-browser-compatibility)
- [Code Features](#-code-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

![Quiz Master](https://img.shields.io/badge/Quiz-Master-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![HTML5](https://img.shields.io/badge/HTML5-E34F26-orange) ![CSS3](https://img.shields.io/badge/CSS3-1572B6-blue)

## ✨ Features

- **📚 Multiple Categories**: Choose from 30+ categories including Science, History, Sports, Movies, and more
- **🎲 Flexible Quiz Length**: Select 5, 10, 20, 25, 30, 40, or 50 questions per quiz
- **🌓 Dark Mode**: Toggle between light and dark themes with smooth transitions
- **📊 Quiz History**: View your past quiz results with detailed breakdowns
- **✅ Instant Feedback**: Get immediate feedback on your answers with color-coded responses
- **💾 Local Storage**: Your quiz history is automatically saved in your browser
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface with smooth animations and transitions

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An internet connection (for fetching questions from the API)

### Installation

1. **Clone the repository** or download the project files:
   ```bash
   git clone <repository-url>
   cd MyDailyWork_Task3
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local development server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

3. **Access the app**:
   - Navigate to `http://localhost:8000` (or the port your server uses)
   - Or double-click `index.html` to open directly in your browser

## 📖 How to Use

### Starting a Quiz

1. **Select Quiz Settings**:
   - Choose the number of questions (5-50)
   - Select a category from the dropdown (or leave as "Mixed Category" for random questions)

2. **Start the Quiz**:
   - Click the "Start Quiz" button
   - Wait for questions to load from the API

3. **Answer Questions**:
   - Read each question carefully
   - Click on your chosen answer
   - View instant feedback (green for correct, red for incorrect)
   - Click "Next Question" to proceed

4. **View Results**:
   - After completing all questions, see your final score
   - Get a performance message based on your percentage
   - Option to start a new quiz

### Viewing Quiz History

1. Click the "View History" button on the main screen
2. Browse your past quiz results with:
   - Quiz number and date
   - Category and difficulty
   - Score and percentage
3. Click "View Details" to see:
   - Each question and your answer
   - Correct answers for questions you got wrong
   - Difficulty level for each question

### Theme Toggle

- Click the theme icon (sun/moon) in the top-right corner
- Switch between light and dark modes
- Your preference is saved automatically

## 🏗️ Project Structure

```
MyDailyWork_Task3/
│
├── index.html          # Main HTML structure
├── style.css           # All styling and theme definitions
├── script.js           # Application logic and API integration
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript (ES6+)**: No frameworks or dependencies
- **Open Trivia DB API**: Free, open-source trivia questions database
- **LocalStorage API**: Browser storage for quiz history

## 🎨 Features in Detail

### Quiz Categories

The app supports 30+ categories including:
- General Knowledge
- Books, Film, Music
- Musicals & Theatres, Television
- Science & Nature, Mathematics, Computers
- Sports, Geography, History, Politics
- Art, Celebrities, Animals, Vehicles
- Video Games, Board Games, Comics
- Japanese Anime & Manga, Cartoon & Animations
- Mythology, Gadgets
- And more!

### Scoring System

- **Perfect Score (100%)**: "Perfect Score! You are a true Trivia Master! 🏆"
- **Great (70-99%)**: "Great job! You know your stuff! 🌟"
- **Good (40-69%)**: "Solid effort. Keep learning! 👍"
- **Needs Improvement (<40%)**: "You can do better! Time for some review. 😉"

### Data Persistence

- Quiz history is stored in browser's localStorage
- Automatically saves after each completed quiz
- Keeps the last 10 quizzes to prevent storage bloat
- Theme preference (light/dark mode) is saved and restored on page load
- Detailed quiz responses including questions, answers, and difficulty levels are preserved

## 🔧 API Information

This app uses the [Open Trivia Database](https://opentdb.com/) API:
- **Free and open-source**
- **No API key required**
- **Multiple choice questions**
- **Various difficulty levels**
- **Multiple categories**

## 🎯 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Opera (latest)

## 📝 Code Features

- **Error Handling**: Graceful handling of API errors with exponential backoff retry logic (up to 5 attempts)
- **Loading States**: Visual feedback during question fetching with animated spinner
- **Answer Shuffling**: Answers are randomized using Fisher-Yates shuffle algorithm
- **HTML Entity Decoding**: Properly displays special characters and symbols from API responses
- **Responsive Design**: Mobile-first approach with flexible layouts and breakpoints
- **Local Storage Management**: Automatically limits history to last 10 quizzes to prevent storage bloat
- **Theme Persistence**: Saves user's theme preference (light/dark mode) across sessions
- **Accessibility**: ARIA labels and semantic HTML for better screen reader support

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing the free trivia API
- [Inter Font](https://fonts.google.com/specimen/Inter) from Google Fonts
- All the open-source developers who made this possible

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Enjoy testing your knowledge with Quiz Master! 🎓**

