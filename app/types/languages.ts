export type TranscriptionLanguageOption = {
  code: string;
  label: string;
  whisperCode: string | "auto";
  flag: string;
};

export const AUTO_DETECT_LANGUAGE = {
  code: "auto",
  label: "Auto-detect",
  whisperCode: "auto",
  flag: "🌐",
} as const;

const RAW_TRANSCRIPTION_LANGUAGES = [
  { code: "af", label: "Afrikaans", whisperCode: "af", flag: "🇿🇦" },
  { code: "am", label: "Amharic", whisperCode: "am", flag: "🇪🇹" },
  { code: "ar", label: "Arabic", whisperCode: "ar", flag: "🇸🇦" },
  { code: "as", label: "Assamese", whisperCode: "as", flag: "🇮🇳" },
  { code: "az", label: "Azerbaijani", whisperCode: "az", flag: "🇦🇿" },
  { code: "ba", label: "Bashkir", whisperCode: "ba", flag: "🇷🇺" },
  { code: "be", label: "Belarusian", whisperCode: "be", flag: "🇧🇾" },
  { code: "bg", label: "Bulgarian", whisperCode: "bg", flag: "🇧🇬" },
  { code: "bn", label: "Bengali", whisperCode: "bn", flag: "🇧🇩" },
  { code: "bo", label: "Tibetan", whisperCode: "bo", flag: "🇨🇳" },
  { code: "br", label: "Breton", whisperCode: "br", flag: "🇫🇷" },
  { code: "bs", label: "Bosnian", whisperCode: "bs", flag: "🇧🇦" },
  { code: "ca", label: "Catalan", whisperCode: "ca", flag: "🇪🇸" },
  { code: "cs", label: "Czech", whisperCode: "cs", flag: "🇨🇿" },
  { code: "cy", label: "Welsh", whisperCode: "cy", flag: "🏴" },
  { code: "da", label: "Danish", whisperCode: "da", flag: "🇩🇰" },
  { code: "de", label: "German", whisperCode: "de", flag: "🇩🇪" },
  { code: "el", label: "Greek", whisperCode: "el", flag: "🇬🇷" },
  { code: "en", label: "English", whisperCode: "en", flag: "🇺🇸" },
  { code: "es", label: "Spanish", whisperCode: "es", flag: "🇪🇸" },
  { code: "et", label: "Estonian", whisperCode: "et", flag: "🇪🇪" },
  { code: "eu", label: "Basque", whisperCode: "eu", flag: "🇪🇸" },
  { code: "fa", label: "Persian", whisperCode: "fa", flag: "🇮🇷" },
  { code: "fi", label: "Finnish", whisperCode: "fi", flag: "🇫🇮" },
  { code: "fo", label: "Faroese", whisperCode: "fo", flag: "🇫🇴" },
  { code: "fr", label: "French", whisperCode: "fr", flag: "🇫🇷" },
  { code: "gl", label: "Galician", whisperCode: "gl", flag: "🇪🇸" },
  { code: "gu", label: "Gujarati", whisperCode: "gu", flag: "🇮🇳" },
  { code: "ha", label: "Hausa", whisperCode: "ha", flag: "🇳🇬" },
  { code: "haw", label: "Hawaiian", whisperCode: "haw", flag: "🇺🇸" },
  { code: "he", label: "Hebrew", whisperCode: "he", flag: "🇮🇱" },
  { code: "hi", label: "Hindi", whisperCode: "hi", flag: "🇮🇳" },
  { code: "hr", label: "Croatian", whisperCode: "hr", flag: "🇭🇷" },
  { code: "ht", label: "Haitian Creole", whisperCode: "ht", flag: "🇭🇹" },
  { code: "hu", label: "Hungarian", whisperCode: "hu", flag: "🇭🇺" },
  { code: "hy", label: "Armenian", whisperCode: "hy", flag: "🇦🇲" },
  { code: "id", label: "Indonesian", whisperCode: "id", flag: "🇮🇩" },
  { code: "is", label: "Icelandic", whisperCode: "is", flag: "🇮🇸" },
  { code: "it", label: "Italian", whisperCode: "it", flag: "🇮🇹" },
  { code: "ja", label: "Japanese", whisperCode: "ja", flag: "🇯🇵" },
  { code: "jw", label: "Javanese", whisperCode: "jw", flag: "🇮🇩" },
  { code: "ka", label: "Georgian", whisperCode: "ka", flag: "🇬🇪" },
  { code: "kk", label: "Kazakh", whisperCode: "kk", flag: "🇰🇿" },
  { code: "km", label: "Khmer", whisperCode: "km", flag: "🇰🇭" },
  { code: "kn", label: "Kannada", whisperCode: "kn", flag: "🇮🇳" },
  { code: "ko", label: "Korean", whisperCode: "ko", flag: "🇰🇷" },
  { code: "la", label: "Latin", whisperCode: "la", flag: "🏛️" },
  { code: "lb", label: "Luxembourgish", whisperCode: "lb", flag: "🇱🇺" },
  { code: "ln", label: "Lingala", whisperCode: "ln", flag: "🇨🇩" },
  { code: "lo", label: "Lao", whisperCode: "lo", flag: "🇱🇦" },
  { code: "lt", label: "Lithuanian", whisperCode: "lt", flag: "🇱🇹" },
  { code: "lv", label: "Latvian", whisperCode: "lv", flag: "🇱🇻" },
  { code: "mg", label: "Malagasy", whisperCode: "mg", flag: "🇲🇬" },
  { code: "mi", label: "Maori", whisperCode: "mi", flag: "🇳🇿" },
  { code: "mk", label: "Macedonian", whisperCode: "mk", flag: "🇲🇰" },
  { code: "ml", label: "Malayalam", whisperCode: "ml", flag: "🇮🇳" },
  { code: "mn", label: "Mongolian", whisperCode: "mn", flag: "🇲🇳" },
  { code: "mr", label: "Marathi", whisperCode: "mr", flag: "🇮🇳" },
  { code: "ms", label: "Malay", whisperCode: "ms", flag: "🇲🇾" },
  { code: "mt", label: "Maltese", whisperCode: "mt", flag: "🇲🇹" },
  { code: "my", label: "Burmese", whisperCode: "my", flag: "🇲🇲" },
  { code: "ne", label: "Nepali", whisperCode: "ne", flag: "🇳🇵" },
  { code: "nl", label: "Dutch", whisperCode: "nl", flag: "🇳🇱" },
  { code: "nn", label: "Nynorsk", whisperCode: "nn", flag: "🇳🇴" },
  { code: "no", label: "Norwegian", whisperCode: "no", flag: "🇳🇴" },
  { code: "oc", label: "Occitan", whisperCode: "oc", flag: "🇫🇷" },
  { code: "pa", label: "Punjabi", whisperCode: "pa", flag: "🇮🇳" },
  { code: "pl", label: "Polish", whisperCode: "pl", flag: "🇵🇱" },
  { code: "ps", label: "Pashto", whisperCode: "ps", flag: "🇦🇫" },
  { code: "pt", label: "Portuguese", whisperCode: "pt", flag: "🇵🇹" },
  { code: "ro", label: "Romanian", whisperCode: "ro", flag: "🇷🇴" },
  { code: "ru", label: "Russian", whisperCode: "ru", flag: "🇷🇺" },
  { code: "sa", label: "Sanskrit", whisperCode: "sa", flag: "🇮🇳" },
  { code: "sd", label: "Sindhi", whisperCode: "sd", flag: "🇵🇰" },
  { code: "si", label: "Sinhala", whisperCode: "si", flag: "🇱🇰" },
  { code: "sk", label: "Slovak", whisperCode: "sk", flag: "🇸🇰" },
  { code: "sl", label: "Slovenian", whisperCode: "sl", flag: "🇸🇮" },
  { code: "sn", label: "Shona", whisperCode: "sn", flag: "🇿🇼" },
  { code: "so", label: "Somali", whisperCode: "so", flag: "🇸🇴" },
  { code: "sq", label: "Albanian", whisperCode: "sq", flag: "🇦🇱" },
  { code: "sr", label: "Serbian", whisperCode: "sr", flag: "🇷🇸" },
  { code: "su", label: "Sundanese", whisperCode: "su", flag: "🇮🇩" },
  { code: "sv", label: "Swedish", whisperCode: "sv", flag: "🇸🇪" },
  { code: "sw", label: "Swahili", whisperCode: "sw", flag: "🇰🇪" },
  { code: "ta", label: "Tamil", whisperCode: "ta", flag: "🇮🇳" },
  { code: "te", label: "Telugu", whisperCode: "te", flag: "🇮🇳" },
  { code: "tg", label: "Tajik", whisperCode: "tg", flag: "🇹🇯" },
  { code: "th", label: "Thai", whisperCode: "th", flag: "🇹🇭" },
  { code: "tk", label: "Turkmen", whisperCode: "tk", flag: "🇹🇲" },
  { code: "tl", label: "Tagalog", whisperCode: "tl", flag: "🇵🇭" },
  { code: "tr", label: "Turkish", whisperCode: "tr", flag: "🇹🇷" },
  { code: "tt", label: "Tatar", whisperCode: "tt", flag: "🇷🇺" },
  { code: "uk", label: "Ukrainian", whisperCode: "uk", flag: "🇺🇦" },
  { code: "ur", label: "Urdu", whisperCode: "ur", flag: "🇵🇰" },
  { code: "uz", label: "Uzbek", whisperCode: "uz", flag: "🇺🇿" },
  { code: "vi", label: "Vietnamese", whisperCode: "vi", flag: "🇻🇳" },
  { code: "yi", label: "Yiddish", whisperCode: "yi", flag: "🇮🇱" },
  { code: "yo", label: "Yoruba", whisperCode: "yo", flag: "🇳🇬" },
  { code: "zh", label: "Chinese", whisperCode: "zh", flag: "🇨🇳" },

  // Regional variants (mapped to supported Whisper base language codes)
  { code: "ar-eg", label: "Arabic (Egypt)", whisperCode: "ar", flag: "🇪🇬" },
  {
    code: "ar-sa",
    label: "Arabic (Saudi Arabia)",
    whisperCode: "ar",
    flag: "🇸🇦",
  },
  {
    code: "da-dk",
    label: "Danish (Denmark)",
    whisperCode: "da",
    flag: "🇩🇰",
  },
  { code: "de-at", label: "German (Austria)", whisperCode: "de", flag: "🇦🇹" },
  {
    code: "de-de",
    label: "German (Germany)",
    whisperCode: "de",
    flag: "🇩🇪",
  },
  {
    code: "en-au",
    label: "English (Australia)",
    whisperCode: "en",
    flag: "🇦🇺",
  },
  {
    code: "en-gb",
    label: "English (United Kingdom)",
    whisperCode: "en",
    flag: "🇬🇧",
  },
  {
    code: "en-in",
    label: "English (India)",
    whisperCode: "en",
    flag: "🇮🇳",
  },
  {
    code: "en-us",
    label: "English (United States)",
    whisperCode: "en",
    flag: "🇺🇸",
  },
  { code: "es-es", label: "Spanish (Spain)", whisperCode: "es", flag: "🇪🇸" },
  { code: "es-mx", label: "Spanish (Mexico)", whisperCode: "es", flag: "🇲🇽" },
  { code: "fr-ca", label: "French (Canada)", whisperCode: "fr", flag: "🇨🇦" },
  { code: "fr-fr", label: "French (France)", whisperCode: "fr", flag: "🇫🇷" },
  { code: "hi-in", label: "Hindi (India)", whisperCode: "hi", flag: "🇮🇳" },
  {
    code: "id-id",
    label: "Indonesian (Indonesia)",
    whisperCode: "id",
    flag: "🇮🇩",
  },
  { code: "it-it", label: "Italian (Italy)", whisperCode: "it", flag: "🇮🇹" },
  { code: "ja-jp", label: "Japanese (Japan)", whisperCode: "ja", flag: "🇯🇵" },
  { code: "ko-kr", label: "Korean (Korea)", whisperCode: "ko", flag: "🇰🇷" },
  {
    code: "nl-nl",
    label: "Dutch (Netherlands)",
    whisperCode: "nl",
    flag: "🇳🇱",
  },
  {
    code: "no-no",
    label: "Norwegian (Norway)",
    whisperCode: "no",
    flag: "🇳🇴",
  },
  { code: "pl-pl", label: "Polish (Poland)", whisperCode: "pl", flag: "🇵🇱" },
  {
    code: "pt-br",
    label: "Portuguese (Brazil)",
    whisperCode: "pt",
    flag: "🇧🇷",
  },
  {
    code: "pt-pt",
    label: "Portuguese (Portugal)",
    whisperCode: "pt",
    flag: "🇵🇹",
  },
  { code: "ru-ru", label: "Russian (Russia)", whisperCode: "ru", flag: "🇷🇺" },
  {
    code: "sv-se",
    label: "Swedish (Sweden)",
    whisperCode: "sv",
    flag: "🇸🇪",
  },
  { code: "th-th", label: "Thai (Thailand)", whisperCode: "th", flag: "🇹🇭" },
  {
    code: "tr-tr",
    label: "Turkish (Turkey)",
    whisperCode: "tr",
    flag: "🇹🇷",
  },
  {
    code: "uk-ua",
    label: "Ukrainian (Ukraine)",
    whisperCode: "uk",
    flag: "🇺🇦",
  },
  {
    code: "vi-vn",
    label: "Vietnamese (Vietnam)",
    whisperCode: "vi",
    flag: "🇻🇳",
  },
  {
    code: "zh-cn",
    label: "Chinese (Simplified)",
    whisperCode: "zh",
    flag: "🇨🇳",
  },
  {
    code: "zh-hk",
    label: "Chinese (Hong Kong)",
    whisperCode: "zh",
    flag: "🇭🇰",
  },
  {
    code: "zh-tw",
    label: "Chinese (Traditional)",
    whisperCode: "zh",
    flag: "🇹🇼",
  },
] as const satisfies readonly TranscriptionLanguageOption[];

