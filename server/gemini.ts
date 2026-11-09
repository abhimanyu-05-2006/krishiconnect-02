import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

export interface SmartPricingResult {
  recommendedMinPrice: number;
  recommendedMaxPrice: number;
  recommendedOptimalPrice: number;
  traditionalMandiPrice: number;
  farmerDirectGainPercent: number;
  marketTrend: 'Bullish (Rising)' | 'Stable' | 'Bearish (Falling)';
  demandLevel: 'High' | 'Moderate' | 'Low';
  rationale: string;
  actionableAdvice: string[];
  isRealAi: boolean;
}

export async function calculateSmartPricing(params: {
  cropName: string;
  location: string;
  quantity: number;
  unit: string;
  currentPrice: number;
  isOrganic: boolean;
}): Promise<SmartPricingResult> {
  const { cropName, location, quantity, unit, currentPrice, isOrganic } = params;

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are KrishiConnect's agricultural market pricing economist specializing in Indian mandis and direct farm-to-consumer commerce in Madhya Pradesh (${location}).
Analyze the fair direct farm selling price for:
- Crop: ${cropName}
- Current Farm Ask: ₹${currentPrice} per ${unit}
- Volume: ${quantity} ${unit}
- Farming method: ${isOrganic ? 'Certified Organic' : 'Conventional'}
- Market: ${location}, India

Return ONLY a valid JSON object without markdown or backticks in this exact schema:
{
  "recommendedMinPrice": number,
  "recommendedMaxPrice": number,
  "recommendedOptimalPrice": number,
  "traditionalMandiPrice": number,
  "farmerDirectGainPercent": number,
  "marketTrend": "Bullish (Rising)" | "Stable" | "Bearish (Falling)",
  "demandLevel": "High" | "Moderate" | "Low",
  "rationale": "2-3 sentences explaining market arrivals, festival/seasonal demand, and why direct selling yields higher return.",
  "actionableAdvice": ["Tip 1", "Tip 2", "Tip 3"]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          ...parsed,
          isRealAi: true,
        };
      }
    } catch (err) {
      console.warn('Gemini smart pricing error, using domain fallback:', err);
    }
  }

  // Realistic domain model fallback
  const base = currentPrice || 30;
  const organicMultiplier = isOrganic ? 1.25 : 1.0;
  const mandiPrice = Math.round(base * 0.72);
  const optimal = Math.round(base * 1.05 * organicMultiplier);
  const min = Math.round(optimal * 0.92);
  const max = Math.round(optimal * 1.15);
  const gain = Math.round(((optimal - mandiPrice) / mandiPrice) * 100);

  return {
    recommendedMinPrice: min,
    recommendedMaxPrice: max,
    recommendedOptimalPrice: optimal,
    traditionalMandiPrice: mandiPrice,
    farmerDirectGainPercent: gain,
    marketTrend: isOrganic ? 'Bullish (Rising)' : 'Stable',
    demandLevel: 'High',
    rationale: `Wholesale mandi arrivals in ${location} reflect elevated middleman margins (~28%). By selling directly through KrishiConnect, you bypass 3 intermediary commissions and capture ${gain}% higher net realization while keeping consumer retail rates attractive.`,
    actionableAdvice: [
      `Stage harvest dispatch in batches of 50-100 ${unit} to maintain premium freshness.`,
      `Highlight ${isOrganic ? 'Zero-Chemical NPOP certification' : 'fresh morning plucking'} on your product listing.`,
      `Offer 8-10% wholesale concession for local restaurants and supermarkets ordering above 50 ${unit}.`,
    ],
    isRealAi: false,
  };
}

