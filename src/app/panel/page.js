"use client"

import { Button, Center, Divider, Group, Space, Stack, Text } from "@mantine/core";
import { save } from "../fileManager";
import { useEffect, useState } from "react";

export default function Panel() {
    const [state, setState] = useState("Aus");

    useEffect(() => {
        save("AUS")
    }, []);

    return (
        <Center>
            <Stack>
                <Space h="100" />
                <Group>
                    <Button color="red" onClick={() => {
                        save("Aus")
                        setState("Aus")
                    }}>Ausschalten</Button>
                    <Button color="green" onClick={() => {
                        save("Ein")
                        setState("Ein")
                    }}>Einschalten</Button>
                </Group>

                <Divider />

                <Text> Status: {state}</Text>
            </Stack>
        </Center>
    );
}