export interface CityContent {
  cityName: string
  citySlug: string
  appDownload: string
  hero: {
    title: {
      prefix: string
    }
    subtitle: string
    description: string
    ctaButton: string
  }
  features: {
    sectionTitle: string
    title: string
    subtitle: string
    beginners: {
      title: string
      description: string
      benefits: string[]
    }
    advanced: {
      title: string
      description: string
      benefits: string[]
      badges: string[]
    }
  }
  form: {
    title: string
    subtitle: string
    cardTitle: string
    successTitle: string
    errorMessage: string
    disclaimer: string
    stepIndicator: {
      step: string
      of: string
      completed: string
    }
    steps: string[]
    fields: {
      name: string
      email: string
      goal: string
      district: string
      startTime: string
      phone: string
      message: string
    }
    placeholders: {
      name: string
      email: string
      goal: string
      district: string
      startTime: string
      phone: string
      message: string
      messageHint: string
    }
    validation: {
      nameRequired: string
      emailRequired: string
      emailInvalid: string
      goalRequired: string
      districtRequired: string
      startTimeRequired: string
    }
    buttons: {
      back: string
      next: string
      submit: string
      submitting: string
    }
  }
  districts: string[]
  fitnessGoals: Array<{
    value: string
    label: string
    color: string
  }>
  startTimes: Array<{
    value: string
    label: string
  }>
}

// Munich Content (German)
export const munichContent: CityContent = {
  cityName: "München",
  citySlug: "muenchen",
  appDownload: "App downloaden",
  hero: {
    title: {
      prefix: "Personal Training in"
    },
    subtitle: "Der passende Coach für dich",
    description: "Egal ob du Anfänger bist oder im Training stagnierst – in München gibt's Trainer*innen, die dich verstehen und weiterbringen.",
    ctaButton: "Gratis Probetraining"
  },
  features: {
    sectionTitle: "MÜNCHEN TRAINING",
    title: "Zwei Wege zu deinem Ziel",
    subtitle: "Ob Einsteiger oder Fortgeschrittener – wir haben den passenden Ansatz für dich",
    beginners: {
      title: "🧍‍♂️ Keine Ahnung, wie du anfangen sollst?",
      description: "Viele Leute in München wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen halten sie ab. Unsere Coaches helfen beim Einstieg.",
      benefits: [
        "Kostenloses Probetraining",
        "Online-Beratung mit Fokus auf Gesundheit",
        "Einstieg mit Bewegungsanalyse & Haltungstraining"
      ]
    },
    advanced: {
      title: "🏋️‍♂️ Du trainierst hart, aber nichts passiert?",
      description: "Wenn du in München ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.",
      benefits: [
        "Maßgeschneiderte Programme",
        "Fokus auf progressive Overload",
        "App-Tracking und Analyse",
        "Wissen zu Hypertrophie, Regeneration & Ernährung"
      ],
      badges: ["Muskelaufbau", "Leistung", "Technikanalyse"]
    }
  },
  form: {
    title: "Finde deinen passenden Coach in München",
    subtitle: "Fülle das Formular aus und wir finden zwei Trainer*innen, die zu dir passen.",
    cardTitle: "Coach-Finder",
    successTitle: "Vielen Dank!",
    errorMessage: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    disclaimer: "Kostenlos und unverbindlich. Wir finden passende Trainer*innen für dich.",
    stepIndicator: {
      step: "Schritt",
      of: "von",
      completed: "abgeschlossen"
    },
    steps: ["Grunddaten", "Trainingsziel", "Ort & Zeit", "Kontakt & Details"],
    fields: {
      name: "Name",
      email: "E-Mail",
      goal: "Trainingsziel",
      district: "Stadtteil",
      startTime: "Startzeitpunkt",
      phone: "Telefon (optional)",
      message: "Nachricht (optional)"
    },
    placeholders: {
      name: "Dein Name",
      email: "name@beispiel.de",
      goal: "Wähle dein Hauptziel",
      district: "Wähle deinen Stadtteil",
      startTime: "Wann möchtest du starten?",
      phone: "+49 89 123456789",
      message: "Ich möchte...",
      messageHint: "Erzähl uns mehr über deine Ziele oder Wünsche..."
    },
    validation: {
      nameRequired: "Name ist erforderlich",
      emailRequired: "E-Mail ist erforderlich",
      emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de)",
      goalRequired: "Bitte wähle dein Trainingsziel",
      districtRequired: "Bitte wähle deinen Stadtteil",
      startTimeRequired: "Bitte wähle deinen Startzeitpunkt"
    },
    buttons: {
      back: "Zurück",
      next: "Weiter",
      submit: "Absenden",
      submitting: "Wird gesendet..."
    }
  },
  districts: [
    "Altstadt-Lehel",
    "Ludwigsvorstadt-Isarvorstadt",
    "Maxvorstadt",
    "Schwabing-West",
    "Au-Haidhausen",
    "Sendling",
    "Sendling-Westpark",
    "Schwanthalerhöhe",
    "Neuhausen-Nymphenburg",
    "Moosach",
    "Milbertshofen-Am Hart",
    "Schwabing-Freimann",
    "Bogenhausen",
    "Berg am Laim",
    "Trudering-Riem",
    "Ramersdorf-Perlach",
    "Obergiesing-Fasangarten",
    "Untergiesing-Harlaching",
    "Thalkirchen-Obersendling-Forstenried-Fürstenried-Solln",
    "Hadern",
    "Pasing-Obermenzing",
    "Aubing-Lochhausen-Langwied",
    "Allach-Untermenzing",
    "Feldmoching-Hasenbergl",
    "Laim"
  ],
  fitnessGoals: [
    { value: "muskelaufbau", label: "Muskelaufbau", color: "bg-blue-100 text-blue-800" },
    { value: "abnehmen", label: "Abnehmen & Körperfett reduzieren", color: "bg-green-100 text-green-800" },
    { value: "gesundheit", label: "Gesundheit & Rücken", color: "bg-purple-100 text-purple-800" },
    { value: "haltung", label: "Haltung verbessern", color: "bg-orange-100 text-orange-800" },
    { value: "kraft", label: "Kraft & Leistung steigern", color: "bg-red-100 text-red-800" },
    { value: "einstieg", label: "Einstieg ins Training", color: "bg-cyan-100 text-cyan-800" },
    { value: "beweglichkeit", label: "Beweglichkeit & Mobilität", color: "bg-pink-100 text-pink-800" }
  ],
  startTimes: [
    { value: "sofort", label: "Sofort" },
    { value: "1-2-wochen", label: "In 1-2 Wochen" },
    { value: "1-monat", label: "In einem Monat" },
    { value: "2-3-monate", label: "In 2-3 Monaten" },
    { value: "unbestimmt", label: "Noch unbestimmt" }
  ]
}

