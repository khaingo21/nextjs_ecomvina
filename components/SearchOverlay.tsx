"use client";
import React from "react";

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export default function SearchOverlay({ visible, onClose }: Props) {
  return (
    <form action="#" className="search-box" style={{ display: visible ? "block" : "none" }}>
      <button
        type="button"
        className="search-box__close position-absolute inset-block-start-0 inset-inline-end-0 m-16 w-48 h-48 border border-gray-100 rounded-circle flex-center text-white hover-text-gray-800 hover-bg-white text-2xl transition-1"
        aria-label="Close search"
        onClick={onClose}
      >
        <i className="ph ph-x"></i>
      </button>
      <div className="container container-lg">
        <div className="position-relative">
          <input
            type="text"
            className="form-control py-16 px-24 text-xl rounded-pill pe-64"
            placeholder="Search for a product or brand"
          />
          <button
            type="submit"
            className="w-48 h-48 bg-main-600 rounded-circle flex-center text-xl text-white position-absolute top-50 translate-middle-y inset-inline-end-0 me-8"
            aria-label="Search"
          >
            <i className="ph ph-magnifying-glass"></i>
          </button>
        </div>
      </div>
    </form>
  );
}
