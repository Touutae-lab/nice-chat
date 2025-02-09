import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (userInput: string) => {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      console.log("ChatGPT Response:", data); // Debugging

      return data;
    },
    onSuccess: (data) => {
      if (!data.response) return; // Fix the response field

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response }, // Use `response` instead of `message`
      ]);
    },
  });

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };

    // Add user message to state before API call
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    sendMessageMutation.mutate(input);
    setInput(""); // Clear input after sending
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl flex flex-col bg-white shadow-lg rounded-xl p-6">
        {/* Chat Header */}
        <div className="text-center text-2xl font-bold text-gray-700 mb-3">
          ChatGPT
        </div>

        {/* Chat Card */}
        <Card className="flex flex-col w-full overflow-hidden h-[500px] max-h-[80vh] border shadow-md rounded-2xl bg-gray-50">
          <CardContent className="flex flex-col flex-grow overflow-y-auto p-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">
                Start a conversation...
              </p>
            ) : (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg max-w-[80%] text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-blue-500 text-white text-right"
                      : "mr-auto bg-gray-200 text-left"
                  }`}
                >
                  <strong className="block text-xs text-gray-600 mb-1">
                    {msg.role === "user" ? "You" : "Travern Owner"}
                  </strong>
                  {msg.content}
                </motion.div>
              ))
            )}
            {/* Empty div for auto scroll */}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input Box */}
        <div className="flex items-center gap-2 border-t pt-3 w-full">
          <Input
            className="flex-grow border rounded-lg p-3 text-sm"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={sendMessageMutation.status === "pending"}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200"
          >
            {sendMessageMutation.status === "pending" ? "..." : <Send size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
