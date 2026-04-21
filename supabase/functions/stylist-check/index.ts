import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  rain_probability: number;
  description: string;
  wind_speed: number;
}

interface RequestBody {
  outfit: string;
  lat: number;
  lon: number;
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = Deno.env.get("OPENWEATHERMAP_API_KEY");

  if (!apiKey) {
    return {
      temperature: 28,
      feels_like: 30,
      humidity: 75,
      rain_probability: 60,
      description: "partly cloudy with chance of rain",
      wind_speed: 15,
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=4`;
  const forecastResponse = await fetch(forecastUrl);
  const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;

  let rainProbability = 0;
  if (forecastData && forecastData.list) {
    const rainData = forecastData.list.find((item: { pop: number }) => item.pop > 0);
    rainProbability = rainData ? Math.round(rainData.pop * 100) : 0;
  }

  return {
    temperature: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    rain_probability: rainProbability,
    description: data.weather[0]?.description || "clear",
    wind_speed: data.wind.speed * 3.6,
  };
}

async function getStylistAdvice(outfit: string, weather: WeatherData): Promise<{ verdict: string; advice: string }> {
  const apiKey = Deno.env.get("LLM_API_KEY");
  const apiUrl = Deno.env.get("LLM_API_URL");

  if (!apiKey || !apiUrl) {
    return generateLocalAdvice(outfit, weather);
  }

  const prompt = `You are a brutally honest stylist for university students. The user is planning to wear: "${outfit}"

Current weather conditions:
- Temperature: ${weather.temperature}°C (feels like ${weather.feels_like}°C)
- Humidity: ${weather.humidity}%
- Rain probability: ${weather.rain_probability}%
- Wind: ${weather.wind_speed} km/h
- Conditions: ${weather.description}

Give a short, practical verdict. Start with exactly one of: "SAFE", "WARNING", or "DISASTER".
Then provide ONE sentence of practical advice about makeup or clothing adjustments.

Format your response exactly like this:
VERDICT: [SAFE/WARNING/DISASTER]
ADVICE: [Your one sentence of practical advice]`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 150,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return generateLocalAdvice(outfit, weather);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    const verdictMatch = text.match(/VERDICT:\s*(SAFE|WARNING|DISASTER)/i);
    const adviceMatch = text.match(/ADVICE:\s*(.+)/i);

    return {
      verdict: verdictMatch ? verdictMatch[1].toUpperCase() : "WARNING",
      advice: adviceMatch ? adviceMatch[1].trim() : text.trim(),
    };
  } catch {
    return generateLocalAdvice(outfit, weather);
  }
}

function generateLocalAdvice(outfit: string, weather: WeatherData): { verdict: string; advice: string } {
  const outfitLower = outfit.toLowerCase();
  const issues: string[] = [];
  let verdict = "SAFE";

  if (weather.rain_probability > 50) {
    if (outfitLower.includes("white") || outfitLower.includes("cream") || outfitLower.includes("light")) {
      issues.push("light colors will get muddy");
      verdict = "DISASTER";
    } else if (outfitLower.includes("linen") || outfitLower.includes("silk")) {
      issues.push("delicate fabrics will suffer in rain");
      verdict = "WARNING";
    }
  }

  if (weather.humidity > 70) {
    if (outfitLower.includes("dewy") || outfitLower.includes("glowy") || outfitLower.includes("glow")) {
      issues.push("dewy makeup will melt in high humidity");
      verdict = verdict === "SAFE" ? "WARNING" : verdict;
    }
    if (outfitLower.includes("matte")) {
      issues = issues.filter((i) => !i.includes("makeup"));
    }
  }

  if (weather.temperature > 30) {
    if (outfitLower.includes("heavy") || outfitLower.includes("wool") || outfitLower.includes("thick")) {
      issues.push("heavy fabrics are too warm");
      verdict = "WARNING";
    }
  }

  if (weather.temperature < 20) {
    if (outfitLower.includes("shorts") || outfitLower.includes("sleeveless") || outfitLower.includes("tank")) {
      issues.push("too cold for summer clothes");
      verdict = "WARNING";
    }
  }

  if (weather.wind_speed > 20) {
    if (outfitLower.includes("skirt") || outfitLower.includes("dress")) {
      issues.push("windy conditions make skirts risky");
      verdict = verdict === "SAFE" ? "WARNING" : verdict;
    }
  }

  if (verdict === "SAFE") {
    return {
      verdict: "SAFE",
      advice: "Your outfit works well with today's weather. You're good to go!",
    };
  }

  const adviceMap: Record<string, string> = {
    "light colors will get muddy": "Swap to dark pants or bring a waterproof layer.",
    "delicate fabrics will suffer in rain": "Choose synthetic blends that dry quickly.",
    "dewy makeup will melt in high humidity": "Use a matte setting spray or switch to powder foundation.",
    "heavy fabrics are too warm": "Opt for breathable cotton or linen instead.",
    "too cold for summer clothes": "Add a light jacket or cardigan.",
    "windy conditions make skirts risky": "Wear shorts underneath or choose pants instead.",
  };

  const advice = issues.map((i) => adviceMap[i] || i).join(" ");

  return { verdict, advice };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: RequestBody = await req.json();

    if (!body.outfit || typeof body.lat !== "number" || typeof body.lon !== "number") {
      return new Response(JSON.stringify({ error: "Missing required fields: outfit, lat, lon" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weather = await fetchWeather(body.lat, body.lon);
    const stylistResult = await getStylistAdvice(body.outfit, weather);

    return new Response(
      JSON.stringify({
        weather,
        verdict: stylistResult.verdict,
        advice: stylistResult.advice,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
