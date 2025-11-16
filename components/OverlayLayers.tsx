"use client";
import React from "react";

type Props = {
  showOverlay?: boolean;
  showSideOverlay?: boolean;
  onOverlayClick?: () => void;
  onSideOverlayClick?: () => void;
};

export default function OverlayLayers({
  showOverlay,
  showSideOverlay,
  onOverlayClick,
  onSideOverlayClick,
}: Props) {
  return (
    <>
      <div
        className="overlay"
        onClick={onOverlayClick}
        style={{ display: showOverlay ? "block" : "none" }}
      />
      <div
        className="side-overlay"
        onClick={onSideOverlayClick}
        style={{ display: showSideOverlay ? "block" : "none" }}
      />
    </>
  );
}