export const TRANSCRIPTION_LANGUAGES = [
  AUTO_DETECT_LANGUAGE,
  ...[...RAW_TRANSCRIPTION_LANGUAGES].sort((a, b) =>
    a.label.localeCompare(b.label),
  ),
] as const satisfies readonly TranscriptionLanguageOption[];

export const VISIBLE_TRANSCRIPTION_LANGUAGES = [
  AUTO_DETECT_LANGUAGE,
  ...TRANSCRIPTION_LANGUAGES.filter((entry) => entry.code !== "auto").filter(
    (entry, index, all) =>
      all.findIndex((other) => other.whisperCode === entry.whisperCode) ===
      index,
  ),
] as const satisfies readonly TranscriptionLanguageOption[];

export type TranscriptionLanguage =
  (typeof TRANSCRIPTION_LANGUAGES)[number]["code"];
export type SelectableTranscriptionLanguage = Exclude<
  (typeof VISIBLE_TRANSCRIPTION_LANGUAGES)[number]["code"],
  "auto"
>;

export const DEFAULT_TRANSCRIPTION_LANGUAGE: TranscriptionLanguage = "en";
export const DEFAULT_TRANSCRIPTION_LANGUAGES: SelectableTranscriptionLanguage[] =
  ["en"];

const TRANSCRIPTION_LANGUAGE_BY_CODE = new Map<
  string,
  (typeof TRANSCRIPTION_LANGUAGES)[number]
