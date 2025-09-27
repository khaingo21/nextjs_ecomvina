"use client";
import Link from "next/link";
import React from "react";

export type CrumbItem = { label: string; href?: string };

export default function Breadcrumb({
  title,
  items,
}: {
  title: string;
  items: CrumbItem[];
}) {
  return (
    <div className="breadcrumb mb-0 py-26 bg-main-two-50">
      <div className="container container-lg">
        <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
          <h6 className="mb-0">{title}</h6>
          <ul className="flex-align gap-8 flex-wrap">
            {items.map((it, idx) => (
              <React.Fragment key={idx}>
                <li className="text-sm">
                  {it.href ? (
                    <Link href={it.href} className="text-gray-900 flex-align gap-8 hover-text-main-600">
                      {idx === 0 && <i className="ph ph-house"></i>}
                      {it.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-main-600"> {it.label} </span>
                  )}
                </li>
                {idx < items.length - 1 && (
                  <li className="flex-align">
                    <i className="ph ph-caret-right"></i>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
