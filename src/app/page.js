"use client"

import { Anchor, AppShell, Burger, Button, Center, Grid, Group, Image, Modal, SimpleGrid, Space, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { links, partners, figures } from '@/app/config';
import Snowfall from "react-snowfall";
import Chat from "./components/Chat";
import { save } from "./fileManager";

export default function Home() {
    const [opened, { toggle }] = useDisclosure();
    const [modalOpened, { open, close }] = useDisclosure(false);
    const [systemPrompt, setSystemPrompt] = useState("");

    function runFigure(id) {
        save(id);
        setSystemPrompt(figures[id].prompt);
        open();
    };

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header withBorder={false}>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Group style={{ flex: 1 }}>
                        <Anchor underline="never" c="var(--mantine-color-white)" fw={750} href="#home">
                            Lichtskulpturenpfad
                        </Anchor>
                        <Group ml="xl" gap={25} visibleFrom="sm">
                            {
                                (links).filter(link => !link.hidden).map((link) => (
                                    <Anchor key={link.label} href={link.href} c="var(--mantine-color-bright)" underline="never">
                                        {link.label}
                                    </Anchor>
                                ))
                            }
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar py="md" px={4}>
                <Center>
                    <Stack>
                        {
                            links.filter(link => !link.hidden).map((link) => (
                                <Anchor key={link.label} href={link.href} c="var(--mantine-color-text)" underline="never" onClick={toggle}>
                                    {link.label}
                                </Anchor>
                            ))
                        }
                    </Stack>
                </Center>
            </AppShell.Navbar>
            <AppShell.Main id="home">
                <Center>
                    <Stack>
                        <Text size="xl" c="var(--mantine-color-text)" align="center" fw={1000}>
                            Willkommen im Lichtskulpturenpfad
                        </Text>
                        <Space h="xl" />
                        <Center
                            w='calc(100dvw - var(--app-shell-padding) * 2)'
                        >
                            <SimpleGrid cols={2}>
                                <Button
                                    style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }}
                                    variant="transparent"
                                    onClick={() => runFigure("herz")}
                                >
                                    <Image src="/images/herz.png" alt="Herz" />
                                </Button>
                                {
                                    /*
                                    <Button
                                        style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }}
                                        variant="transparent"
                                        onClick={() => runFigure("krippe")}
                                    >
                                        <Image src="/images/schneeballe.png" alt="Schneebälle" />
                                    </Button>
                                    */
                                }
                                <Button
                                    style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }}
                                    variant="transparent"
                                    onClick={() => runFigure("engel")}
                                >
                                    <Image src="/images/engel.png" alt="Engel" />
                                </Button>
                                {
                                    /*
                                    <Button
                                        style={{ width: '100%', height: '100%', maxWidth: '200px', maxHeight: '200px' }}
                                        variant="transparent"
                                        onClick={() => runFigure("schaaf")}
                                    >
                                        <Image src="/images/kerze.png" alt="Kerze" />
                                    </Button>
                                    */
                                }
                            </SimpleGrid>
                        </Center>
                        <Text align="center">
                            Drücke ein Icon um die Figur auf dem Feld zu bewegen.
                        </Text>
                    </Stack>
                </Center>
                <Space h="20vh" />

                <Text id="aboutus" size="xl" fw={1000}>Über uns</Text>
                <Text style={{ maxWidth: "80vw" }}>
                    Der Lichtskulpturenpfad wurde von dem Oberderdinger Lichtkünstler Prof. Dr. Jürgen Scheible, Hochschule der Medien Stuttgart,
                    initiiert, konzipiert und in Zusammenarbeit mit Michael Neupert, Harald Stindl - beide aus Oberderdingen - technisch entwickelt
                    und umgesetzt sowie weiteren Helfern (Alfred Woll, Ludwig Hupbauer, Stefan Scharfe, Christoph Kornblum, Peter Kornblum) aufgebaut.
                    Web Applikation: Prof. Dr. Jürgen Scheible, Simon Strobel, Jens Bissinger. Das Projekt ist eine Kooperation mit der Gemeinde Oberderdingen
                    als Veranstalter und tecspaze, einer Digitalwerkstatt für Kinder und Jugendliche für der Region als Technik-Unterstützer.
                    Des Weiteren unterstützt die Familie Hofmann durch die Bereitstellung von Wiesenflächen diesen interaktive Pfad. <Anchor href="https://tecspaze.de">www.tecspaze.de</Anchor>
                </Text>
                <Space h="20vh" />

                <Text id="partners" size="xl" fw={1000}>Partner</Text>
                <Grid gutter="xl">
                    {
                        partners.map((partner, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                                <Anchor href={partner.href}>
                                    <Image src={partner.image} alt="Partner" style={{ maxWidth: "400px" }} />
                                </Anchor>
                            </Grid.Col>
                        ))
                    }
                </Grid>
                <Space h="20vh" />

                <Text id="impressum" size="xl" fw={1000}>Impressum</Text>
                <Text size="md" fw={1000}>Angaben gemäß § 5 TMG</Text>
                <Text>Jürgen Scheible, Hochschule der Medien Stuttgart Nobelstraße 10 70569 Stuttgart</Text>
                <Space h="md" />
                <Text size="md" fw={1000}>Kontakt</Text>
                <Text>Tel.: 0711/8923-2276 E-Mail: scheible@hdm-stuttgart.de</Text>
                <Space h="md" />
                <Text size="md" fw={1000}>Haftung für Inhalte</Text>
                <Text>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </Text>
                <Space h="md" />
                <Text size="md" fw={1000}>Haftung für Links</Text>
                <Text>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.

                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </Text>
                <Space h="md" />
                <Text size="md" fw={1000}>Urheberrecht</Text>
                <Text>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.

                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </Text>
                <Text>Quelle:e-recht24.de</Text>
                <Space h="md" />
                <Text>© 2021 - 2024 Lichtskulpturenpfad</Text>
            </AppShell.Main>

            <Snowfall
                snowflakeCount={150}
                wind={[0, 0]}
                speed={[0.4, 0.6]}
                style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1 }}
            />

            <Modal opened={modalOpened} onClose={close} title="" centered>
                <Chat height="80vh" systemPrompt={systemPrompt} close={close} />
            </Modal>
        </AppShell>
    );
}