// Berlin Content (German)
export const berlinContent: CityContent = {
  cityName: "Berlin",
  citySlug: "berlin",
  appDownload: "App downloaden",
  hero: {
    title: {
      prefix: "Personal Training in"
    },
    subtitle: "Der passende Coach für dich",
    description: "Egal ob du Anfänger bist oder im Training stagnierst – in Berlin gibt's Trainer*innen, die dich verstehen und weiterbringen.",
    ctaButton: "Gratis Probetraining"
  },
  features: {
    sectionTitle: "BERLIN TRAINING",
    title: "Zwei Wege zu deinem Ziel",
    subtitle: "Ob Einsteiger oder Fortgeschrittener – wir haben den passenden Ansatz für dich",
    beginners: {
      title: "🧍‍♂️ Keine Ahnung, wie du anfangen sollst?",
      description: "Viele Leute in Berlin wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen halten sie ab. Unsere Coaches helfen beim Einstieg.",
      benefits: [
        "Kostenloses Probetraining",
        "Online-Beratung mit Fokus auf Gesundheit",
        "Einstieg mit Bewegungsanalyse & Haltungstraining"
      ]
    },
    advanced: {
      title: "🏋️‍♂️ Du trainierst hart, aber nichts passiert?",
      description: "Wenn du in Berlin ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.",
      benefits: [
        "Maßgeschneiderte Programme",
        "Fokus auf progressive Overload",
        "App-Tracking und Analyse",
        "Wissen zu Hypertrophie, Regeneration & Ernährung"
      ],
      badges: ["Muskelaufbau", "Leistung", "Technikanalyse"]
    }
  },
  form: {
    title: "Finde deinen passenden Coach in Berlin",
    subtitle: "Fülle das Formular aus und wir finden zwei Trainer*innen, die zu dir passen.",
    cardTitle: "Coach-Finder",
    successTitle: "Vielen Dank!",
    errorMessage: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    disclaimer: "Kostenlos und unverbindlich. Wir finden passende Trainer*innen für dich.",
    stepIndicator: {
      step: "Schritt",
      of: "von",
      completed: "abgeschlossen"
    },
    steps: ["Grunddaten", "Trainingsziel", "Ort & Zeit", "Kontakt & Details"],
    fields: {
      name: "Name",
      email: "E-Mail",
      goal: "Trainingsziel",
      district: "Bezirk",
      startTime: "Startzeitpunkt",
      phone: "Telefon (optional)",
      message: "Nachricht (optional)"
    },
    placeholders: {
      name: "Dein Name",
      email: "name@beispiel.de",
      goal: "Wähle dein Hauptziel",
      district: "Wähle deinen Bezirk",
      startTime: "Wann möchtest du starten?",
      phone: "+49 30 123456789",
      message: "Ich möchte...",
      messageHint: "Erzähl uns mehr über deine Ziele oder Wünsche..."
    },
    validation: {
      nameRequired: "Name ist erforderlich",
      emailRequired: "E-Mail ist erforderlich",
      emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.de)",
      goalRequired: "Bitte wähle dein Trainingsziel",
      districtRequired: "Bitte wähle deinen Bezirk",
      startTimeRequired: "Bitte wähle deinen Startzeitpunkt"
    },
    buttons: {
      back: "Zurück",
      next: "Weiter",
      submit: "Absenden",
      submitting: "Wird gesendet..."
    }
  },
  districts: [
    "Mitte",
    "Friedrichshain-Kreuzberg",
    "Pankow",
    "Charlottenburg-Wilmersdorf",
    "Spandau",
    "Steglitz-Zehlendorf",
    "Tempelhof-Schöneberg",
    "Neukölln",
    "Treptow-Köpenick",
    "Marzahn-Hellersdorf",
    "Lichtenberg",
    "Reinickendorf"
  ],
  fitnessGoals: [
    { value: "muskelaufbau", label: "Muskelaufbau", color: "bg-blue-100 text-blue-800" },
    { value: "abnehmen", label: "Abnehmen & Körperfett reduzieren", color: "bg-green-100 text-green-800" },
    { value: "gesundheit", label: "Gesundheit & Rücken", color: "bg-purple-100 text-purple-800" },
    { value: "haltung", label: "Haltung verbessern", color: "bg-orange-100 text-orange-800" },
    { value: "kraft", label: "Kraft & Leistung steigern", color: "bg-red-100 text-red-800" },
    { value: "einstieg", label: "Einstieg ins Training", color: "bg-cyan-100 text-cyan-800" },
    { value: "beweglichkeit", label: "Beweglichkeit & Mobilität", color: "bg-pink-100 text-pink-800" }
  ],
  startTimes: [
    { value: "sofort", label: "Sofort" },
    { value: "1-2-wochen", label: "In 1-2 Wochen" },
    { value: "1-monat", label: "In einem Monat" },
    { value: "2-3-monate", label: "In 2-3 Monaten" },
    { value: "unbestimmt", label: "Noch unbestimmt" }
  ]
}

