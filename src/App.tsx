import { useState } from "react";
import "./App.css";
import { MantineProvider, Box } from "@mantine/core";
import "@mantine/core/styles.css";
import { Dictionary } from "./Dictionary";
import { Home } from "./Home";

function App() {
    const [page, setPage] = useState<"home" | "practice" | "dictionary">(
        "home"
    );

    return (
        <MantineProvider>
            <Box mih='100vh'>
                {page === "home" && (
                    <Home
                        onClickPractice={() => setPage("practice")}
                        onClickDictionary={() => setPage("dictionary")}
                    />
                )}
                {page === "dictionary" && (
                    <Dictionary onBack={() => setPage("home")} />
                )}
            </Box>
        </MantineProvider>
    );
}

export default App;
