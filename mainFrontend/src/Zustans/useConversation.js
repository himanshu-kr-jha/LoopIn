// useConversation.js
import { create } from "zustand";

const useConversation = create((set) => ({
  messages: [],
  selectedConversation: null,

  setMessage: (messages) => set({ messages }),

  setSelectedConversation: (conversation) => {
    localStorage.setItem("selectedConversation", JSON.stringify(conversation));
    set({ selectedConversation: conversation });
  },

  resetConversation: () => {
    localStorage.removeItem("selectedConversation");
    set({ selectedConversation: null, messages: [] });
  },
}));

// Load from localStorage on startup
const storedConversation = localStorage.getItem("selectedConversation");
if (storedConversation) {
  useConversation.setState({
    selectedConversation: JSON.parse(storedConversation),
  });
}

export default useConversation;