export async function generateDemandForecast(params: {
  category: string;
  region: string;
  timeline: string;
}) {
  const { category, region, timeline } = params;

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are KrishiConnect AgriTech Demand Forecaster for central India (${region}).
Analyze upcoming 30-day demand trends for agricultural category: "${category}".
Return ONLY a valid JSON object in this format:
{
  "projectedDemandGrowth": number,
  "topHighDemandCrops": [
    {"name": string, "growthPercent": number, "peakWindow": string, "reason": string}
  ],
  "inventoryRecommendation": string,
  "weatherRiskAlert": string
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        return { ...JSON.parse(response.text), isRealAi: true };
      }
    } catch (e) {
      console.warn('Gemini demand forecast error:', e);
    }
  }

  // Fallback domain forecast
  return {
    projectedDemandGrowth: 18.5,
    topHighDemandCrops: [
      {
        name: 'Desi Tomatoes & Cherry Tomatoes',
        growthPercent: 24,
        peakWindow: 'Mid November - December',
        reason: 'Wedding season banquet demand across Bhopal & Indore hospitality sectors.',
      },
      {
        name: 'Tender Sweet Peas (Matar)',
        growthPercent: 32,
        peakWindow: 'Immediate 4 weeks',
        reason: 'Early winter winter crop novelty with consumers willing to pay premium.',
      },
      {
        name: 'Fresh Leafy Spinach & Fenugreek (Methi)',
        growthPercent: 19,
        peakWindow: 'Entire Winter Quarter',
        reason: 'High daily household consumption and wellness trends in urban tier-2 centres.',
      },
    ],
    inventoryRecommendation:
      'Harvest tomatoes at breaker/turning stage (pink-orange) for urban transit longevity. Plan staggered plantings of coriander and spinach at 10-day intervals.',
    weatherRiskAlert:
      'Moderate night-time fog and dew anticipated in Narmada valley belt; monitor for early blight symptoms on solanaceous crops.',
    isRealAi: false,
  };
}

