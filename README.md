# AI Chat Assistant

A modern, responsive web application for interacting with Google's Gemini AI. Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- 🤖 **Gemini AI Integration**: Powered by Google's latest Gemini 2.0 Flash model
- 💬 **Real-time Chat**: Smooth, responsive chat interface
- 🎨 **Modern UI**: Clean design with shadcn/ui components
- 🌙 **Dark Mode**: Automatic dark/light mode support
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 🔒 **Secure**: API key is handled client-side (not stored in .env)
- ⚡ **Fast**: Built with Next.js 15 and optimized for performance
- 🧹 **Clean Code**: Well-structured, maintainable codebase

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from Google AI Studio

### Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Enter the API key in the application when prompted

**Note**: The API key is stored locally in your browser and is not sent to any external servers except Google's Gemini API.

## Usage

1. **Configure API Key**: On first launch, you'll be prompted to enter your Gemini API key
2. **Start Chatting**: Type your message in the input field and press Enter or click Send
3. **View Responses**: The AI will respond in real-time with helpful, contextual answers
4. **Manage Conversation**: Use the Clear button to start a new conversation
5. **Update Settings**: Click the API Key button to change your API key

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── ChatInterface.tsx    # Main chat component
│   ├── ChatMessage.tsx      # Individual message component
│   └── ChatInput.tsx        # Message input component
├── hooks/
│   └── useChat.ts           # Chat state management hook
└── lib/
    ├── gemini.ts            # Gemini API service
    └── utils.ts             # Utility functions
```

## Key Features Explained

### Clean Architecture

- **Separation of Concerns**: UI components, business logic, and API calls are properly separated
- **Custom Hooks**: Chat state is managed through a reusable `useChat` hook
- **Service Layer**: Gemini API interactions are abstracted into a dedicated service class
- **Type Safety**: Full TypeScript support with proper type definitions

### Error Handling

- Comprehensive error handling for API failures
- User-friendly error messages
- Retry functionality for failed requests
- Graceful degradation when API key is invalid

### Performance

- Optimized re-renders with React best practices
- Efficient state management
- Lazy loading and code splitting
- Minimal bundle size

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI Integration**: Google Generative AI SDK
- **Icons**: Lucide React
- **State Management**: React Hooks

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
