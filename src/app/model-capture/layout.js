// Isolated layout for model capture - no navbar, no background, no cursor
export default function ModelCaptureLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0, background: "transparent", overflow: "hidden" }}>
                {children}
            </body>
        </html>
    );
}