export async function askAgriAssistant(params: {
  message: string;
  role: string;
  language: 'en' | 'hi' | 'mr';
  chatHistory?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}) {
  const { message, role, language } = params;

  if (aiClient && process.env.GEMINI_API_KEY) {
    try {
      const langInstruction =
        language === 'hi'
          ? 'Respond in clear, respectful, natural Hindi (Devanagari script or conversational Hindi with practical agricultural terminology).'
          : language === 'mr'
          ? 'Respond in clear, respectful, natural Marathi (Devanagari script with authentic Indian/Maharashtra agricultural terminology like शेतकरी, बाजारभाव, काढणी, सेंद्रिय खत, कीड नियंत्रण).'
          : 'Respond in clear, encouraging, practical English with agricultural specifics.';

      const systemInstruction = `You are "KrishiMitra", the expert AI AgriTech Assistant within KrishiConnect.
You assist Indian farmers, consumers, and food businesses.
Current user role: ${role}.
${langInstruction}
Focus on:
1. Direct farmer pricing and market fair share
2. Natural, organic, and IPM pest management without expensive chemicals
3. Post-harvest handling, grading, and reducing spoilage
4. Consumer advice on seasonal freshness and price transparency
5. Direct logistics tips in Central India & Maharashtra agricultural belts.
Keep advice concise, actionable, and structured with bullet points. Never provide dangerous chemical dosage advice.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
          tools: [
            {
              googleMaps: {},
            },
          ],
        },
      });

      // Extract Google Maps grounding metadata if available
      const candidate = response.candidates?.[0];
      const groundingMeta = candidate?.groundingMetadata;
      const mapSources = groundingMeta?.groundingChunks
        ?.filter((c: any) => c.maps)
        ?.map((c: any) => ({
          title: c.maps?.title || 'Google Maps Location',
          uri: c.maps?.googleMapsUri,
        })) || [];

      return {
        reply: response.text || 'Thank you for your question. KrishiConnect is ready to help.',
        isRealAi: true,
        groundedWithMaps: mapSources.length > 0,
        mapSources,
      };
    } catch (err) {
      console.warn('Gemini chat error with Maps Grounding, falling back:', err);
    }
  }

  // Contextual domain responses
  const q = message.toLowerCase();
  let reply = '';
  if (language === 'hi') {
    if (q.includes('price') || q.includes('daam') || q.includes('bhaav') || q.includes('भाव') || q.includes('दाम')) {
      reply =
        '**कृषि कनेक्ट स्मार्ट मूल्य सुझाव:**\n' +
        '• भोपाल और सीहोर मंडी में आज टमाटर ₹22-26/किलो थोक पर बिक रहा है।\n' +
        '• कृषि कनेक्ट पर सीधे उपभोक्ताओं और किराना स्टोर्स को ₹28-32/किलो पर बेचें।\n' +
        '• इससे आपको 30% अधिक शुद्ध लाभ मिलेगा और ग्राहकों को भी ताज़ा माल सस्ते में मिलेगा।';
    } else if (q.includes('tamatar') || q.includes('रोग') || q.includes('keet') || q.includes('टमाटर')) {
      reply =
        '**टमाटर फसल स्वास्थ्य सलाह:**\n' +
        '• अगेती झुलसा (Early Blight) से बचाव के लिए नीम का तेल (10,000 ppm) 3 मिली प्रति लीटर पानी में मिलाकर शाम के समय छिड़कें।\n' +
        '• तने के पास जलभराव न होने दें। ट्राइकोडर्मा विरिडी 5 ग्राम/लीटर का प्रयोग मिट्टी उपचार में करें।';
    } else {
      reply =
        '**नमस्ते! मैं आपका कृषि मित्र हूँ।**\n' +
        'कृषि कनेक्ट पर आप अपनी उपज का सही मूल्य तय कर सकते हैं, आगामी मांग का पूर्वानुमान देख सकते हैं और सीधे खरीदारों से जुड़ सकते हैं। आप फसल, मौसम, या मंडी भाव के बारे में कोई भी प्रश्न पूछ सकते हैं।';
    }
  } else if (language === 'mr') {
    if (q.includes('price') || q.includes('daam') || q.includes('bhaav') || q.includes('भाव') || q.includes('दर') || q.includes('किंमत')) {
      reply =
        '**कृषी कनेक्ट स्मार्ट बाजारभाव सल्ला:**\n' +
        '• स्थानिक बाजार समित्यांमध्ये आज दर्जेदार टोमॅटो ₹२२-२६/किलो घाऊक दराने विकला जात आहे.\n' +
        '• कृषी कनेक्टवर थेट ग्राहक व किरकोळ व्यापाऱ्यांना ₹२८-३२/किलो दराने विक्री करा.\n' +
        '• यामुळे दलाली वाचून शेतकऱ्यांना ३०% अधिक निव्वळ नफा मिळतो आणि ग्राहकांनाही ताजा शेतमाल मिळतो.';
    } else if (q.includes('tamatar') || q.includes('रोग') || q.includes('कीड') || q.includes('टोमॅटो') || q.includes('pest')) {
      reply =
        '**टोमॅटो पीक संरक्षण व सेंद्रिय सल्ला:**\n' +
        '• करपा व बुरशीजन्य रोगांच्या नियंत्रणासाठी कडुलिंबाचे तेल (Neem Oil 10,000 ppm) ३ मिली प्रति लिटर पाण्यात मिसळून संध्याकाळी फवारावे.\n' +
        '• झाडांच्या मुळाशी पाणी साचू देऊ नका. ट्रायकोडर्मा व्हिरिडी ५ ग्रॅम/लिटर प्रमाणात मातीत मिसळावे.';
    } else {
      reply =
        '**नमस्कार! मी आपला कृषी मित्र आहे.**\n' +
        'कृषी कनेक्टवर आपण आपल्या शेतमालाचा रास्त दर ठरवू शकता, आगामी बाजारपेठेतील मागणी तपासू शकता आणि मध्यस्थांशिवाय थेट ग्राहकांशी जोडू शकता. शेती, हवामान किंवा बाजारभावाबद्दल कोणताही प्रश्न विचारा!';
    }
  } else {
    if (q.includes('price') || q.includes('mandi') || q.includes('rate')) {
      reply =
        '**KrishiConnect Smart Pricing Advisory:**\n' +
        '• Current Sehore & Bhopal mandi wholesale rate for desi tomatoes is ₹22-25/kg.\n' +
        '• Recommended direct farm-gate listing on KrishiConnect: ₹28-32/kg.\n' +
        '• Benefit: You eliminate ₹6/kg arhatiya commission and crate deductions, yielding 28% higher net income.';
    } else if (q.includes('season') || q.includes('winter') || q.includes('harvest')) {
      reply =
        '**Current Peak Harvest in Central MP:**\n' +
        '• Tender Green Peas (Matar) - High urban demand across Bhopal & Indore.\n' +
        '• Cauliflower and Leafy Palak - Harvest early morning (5:00 AM) to preserve crisp moisture.\n' +
        '• Sharbati Wheat staging - Ideal moisture level for storage is below 11%.';
    } else {
      reply =
        '**Welcome to KrishiMitra AI!**\n' +
        'I can guide you on real-time mandi price comparisons, organic pest management, crop harvesting windows, and direct retailer negotiation. Ask me any question regarding your harvest or produce purchase!';
    }
  }

  return { reply, isRealAi: false };
}