// Vienna Content (German)
export const viennaContent: CityContent = {
  cityName: "Wien",
  citySlug: "wien",
  appDownload: "App downloaden",
  hero: {
    title: {
      prefix: "Personal Training in"
    },
    subtitle: "Der passende Coach für dich",
    description: "Egal ob du Anfänger bist oder im Training stagnierst – in Wien gibt's Trainer*innen, die dich verstehen und weiterbringen.",
    ctaButton: "Gratis Probetraining"
  },
  features: {
    sectionTitle: "WIEN TRAINING",
    title: "Zwei Wege zu deinem Ziel",
    subtitle: "Ob Einsteiger oder Fortgeschrittener – wir haben den passenden Ansatz für dich",
    beginners: {
      title: "🧍‍♂️ Keine Ahnung, wie du anfangen sollst?",
      description: "Viele Leute in Wien wollen fitter werden – aber Gym-Stress, Unsicherheit oder Rückenschmerzen halten sie ab. Unsere Coaches helfen beim Einstieg.",
      benefits: [
        "Kostenloses Probetraining",
        "Online-Beratung mit Fokus auf Gesundheit",
        "Einstieg mit Bewegungsanalyse & Haltungstraining"
      ]
    },
    advanced: {
      title: "🏋️‍♂️ Du trainierst hart, aber nichts passiert?",
      description: "Wenn du in Wien ernsthaft Kraft trainierst, aber stagnierst, brauchst du einen Coach mit Plan.",
      benefits: [
        "Maßgeschneiderte Programme",
        "Fokus auf progressive Overload",
        "App-Tracking und Analyse",
        "Wissen zu Hypertrophie, Regeneration & Ernährung"
      ],
      badges: ["Muskelaufbau", "Leistung", "Technikanalyse"]
    }
  },
  form: {
    title: "Finde deinen passenden Coach in Wien",
    subtitle: "Fülle das Formular aus und wir finden zwei Trainer*innen, die zu dir passen.",
    cardTitle: "Coach-Finder",
    successTitle: "Vielen Dank!",
    errorMessage: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    disclaimer: "Kostenlos und unverbindlich. Wir finden passende Trainer*innen für dich.",
    stepIndicator: {
      step: "Schritt",
      of: "von",
      completed: "abgeschlossen"
    },
    steps: ["Grunddaten", "Trainingsziel", "Ort & Zeit", "Kontakt & Details"],
    fields: {
      name: "Name",
      email: "E-Mail",
      goal: "Trainingsziel",
      district: "Bezirk",
      startTime: "Startzeitpunkt",
      phone: "Telefon (optional)",
      message: "Nachricht (optional)"
    },
    placeholders: {
      name: "Dein Name",
      email: "name@beispiel.at",
      goal: "Wähle dein Hauptziel",
      district: "Wähle deinen Bezirk",
      startTime: "Wann möchtest du starten?",
      phone: "+43 1 123456789",
      message: "Ich möchte...",
      messageHint: "Erzähl uns mehr über deine Ziele oder Wünsche..."
    },
    validation: {
      nameRequired: "Name ist erforderlich",
      emailRequired: "E-Mail ist erforderlich",
      emailInvalid: "Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.at)",
      goalRequired: "Bitte wähle dein Trainingsziel",
      districtRequired: "Bitte wähle deinen Bezirk",
      startTimeRequired: "Bitte wähle deinen Startzeitpunkt"
    },
    buttons: {
      back: "Zurück",
      next: "Weiter",
      submit: "Absenden",
      submitting: "Wird gesendet..."
    }
  },
  districts: [
    "1. Innere Stadt",
    "2. Leopoldstadt",
    "3. Landstraße",
    "4. Wieden",
    "5. Margareten",
    "6. Mariahilf",
    "7. Neubau",
    "8. Josefstadt",
    "9. Alsergrund",
    "10. Favoriten",
    "11. Simmering",
    "12. Meidling",
    "13. Hietzing",
    "14. Penzing",
    "15. Rudolfsheim-Fünfhaus",
    "16. Ottakring",
    "17. Hernals",
    "18. Währing",
    "19. Döbling",
    "20. Brigittenau",
    "21. Floridsdorf",
    "22. Donaustadt",
    "23. Liesing"
  ],
  fitnessGoals: [
    { value: "muskelaufbau", label: "Muskelaufbau", color: "bg-blue-100 text-blue-800" },
    { value: "abnehmen", label: "Abnehmen & Körperfett reduzieren", color: "bg-green-100 text-green-800" },
    { value: "gesundheit", label: "Gesundheit & Rücken", color: "bg-purple-100 text-purple-800" },
    { value: "haltung", label: "Haltung verbessern", color: "bg-orange-100 text-orange-800" },
    { value: "kraft", label: "Kraft & Leistung steigern", color: "bg-red-100 text-red-800" },
    { value: "einstieg", label: "Einstieg ins Training", color: "bg-cyan-100 text-cyan-800" },
    { value: "beweglichkeit", label: "Beweglichkeit & Mobilität", color: "bg-pink-100 text-pink-800" }
  ],
  startTimes: [
    { value: "sofort", label: "Sofort" },
    { value: "1-2-wochen", label: "In 1-2 Wochen" },
    { value: "1-monat", label: "In einem Monat" },
    { value: "2-3-monate", label: "In 2-3 Monaten" },
    { value: "unbestimmt", label: "Noch unbestimmt" }
  ]
}

