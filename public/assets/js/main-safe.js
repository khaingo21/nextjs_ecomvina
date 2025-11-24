(function ($) {
    "use strict";

    // Helper function to safely init slick
    function safeSlickInit(selector, options) {
        const $element = $(selector);
        if ($element.length > 0 && $.fn.slick) {
            try {
                // Check if already initialized
                if (!$element.hasClass('slick-initialized')) {
                    $element.slick(options);
                }
            } catch (e) {
                console.warn(`Could not initialize slick on ${selector}:`, e.message);
            }
        }
    }

    // ==========================================
    //      Start Document Ready function
    // ==========================================
    $(document).ready(function () {
        // ============== Mobile Menu Sidebar & Offcanvas Js Start ========
        $(".toggle-mobileMenu").on("click", function () {
            $(".mobile-menu").addClass("active");
            $(".side-overlay").addClass("show");
            $("body").addClass("scroll-hide-sm");
        });

        $(".close-button, .side-overlay").on("click", function () {
            $(".mobile-menu").removeClass("active");
            $(".side-overlay").removeClass("show");
            $("body").removeClass("scroll-hide-sm");
        });

        // ========================= Header Sticky Js Start ==============
        $(window).on("scroll", function () {
            if ($(window).scrollTop() >= 260) {
                $(".header").addClass("fixed-header");
            } else {
                $(".header").removeClass("fixed-header");
            }
        });

        // ========================== Add Bg White Color Js Start =====================
        $(".scroll-bg").on("click", function () {
            $(".footer").addClass("bg-white");
        });

        // ========================== add bg white color Js End =====================

        // ========================= Scroll To Top Icon Js Start =============
        var btn = $(".scroll-top");
        $(window).scroll(function () {
            if ($(window).scrollTop() > 300) {
                btn.addClass("show");
            } else {
                btn.removeClass("show");
            }
        });

        btn.on("click", function (e) {
            e.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, "300");
        });

        // ========================= Preloader Js Start =====================
        $(window).on("load", function () {
            $(".preloader").fadeOut();
        });

        // ==================== Slick Sliders - Safe Init ====================
        // Only initialize sliders that actually exist in the DOM

        // Banner Slider
        safeSlickInit(".banner-slider", {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: false,
            pauseOnHover: true,
            arrows: true,
            draggable: true,
            rtl: $("html").attr("dir") === "rtl" ? true : false,
            prevArrow: '<button type="button" class="slick-prev"><i class="ph ph-caret-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ph ph-caret-right"></i></button>',
        });

        // Top Brand Slider
        safeSlickInit(".top-brand-slider", {
            slidesToShow: 6,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: false,
            pauseOnHover: true,
            arrows: true,
            draggable: true,
            rtl: $("html").attr("dir") === "rtl" ? true : false,
            prevArrow: '<button type="button" class="slick-prev"><i class="ph ph-caret-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ph ph-caret-right"></i></button>',
            responsive: [
                { breakpoint: 1599, settings: { slidesToShow: 5 } },
                { breakpoint: 1399, settings: { slidesToShow: 4 } },
                { breakpoint: 992, settings: { slidesToShow: 3 } },
                { breakpoint: 575, settings: { slidesToShow: 2 } },
            ],
        });

        // Recommended Slider
        safeSlickInit(".recommended-slider", {
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: false,
            pauseOnHover: true,
            arrows: true,
            draggable: true,
            rtl: $("html").attr("dir") === "rtl" ? true : false,
            prevArrow: '<button type="button" class="slick-prev"><i class="ph ph-caret-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ph ph-caret-right"></i></button>',
            responsive: [
                { breakpoint: 1599, settings: { slidesToShow: 4 } },
                { breakpoint: 1399, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 575, settings: { slidesToShow: 1 } },
            ],
        });

        // Top Brand Slider (alternative selector)
        safeSlickInit(".top-brand__slider", {
            slidesToShow: 7,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: false,
            pauseOnHover: true,
            arrows: true,
            draggable: true,
            rtl: $("html").attr("dir") === "rtl" ? true : false,
            prevArrow: '<button type="button" class="slick-prev"><i class="ph ph-caret-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ph ph-caret-right"></i></button>',
            responsive: [
                { breakpoint: 1599, settings: { slidesToShow: 6 } },
                { breakpoint: 1399, settings: { slidesToShow: 5 } },
                { breakpoint: 992, settings: { slidesToShow: 4 } },
                { breakpoint: 575, settings: { slidesToShow: 3 } },
            ],
        });

        // Product Details Sliders
        safeSlickInit(".product-details__thumb-slider", {
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 1500,
            dots: false,
            pauseOnHover: true,
            arrows: true,
            focusOnSelect: true,
            vertical: true,
            rtl: $("html").attr("dir") === "rtl" ? true : false,
            prevArrow: '<button type="button" class="slick-prev"><i class="ph ph-caret-up"></i></button>',
            nextArrow: '<button type="button" class="slick-next"><i class="ph ph-caret-down"></i></button>',
            asNavFor: ".product-details__images-slider",
            responsive: [
                { breakpoint: 992, settings: { vertical: false, slidesToShow: 4 } },
                { breakpoint: 575, settings: { vertical: false, slidesToShow: 3 } },
            ],
        });

        safeSlickInit(".product-details__images-slider", {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: ".product-details__thumb-slider",
        });

        // ======================== Product View Mode Js Start ===============
        $(".grid-btn").on("click", function () {
            $(".list").removeClass("active");
            $(".grid").addClass("active");
        });

        $(".list-btn").on("click", function () {
            $(".grid").removeClass("active");
            $(".list").addClass("active");
        });

        // ===================== Search Bar Show Js Start =================
        $(".search-icon").on("click", function () {
            $(".search-popup").addClass("active");
            $(".side-overlay").addClass("show");
            $("body").addClass("scroll-hide-sm");
        });

        $(".search-popup__close, .side-overlay").on("click", function () {
            $(".search-popup").removeClass("active");
            $(".side-overlay").removeClass("show");
            $("body").removeClass("scroll-hide-sm");
        });

        // ===================== Sidebar Menu Js Start ====================
        $(".side-menu-open").on("click", function () {
            $(".side-menu-wrapper").addClass("show");
            $(".side-overlay").addClass("show");
            $("body").addClass("scroll-hide-sm");
        });

        $(".side-menu-close, .side-overlay").on("click", function () {
            $(".side-menu-wrapper").removeClass("show");
            $(".side-overlay").removeClass("show");
            $("body").removeClass("scroll-hide-sm");
        });

        // Dropdown Menu
        $(".side-menu-wrapper .side-menu li.has-submenus > a").on("click", function (e) {
            var submenu = $(this).next(".side-submenu");
            e.preventDefault();
            submenu.slideToggle(300);
            submenu.parent().toggleClass("active");
            submenu.parent().siblings().removeClass("active");
            submenu.parent().siblings().find(".side-submenu").slideUp(300);
        });

        // =============== Product Quantity Js Start ==================
        $(".increment").on("click", function () {
            var $input = $(this).closest(".quantity").find("input.qty");
            var val = parseInt($input.val());
            $input.val(val + 1).change();
        });

        $(".decrement").on("click", function () {
            var $input = $(this).closest(".quantity").find("input.qty");
            var val = parseInt($input.val());
            if (val > 1) {
                $input.val(val - 1).change();
            }
        });

        // ================== Testimonial One Js End ===================
    });
    // ==========================================
    //      End Document Ready function
    // ==========================================

    // ========================= Preloader Js End =====================

    // ========================= Header Sticky Js End =================

    // ========================= Scroll To Top Icon Js End =============
})(jQuery);
