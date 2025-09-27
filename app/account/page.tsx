"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FullHeader from "@/components/FullHeader";
import BenefitsStrip from "@/components/BenefitsStrip";

export default function Page() {
    useEffect(() => {
        const cls = ["color-two", "font-exo", "header-style-two"];
        const html = document.documentElement;
        cls.forEach(c => html.classList.add(c));
        return () => { cls.forEach(c => html.classList.remove(c)); };
    }, []);

    return (
        <React.Fragment>
            <FullHeader showTopNav={true} showCategoriesBar={true} />

            <div className="breadcrumb mb-0 py-26 bg-main-two-50">
                <div className="container container-lg">
                    <div className="breadcrumb-wrapper flex-between flex-wrap gap-16">
                        <h6 className="mb-0">My Account</h6>
                        <ul className="flex-align gap-8 flex-wrap">
                            <li className="text-sm">
                                <Link href="/" className="text-gray-900 flex-align gap-8 hover-text-main-600">
                                    <i className="ph ph-house"></i>
                                    Home
                                </Link>
                            </li>
                            <li className="flex-align"><i className="ph ph-caret-right"></i></li>
                            <li className="text-sm text-main-600"> My Account </li>
                        </ul>
                    </div>
                </div>
            </div>

            <section className="account py-80">
                <div className="container container-lg">
                    <div className="row gy-4">
                        <div className="col-lg-6">
                            <div className="border border-gray-100 rounded-12 p-sm-32 p-16">
                                <h6 className="text-xl mb-24">Login</h6>
                                <form action="#">
                                    <div className="row gy-4">
                                        <div className="col-12">
                                            <label className="text-sm fw-medium text-gray-900">Username or email address *</label>
                                            <input type="text" className="common-input" placeholder="First Name" />
                                        </div>
                                        <div className="col-12">
                                            <label className="text-sm fw-medium text-gray-900">Password</label>
                                            <input type="password" id="password-field" className="common-input" placeholder="Password" />
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center mb-24">
                                                <button type="submit" className="btn btn-main-two">Log in</button>
                                                <div className="d-flex align-items-center ms-24">
                                                    <input type="checkbox" className="form-check-input" id="remember" />
                                                    <label htmlFor="remember" className="form-check-label ms-2">Remember me</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <Link href="#" className="text-danger-600">Forgot your password?</Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="border border-gray-100 rounded-12 p-sm-32 p-16">
                                <h6 className="text-xl mb-24">Register</h6>
                                <form action="#">
                                    <div className="row gy-4">
                                        <div className="col-12">
                                            <label className="text-sm fw-medium text-gray-900">Username *</label>
                                            <input type="text" className="common-input" placeholder="Write a username" />
                                        </div>
                                        <div className="col-12">
                                            <label className="text-sm fw-medium text-gray-900">Email address *</label>
                                            <input type="email" className="common-input" placeholder="Enter Email Address" />
                                        </div>
                                        <div className="col-12">
                                            <label className="text-sm fw-medium text-gray-900">Password *</label>
                                            <input type="password" id="password-field-two" className="common-input" placeholder="Password" />
                                        </div>
                                        <div className="col-12">
                                            <p className="text-gray-600">Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="#" className="text-main-600">privacy policy</Link>.</p>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-main-two">Register</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BenefitsStrip />
        </React.Fragment>
    );
}