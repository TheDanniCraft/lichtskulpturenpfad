"use client"

import ThemeSettings from "../components/ThemeSettings";
import { useState, useEffect, useRef } from "react";
import { Textarea, ActionIcon, Divider, Space, Popover, Stack, Modal, Text, Button } from "@mantine/core";
import { IconCircleXFilled, IconSend, IconSettings, IconTrash } from "@tabler/icons-react";
import ollama from 'ollama/browser'
import { useDisclosure } from "@mantine/hooks";

const modelfile = `
FROM llama3.1
SYSTEM "Du bist ein Engel und beendest jeden Satz mit  - Dein Engel vom Felde."
`


export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [locked, setLocked] = useState(false);
  const textareaRef = useRef(null);
  const [opened, { open, close }] = useDisclosure(false);
  useEffect(() => {
    async function buildModel() {
      await ollama.create({ model: 'custom', modelfile: modelfile })
    }

    buildModel();
  }, []);

  useEffect(() => {
    if (!locked) {
      textareaRef.current.focus();
    }
  }, [locked]);

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
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                padding: "8px",
                margin: "4px",
                borderRadius: message.role === "user" ? "10px 10px 0 10px" : "0px 10px 10px 10px",
                backgroundColor: message.role === "user" ? "var(--mantine-primary-color-8)" : "var(--mantine-color-gray-3)",
                color: message.role === "user" ? "var(--mantine-primary-color-0)" : "var(--mantine-color-dark-7)",
                maxWidth: "80%",
                minWidth: "25px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
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
                  color="var(--mantine-color-red-9)"
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
            ref={textareaRef}
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

      <Modal opened={opened} onClose={close} title="Please Confirm">
        <Text fw={1000}>Are you sure you want to delete your entire chat? This action is permanent and cannot be undone.</Text>
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
            color="var(--mantine-color-red-9)"
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