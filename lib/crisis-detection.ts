interface CrisisResult {
  detected: boolean
  level: "low" | "medium" | "high"
  keywords: string[]
  confidence: number
}

export function detectCrisis(message: string): CrisisResult {
  const text = message.toLowerCase()

  // High-risk keywords and phrases
  const highRiskKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "want to die",
    "better off dead",
    "no point living",
    "can't go on",
    "end my life",
    "hurt myself",
    "self harm",
  ]

  // Medium-risk keywords and phrases
  const mediumRiskKeywords = [
    "hopeless",
    "worthless",
    "can't take it",
    "give up",
    "no way out",
    "trapped",
    "burden",
    "hate myself",
    "want to disappear",
    "nothing matters",
  ]

  // Low-risk keywords (concerning but not immediate crisis)
  const lowRiskKeywords = [
    "depressed",
    "anxious",
    "overwhelmed",
    "stressed",
    "sad",
    "lonely",
    "tired",
    "exhausted",
    "struggling",
    "difficult",
    "hard time",
  ]

  const foundKeywords: string[] = []
  let maxLevel: "low" | "medium" | "high" = "low"
  let confidence = 0

  // Check for high-risk keywords
  for (const keyword of highRiskKeywords) {
    if (text.includes(keyword)) {
      foundKeywords.push(keyword)
      maxLevel = "high"
      confidence = Math.max(confidence, 0.9)
    }
  }

  // Check for medium-risk keywords
  for (const keyword of mediumRiskKeywords) {
    if (text.includes(keyword)) {
      foundKeywords.push(keyword)
      if (maxLevel !== "high") maxLevel = "medium"
      confidence = Math.max(confidence, 0.7)
    }
  }

  // Check for low-risk keywords
  for (const keyword of lowRiskKeywords) {
    if (text.includes(keyword)) {
      foundKeywords.push(keyword)
      if (maxLevel !== "high" && maxLevel !== "medium") maxLevel = "low"
      confidence = Math.max(confidence, 0.5)
    }
  }

  // Additional pattern matching for concerning phrases
  const concerningPatterns = [
    /i (want to|wanna) (die|kill myself)/i,
    /life (isn't|is not) worth/i,
    /no (one|body) (cares|would miss me)/i,
    /better off (dead|gone)/i,
    /can't (take|handle) (it|this) anymore/i,
  ]

  for (const pattern of concerningPatterns) {
    if (pattern.test(text)) {
      maxLevel = "high"
      confidence = 0.95
      foundKeywords.push("concerning phrase pattern")
      break
    }
  }

  return {
    detected: foundKeywords.length > 0,
    level: maxLevel,
    keywords: foundKeywords,
    confidence,
  }
}