// Amsterdam Content (Dutch)
export const amsterdamContent: CityContent = {
  cityName: "Amsterdam",
  citySlug: "amsterdam",
  appDownload: "App downloaden",
  hero: {
    title: {
      prefix: "Personal Training in"
    },
    subtitle: "De juiste coach voor jou",
    description: "Of je nu beginner bent of vastloopt in je training – in Amsterdam zijn er trainers die je begrijpen en verder helpen.",
    ctaButton: "Gratis proefles"
  },
  features: {
    sectionTitle: "AMSTERDAM TRAINING",
    title: "Twee wegen naar jouw doel",
    subtitle: "Of je nu beginner of gevorderd bent – wij hebben de juiste aanpak voor jou",
    beginners: {
      title: "🧍‍♂️ Geen idee hoe je moet beginnen?",
      description: "Veel mensen in Amsterdam willen fitter worden – maar gym-stress, onzekerheid of rugpijn houden ze tegen. Onze coaches helpen bij de start.",
      benefits: [
        "Gratis proeftraining",
        "Online begeleiding met focus op gezondheid",
        "Start met bewegingsanalyse & houdingstraining"
      ]
    },
    advanced: {
      title: "🏋️‍♂️ Train je hard, maar gebeurt er niets?",
      description: "Als je in Amsterdam serieus krachttraining doet maar stagneert, heb je een coach met een plan nodig.",
      benefits: [
        "Programma's op maat",
        "Focus op progressieve overbelasting",
        "App-tracking en analyse",
        "Kennis over hypertrofie, herstel & voeding"
      ],
      badges: ["Spieropbouw", "Prestatie", "Techniekanalyse"]
    }
  },
  form: {
    title: "Vind jouw passende coach in Amsterdam",
    subtitle: "Vul het formulier in en wij vinden twee trainers die bij je passen.",
    cardTitle: "Coach-Finder",
    successTitle: "Dank je wel!",
    errorMessage: "Er is een fout opgetreden. Probeer het opnieuw.",
    disclaimer: "Gratis en vrijblijvend. Wij vinden passende trainers voor je.",
    stepIndicator: {
      step: "Stap",
      of: "van",
      completed: "voltooid"
    },
    steps: ["Basisgegevens", "Trainingsdoel", "Locatie & Tijd", "Contact & Details"],
    fields: {
      name: "Naam",
      email: "E-mail",
      goal: "Trainingsdoel",
      district: "Stadsdeel",
      startTime: "Starttijd",
      phone: "Telefoon (optioneel)",
      message: "Bericht (optioneel)"
    },
    placeholders: {
      name: "Jouw naam",
      email: "naam@voorbeeld.nl",
      goal: "Kies je hoofddoel",
      district: "Kies je stadsdeel",
      startTime: "Wanneer wil je starten?",
      phone: "+31 20 1234567",
      message: "Ik wil...",
      messageHint: "Vertel ons meer over je doelen of wensen..."
    },
    validation: {
      nameRequired: "Naam is verplicht",
      emailRequired: "E-mail is verplicht",
      emailInvalid: "Voer een geldig e-mailadres in (bijv. naam@voorbeeld.nl)",
      goalRequired: "Kies je trainingsdoel",
      districtRequired: "Kies je stadsdeel",
      startTimeRequired: "Kies je starttijd"
    },
    buttons: {
      back: "Terug",
      next: "Verder",
      submit: "Versturen",
      submitting: "Wordt verstuurd..."
    }
  },
  districts: [
    "Centrum",
    "Noord",
    "Oost",
    "West",
    "Zuid",
    "Zuidoost",
    "Nieuw-West"
  ],
  fitnessGoals: [
    { value: "spieropbouw", label: "Spieropbouw", color: "bg-blue-100 text-blue-800" },
    { value: "afvallen", label: "Afvallen & vetpercentage verlagen", color: "bg-green-100 text-green-800" },
    { value: "gezondheid", label: "Gezondheid & rug", color: "bg-purple-100 text-purple-800" },
    { value: "houding", label: "Houding verbeteren", color: "bg-orange-100 text-orange-800" },
    { value: "kracht", label: "Kracht & prestatie verhogen", color: "bg-red-100 text-red-800" },
    { value: "beginnen", label: "Beginnen met trainen", color: "bg-cyan-100 text-cyan-800" },
    { value: "mobiliteit", label: "Beweeglijkheid & mobiliteit", color: "bg-pink-100 text-pink-800" }
  ],
  startTimes: [
    { value: "direct", label: "Direct" },
    { value: "1-2-weken", label: "Over 1-2 weken" },
    { value: "1-maand", label: "Over een maand" },
    { value: "2-3-maanden", label: "Over 2-3 maanden" },
    { value: "onbepaald", label: "Nog onbepaald" }
  ]
}

