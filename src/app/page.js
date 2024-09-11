"use client"

import ThemeSettings from "./components/ThemeSettings";
import { useState, useEffect } from "react";
import { Textarea, ActionIcon, Divider, Space, Popover, Stack, Modal, Text, Button } from "@mantine/core";
import { IconCircleXFilled, IconSend, IconSettings, IconTrash } from "@tabler/icons-react";
import ollama from 'ollama/browser'
import { useDisclosure } from "@mantine/hooks";

const modelfile = `
FROM llama3.1
SYSTEM ""
`


export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [locked, setLocked] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    async function buildModel() {
      await ollama.create({ model: 'custom', modelfile: modelfile })
    }

    buildModel();
  }, []);

  async function handleSendMessage(role) {
    try {
      if (!message || message.length < 1) return;
      await setMessages((prevMessages) => [...prevMessages, { content: message, role: role }]);
      setLocked(true);

      const response = await ollama.chat({ model: 'custom', messages: [...messages, { content: message, role: role }], stream: true })
      const newMessage = { content: "", role: "assistant" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      for await (const part of response) {
        newMessage.content += part.message.content;
        setMessages((prevMessages) => [...prevMessages]); // Update the message in the UI
      }
      setLocked(false);
    }
    catch (error) {
      console.error(error);
      setLocked(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ flex: "1 1 auto", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column-reverse" }}>
          {messages.slice(0).reverse().map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.role === "user" ? "flex-start" : "flex-end",
                padding: "8px",
                margin: "4px",
                borderRadius: "4px",
                backgroundColor: message.role === "user" ? "#e0e0e0" : "#2196f3",
                color: message.role === "user" ? "#000" : "#fff",
                "max-width": "80%",
                whiteSpace: "pre-wrap",
              }}
            >
              <Text>{message.content}</Text>
            </div>
          ))}
        </div>
        <Divider />
        <div style={{ display: "flex", alignItems: "flex-end", padding: "16px" }}>
          <Popover trapFocus position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon
                style={{ height: "35px", width: "35px", alignSelf: "flex-start" }}
              >
                <IconSettings />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
              <Stack>
                <ThemeSettings />
                <ActionIcon
                  color="#c21325"
                  onClick={() => {
                    open();
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </Stack>
            </Popover.Dropdown>
          </Popover>
          <Space w="xs" />
          <Textarea
            style={{ flex: "1", border: "none" }}
            placeholder="Type your message..."
            value={message}
            disabled={locked}
            autosize
            maxRows={4}
            onChange={(event) => setMessage(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage("user");
                setMessage("");
              }
            }}
          />
          <Space w="xs" />
          <ActionIcon
            style={{ height: "35px", width: "35px", alignSelf: "flex-end" }}
            disabled={locked}
            onClick={() => {
              handleSendMessage("user");
              setMessage("");
            }}
          >
            <IconSend />
          </ActionIcon>
        </div>
      </div>

      <Modal opened={opened} onClose={close} title="Confirm">
        <Text fw={1000}>Are you sure you want to delete your full chat? It will be gone forever (a long time)!</Text>
        <Space h="md" />
        <div style={{ display: "flex", flexGrow: 1 }}>
          <Button
            color="grey"
            style={{ flex: 1 }}
            onClick={close}
            rightSection={<IconCircleXFilled />}
          >
            No
          </Button>
          <Space w="xs" />
          <Button
            color="#c21325"
            style={{ flex: 1 }}
            onClick={() => {
              setMessages([]);
              close();
            }}
            rightSection={<IconTrash />}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </>
  );
}