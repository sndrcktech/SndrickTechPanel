import React, { useEffect, useRef } from "react";
import { useAuth } from "../api/auth";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalPage: React.FC = () => {
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const term = new XTerm({
      fontSize: 16,
      theme: { background: "#181818" }
    });
    termRef.current = term;
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);

    term.open(document.getElementById("xterm-container")!);
    fitAddon.fit();

    const wsProto = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${wsProto}://${window.location.host}/api/v1/terminal/ws?token=${getToken()}`;
    const ws = new window.WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => term.focus();
    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const text = new TextDecoder().decode(new Uint8Array(event.data));
        term.write(text);
      }
    };
    term.onData((data) => {
      ws.send(new TextEncoder().encode(data));
    });
    ws.onclose = () => term.write("\r\n[Сессия завершена]\r\n");
    ws.onerror = () => term.write("\r\n[Ошибка WebSocket]\r\n");

    window.addEventListener("resize", () => fitAddon.fit());
    return () => {
      ws.close();
      term.dispose();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="p-0 h-full w-full">
      <div id="xterm-container" style={{ width: "100%", height: "75vh", background: "#181818", borderRadius: 8 }} />
    </div>
  );
};

export default TerminalPage;
