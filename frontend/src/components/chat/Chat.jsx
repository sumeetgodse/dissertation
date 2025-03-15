import ChatBot, { Button } from "react-chatbotify";
import { ChatIcon } from "../../assets/ChatIcon";

export const Chat = () => {
  async function postQuery(query) {
    try {
      const response = await fetch(
        "http://localhost:8000/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            top_k: 3,
            conversation_id: "string",
          }),
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return `${error}! Oh no I don't know what to say!`;
    }
  }
  const flow = {
    start: {
      message: "Hey there! How can I assist you today!",
      path: "loop",
    },
    loop: {
      message: async ({ userInput }) => {
        const result = await postQuery(userInput);
        return result.answer ?? result;
      },
      path: "loop",
    },
  };

  return (
    <ChatBot
      settings={{
        general: {
          embedded: false,
          primaryColor: "#0d47a1",
          secondaryColor: "#0d47a1",
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
          showFooter: false,
        },
        chatHistory: { storageKey: "chat-assisstant" },
        header: {
          title: "Chat Assistant",
          showAvatar: false,
          buttons: [Button.CLOSE_CHAT_BUTTON],
        },
        tooltip: undefined,
        chatButton: { icon: ChatIcon },
      }}
      flow={flow}
    />
  );
};