// Copenhagen Content (Danish)
export const copenhagenContent: CityContent = {
  cityName: "København",
  citySlug: "koebenhavn",
  appDownload: "Download app",
  hero: {
    title: {
      prefix: "Personlig træning i"
    },
    subtitle: "Den rigtige coach til dig",
    description: "Uanset om du er begynder eller kører fast i din træning – i København er der trænere, der forstår dig og kan hjælpe dig videre.",
    ctaButton: "Gratis prøvetræning"
  },
  features: {
    sectionTitle: "KØBENHAVN TRÆNING",
    title: "To veje til dit mål",
    subtitle: "Om du er begynder eller øvet – vi har den rigtige tilgang til dig",
    beginners: {
      title: "🧍‍♂️ Ingen anelse om, hvordan du skal starte?",
      description: "Mange mennesker i København vil blive mere fit – men gym-stress, usikkerhed eller rygsmerter holder dem tilbage. Vores coaches hjælper med at komme i gang.",
      benefits: [
        "Gratis prøvetræning",
        "Online vejledning med fokus på sundhed",
        "Start med bevægelsesanalyse & holdningstræning"
      ]
    },
    advanced: {
      title: "🏋️‍♂️ Træner du hårdt, men der sker intet?",
      description: "Hvis du i København træner seriøst styrketræning, men stagnerer, har du brug for en coach med en plan.",
      benefits: [
        "Skræddersyede programmer",
        "Fokus på progressiv overbelastning",
        "App-tracking og analyse",
        "Viden om hypertrofi, restitution & ernæring"
      ],
      badges: ["Muskelopbygning", "Præstation", "Teknikanalyse"]
    }
  },
  form: {
    title: "Find din passende coach i København",
    subtitle: "Udfyld formularen, og vi finder to trænere, der passer til dig.",
    cardTitle: "Coach-Finder",
    successTitle: "Tak!",
    errorMessage: "Der opstod en fejl. Prøv igen.",
    disclaimer: "Gratis og uforpligtende. Vi finder passende trænere til dig.",
    stepIndicator: {
      step: "Trin",
      of: "af",
      completed: "fuldført"
    },
    steps: ["Grunddata", "Træningsmål", "Sted & Tid", "Kontakt & Detaljer"],
    fields: {
      name: "Navn",
      email: "E-mail",
      goal: "Træningsmål",
      district: "Bydel",
      startTime: "Starttidspunkt",
      phone: "Telefon (valgfrit)",
      message: "Besked (valgfrit)"
    },
    placeholders: {
      name: "Dit navn",
      email: "navn@eksempel.dk",
      goal: "Vælg dit hovedmål",
      district: "Vælg din bydel",
      startTime: "Hvornår vil du starte?",
      phone: "+45 12 34 56 78",
      message: "Jeg vil gerne...",
      messageHint: "Fortæl os mere om dine mål eller ønsker..."
    },
    validation: {
      nameRequired: "Navn er påkrævet",
      emailRequired: "E-mail er påkrævet",
      emailInvalid: "Indtast en gyldig e-mailadresse (f.eks. navn@eksempel.dk)",
      goalRequired: "Vælg dit træningsmål",
      districtRequired: "Vælg din bydel",
      startTimeRequired: "Vælg dit starttidspunkt"
    },
    buttons: {
      back: "Tilbage",
      next: "Næste",
      submit: "Send",
      submitting: "Sender..."
    }
  },
  districts: [
    "Indre By",
    "Østerbro",
    "Nørrebro",
    "Vesterbro/Kongens Enghave",
    "Valby",
    "Vanløse",
    "Brønshøj-Husum",
    "Bispebjerg",
    "Amager Øst",
    "Amager Vest"
  ],
  fitnessGoals: [
    { value: "muskelopbygning", label: "Muskelopbygning", color: "bg-blue-100 text-blue-800" },
    { value: "vægttab", label: "Vægttab & fedtprocent reduktion", color: "bg-green-100 text-green-800" },
    { value: "sundhed", label: "Sundhed & ryg", color: "bg-purple-100 text-purple-800" },
    { value: "holdning", label: "Forbedre holdning", color: "bg-orange-100 text-orange-800" },
    { value: "styrke", label: "Øge styrke & præstation", color: "bg-red-100 text-red-800" },
    { value: "begynde", label: "Begynde at træne", color: "bg-cyan-100 text-cyan-800" },
    { value: "mobilitet", label: "Bevægelighed & mobilitet", color: "bg-pink-100 text-pink-800" }
  ],
  startTimes: [
    { value: "straks", label: "Straks" },
    { value: "1-2-uger", label: "Om 1-2 uger" },
    { value: "1-måned", label: "Om en måned" },
    { value: "2-3-måneder", label: "Om 2-3 måneder" },
    { value: "ubestemt", label: "Endnu ubestemt" }
  ]
}
