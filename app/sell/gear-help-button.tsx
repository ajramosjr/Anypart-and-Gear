"use client";

export default function GearHelpButton() {
  return <button className="sell-gear-help button button-secondary" type="button" onClick={() => window.dispatchEvent(new Event("apg-show-gear"))}>Need help? Ask Gear</button>;
}
