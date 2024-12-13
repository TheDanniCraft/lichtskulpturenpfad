"use client"

import { useState, useEffect, useRef } from "react";
import { Textarea, ActionIcon, Divider, Space, Text } from "@mantine/core";
import { IconArrowLeft, IconSend } from "@tabler/icons-react";
import { Ollama } from 'ollama/browser';

const ollama = new Ollama({ host: "https://teki.thedannicraft.de" })

export default function Chat({ close, height = 'auto', systemPrompt = "" }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [locked, setLocked] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        async function buildModel() {
            const baseConfig = `
                FROM llama3.2
                SYSTEM "${systemPrompt}"
            `;
            await ollama.create({ model: 'custom', modelfile: baseConfig });
        }
        buildModel();
    }, [systemPrompt]);

    useEffect(() => {
        setTimeout(() => {
            textareaRef.current?.focus();
        }, 100)
    }, []);

    useEffect(() => {
        if (!locked) {
            textareaRef.current?.focus();
        }
    }, [locked]);

    async function handleSendMessage(role) {
        try {
            if (!message || message.length < 1) return;
            setMessages((prevMessages) => [...prevMessages, { content: message, role: role }]);
            setLocked(true);

            const response = await ollama.chat({ model: 'custom', messages: [...messages, { content: message, role: role }], stream: true });
            const newMessage = { content: "", role: "assistant" };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            for await (const part of response) {
                newMessage.content += part.message.content;
                setMessages((prevMessages) => [...prevMessages]); // Update the message in the UI
            }
            setLocked(false);
        } catch (error) {
            console.error(error);
            setLocked(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: height, maxHeight: '100%', overflow: 'hidden' }}>
            <div style={{ flex: "1", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column-reverse" }}>
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
                <ActionIcon
                    style={{ height: "35px", width: "35px", alignSelf: "flex-start" }}
                    color="var(--mantine-color-red-9)"
                    onClick={() => close()}
                >
                    <IconArrowLeft />
                </ActionIcon>
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
    );
}
