import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";

const assets = import.meta.glob("./assets/**/*.json", {
  eager: true,
});

const Popup = () => {
  const globKey = `./assets/${import.meta.env.VITE_STAGE}/manifest.json`;
  const manifest = assets[globKey] as
    | undefined
    | { name: string; version: string };

  if (!manifest?.name || !manifest?.version) {
    return null;
  }

  return (
    <div className="w-[250px] p-5">
      <h3 className="text-md mb-5">
        To start using Outreachr, head over to{" "}
        <span className="font-bold text-indigo">LinkedIn Messaging</span>
      </h3>
      🚀 {manifest.name} - {manifest.version}
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("app"),
);
