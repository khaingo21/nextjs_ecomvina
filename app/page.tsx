"use client";
import React from "react";
import FullHeader from "@/components/FullHeader";
import BannerTwo from "@/components/BannerTwo";
import FeatureSection from "@/components/FeatureSection";
import TopSellingProducts from "@/components/TopSellingProducts";
import PromoBanner from "@/components/PromoBanner";
import TrendingProductsTabs from "@/components/TrendingProductsTabs";
import TopBrandsSection from "@/components/TopBrandsSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import InterestedProducts from "@/components/InterestedProducts";
import PartnerBrands from "@/components/PartnerBrands";
import DiscountStrip from "@/components/DiscountStrip";

export default function Home() {
  return (
    <>
      {/* Header (full template) */}
      <FullHeader showTopNav={false} />

      {/* Banner Section */}
      <BannerTwo />

      {/* Feature Categories */}
      <FeatureSection />

      {/* Top Selling Products */}
      <TopSellingProducts />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Trending Products with Tabs */}
      <TrendingProductsTabs />

      {/* Top Brands */}
      <TopBrandsSection />

      {/* Featured Products complex section */}
      <FeaturedProductsSection />

      {/* Discount strip below featured products */}
      <DiscountStrip />

      {/* Interested Products */}
      <InterestedProducts />

      {/* Partner Brands */}
      <PartnerBrands />
      
    </>
  );
}


