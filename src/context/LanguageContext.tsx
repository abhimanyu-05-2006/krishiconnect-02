import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Navigation
    brand_name: 'KrishiConnect',
    tagline: 'Fresh From Farms. Fair For Everyone.',
    nav_marketplace: 'Marketplace',
    nav_farmers: 'Farmers',
    nav_reviews: '360° Reviews',
    nav_map: 'Agri Map',
    nav_how_it_works: 'How It Works',
    nav_transparency: 'Price Transparency',
    nav_about: 'About',
    nav_dashboard: 'Dashboard',
    nav_login: 'Stakeholder Login',
    nav_logout: 'Logout',
    btn_shop_produce: 'Shop Fresh Produce',
    btn_become_farmer: 'List Your Produce',
    btn_back: 'Back',
    btn_back_home: 'Back to Home',
    view_name_marketplace: 'Marketplace',
    view_name_farmers: 'Farmers',
    view_name_reviews: '360° Reviews',
    view_name_map: 'Agri Map',
    view_name_transparency: 'Price Transparency',
    view_name_how_it_works: 'How It Works',
    view_name_checkout: 'Checkout',
    view_name_login: 'Stakeholder Login',
    view_name_dashboard: 'Dashboard',

    // Hero Section
    hero_headline_1: 'Fresh From Farms.',
    hero_headline_2: 'Fair For Everyone.',
    hero_title: 'Direct From Farms. Fair For Everyone.',
    hero_subtitle: 'Empowering growers with 30-40% higher earnings while delivering naturally harvested, chemical-free produce to consumers and businesses within 18 hours of harvest.',
    hero_region_pill: 'Madhya Pradesh Agricultural Belt · Bhopal, Sehore & Vidisha',
    trust_npop: 'NPOP Certified Produce',
    trust_farmer_share: '90% Direct Farmer Share',
    trust_under_18h: 'Under 18h Farm-to-Door',
    stat_farmer_realization: 'Farmer Realization',
    stat_vs_mandi: '+34% vs Traditional Mandi',
    hub_filter_title: 'Filter Fresh Harvest by District Hub:',
    hub_filter_subtitle: 'Discover verified farms operating near your delivery pincode',

    // Metrics Strip
    stats_farmers: 'Verified Farmers',
    stats_traded: 'Tonnes Traded Directly',
    stats_farmer_profit: 'Higher Farmer Income',
    stats_freshness: 'Farm-to-Door Delivery',
    metrics_farmers_sub: 'Across 8 MP Districts',
    metrics_traded_sub: 'Direct B2C & B2B Volume',
    metrics_profit_sub: 'Extra income to rural households',
    metrics_freshness_sub: 'Zero cold-storage chemical gas',

    // How It Works
    how_tag: 'Direct Agri Trade',
    how_title: 'How KrishiConnect Works',
    how_subtitle: 'A transparent four-step cycle that completely eliminates unnecessary middlemen and guarantees freshness.',
    step1_title: 'Farmer Lists Produce',
    step1_desc: 'Farmer inputs harvest date, quantity, and asks for fair price guided by our Gemini AI Smart Mandi Advisor.',
    step2_title: 'Consumer / Retailer Buys',
    step2_desc: 'Buyers browse verified local crops, view exact price breakdowns, and order directly with COD or instant payment.',
    step3_title: 'Morning Farm-Gate Pluck',
    step3_desc: 'Produce is harvested fresh upon order confirmation. Graded, weighed, and sealed in returnable agri-crates.',
    step4_title: 'AgriFleet Direct Transit',
    step4_desc: 'Dispatched straight to city households & supermarkets. 90% payout credited directly to the farmer’s UPI/bank.',

    // Popular Produce
    popular_tag: 'From Morning Harvest',
    popular_title: 'Popular Farm Produce',
    popular_subtitle: 'Direct from Sehore, Vidisha, and Raisen growers',
    view_all_products: 'View All Products',
    farm_direct_price: 'Farm Direct Price',
    btn_add: 'Add',

    // Farmers Section
    farmers_tag: 'Meet The Growers',
    farmers_title: 'Certified Progressive Farmers',
    see_all_farmers: 'See All Farmers',
    years_farming: 'Years Farming Experience',
    view_farm_produce: 'View Farm Produce',

    // AI Banner
    ai_banner_tag: 'Powered by Google Gemini 3.8 Flash',
    ai_banner_title: 'Instant AI Farming Guidance & Smart Mandi Discovery',
    ai_banner_desc: 'Whether you are a farmer deciding harvest pricing or a consumer looking for seasonal produce, KrishiMitra AI gives you immediate advisory in English, Hindi, and Marathi.',
    ai_banner_btn: 'Launch KrishiMitra AI Assistant',
    browse_marketplace: 'Browse Marketplace',

    // Categories
    cat_all: 'All Produce',
    cat_vegetables: 'Vegetables',
    cat_fruits: 'Fruits',
    cat_grains: 'Grains & Millets',
    cat_pulses: 'Pulses & Dals',
    cat_spices: 'Natural Spices',
    cat_dairy: 'Desi Cow Dairy',
    cat_organic: 'Certified Organic',
    filter_organic_only: 'Organic Only',
    filter_all_districts: 'All MP Regions',
    search_placeholder: 'Search farm fresh tomatoes, sharbati wheat, desi milk...',

    // Marketplace Controls
    marketplace_title: 'Direct Agricultural Produce',
    marketplace_subtitle: 'Harvested to order across Sehore, Bhopal, Raisen & Vidisha rural cooperatives.',
    ask_ai_season: 'Ask KrishiMitra: "What\'s in peak season?"',
    sort_popular: 'Sort: Highest Rated',
    sort_freshness: 'Sort: Most Recently Harvested',
    sort_price_low: 'Sort: Price Low to High',
    sort_price_high: 'Sort: Price High to Low',
    filter_show_organic: 'Show Only Certified Organic (NPOP)',
    showing_listings: 'Showing farm-direct listings',
    no_products_found: 'No agricultural produce found',
    no_products_hint: 'Try resetting your district filter or search terms. Fresh harvests from Sehore and Vidisha arrive daily at 5 AM.',
    reset_filters: 'Reset All Filters',

    // Map Section
    map_tag: 'Live Agri-Geospatial Grid',
    map_title: 'Direct Agricultural Ecosystem Map',
    map_desc: 'Discover verified farmers, harvest acreages, nearby bulk retailers, and active AgriFleet transit corridors across central MP.',
    map_filter_all: 'All Stakeholders',
    map_filter_farmers: 'Farmers',
    map_filter_retailers: 'Retailers & Buyers',
    map_filter_delivery: 'AgriFleet Delivery',
    map_filter_consumers: 'Consumers',
    map_district_all: 'All Districts',
    map_view_produce: 'View Produce',
    map_view_profile: 'View Farm Profile',

    // Price Transparency
    price_transparency_title: 'Where Does Every Rupee Go?',
    price_transparency_subtitle: 'Traditional mandi supply chains pass through 4-5 middlemen taking 50% commission. KrishiConnect transfers 88-92% directly into the farmer’s bank account.',
    farmer_receives: 'Farmer Receives Directly',
    logistics_quality: 'Farm-Gate Cold Logistics',
    platform_fee: 'KrishiConnect Platform Fee',
    traditional_mandi: 'Traditional Mandi System',
    krishi_direct: 'KrishiConnect Direct Model',
    middleman_cut: 'Middleman & Arhatiya Cut',
    retail_markup: 'Supermarket Store Markup',

    // Cart & Checkout
    btn_add_to_cart: 'Add to Cart',
    btn_buy_now: 'Buy Now',
    btn_checkout: 'Proceed to Checkout',
    cart_title: 'Your Farm Basket',
    cart_empty: 'Your farm basket is empty. Browse fresh harvest now!',
    cart_subtotal: 'Subtotal',
    cart_delivery: 'Farm-Gate Cold Delivery',
    cart_free_delivery: 'Free for orders over ₹499',
    cart_total: 'Total Payable',

    // Roles
    role_farmer: 'Farmer',
    role_consumer: 'Consumer',
    role_retailer: 'Retailer / Business',
    role_delivery: 'Delivery Partner',
    role_admin: 'Platform Admin',

    // AI Tools
    ai_assistant_title: 'KrishiMitra AI Assistant',
    ai_pricing_tool: 'AI Smart Mandi Pricing',
    ai_demand_forecast: 'AI Demand Prediction',

    // Order Statuses
    order_status_confirmed: 'Confirmed',
    order_status_accepted: 'Accepted by Farmer',
    order_status_preparing: 'Harvesting & Grading',
    order_status_ready: 'Ready for Pickup',
    order_status_picked: 'Picked Up by AgriFleet',
    order_status_delivering: 'Out for Delivery',
    order_status_delivered: 'Delivered Fresh',

    // Footer
    footer_guarantee_title: 'Direct Farm-Gate Guarantee',
    footer_guarantee_desc: 'Zero synthetic ripening agents or artificial wax. Verified farm origin with complete harvest provenance.',
    footer_payout_title: 'Transparent 90% Farmer Payout',
    footer_payout_desc: 'We eliminate multi-tiered mandi middleman cuts. Farmers take home 30-40% higher realization per quintal.',
    footer_transit_title: 'AgriFleet 18-Hour Transit',
    footer_transit_desc: 'Plucked at dawn in Sehore & Vidisha; sorted, weighed and delivered to homes and restaurants before dusk.',
    footer_about_text: 'Madhya Pradesh’s premier direct farmer-to-consumer digital agricultural trade infrastructure. Empowering sovereign growers with AI price discovery and fair markets.',
    footer_rights: 'All rights reserved.',
  },

  hi: {
    // Brand & Navigation
    brand_name: 'कृषि कनेक्ट',
    tagline: 'खेत से सीधे आपके घर. किसान को सम्मान, सबको ताज़ा.',
    nav_marketplace: 'ताज़ा मंडी',
    nav_farmers: 'हमारे किसान',
    nav_reviews: 'समीक्षा व अनुभव',
    nav_map: 'कृषि नक्शा',
    nav_how_it_works: 'कैसे काम करता है',
    nav_transparency: 'पारदर्शी मूल्य',
    nav_about: 'हमारे बारे में',
    nav_dashboard: 'डैशबोर्ड',
    nav_login: 'लॉग इन करें',
    nav_logout: 'लॉग आउट',
    btn_shop_produce: 'ताज़ा उपज खरीदें',
    btn_become_farmer: 'उपज बेचें (किसान)',
    btn_back: 'वापस जाएँ',
    btn_back_home: 'मुख्य पृष्ठ पर वापस',
    view_name_marketplace: 'ताज़ा मंडी',
    view_name_farmers: 'हमारे किसान',
    view_name_reviews: '360° समीक्षा व अनुभव',
    view_name_map: 'कृषि नक्शा',
    view_name_transparency: 'पारदर्शी मूल्य',
    view_name_how_it_works: 'कैसे काम करता है',
    view_name_checkout: 'ऑर्डर चेकआउट',
    view_name_login: 'हितधारक लॉगिन',
    view_name_dashboard: 'डैशबोर्ड',

    // Hero Section
    hero_headline_1: 'खेत से सीधे आपके घर.',
    hero_headline_2: 'किसान को सम्मान, सबको ताज़ा।',
    hero_title: 'खेत से सीधे आपके घर. किसान को सम्मान, सबको ताज़ा.',
    hero_subtitle: 'बिचौलियों को हटाकर किसानों को 30-40% अधिक आय और उपभोक्ताओं को 18 घंटे के भीतर खेत से तोड़ी गई शुद्ध, रसायन-मुक्त ताज़ी उपज उपलब्ध कराना।',
    hero_region_pill: 'मध्य प्रदेश कृषि क्षेत्र · भोपाल, सीहोर एवं विदिशा',
    trust_npop: 'NPOP प्रमाणित जैविक उपज',
    trust_farmer_share: '90% सीधा किसान का हिस्सा',
    trust_under_18h: '18 घंटे के भीतर खेत से घर',
    stat_farmer_realization: 'किसान की शुद्ध आय',
    stat_vs_mandi: 'पारंपरिक मंडी से +34% अधिक',
    hub_filter_title: 'जिले के अनुसार ताज़ा उपज चुनें:',
    hub_filter_subtitle: 'अपने डिलीवरी पिनकोड के पास सत्यापित खेतों को खोजें',

    // Metrics Strip
    stats_farmers: 'प्रमाणित किसान',
    stats_traded: 'टन सीधी बिक्री',
    stats_farmer_profit: 'किसानों की अतिरिक्त आय',
    stats_freshness: 'खेत से घर डिलीवरी',
    metrics_farmers_sub: '8 जिलों के सक्रिय किसान',
    metrics_traded_sub: 'सीधी B2C और B2B बिक्री',
    metrics_profit_sub: 'ग्रामीण परिवारों की अतिरिक्त आय',
    metrics_freshness_sub: 'बिना किसी रासायनिक गैस के ताज़ा',

    // How It Works
    how_tag: 'सीधा कृषि व्यापार',
    how_title: 'कृषि कनेक्ट कैसे काम करता है',
    how_subtitle: 'एक पारदर्शी चार-चरणीय चक्र जो बिचौलियों को हटाकर 100% ताज़गी और सही दाम सुनिश्चित करता है।',
    step1_title: 'किसान उपज सूचीबद्ध करते हैं',
    step1_desc: 'किसान कटाई की तारीख, मात्रा दर्ज करते हैं और AI स्मार्ट मंडी सलाहकार की मदद से सही मूल्य तय करते हैं।',
    step2_title: 'उपभोक्ता व व्यापारी ऑर्डर करते हैं',
    step2_desc: 'खरीदार स्थानीय फसलों को देखते हैं, पारदर्शी मूल्य विभाजन जांचते हैं और सीधे ऑनलाइन ऑर्डर करते हैं।',
    step3_title: 'सुबह खेत से सीधी तुड़ाई',
    step3_desc: 'ऑर्डर की पुष्टि होते ही सुबह ताज़ा तुड़ाई, ग्रेडिंग और एग्री-क्रेट्स में सुरक्षित पैकिंग होती है।',
    step4_title: 'एग्री-फ्लीट सीधी डिलीवरी',
    step4_desc: 'सीधे शहरी घरों और दुकानों तक 18 घंटे में डिलीवरी। 90% भुगतान तुरंत किसान के खाते में जमा होता है।',

    // Popular Produce
    popular_tag: 'सुबह की ताज़ा तुड़ाई',
    popular_title: 'लोकप्रिय कृषि उत्पाद',
    popular_subtitle: 'सीहोर, विदिशा और रायसेन के खेतों से सीधे ताज़ा',
    view_all_products: 'सभी उत्पाद देखें',
    farm_direct_price: 'खेत का सीधा भाव',
    btn_add: 'जोड़ें',

    // Farmers Section
    farmers_tag: 'हमारे अन्नदाता',
    farmers_title: 'प्रमाणित प्रगतिशील किसान',
    see_all_farmers: 'सभी किसान देखें',
    years_farming: 'वर्षों का कृषि अनुभव',
    view_farm_produce: 'खेत की उपज देखें',

    // AI Banner
    ai_banner_tag: 'गूगल जेमिनी 3.8 फ्लैश द्वारा संचालित',
    ai_banner_title: 'तत्काल AI फसल मार्गदर्शन और स्मार्ट मंडी खोज',
    ai_banner_desc: 'चाहे आप किसान हों या उपभोक्ता, कृषि मित्र AI आपको हिंदी, मराठी और अंग्रेज़ी में तुरंत सटीक व व्यावहारिक सलाह देता है।',
    ai_banner_btn: 'कृषि मित्र AI सहायक खोलें',
    browse_marketplace: 'मंडी ब्राउज़ करें',

    // Categories
    cat_all: 'सभी उत्पाद',
    cat_vegetables: 'हरी सब्जियां',
    cat_fruits: 'ताजे फल',
    cat_grains: 'शरबती गेहूं व अनाज',
    cat_pulses: 'दालें व चना',
    cat_spices: 'देसी मसाले',
    cat_dairy: 'देसी गाय का दूध व घी',
    cat_organic: 'जैविक (Organic)',
    filter_organic_only: 'केवल जैविक',
    filter_all_districts: 'मध्य प्रदेश के सभी जिले',
    search_placeholder: 'टमाटर, शरबती गेहूं, सीहोर की प्याज, शुद्ध दूध खोजें...',

    // Marketplace Controls
    marketplace_title: 'खेत से सीधी कृषि उपज',
    marketplace_subtitle: 'सीहोर, भोपाल, रायसेन और विदिशा के ग्रामीण किसान संघों से सीधे तोड़ा गया ताज़ा माल।',
    ask_ai_season: 'कृषि मित्र से पूछें: "इस मौसम में क्या सबसे ताज़ा है?"',
    sort_popular: 'क्रम: उच्चतम रेटिंग',
    sort_freshness: 'क्रम: सबसे ताज़ा तुड़ाई',
    sort_price_low: 'क्रम: कम से अधिक कीमत',
    sort_price_high: 'क्रम: अधिक से कम कीमत',
    filter_show_organic: 'केवल प्रमाणित जैविक (NPOP) दिखाएं',
    showing_listings: 'खेत के सीधे उत्पाद उपलब्ध हैं',
    no_products_found: 'कोई कृषि उपज नहीं मिली',
    no_products_hint: 'कृपया अपने ज़िले का फ़िल्टर या खोज शब्द बदलें। सीहोर व विदिशा से ताज़ा फसलें रोज़ाना सुबह 5 बजे आती हैं।',
    reset_filters: 'सभी फ़िल्टर रीसेट करें',

    // Map Section
    map_tag: 'लाइव कृषि भू-स्थानिक ग्रिड',
    map_title: 'प्रत्यक्ष कृषि पारिस्थितिकी तंत्र नक्शा',
    map_desc: 'मध्य प्रदेश के सत्यापित किसान, खेत का रकबा, नजदीकी व्यापारी और एग्री-फ्लीट डिलीवरी कॉरिडोर देखें।',
    map_filter_all: 'सभी हितधारक',
    map_filter_farmers: 'किसान',
    map_filter_retailers: 'थोक व खुदरा व्यापारी',
    map_filter_delivery: 'एग्री-वाहन बेड़ा',
    map_filter_consumers: 'उपभोक्ता',
    map_district_all: 'सभी जिले',
    map_view_produce: 'उपज देखें',
    map_view_profile: 'किसान प्रोफ़ाइल देखें',

    // Price Transparency
    price_transparency_title: 'आपका पैसा कहाँ जाता है?',
    price_transparency_subtitle: 'पारंपरिक मंडियों में 4-5 बिचौलिये 50% से अधिक हिस्सा हड़प लेते हैं। कृषि कनेक्ट में 88-92% सीधा किसान के खाते में जाता है।',
    farmer_receives: 'सीधा किसान को मिला',
    logistics_quality: 'गुणवत्ता जांच व कोल्ड वाहन',
    platform_fee: 'कृषि कनेक्ट सेवा शुल्क',
    traditional_mandi: 'पारंपरिक मंडी व्यवस्था',
    krishi_direct: 'कृषि कनेक्ट सीधा मॉडल',
    middleman_cut: 'आढ़तिया व बिचौलिया कटौती',
    retail_markup: 'सुपरमार्केट स्टोर मार्जिन',

    // Cart & Checkout
    btn_add_to_cart: 'टोकरी में डालें',
    btn_buy_now: 'अभी खरीदें',
    btn_checkout: 'ऑर्डर पूरा करें',
    cart_title: 'आपकी ताज़ा टोकरी',
    cart_empty: 'आपकी टोकरी खाली है। खेत की ताज़ा उपज जोड़ें!',
    cart_subtotal: 'कुल राशि',
    cart_delivery: 'खेत से कोल्ड डिलीवरी',
    cart_free_delivery: '₹499 से अधिक के ऑर्डर पर मुफ्त',
    cart_total: 'अंतिम देय राशि',

    // Roles
    role_farmer: 'किसान भाई',
    role_consumer: 'उपभोक्ता',
    role_retailer: 'थोक / व्यापारी',
    role_delivery: 'डिलीवरी पार्टनर',
    role_admin: 'प्रशासन (Admin)',

    // AI Tools
    ai_assistant_title: 'कृषि मित्र AI सहायक',
    ai_pricing_tool: 'AI सही मंडी भाव',
    ai_demand_forecast: 'AI मांग पूर्वानुमान',

    // Order Statuses
    order_status_confirmed: 'ऑर्डर स्वीकृत',
    order_status_accepted: 'किसान ने स्वीकार किया',
    order_status_preparing: 'तुड़ाई व ग्रेडिंग चालू',
    order_status_ready: 'पिकअप हेतु तैयार',
    order_status_picked: 'एग्री-वाहन में रवाना',
    order_status_delivering: 'डिलीवरी के लिए निकला',
    order_status_delivered: 'सफलतापूर्वक delivered',

    // Footer
    footer_guarantee_title: 'सीधी खेत गारंटी',
    footer_guarantee_desc: 'कृत्रिम पकाने वाले रसायनों या मोम से मुक्त। प्रामाणिक खेत से 100% ताज़ी उपज।',
    footer_payout_title: 'पारदर्शी 90% किसान भुगतान',
    footer_payout_desc: 'बिचौलियों की 50% दलाली खत्म। किसानों को प्रति क्विंटल 30-40% अधिक शुद्ध आय।',
    footer_transit_title: 'एग्री-फ्लीट 18 घंटे में डिलीवरी',
    footer_transit_desc: 'सुबह खेतों से तुड़ाई और शाम तक ताज़ा आपके दरवाज़े पर सीधी आपूर्ति।',
    footer_about_text: 'मध्य प्रदेश का प्रमुख प्रत्यक्ष किसान-से-उपभोक्ता डिजिटल कृषि व्यापार मंच। AI मूल्य खोज और निष्पक्ष बाज़ार से किसानों को सशक्त बनाना।',
    footer_rights: 'सर्वाधिकार सुरक्षित।',
  },

  mr: {
    // Brand & Navigation
    brand_name: 'कृषी कनेक्ट',
    tagline: 'थेट शेतातून आपल्या घरी. शेतकऱ्याला योग्य भाव, सर्वांना ताजी भाजी.',
    nav_marketplace: 'ताजी बाजारपेठ',
    nav_farmers: 'आमचे शेतकरी',
    nav_reviews: 'समीक्षा व अनुभव',
    nav_map: 'कृषी नकाशा',
    nav_how_it_works: 'कसे कार्य करते',
    nav_transparency: 'पारदर्शक दर',
    nav_about: 'आमच्याबद्दल',
    nav_dashboard: 'डॅशबोर्ड',
    nav_login: 'लॉग इन',
    nav_logout: 'लॉग आऊट',
    btn_shop_produce: 'ताजी शेतमाल खरेदी करा',
    btn_become_farmer: 'शेतमाल विका (शेतकरी)',
    btn_back: 'मागे जा',
    btn_back_home: 'मुख्य पृष्ठावर परत',
    view_name_marketplace: 'ताजी बाजारपेठ',
    view_name_farmers: 'आमचे शेतकरी',
    view_name_reviews: '३६०° समीक्षा व अनुभव',
    view_name_map: 'कृषी नकाशा',
    view_name_transparency: 'पारदर्शक दर',
    view_name_how_it_works: 'कसे कार्य करते',
    view_name_checkout: 'ऑर्डर चेकआऊट',
    view_name_login: 'हितधारक लॉगिन',
    view_name_dashboard: 'डॅशबोर्ड',

    // Hero Section
    hero_headline_1: 'थेट शेतातून आपल्या घरी.',
    hero_headline_2: 'शेतकऱ्याला न्याय, सर्वांना ताजी भाजी।',
    hero_title: 'थेट शेतातून आपल्या घरी. शेतकऱ्याला न्याय, सर्वांना ताजी भाजी.',
    hero_subtitle: 'दलालांना हटवून शेतकऱ्यांना ३०-४०% अधिक उत्पन्न मिळवून देणे आणि ग्राहकांना १८ तासांच्या आत शेतातून काढलेला शुद्ध, विषमुक्त शेतमाल पोहोचवणे.',
    hero_region_pill: 'मध्य प्रदेश कृषी पट्टा · भोपाळ, सिहोर आणि विदिशा',
    trust_npop: 'NPOP प्रमाणित सेंद्रिय शेतमाल',
    trust_farmer_share: '९०% थेट शेतकऱ्याचा वाटा',
    trust_under_18h: '१८ तासांच्या आत शेतातून थेट घरी',
    stat_farmer_realization: 'शेतकऱ्यांचे निव्वळ उत्पन्न',
    stat_vs_mandi: 'बाजार समितीपेक्षा +३४% अधिक',
    hub_filter_title: 'जिल्ह्यानुसार ताजी शेतमाल निवडा:',
    hub_filter_subtitle: 'आपल्या पिनकोड जवळ कार्यरत असलेल्या प्रमाणित शेतांचा शोध घ्या',

    // Metrics Strip
    stats_farmers: 'प्रमाणित शेतकरी',
    stats_traded: 'टन थेट विक्री',
    stats_farmer_profit: 'शेतकऱ्यांचे वाढीव उत्पन्न',
    stats_freshness: 'शेतातून घरपोच डिलिव्हरी',
    metrics_farmers_sub: '८ जिल्ह्यांतील सक्रिय शेतकरी',
    metrics_traded_sub: 'थेट B2C आणि B2B विक्री',
    metrics_profit_sub: 'ग्रामीण शेतकरी कुटुंबांचे वाढीव उत्पन्न',
    metrics_freshness_sub: 'कोणत्याही रासायनिक वायूविना पूर्णपणे ताजे',

    // How It Works
    how_tag: 'थेट कृषी व्यापार',
    how_title: 'कृषी कनेक्ट कसे कार्य करते',
    how_subtitle: 'एक पारदर्शक चार-टप्प्यांची कार्यपद्धती जी सर्व दलालांना हटवून १००% ताजेपणा आणि योग्य दराची खात्री देते.',
    step1_title: 'शेतकरी शेतमालाची नोंद करतात',
    step1_desc: 'शेतकरी काढणीची तारीख, प्रमाण नोंदवतात आणि AI स्मार्ट बाजार समिती मार्गदर्शकाद्वारे योग्य दर ठरवतात.',
    step2_title: 'ग्राहक आणि व्यापारी खरेदी करतात',
    step2_desc: 'खरेदीदार स्थानिक पिके पाहतात, पारदर्शक किंमत विभागणी तपासतात आणि थेट ऑर्डर नोंदवतात.',
    step3_title: 'सकाळी शेतातून ताजी तोडणी',
    step3_desc: 'ऑर्डर निश्चित होताच सकाळी ताजी काढणी, प्रतवारी आणि एग्री-क्रेट्समध्ये सुरक्षित पॅकिंग केले जाते.',
    step4_title: 'एग्री-फ्लीट थेट वाहतूक',
    step4_desc: 'शहरातील घरे व दुकानांपर्यंत १८ तासांत जलद डिलिव्हरी. ९०% रक्कम थेट शेतकऱ्याच्या बँक खात्यात जमा होते.',

    // Popular Produce
    popular_tag: 'सकाळची ताजी तोडणी',
    popular_title: 'लोकप्रिय शेतमाल',
    popular_subtitle: 'सिहोर, विदिशा आणि रायसेनच्या शेतकऱ्यांकडून थेट ताजे उत्पादने',
    view_all_products: 'सर्व उत्पादने पहा',
    farm_direct_price: 'शेताचा थेट दर',
    btn_add: 'जोडा',

    // Farmers Section
    farmers_tag: 'आमचे बळीराजा',
    farmers_title: 'प्रमाणित प्रगतीशील शेतकरी',
    see_all_farmers: 'सर्व शेतकरी पहा',
    years_farming: 'वर्षे शेतीचा प्रदीर्घ अनुभव',
    view_farm_produce: 'शेतातील उत्पादने पहा',

    // AI Banner
    ai_banner_tag: 'गुगल जेमिनी ३.८ फ्लॅश द्वारे समर्थित',
    ai_banner_title: 'झटपट AI शेती सल्ला आणि स्मार्ट बाजारपेठ शोध',
    ai_banner_desc: 'तुम्ही शेतकरी असा वा ग्राहक, कृषी मित्र AI मराठी, हिंदी आणि इंग्रजीत त्वरित व व्यावहारिक उत्तरे देतो.',
    ai_banner_btn: 'कृषी मित्र AI सहाय्यक सुरू करा',
    browse_marketplace: 'बाजारपेठ पहा',

    // Categories
    cat_all: 'सर्व उत्पादने',
    cat_vegetables: 'हिरव्या पालेभाज्या व भाज्या',
    cat_fruits: 'ताजी फळे',
    cat_grains: 'शरबती गहू व धान्य',
    cat_pulses: 'डाळी व कडधान्ये',
    cat_spices: 'शुद्ध मसाले',
    cat_dairy: 'गावरान गाईचे दूध व तूप',
    cat_organic: 'सेंद्रिय (Organic)',
    filter_organic_only: 'फक्त सेंद्रिय',
    filter_all_districts: 'सर्व जिल्हे',
    search_placeholder: 'टोमॅटो, शरबती गहू, कांदा, शुद्ध दूध शोधा...',

    // Marketplace Controls
    marketplace_title: 'थेट शेतातून उत्पादित शेतमाल',
    marketplace_subtitle: 'सिहोर, भोपाळ, रायसेन आणि विदिशा येथील शेतकरी संस्थांकडून थेट काढणी केलेला ताजा शेतमाल.',
    ask_ai_season: 'कृषी मित्राला विचारा: "सध्याच्या हंगामात काय सर्वात ताजे आहे?"',
    sort_popular: 'क्रम: सर्वोत्तम रेटिंग',
    sort_freshness: 'क्रम: सर्वात ताजी तोडणी',
    sort_price_low: 'क्रम: कमी ते जास्त दर',
    sort_price_high: 'क्रम: जास्त ते कमी दर',
    filter_show_organic: 'फक्त प्रमाणित सेंद्रिय (NPOP) दाखवा',
    showing_listings: 'थेट शेतातील शेतमाल उपलब्ध आहे',
    no_products_found: 'कोणताही शेतमाल सापडला नाही',
    no_products_hint: 'कृपया आपला जिल्हा किंवा शोध शब्द बदला. सिहोर आणि विदिशा येथून ताजी आवक रोज सकाळी ५ वाजता होते.',
    reset_filters: 'सर्व फिल्टर्स रीसेट करा',

    // Map Section
    map_tag: 'थेट कृषी भौगोलिक नकाशा',
    map_title: 'थेट कृषी परिसंस्था नकाशा',
    map_desc: 'प्रमाणित शेतकरी, शेतजमीन, जवळील घाऊक व्यापारी आणि एग्री-फ्लीट वाहतूक मार्ग नकाशावर पहा.',
    map_filter_all: 'सर्व घटक',
    map_filter_farmers: 'शेतकरी',
    map_filter_retailers: 'घाऊक व किरकोळ व्यापारी',
    map_filter_delivery: 'वाहतूकदार (AgriFleet)',
    map_filter_consumers: 'ग्राहक',
    map_district_all: 'सर्व जिल्हे',
    map_view_produce: 'शेतमाल पहा',
    map_view_profile: 'शेतकरी प्रोफाइल पहा',

    // Price Transparency
    price_transparency_title: 'तुमचे पैसे कुठे जातात?',
    price_transparency_subtitle: 'पारंपारिक बाजार समित्यांमध्ये ४-५ दलाल ५०% पेक्षा जास्त नफा घेतात. कृषी कनेक्टमध्ये ८८-९२% रक्कम थेट शेतकऱ्याच्या बँक खात्यात जमा होते.',
    farmer_receives: 'थेट शेतकऱ्याला मिळणारी रक्कम',
    logistics_quality: 'दर्जा तपासणी व वाहतूक',
    platform_fee: 'कृषी कनेक्ट सेवा शुल्क',
    traditional_mandi: 'पारंपारिक बाजार समिती पद्धत',
    krishi_direct: 'कृषी कनेक्ट थेट मॉडेल',
    middleman_cut: 'दलाल व मध्यस्थ कमिशन',
    retail_markup: 'सुपरमार्केट स्टोअर नफा',

    // Cart & Checkout
    btn_add_to_cart: 'बास्केटमध्ये जोडा',
    btn_buy_now: 'आत्ताच खरेदी करा',
    btn_checkout: 'ऑर्डर पूर्ण करा',
    cart_title: 'तुमची शेतमाल बास्केट',
    cart_empty: 'तुमची बास्केट रिकामी आहे. आत्ताच ताजी उत्पादने निवडा!',
    cart_subtotal: 'एकूण रक्कम',
    cart_delivery: 'शेतातून थेट जलद वाहतूक',
    cart_free_delivery: '₹४९९ पेक्षा जास्त ऑर्डरवर मोफत',
    cart_total: 'अंतिम देय रक्कम',

    // Roles
    role_farmer: 'शेतकरी मित्र',
    role_consumer: 'ग्राहक',
    role_retailer: 'व्यापारी / किरकोळ विक्रेते',
    role_delivery: 'डिलिव्हरी पार्टनर',
    role_admin: 'प्रशासन (Admin)',

    // AI Tools
    ai_assistant_title: 'कृषी मित्र AI सहाय्यक',
    ai_pricing_tool: 'AI योग्य बाजारभाव',
    ai_demand_forecast: 'AI मागणी अंदाज',

    // Order Statuses
    order_status_confirmed: 'ऑर्डर निश्चित झाली',
    order_status_accepted: 'शेतकऱ्याने स्वीकारली',
    order_status_preparing: 'काढणी व प्रतवारी सुरू',
    order_status_ready: 'पिकअपसाठी तयार',
    order_status_picked: 'वाहतुकीसाठी रवाना',
    order_status_delivering: 'डिलिव्हरीसाठी मार्गस्थ',
    order_status_delivered: 'यशस्वीरित्या पोहोचवले',

    // Footer
    footer_guarantee_title: 'थेट शेताची हमी',
    footer_guarantee_desc: 'रासायनिक फवारणी किंवा मेणापासून मुक्त. शेताचा शुद्ध आणि नैसर्गिक शेतमाल.',
    footer_payout_title: 'पारदर्शक ९०% शेतकरी मोबदला',
    footer_payout_desc: 'मध्यस्थांची दलाली बंद. शेतकऱ्यांना प्रतिक्विंटल ३०-४०% अधिक थेट उत्पन्न.',
    footer_transit_title: 'एग्री-फ्लीट १८ तासांत पोहोच',
    footer_transit_desc: 'पहाटे शेतातून तोडणी आणि संध्याकाळपूर्वी ताजी भाजी थेट आपल्या दारात.',
    footer_about_text: 'मध्य प्रदेशातील आघाडीचे थेट शेतकरी-ते-ग्राहक डिजिटल कृषी व्यापार व्यासपीठ. AI दर निर्धारण आणि न्याय्य बाजारपेठ.',
    footer_rights: 'सर्व हक्क राखीव.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('krishi_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('krishi_lang', l);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