>(TRANSCRIPTION_LANGUAGES.map((entry) => [entry.code, entry]));
const VISIBLE_LANGUAGE_BY_WHISPER_CODE = new Map<
  string,
  (typeof VISIBLE_TRANSCRIPTION_LANGUAGES)[number]
>(
  VISIBLE_TRANSCRIPTION_LANGUAGES.filter((entry) => entry.code !== "auto").map(
    (entry) => [entry.whisperCode, entry],
  ),
);

function findTranscriptionLanguageOption(code: string) {
  return TRANSCRIPTION_LANGUAGE_BY_CODE.get(code);
}

export function getTranscriptionLanguageOption(
  code: string,
): (typeof TRANSCRIPTION_LANGUAGES)[number] {
  return (
    findTranscriptionLanguageOption(code) ??
    TRANSCRIPTION_LANGUAGE_BY_CODE.get("en")!
  );
}

export function getTranscriptionLanguageLabel(code: string) {
  return getTranscriptionLanguageOption(code).label;
}

export function getWhisperLanguageCode(
  code: string,
): string | null {
  const option = getTranscriptionLanguageOption(code);
  return option.whisperCode === "auto" ? null : option.whisperCode;
}

export function toVisibleTranscriptionLanguageCode(
  code: string,
): SelectableTranscriptionLanguage | null {
  const option = findTranscriptionLanguageOption(code);
  if (!option || option.code === "auto") return null;
  const visible = VISIBLE_LANGUAGE_BY_WHISPER_CODE.get(option.whisperCode);
  if (!visible || visible.code === "auto") return null;
  return visible.code as SelectableTranscriptionLanguage;
}

export function normalizeTranscriptionLanguageSelection(
  codes: readonly string[] | null | undefined,
): SelectableTranscriptionLanguage[] {
  if (!codes || codes.length === 0) return [];
  const deduped = new Set<SelectableTranscriptionLanguage>();
  for (const code of codes) {
    const normalizedCode = toVisibleTranscriptionLanguageCode(code);
    if (!normalizedCode) continue;
    deduped.add(normalizedCode);
  }
  return [...deduped].sort((a, b) =>
    getTranscriptionLanguageLabel(a).localeCompare(
      getTranscriptionLanguageLabel(b),
    ),
  );
}
