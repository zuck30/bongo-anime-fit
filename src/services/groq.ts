
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface Question {
  text: string;
  answers: string[];
}

export interface CharacterResult {
  character: string;
  anime: string;
  description: string;
  funny_line: string;
  traits: string[];
}

export async function generateQuestions(): Promise<Question[]> {
  const prompt = `UNA WAJIBU WA KUTENGAZA MASWALI 6 MAPYA KILA MARA.

MUHIMU SANA:
- Kila swali lazima liwe TOFAUTI na lile la awali
- Usirudie swali lile lile la daladala mara kwa mara
- Tumia KiswahILI CHA MITAANI kama wanavyozungumza Tanzania
- Kila swali liwe na majibu 4

HAPA MFANO WA MWONGOZO TU (USIYAnakili):
[{"text": "Daladala imekwama, unafanya nini?", "answers": ["Kusukuma", "Kushuka", "Kusubiri", "Kupiga kelele"]}]

SASA TENGAZA SWALI LA 1 LA KWELI:
KUHUSU MAISHA YA KILA SIKU TANZANIA (chakula, usafiri, marafiki, hela, umeme, mapenzi)

SWALI LA 2: (TOFAUTI KABISA)
SWALI LA 3: (TOFAUTI KABISA)
SWALI LA 4:
SWALI LA 5:
SWALI LA 6:

RUDI JSON TU.`;

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 1.1,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content;
  
  if (!text) throw new Error("No response from Groq");
  
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  

  let jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    const retryResponse = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt + "\n\nRUDI JSON TU. USIWEKE MANENO YOYOTE NYINGINE." }],
        temperature: 0.8,
        max_tokens: 1500
      })
    });
    
    const retryData = await retryResponse.json();
    let retryText = retryData.choices?.[0]?.message?.content;
    retryText = retryText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    jsonMatch = retryText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found after retry");
    text = retryText;
  }
  
  const questions = JSON.parse(jsonMatch[0]);
  
  if (!Array.isArray(questions) || questions.length !== 6) {
    throw new Error("Invalid questions format");
  }
  
  return questions;
}

export async function getCharacter(answers: string[]): Promise<CharacterResult> {
  const prompt = `MAJIBU YA MTU: ${answers.join(", ")}

KAZI YAKO: Chambua tabia za mtu huyu kulingana na majibu yake.

MUHIMU:
- Mlinganishe na mhusika mmoja WA ANIME HALISI (Zoro, Luffy, Naruto, Gojo, Tanjiro, Zenitsu, Levi, Goku, Nami, Sakura, etc.)
- Usizushi mhusika mpya. Tumia waliopo kwenye anime maarufu.
- Maelezo yake yatumie KISWAHILI CHA MITAANI (sio Kiswahili cha kitabu)
- Sentensi ya ucheshi iwe KUTANIA MAISHA YA TANZANIA (daladala, ugali, umeme, TANESCO, hela)

RETURN JSON TU. MFANO:
{
  "character": "Zoro",
  "anime": "One Piece",
  "description": "Mtu anayepotea anapotoka dukani kwenda nyumbani. Anachelewa kila siku lakini ana nguvu za ajabu.",
  "funny_line": "Nenda ununue chumvi, anakwenda Mwanza!",
  "traits": ["Anapotea", "Mwenye nguvu", "Mvumilivu"]
}`;

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 600
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  let text = data.choices?.[0]?.message?.content;
  
  if (!text) throw new Error("No response from Groq");
  
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found");
  
  const result = JSON.parse(jsonMatch[0]);
  

  if (!result.character) throw new Error("Missing character");
  if (!result.anime) throw new Error("Missing anime");
  if (!result.description) result.description = "Mtu wa kawaida anayependa amani";
  if (!result.funny_line) result.funny_line = "Ugali umekatika!";
  if (!result.traits) result.traits = ["Mcheshi", "Mkarimu"];
  
  return result;
}