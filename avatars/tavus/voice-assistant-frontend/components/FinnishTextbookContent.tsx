"use client";

import { useState } from "react";

interface FillInTheBlank {
  id: string;
  question: string;
  blanks: Array<{ position: number; answer: string; hint?: string }>;
  userAnswers: string[];
}

export default function FinnishTextbookContent() {
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A2" | "B1" | "B2" | "C1">("A1");
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);
  const [fillInBlanks, setFillInBlanks] = useState<Record<string, FillInTheBlank>>({});

  const chapters = {
    A1: [
      {
        number: 1,
        title: "Hei ja tervetuloa!",
        subtitle: "Tutustuminen, tervehdykset, viikonpäivät, aakkoset, numerot",
        vocabulary: {
          title: "Sanasto",
          items: [
            {
              category: "Tervehdykset (Greetings)",
              words: [
                { finnish: "Hei", english: "Hello/Hi" },
                { finnish: "Moi", english: "Hi (informal)" },
                { finnish: "Tervetuloa", english: "Welcome" },
                { finnish: "Hyvää huomenta", english: "Good morning" },
                { finnish: "Hyvää päivää", english: "Good day" },
                { finnish: "Hyvää iltaa", english: "Good evening" },
                { finnish: "Hyvää yötä", english: "Good night" },
                { finnish: "Näkemiin", english: "Goodbye" },
                { finnish: "Hei hei", english: "Bye" },
                { finnish: "Moi moi", english: "Bye (informal)" },
              ],
            },
            {
              category: "Viikonpäivät (Days of the week)",
              words: [
                { finnish: "Mikä päivä tänään on?", english: "What day is it today?" },
                { finnish: "maanantai (ma)", english: "Monday (abbrev: ma)" },
                { finnish: "tiistai (ti)", english: "Tuesday (abbrev: ti)" },
                { finnish: "tiistaina", english: "on Tuesday" },
                { finnish: "keskiviikko (ke)", english: "Wednesday (abbrev: ke)" },
                { finnish: "torstai (to)", english: "Thursday (abbrev: to)" },
                { finnish: "torstaina", english: "on Thursday" },
                { finnish: "perjantai (pe)", english: "Friday (abbrev: pe)" },
                { finnish: "lauantai (la)", english: "Saturday (abbrev: la)" },
                { finnish: "lauantaina", english: "on Saturday" },
                { finnish: "sunnuntai (su)", english: "Sunday (abbrev: su)" },
                { finnish: "sunnuntaina", english: "on Sunday" },
                { finnish: "viikonloppu", english: "weekend (Saturday and Sunday)" },
                { finnish: "viikonloppuna", english: "on the weekend" },
                { finnish: "Hauskaa viikonloppua!", english: "Have a nice weekend!" },
                { finnish: "Milloin?", english: "When?" },
                { finnish: "maanantaina", english: "on Monday" },
                { finnish: "keskiviikkona", english: "on Wednesday" },
                { finnish: "perjantaina", english: "on Friday" },
                { finnish: "toissapäivänä", english: "the day before yesterday" },
                { finnish: "eilen", english: "yesterday" },
                { finnish: "tänään", english: "today" },
                { finnish: "huomenna", english: "tomorrow" },
                { finnish: "ylihuomenna", english: "the day after tomorrow" },
              ],
            },
            {
              category: "Aakkoset (Alphabet)",
              words: [
                { finnish: "A [aa]", english: "A [pronounced: aa]" },
                { finnish: "B [bee]", english: "B [pronounced: bee]" },
                { finnish: "C [see]", english: "C [pronounced: see]" },
                { finnish: "D [dee]", english: "D [pronounced: dee]" },
                { finnish: "E [ee]", english: "E [pronounced: ee]" },
                { finnish: "F [äf]", english: "F [pronounced: äf]" },
                { finnish: "G [gee]", english: "G [pronounced: gee]" },
                { finnish: "H [hoo]", english: "H [pronounced: hoo]" },
                { finnish: "I [ii]", english: "I [pronounced: ii]" },
                { finnish: "J [jii]", english: "J [pronounced: jii]" },
                { finnish: "K [koo]", english: "K [pronounced: koo]" },
                { finnish: "L [äl]", english: "L [pronounced: äl]" },
                { finnish: "M [äm]", english: "M [pronounced: äm]" },
                { finnish: "N [än]", english: "N [pronounced: än]" },
                { finnish: "O [oo]", english: "O [pronounced: oo]" },
                { finnish: "P [pee]", english: "P [pronounced: pee]" },
                { finnish: "Q [kuu]", english: "Q [pronounced: kuu]" },
                { finnish: "R [är]", english: "R [pronounced: är]" },
                { finnish: "S [äs]", english: "S [pronounced: äs]" },
                { finnish: "T [tee]", english: "T [pronounced: tee]" },
                { finnish: "U [uu]", english: "U [pronounced: uu]" },
                { finnish: "V [vee]", english: "V [pronounced: vee]" },
                { finnish: "W [kaksois-vee]", english: "W [pronounced: kaksois-vee]" },
                { finnish: "X [äks]", english: "X [pronounced: äks]" },
                { finnish: "Y [yy]", english: "Y [pronounced: yy]" },
                { finnish: "Z [tseta]", english: "Z [pronounced: tseta]" },
                { finnish: "Ä [ää]", english: "Ä [pronounced: ää]" },
                { finnish: "Ö [öö]", english: "Ö [pronounced: öö]" },
              ],
            },
            {
              category: "Numerot (Numbers)",
              words: [
                { finnish: "nolla", english: "zero" },
                { finnish: "yksi", english: "one" },
                { finnish: "kaksi", english: "two" },
                { finnish: "kolme", english: "three" },
                { finnish: "neljä", english: "four" },
                { finnish: "viisi", english: "five" },
                { finnish: "kuusi", english: "six" },
                { finnish: "seitsemän", english: "seven" },
                { finnish: "kahdeksan", english: "eight" },
                { finnish: "yhdeksän", english: "nine" },
                { finnish: "kymmenen", english: "ten" },
                { finnish: "yksitoista", english: "eleven" },
                { finnish: "kaksitoista", english: "twelve" },
                { finnish: "kolmetoista", english: "thirteen" },
                { finnish: "neljätoista", english: "fourteen" },
                { finnish: "viisitoista", english: "fifteen" },
                { finnish: "kuusitoista", english: "sixteen" },
                { finnish: "seitsemäntoista", english: "seventeen" },
                { finnish: "kahdeksantoista", english: "eighteen" },
                { finnish: "yhdeksäntoista", english: "nineteen" },
                { finnish: "kaksikymmentä", english: "twenty" },
                { finnish: "kaksikymmentäyksi", english: "twenty-one" },
                { finnish: "kaksikymmentäkaksi", english: "twenty-two" },
                { finnish: "kolmekymmentä", english: "thirty" },
                { finnish: "neljäkymmentä", english: "forty" },
                { finnish: "viisikymmentä", english: "fifty" },
                { finnish: "kuusikymmentä", english: "sixty" },
                { finnish: "seitsemänkymmentä", english: "seventy" },
                { finnish: "kahdeksankymmentä", english: "eighty" },
                { finnish: "yhdeksänkymmentä", english: "ninety" },
                { finnish: "sata", english: "one hundred" },
                { finnish: "satayksi", english: "one hundred one" },
                { finnish: "kaksisataa", english: "two hundred" },
                { finnish: "kolmesataa", english: "three hundred" },
                { finnish: "tuhat", english: "one thousand" },
                { finnish: "kaksituhatta", english: "two thousand" },
                { finnish: "viisisataatuhatta", english: "five hundred thousand" },
                { finnish: "miljoona", english: "one million" },
                { finnish: "kaksi miljoonaa", english: "two million" },
              ],
            },
            {
              category: "Peruslauseet ja kysymykset (Basic sentences and questions)",
              words: [
                { finnish: "Hei!", english: "Hello!" },
                { finnish: "ja", english: "and" },
                { finnish: "Tervetuloa!", english: "Welcome!" },
                { finnish: "Moi!", english: "Hi!" },
                { finnish: "Anteeksi!", english: "Excuse me! / Sorry!" },
                { finnish: "onko", english: "is there / are there" },
                { finnish: "täällä", english: "here" },
                { finnish: "suomen kurssi", english: "Finnish course" },
                { finnish: "Minulle kuuluu hyvää.", english: "I'm doing well." },
                { finnish: "Entä sinulle?", english: "And you?" },
                { finnish: "Ihan hyvää, kiitos.", english: "Pretty good, thanks." },
                { finnish: "hän", english: "he / she" },
                { finnish: "Kuinka vanha sinä olet?", english: "How old are you?" },
                { finnish: "joo", english: "yes" },
                { finnish: "opettaja", english: "teacher" },
                { finnish: "Kuka sinä olet?", english: "Who are you?" },
                { finnish: "tulla", english: "to come" },
                { finnish: "Huomenta!", english: "Good morning!" },
                { finnish: "minä", english: "I" },
                { finnish: "olla", english: "to be" },
                { finnish: "entä", english: "and / what about" },
                { finnish: "sinä", english: "you" },
                { finnish: "Hauska tutustua!", english: "Nice to meet you!" },
                { finnish: "Kiitos samoin!", english: "Thanks, same to you!" },
                { finnish: "Mitä sinulle kuuluu?", english: "How are you?" },
                { finnish: "Mikä sinun nimi on?", english: "What is your name?" },
                { finnish: "Minun nimi on...", english: "My name is..." },
                { finnish: "Miten se kirjoitetaan?", english: "How is it spelled?" },
                { finnish: "etunimi", english: "first name" },
                { finnish: "sukunimi", english: "last name / surname" },
              ],
            },
          ],
        },
        pronunciation: {
          title: "Ääntäminen (Pronunciation)",
          sections: [
            {
              title: "Vokaalit (Vowels)",
              subtitle: "lyhyt (short) / pitkä (long)",
              content: [
                { short: "a", long: "aa", example: "kala (fish) / kaala (cape)" },
                { short: "e", long: "ee", example: "tule (come) / tulee (comes)" },
                { short: "i", long: "ii", example: "kivi (stone) / kiivi (kiwi)" },
                { short: "o", long: "oo", example: "kota (tent) / koota (to collect)" },
                { short: "u", long: "uu", example: "puro (stream) / puuro (porridge)" },
                { short: "ä", long: "ää", example: "täällä (here) / täältä (from here)" },
                { short: "ö", long: "öö", example: "tölli (cottage) / Töölö (neighborhood)" },
                { short: "y", long: "yy", example: "tylli (dummy) / tyyli (style)" },
              ],
            },
            {
              title: "Konsonantit (Consonants)",
              subtitle: "lyhyt (short) / pitkä (long) / vain lyhyt (only short)",
              content: [
                { short: "k", long: "kk", example: "kuka (who) / kukka (flower)" },
                { short: "p", long: "pp", example: "rapu (crab) / rappu (stairs)" },
                { short: "t", long: "tt", example: "mato (worm) / matto (rug)" },
                { short: "h", long: "", example: "hullu (crazy) / tyhmä (stupid)" },
                { short: "d", long: "", example: "jatko (continuation) / myyjä (seller)" },
                { short: "m", long: "mm", example: "lama (depression) / lammas (sheep)" },
                { short: "n", long: "nn", example: "moni (many) / monni (catfish)" },
                { short: "nk", long: "ng", example: "kenkä (shoe) / kengät (shoes)" },
                { short: "b", long: "", example: "banaani (banana)" },
                { short: "c", long: "", example: "CD (CD)" },
                { short: "f", long: "", example: "fakta (fact) / pizza (pizza)" },
                { short: "g", long: "", example: "gorilla (gorilla)" },
                { short: "q", long: "", example: "aqua (aqua)" },
                { short: "s", long: "ss", example: "kisa (contest) / kissa (cat)" },
                { short: "x", long: "", example: "xylitol (xylitol)" },
                { short: "z", long: "", example: "zen (zen)" },
              ],
            },
            {
              title: "Diftongit (Diphthongs)",
              content: [
                { diphthong: "ai", example: "kaino (shy)" },
                { diphthong: "au", example: "kaula (neck)" },
                { diphthong: "äy", example: "käydä (to visit)" },
                { diphthong: "ie", example: "kieli (tongue)" },
                { diphthong: "ei", example: "eilen (yesterday)" },
                { diphthong: "eu", example: "keula (bow)" },
                { diphthong: "öy", example: "köyhä (poor)" },
                { diphthong: "oi", example: "toivo (hope)" },
                { diphthong: "ou", example: "koulu (school)" },
                { diphthong: "ui", example: "uida (to swim)" },
                { diphthong: "yö", example: "työ (work)" },
                { diphthong: "äi", example: "äiti (mother)" },
                { diphthong: "öi", example: "öitä (night)" },
              ],
            },
            {
              title: "Intonaatio (Intonation)",
              content: [
                "Olen suomalainen. (I am Finnish.)",
                "Oletko sinä suomalainen? (Are you Finnish?)",
                "Missä asut? (Where do you live?)",
              ],
            },
            {
              title: "Sanapaino (Word Stress)",
              content: [
                "Helsinki",
                "hotelli (hotel)",
                "kamera (camera)",
                "museo (museum)",
                "paperi (paper)",
                "spagetti (spaghetti)",
              ],
            },
          ],
        },
        grammar: {
          title: "Kielioppi",
          topics: [
            {
              title: "Persoonapronominit (Personal pronouns)",
              content: "minä (I), sinä (you), hän (he/she), me (we), te (you plural), he (they)",
              examples: [
                "Minä olen opiskelija. (I am a student.)",
                "Sinä olet kotoisin Suomesta. (You are from Finland.)",
                "Hän on opettaja. (He/She is a teacher.)",
              ],
            },
            {
              title: "Olla-verbi (Verb 'to be')",
              content: "Olla means 'to be'. Here are all the forms:",
              examples: [
                "minä olen (I am)",
                "sinä olet (you are)",
                "hän on (he/she is)",
                "me olemme (we are)",
                "te olette (you are, plural)",
                "he ovat (they are)",
              ],
            },
            {
              title: "Persoonapronominit ja olla-verbi (Personal pronouns and verb 'to be')",
              content: "Personal pronouns and the verb 'olla' (to be):",
              examples: [
                "minä olen (I am)",
                "sinä olet (you are)",
                "hän / se on (he/she/it is)",
                "me olemme (we are)",
                "te olette (you are, plural)",
                "he/ne ovat (they are)",
              ],
            },
            {
              title: "Vokaaliharmonia (Vowel harmony)",
              content: "Finnish has vowel harmony. Words with front vowels (ä, ö, y) take front-vowel endings (-ssä, -llä, -vät). Words with back vowels (a, o, u) take back-vowel endings (-ssa, -lla, -vat).",
              examples: [
                "auto-ssa (car → in the car)",
                "laiva-lla (ship → on the ship)",
                "koulu-ssa (school → in the school)",
                "puhu-vat (speak → they speak)",
                "tee-ssä (tea → in the tea)",
                "siili-llä (hedgehog → on the hedgehog)",
                "itke-vät (cry → they cry)",
                "köyhä-ssä (poor → in the poor)",
                "kesä-llä (summer → in the summer)",
                "sää-ssä (weather → in the weather)",
                "kysy-vät (ask → they ask)",
                "",
                "HUOM! Yhdyssanat (Note! Compound words):",
                "yövuoro-ssa (night shift → in the night shift)",
                "yövuoro-ssä (night shift → in the night shift, with front vowel)",
                "suklaajäätelö-ssä (chocolate ice cream → in the chocolate ice cream)",
              ],
            },
          ],
        },
        conversation: {
          title: "Puhutaan (Let's speak)",
          dialogues: [
            {
              speaker: "Alex",
              text: "Hei!",
            },
            {
              speaker: "Olga",
              text: "Moi!",
            },
            {
              speaker: "Alex",
              text: "Anteeksi, onko täällä suomen kurssi?",
              translation: "Excuse me, is there a Finnish course here?",
            },
            {
              speaker: "Olga",
              text: "Joo, on. Kuka sinä olet?",
              translation: "Yes, there is. Who are you?",
            },
            {
              speaker: "Alex",
              text: "Minä olen Alex. Entä sinä?",
              translation: "I am Alex. And you?",
            },
            {
              speaker: "Olga",
              text: "Olen Olga. Hauska tutustua!",
              translation: "I am Olga. Nice to meet you!",
            },
          ],
        },
        exercises: [
          {
            id: "ex1-1",
            type: "pronunciation",
            question: "Harjoitus 1: Ääntäminen - Vokaalit (Pronunciation - Vowels)",
            description: "Practice distinguishing short and long vowels. Read the pairs aloud.",
            examples: [
              "a / aa: kala (fish) / kalaa (of fish)",
              "a / aa: taka (back) / takaa (from behind)",
              "a / aa: avaa (open!) / aava (open sea)",
              "e / ee: te (you) / tee (tea)",
              "e / ee: etu (advantage) / Eetu (name)",
              "e / ee: virhe (error) / virheen (of error)",
              "ä / ää: tältä (from this) / täältä (from here)",
              "ä / ää: älli (intelligence) / ääliö (idiot)",
              "ä / ää: kesä (summer) / kesää (of summer)",
              "o / oo: kota (tent) / koota (to collect)",
              "o / oo: rokko (rash) / rokkoon (to rash)",
              "o / oo: koulu (school) / kouluun (to school)",
              "i / ii: tili (account) / tiili (brick)",
              "i / ii: suksi (ski) / suksii (skis)",
              "i / ii: tyttö (girl) / tyttöön (to girl)",
              "ö / öö: tölli (cottage) / Töölö (neighborhood)",
              "ö / öö: örinä (snarl) / insinöörinä (as engineer)",
              "u / uu: tuli (fire) / tuuli (wind)",
              "u / uu: kaiku (echo) / kaikuu (echoes)",
              "y / yy: kylä (village) / kyylä (nosy person)",
              "y / yy: kynä (pen) / kyynel (tear)",
              "y / yy: täky (hay) / täkyyn (to hay)",
            ],
          },
          {
            id: "ex1-2",
            type: "fill-blank",
            question: "Harjoitus 2: Vokaaliharmonia - Tuleeko -vat vai -vät? (Vowel harmony - Does it use -vat or -vät?)",
            sentences: [
              {
                text: "ostavat (they buy) - uses: _____",
                answer: "-vat",
                hint: "Back vowel word, so use -vat",
              },
              {
                text: "kysy- (ask) - they ask: kysy_____",
                answer: "vät",
                hint: "Front vowel word, so use -vät",
              },
              {
                text: "puhu- (speak) - they speak: puhu_____",
                answer: "vat",
                hint: "Back vowel word, so use -vat",
              },
              {
                text: "itke- (cry) - they cry: itke_____",
                answer: "vät",
                hint: "Front vowel word, so use -vät",
              },
              {
                text: "sano- (say) - they say: sano_____",
                answer: "vat",
                hint: "Back vowel word, so use -vat",
              },
              {
                text: "etsi- (search) - they search: etsi_____",
                answer: "vät",
                hint: "Front vowel word, so use -vät",
              },
              {
                text: "muutta- (move) - they move: muutta_____",
                answer: "vat",
                hint: "Back vowel word, so use -vat",
              },
              {
                text: "lentä- (fly) - they fly: lentä_____",
                answer: "vät",
                hint: "Front vowel word, so use -vät",
              },
            ],
          },
          {
            id: "ex1-3",
            type: "fill-blank",
            question: "Harjoitus 3: Vokaaliharmonia - Tuleeko -ssa vai -ssä? (Vowel harmony - Does it use -ssa or -ssä?)",
            sentences: [
              {
                text: "kuoro (choir) - in the choir: kuoro_____",
                answer: "ssa",
                hint: "Back vowel word, so use -ssa",
              },
              {
                text: "vyö (belt) - in the belt: vyö_____",
                answer: "ssä",
                hint: "Front vowel word, so use -ssä",
              },
              {
                text: "viili (cultured milk) - in the viili: viili_____",
                answer: "ssä",
                hint: "Front vowel word, so use -ssä",
              },
              {
                text: "muki (mug) - in the mug: muki_____",
                answer: "ssa",
                hint: "Back vowel word, so use -ssa",
              },
            ],
          },
          {
            id: "ex1-4",
            type: "fill-blank",
            question: "Harjoitus 4: Yhdyssanat (Compound words) - Choose the correct ending",
            sentences: [
              {
                text: "sähkö sauna (electric sauna) - in the electric sauna: sähkösauna_____",
                answer: "ssa",
                hint: "Back vowel in the compound, so use -ssa",
              },
              {
                text: "loskasää (slushy weather) - in slushy weather: loskasää_____",
                answer: "ssä",
                hint: "Front vowel in the compound, so use -ssä",
              },
              {
                text: "löylykauha (sauna ladle) - in the sauna ladle: löylykauha_____",
                answer: "ssa",
                hint: "Back vowel in the compound, so use -ssa",
              },
              {
                text: "kirjahylly (bookshelf) - in the bookshelf: kirjahylly_____",
                answer: "ssä",
                hint: "Front vowel in the compound, so use -ssä",
              },
              {
                text: "seinäkello (wall clock) - in the wall clock: seinäkello_____",
                answer: "ssa",
                hint: "Back vowel in the compound, so use -ssa",
              },
              {
                text: "yliopisto (university) - in the university: yliopisto_____",
                answer: "ssa",
                hint: "Back vowel in the compound, so use -ssa",
              },
              {
                text: "punaviini (red wine) - in the red wine: punaviini_____",
                answer: "ssä",
                hint: "Front vowel in the compound, so use -ssä",
              },
              {
                text: "kissa (cat) - in the cat: kissa_____",
                answer: "ssa",
                hint: "Back vowel word, so use -ssa",
              },
              {
                text: "äidinkieli (mother tongue) - in the mother tongue: äidinkieli_____",
                answer: "ssä",
                hint: "Front vowel in the compound, so use -ssä",
              },
            ],
          },
          {
            id: "ex1-5",
            type: "fill-blank",
            question: "Complete the sentences with the correct form of 'olla':",
            sentences: [
              {
                text: "Minä _____ opiskelija.",
                answer: "olen",
                hint: "Use 'olen' for 'I am'",
              },
              {
                text: "Sinä _____ kotoisin Suomesta.",
                answer: "olet",
                hint: "Use 'olet' for 'you are'",
              },
              {
                text: "Hän _____ opettaja.",
                answer: "on",
                hint: "Use 'on' for 'he/she is'",
              },
              {
                text: "Me _____ kurssilla.",
                answer: "olemme",
                hint: "Use 'olemme' for 'we are'",
              },
            ],
          },
          {
            id: "ex1-6",
            type: "fill-blank",
            question: "Fill in the days of the week:",
            sentences: [
              {
                text: "Tänään on _____. (Monday)",
                answer: "maanantai",
              },
              {
                text: "Huomenna on _____. (Tuesday)",
                answer: "tiistai",
              },
              {
                text: "Keskiviikkona on _____. (Wednesday)",
                answer: "keskiviikko",
              },
            ],
          },
          {
            id: "ex1-7",
            type: "matching",
            question: "Harjoitus 3: Yhdistä kysymys ja vastaus (Match the question and answer)",
            description: "Match each question (1-7) with the correct answer (a-g).",
            pairs: [
              {
                question: "1. Kuka sinä olet?",
                answer: "Olen Saija.",
                correctMatch: "c"
              },
              {
                question: "2. Hauska tutustua!",
                answer: "Samoin!",
                correctMatch: "g"
              },
              {
                question: "3. Onko täällä suomen kurssi?",
                answer: "Joo, on.",
                correctMatch: "e"
              },
              {
                question: "4. Mitä sinulle kuuluu?",
                answer: "Hyvää kiitos!",
                correctMatch: "f"
              },
              {
                question: "5. Mikä päivä tänään on?",
                answer: "Tänään on tiistai.",
                correctMatch: "d"
              },
              {
                question: "6. Kuka hän on?",
                answer: "Hän on opettaja.",
                correctMatch: "a"
              },
              {
                question: "7. Miten se kirjoitetaan?",
                answer: "S-A-A-R-A R-E-H-U-L-A.",
                correctMatch: "b"
              },
            ],
            options: [
              { id: "a", text: "Hän on opettaja." },
              { id: "b", text: "S-A-A-R-A R-E-H-U-L-A." },
              { id: "c", text: "Olen Saija." },
              { id: "d", text: "Tänään on tiistai." },
              { id: "e", text: "Joo, on." },
              { id: "f", text: "Hyvää kiitos!" },
              { id: "g", text: "Samoin!" },
            ],
          },
          {
            id: "ex1-8",
            type: "fill-blank",
            question: "Harjoitus 4: Kirjoita kysymys (Write the question)",
            description: "Based on the answer, write the correct question in Finnish.",
            sentences: [
              {
                text: "_____? Minä olen Jaakko.",
                answer: "Kuka sinä olet",
                hint: "Who are you? - The answer gives a name",
              },
              {
                text: "_____? Kiitos hyvää.",
                answer: "Mitä sinulle kuuluu",
                hint: "How are you? - The answer says 'good, thanks'",
              },
              {
                text: "_____? P-A-A-V-O S-U-U-R-O-N-E-N",
                answer: "Miten se kirjoitetaan",
                hint: "How is it spelled? - The answer shows spelling",
              },
              {
                text: "_____? Olen 43.",
                answer: "Kuinka vanha sinä olet",
                hint: "How old are you? - The answer gives an age",
              },
            ],
          },
          {
            id: "ex1-9",
            type: "math",
            question: "Harjoitus 5: Mitä on...? (What is...?) - Math operations in Finnish",
            description: "Practice Finnish numbers by solving math problems. Learn: plus (+) = plus, miinus (-) = minus, kertaa (×) = times, on (=) = equals",
            problems: [
              {
                text: "Mitä on 15 + 4? (What is 15 + 4?)",
                answer: "19",
                finnishAnswer: "yhdeksäntoista",
                hint: "15 + 4 = 19 (yhdeksäntoista)",
              },
              {
                text: "Mitä on 2 × 10? (What is 2 × 10?)",
                answer: "20",
                finnishAnswer: "kaksikymmentä",
                hint: "2 × 10 = 20 (kaksikymmentä)",
              },
              {
                text: "Mitä on 22 - 8? (What is 22 - 8?)",
                answer: "14",
                finnishAnswer: "neljätoista",
                hint: "22 - 8 = 14 (neljätoista)",
              },
              {
                text: "Mitä on 3 + 7? (What is 3 + 7?)",
                answer: "10",
                finnishAnswer: "kymmenen",
                hint: "3 + 7 = 10 (kymmenen)",
              },
              {
                text: "Mitä on 68 - 35? (What is 68 - 35?)",
                answer: "33",
                finnishAnswer: "kolmekymmentäkolme",
                hint: "68 - 35 = 33 (kolmekymmentäkolme)",
              },
              {
                text: "Mitä on 9 × 8? (What is 9 × 8?)",
                answer: "72",
                finnishAnswer: "seitsemänkymmentäkaksi",
                hint: "9 × 8 = 72 (seitsemänkymmentäkaksi)",
              },
              {
                text: "Mitä on 31 + 12? (What is 31 + 12?)",
                answer: "43",
                finnishAnswer: "neljäkymmentäkolme",
                hint: "31 + 12 = 43 (neljäkymmentäkolme)",
              },
              {
                text: "Mitä on 11 × 5? (What is 11 × 5?)",
                answer: "55",
                finnishAnswer: "viisikymmentäviisi",
                hint: "11 × 5 = 55 (viisikymmentäviisi)",
              },
              {
                text: "Mitä on 29 - 27? (What is 29 - 27?)",
                answer: "2",
                finnishAnswer: "kaksi",
                hint: "29 - 27 = 2 (kaksi)",
              },
              {
                text: "Mitä on 16 - 16? (What is 16 - 16?)",
                answer: "0",
                finnishAnswer: "nolla",
                hint: "16 - 16 = 0 (nolla)",
              },
            ],
            vocabulary: [
              "plus (+) = plus",
              "miinus (-) = minus",
              "kertaa (×) = times/multiply",
              "on (=) = equals/is",
            ],
          },
          {
            id: "ex1-12",
            type: "fill-blank",
            question: "Harjoitus 12: Kirjoita persoonapronomini (Write the personal pronoun)",
            description: "Fill in the missing personal pronouns: minä, sinä, hän, me, te, he",
            sentences: [
              {
                text: "1. _____ olette nyt kurssilla.",
                answer: "Te",
                hint: "You (plural) are on the course - use 'Te'",
              },
              {
                text: "2. Kuka _____?",
                answer: "hän",
                hint: "Who is he/she? - use 'hän'",
              },
              {
                text: "3. Missä _____ olemme?",
                answer: "me",
                hint: "Where are we? - use 'me'",
              },
              {
                text: "4. Kuinka vanha _____ olet?",
                answer: "sinä",
                hint: "How old are you? - use 'sinä'",
              },
              {
                text: "5. _____ olen Laura.",
                answer: "Minä",
                hint: "I am Laura - use 'Minä'",
              },
              {
                text: "6. _____ ovat Helsingissä.",
                answer: "He",
                hint: "They are in Helsinki - use 'He'",
              },
            ],
          },
          {
            id: "ex1-13",
            type: "fill-blank",
            question: "Harjoitus 13: Kirjoita olla-verbi (Write the verb 'to be')",
            description: "Fill in the correct form of 'olla': olen, olet, on, olemme, olette, ovat",
            sentences: [
              {
                text: "1. Hei, kuka sinä _____?",
                answer: "olet",
                hint: "Who are you? - use 'olet'",
              },
              {
                text: "2. Minä _____ Laura.",
                answer: "olen",
                hint: "I am Laura - use 'olen'",
              },
              {
                text: "3. Me _____ kurssilla.",
                answer: "olemme",
                hint: "We are on the course - use 'olemme'",
              },
              {
                text: "4. Te _____ nyt Suomessa.",
                answer: "olette",
                hint: "You (plural) are now in Finland - use 'olette'",
              },
              {
                text: "5. Kuka _____ hän?",
                answer: "on",
                hint: "Who is he/she? - use 'on'",
              },
              {
                text: "6. Missä _____ he?",
                answer: "ovat",
                hint: "Where are they? - use 'ovat'",
              },
            ],
          },
          {
            id: "ex1-14",
            type: "fill-blank",
            question: "Harjoitus 14: Kirjoita persoonapronomini tai olla-verbi (Write personal pronoun or verb 'to be')",
            description: "Fill in either the personal pronoun (minä, sinä, hän, me, te, he) or the verb 'olla' (olen, olet, on, olemme, olette, ovat)",
            sentences: [
              {
                text: "1. Kuka _____ olet? Minä olen Kalle.",
                answer: "sinä",
                hint: "Who are you? - use personal pronoun 'sinä'",
              },
              {
                text: "2. Te _____ nyt suomen kurssilla.",
                answer: "olette",
                hint: "You are now on the Finnish course - use verb 'olette'",
              },
              {
                text: "3. Opettajan nimi _____ Päivi.",
                answer: "on",
                hint: "The teacher's name is Päivi - use verb 'on'",
              },
              {
                text: "4. _____ ovat nyt Helsingissä.",
                answer: "He",
                hint: "They are now in Helsinki - use personal pronoun 'He'",
              },
              {
                text: "5. Kuinka vanha _____ on?",
                answer: "hän",
                hint: "How old is he/she? - use personal pronoun 'hän'",
              },
              {
                text: "6. Missä olette? Me _____ Suomessa.",
                answer: "olemme",
                hint: "Where are you? We are in Finland - use verb 'olemme'",
              },
              {
                text: "7. Olga ja Alex _____ kurssilla.",
                answer: "ovat",
                hint: "Olga and Alex are on the course - use verb 'ovat'",
              },
            ],
          },
          {
            id: "ex1-15",
            type: "practice",
            question: "Harjoitus 15: Kysy parilta (Ask your partner)",
            description: "Practice these questions with a partner. Say them aloud in Finnish!",
            questions: [
              "1. Mikä sinun nimi on? (What is your name?)",
              "2. Miten se kirjoitetaan? (How is it spelled?)",
              "3. Mitä sinulle kuuluu? (How are you?)",
              "4. Kuinka vanha sinä olet? (How old are you?)",
              "5. Milloin kurssi on? (When is the course?)",
              "6. Mikä päivä tänään on? (What day is it today?)",
            ],
          },
        ],
      },
      {
        number: 2,
        title: "Minkämaalainen sinä olet?",
        subtitle: "Maat, kansalaisuudet, kielet, verbin persoonataivutus",
        vocabulary: {
          title: "Sanasto",
          items: [
            {
              category: "Maat ja kansalaisuudet (Countries and nationalities)",
              words: [
                { finnish: "Suomi", english: "Finland" },
                { finnish: "suomalainen", english: "Finnish (person)" },
                { finnish: "Ranska", english: "France" },
                { finnish: "ranskalainen", english: "French (person)" },
                { finnish: "Brasilia", english: "Brazil" },
                { finnish: "brasilialainen", english: "Brazilian" },
                { finnish: "Venäjä", english: "Russia" },
                { finnish: "venäläinen", english: "Russian (person)" },
              ],
            },
            {
              category: "Kielet (Languages)",
              words: [
                { finnish: "suomi", english: "Finnish (language)" },
                { finnish: "englanti", english: "English" },
                { finnish: "ranska", english: "French (language)" },
                { finnish: "portugali", english: "Portuguese" },
                { finnish: "venäjä", english: "Russian (language)" },
                { finnish: "kreikka", english: "Greek (language)" },
                { finnish: "islanti", english: "Icelandic (language)" },
                { finnish: "arabia", english: "Arabic (language)" },
                { finnish: "urdu", english: "Urdu (language)" },
              ],
            },
            {
              category: "Kysymykset (Questions)",
              words: [
                { finnish: "Mistä sinä olet kotoisin?", english: "Where are you from?" },
                { finnish: "Minkämaalainen sinä olet?", english: "What nationality are you?" },
                { finnish: "Mitä kieltä sinä puhut?", english: "What language do you speak?" },
              ],
            },
            {
              category: "Lisää maita ja kansalaisuuksia (More countries and nationalities)",
              words: [
                { finnish: "Kreikka", english: "Greece" },
                { finnish: "kreikkalainen", english: "Greek (person)" },
                { finnish: "Islanti", english: "Iceland" },
                { finnish: "islantilainen", english: "Icelandic (person)" },
                { finnish: "Egypti", english: "Egypt" },
                { finnish: "egyptiläinen", english: "Egyptian (person)" },
                { finnish: "Pakistan", english: "Pakistan" },
                { finnish: "pakistanilainen", english: "Pakistani (person)" },
              ],
            },
            {
              category: "Jäätelökioskilla (At the ice cream kiosk)",
              words: [
                { finnish: "pallo", english: "scoop (of ice cream)" },
                { finnish: "ahaa", english: "oh, I see" },
                { finnish: "haluaisin", english: "I would like" },
                { finnish: "suklaa", english: "chocolate" },
                { finnish: "okei", english: "okay" },
                { finnish: "sinulle", english: "for you" },
                { finnish: "hinta", english: "price" },
                { finnish: "halpa", english: "cheap" },
                { finnish: "kallis", english: "expensive" },
                { finnish: "-kin", english: "also, too" },
                { finnish: "vanilja", english: "vanilla" },
                { finnish: "mansikka", english: "strawberry" },
                { finnish: "selvä", english: "clear, sure" },
                { finnish: "tässä", english: "here (this)" },
              ],
            },
            {
              category: "Hinta (Price)",
              words: [
                { finnish: "Mitä tämä maksaa?", english: "How much does this cost?" },
                { finnish: "Se maksaa 3,50 €", english: "It costs 3.50 euros" },
                { finnish: "kolme euroa viisikymmentä senttiä", english: "three euros fifty cents" },
                { finnish: "Tuleeko muuta?", english: "Anything else?" },
              ],
            },
          ],
        },
        grammar: {
          title: "Kielioppi",
          topics: [
            {
              title: "Verbin persoonataivutus (Verb conjugation)",
              content: "Finnish verbs are conjugated by person. For verb type 1, infinitive ends in -a/-ä. Personal endings:",
              examples: [
                "Infinitiivi (infinitive): puhua (to speak), kysyä (to ask)",
                "",
                "minä → -n: puhun, kysyn",
                "sinä → -t: puhut, kysyt",
                "hän/se → -V (vokaali): puhuu, kysyy",
                "me → -mme: puhumme, kysymme",
                "te → -tte: puhutte, kysytte",
                "he/ne → -vat/-vät: puhuvat, kysyvät",
              ],
            },
            {
              title: "Olla kotoisin + sta/stä (To be from...)",
              content: "To say where you're from, use 'olla kotoisin' + elative case (-sta/-stä). The ending depends on vowel harmony:",
              examples: [
                "Olen kotoisin Suomesta. (I am from Finland.)",
                "Olen kotoisin Ranskasta. (I am from France.)",
                "Olen kotoisin Kreikasta. (I am from Greece.)",
                "Olen kotoisin Islannista. (I am from Iceland.)",
                "Olen kotoisin Egyptistä. (I am from Egypt.)",
                "Olen kotoisin Venäjältä. (I am from Russia.)",
                "Olen kotoisin Pakistanista. (I am from Pakistan.)",
              ],
            },
            {
              title: "Kansalaisuudet: -lainen/-läinen (Nationalities)",
              content: "Nationalities are formed by adding -lainen (back vowels) or -läinen (front vowels) to the country name:",
              examples: [
                "Suomi → suomalainen (Finland → Finnish)",
                "Ranska → ranskalainen (France → French)",
                "Kreikka → kreikkalainen (Greece → Greek)",
                "Islanti → islantilainen (Iceland → Icelandic)",
                "Egypti → egyptiläinen (Egypt → Egyptian)",
                "Venäjä → venäläinen (Russia → Russian)",
                "Pakistan → pakistanilainen (Pakistan → Pakistani)",
              ],
            },
            {
              title: "Puhua + a/ä (To speak + partitive)",
              content: "When talking about languages, use 'puhua' + partitive case of the language:",
              examples: [
                "Olen suomalainen. Puhun suomea. (I am Finnish. I speak Finnish.)",
                "Olen ranskalainen. Puhun ranskaa. (I am French. I speak French.)",
                "Olen kreikkalainen. Puhun kreikkaa. (I am Greek. I speak Greek.)",
                "Olen islantilainen. Puhun islantia. (I am Icelandic. I speak Icelandic.)",
                "Olen egyptiläinen. Puhun arabiaa. (I am Egyptian. I speak Arabic.)",
                "Olen venäläinen. Puhun venäjää. (I am Russian. I speak Russian.)",
                "Olen pakistanilainen. Puhun urdua. (I am Pakistani. I speak Urdu.)",
              ],
            },
            {
              title: "Negatiivinen lause (Negative sentence)",
              content: "In negative sentences, there are 2 verbs: negative verb (en, et, ei, emme, ette, eivät) + main verb. The main verb is in the basic form without personal ending:",
              examples: [
                "minä en puhu → Minä en puhu espanjaa. (I don't speak Spanish.)",
                "sinä et puhu → Sinä et asu Helsingissä. (You don't live in Helsinki.)",
                "hän ei puhu → Hän ei osta jäätelöä. (He/She doesn't buy ice cream.)",
                "me emme puhu → Me emme tanssi tangoa. (We don't dance tango.)",
                "te ette puhu → Te ette laula. (You don't sing.)",
                "he eivät puhu → He eivät katso televisiota. (They don't watch TV.)",
              ],
            },
          ],
        },
        conversation: {
          title: "Puhutaan: Jäätelökioskilla (Let's speak: At the ice cream kiosk)",
          dialogues: [
            {
              speaker: "Myyjä",
              text: "Hei.",
              translation: "Hello.",
            },
            {
              speaker: "Pedro",
              text: "Hei. Mitä jäätelö maksaa?",
              translation: "Hello. How much does the ice cream cost?",
            },
            {
              speaker: "Myyjä",
              text: "Yksi pallo maksaa 2 € ja kaksi palloa maksaa 3 €.",
              translation: "One scoop costs 2 euros and two scoops cost 3 euros.",
            },
            {
              speaker: "Pedro",
              text: "Ahaa. Minä haluaisin kaksi palloa suklaajäätelöä.",
              translation: "I see. I would like two scoops of chocolate ice cream.",
            },
            {
              speaker: "Myyjä",
              text: "Okei. Entä sinulle?",
              translation: "Okay. And for you?",
            },
            {
              speaker: "Alex",
              text: "Minäkin haluaisin kaksi palloa: vaniljaa ja mansikkaa.",
              translation: "I would also like two scoops: vanilla and strawberry.",
            },
            {
              speaker: "Myyjä",
              text: "Selvä. Tuleeko muuta?",
              translation: "Sure. Anything else?",
            },
            {
              speaker: "Pedro ja Alex",
              text: "Ei kiitos.",
              translation: "No, thanks.",
            },
            {
              speaker: "Myyjä",
              text: "Tässä ovat jäätelöt. Kuusi euroa, kiitos.",
              translation: "Here are the ice creams. Six euros, please.",
            },
            {
              speaker: "Pedro ja Alex",
              text: "Ole hyvä.",
              translation: "Here you are. / You're welcome.",
            },
            {
              speaker: "Myyjä",
              text: "Kiitos.",
              translation: "Thank you.",
            },
            {
              speaker: "Pedro ja Alex",
              text: "Kiitos, hei hei.",
              translation: "Thank you, bye bye.",
            },
          ],
        },
        exercises: [
          {
            id: "ex2-1",
            type: "fill-blank",
            question: "Conjugate the verb 'puhua' (to speak):",
            sentences: [
              {
                text: "Minä _____ suomea. (I speak Finnish)",
                answer: "puhun",
              },
              {
                text: "Sinä _____ englantia. (You speak English)",
                answer: "puhut",
              },
              {
                text: "Hän _____ ranskaa. (He/She speaks French)",
                answer: "puhuu",
              },
            ],
          },
          {
            id: "ex2-11",
            type: "fill-blank",
            question: "Harjoitus 11: Kirjoita viikonpäivä (Write the day of the week)",
            description: "Fill in the days based on the given information. Use: maanantai, tiistai, keskiviikko, torstai, perjantai, lauantai, sunnuntai",
            sentences: [
              {
                text: "A. Tänään on maanantai. 1. Huomenna on _____",
                answer: "tiistai",
                hint: "If today is Monday, tomorrow is Tuesday",
              },
              {
                text: "A. 2. Ylihuomenna on _____",
                answer: "keskiviikko",
                hint: "If today is Monday, day after tomorrow is Wednesday",
              },
              {
                text: "A. 3. Eilen oli _____",
                answer: "sunnuntai",
                hint: "If today is Monday, yesterday was Sunday",
              },
              {
                text: "A. 4. Toissapäivänä oli _____",
                answer: "lauantai",
                hint: "If today is Monday, day before yesterday was Saturday",
              },
              {
                text: "B. Huomenna on sunnuntai. 1. Tänään on _____",
                answer: "lauantai",
                hint: "If tomorrow is Sunday, today is Saturday",
              },
              {
                text: "B. 2. Ylihuomenna on _____",
                answer: "maanantai",
                hint: "If tomorrow is Sunday, day after tomorrow is Monday",
              },
              {
                text: "B. 3. Eilen oli _____",
                answer: "perjantai",
                hint: "If today is Saturday, yesterday was Friday",
              },
              {
                text: "B. 4. Toissapäivänä oli _____",
                answer: "torstai",
                hint: "If today is Saturday, day before yesterday was Thursday",
              },
              {
                text: "C. Milloin on musiikkia? (When is music?) _____",
                answer: "perjantaina",
                hint: "Look at the schedule - music is on Friday",
              },
              {
                text: "C. Milloin on historiaa? (When is history?) _____",
                answer: "keskiviikkona",
                hint: "Look at the schedule - history is on Wednesday",
              },
              {
                text: "C. Milloin on englantia? (When is English?) _____",
                answer: "tiistaina",
                hint: "Look at the schedule - English is on Tuesday",
              },
              {
                text: "C. Milloin on biologiaa? (When is biology?) _____",
                answer: "torstaina",
                hint: "Look at the schedule - biology is on Thursday",
              },
              {
                text: "C. Milloin on matematiikkaa? (When is mathematics?) _____",
                answer: "maanantaina",
                hint: "Look at the schedule - mathematics is on Monday",
              },
            ],
          },
        ],
      },
      {
        number: 3,
        title: "Sähköposti Mikolle",
        subtitle: "Sanasto: arki, pikkusanat; Sää; Vuodenajat/kuukaudet; Värit; Genetiivi; k-p-t-vaihtelu",
        vocabulary: {
          title: "Sanasto",
          items: [
            {
              category: "Arki & sähköposti (Everyday & email)",
              words: [
                { finnish: "sähköposti", english: "email" },
                { finnish: "lähettäjä", english: "sender" },
                { finnish: "vastaanottaja", english: "recipient" },
                { finnish: "otsikko", english: "subject" },
                { finnish: "kirjoittaa", english: "to write" },
                { finnish: "terveisin", english: "best regards" },
                { finnish: "terveisiä", english: "greetings (from)" },
                { finnish: "englanniksi / suomeksi", english: "in English / in Finnish" },
                { finnish: "ymmärtää", english: "to understand" },
              ],
            },
            {
              category: "Pikkusanat (Particles)",
              words: [
                { finnish: "nyt", english: "now" },
                { finnish: "vaan", english: "but (rather)" },
                { finnish: "myös", english: "also" },
                { finnish: "yleensä", english: "usually" },
                { finnish: "joskus", english: "sometimes" },
                { finnish: "siksi", english: "therefore" },
                { finnish: "koska", english: "because" },
                { finnish: "toivottavasti", english: "hopefully" },
              ],
            },
            {
              category: "Missä? (Where?)",
              words: [
                { finnish: "täällä", english: "here" },
                { finnish: "tuolla", english: "over there" },
                { finnish: "siellä", english: "there (not here)" },
                { finnish: "Minä asun Helsingissä.", english: "I live in Helsinki." },
              ],
            },
            {
              category: "Millainen? (What kind?)",
              words: [
                { finnish: "hyvä / huono", english: "good / bad" },
                { finnish: "kuuma / kylmä", english: "hot / cold" },
                { finnish: "vaikea / helppo", english: "difficult / easy" },
                { finnish: "pieni / iso", english: "small / big" },
                { finnish: "uusi / vanha", english: "new / old" },
                { finnish: "kaunis / ruma", english: "beautiful / ugly" },
                { finnish: "lämmin / viileä", english: "warm / cool" },
                { finnish: "valoisa / pimeä", english: "bright / dark" },
                { finnish: "paljon → vähän", english: "a lot → a little" },
              ],
            },
            {
              category: "Sää (Weather)",
              words: [
                { finnish: "On kaunis ilma.", english: "The weather is beautiful." },
                { finnish: "On huono ilma.", english: "The weather is bad." },
                { finnish: "Kuinka monta astetta?", english: "How many degrees?" },
                { finnish: "On +20 astetta.", english: "It is +20 degrees." },
                { finnish: "Aurinko paistaa.", english: "The sun is shining." },
                { finnish: "On pilvistä.", english: "It is cloudy." },
                { finnish: "Sataa (vettä/lunta/räntää).", english: "It rains (water/snow/sleet)." },
                { finnish: "Tuulee.", english: "It is windy." },
                { finnish: "On ukkonen.", english: "There is thunder." },
              ],
            },
            {
              category: "Vuodenajat / Vuorokaudenaika / Kuukaudet (Seasons/Time/Months)",
              words: [
                { finnish: "talvi, kevät, kesä, syksy", english: "winter, spring, summer, autumn" },
                { finnish: "talvella, keväällä, kesällä, syksyllä", english: "in winter/spring/summer/autumn" },
                { finnish: "aamulla, päivällä, iltapäivällä, illalla, yöllä", english: "in the morning/day/afternoon/evening/at night" },
                { finnish: "elokuu", english: "August" },
                { finnish: "elokuussa", english: "in August" },
              ],
            },
            {
              category: "Värit (Colours)",
              words: [
                { finnish: "valkoinen / musta", english: "white / black" },
                { finnish: "punainen / ruskea", english: "red / brown" },
                { finnish: "sininen / harmaa", english: "blue / grey" },
                { finnish: "keltainen / oranssi", english: "yellow / orange" },
                { finnish: "vihreä / liila", english: "green / purple" },
              ],
            },
          ],
        },
        conversation: {
          title: "Puhutaan: Voitko auttaa minua?",
          dialogues: [
            { speaker: "Pedro", text: "Hanna, minä kirjoitan Mikolle sähköpostia suomeksi. Voitko auttaa minua?", translation: "Hanna, I am writing an email to Mikko in Finnish. Can you help me?" },
            { speaker: "Hanna", text: "Tietysti!", translation: "Of course!" },
            { speaker: "Pedro", text: "En tiedä, mitä 'news' on suomeksi.", translation: "I don't know what 'news' is in Finnish." },
            { speaker: "Hanna", text: "Se on 'uutiset'.", translation: "It is 'uutiset'." },
            { speaker: "Pedro", text: "Entä miten sanotaan 'Greetings from Helsinki'?", translation: "And how do you say 'Greetings from Helsinki'?" },
            { speaker: "Hanna", text: "Terveisiä Helsingistä.", translation: "Greetings from Helsinki." },
            { speaker: "Pedro", text: "Ai mitä? Voitko sanoa uudelleen!", translation: "Oh what? Can you say again!" },
            { speaker: "Hanna", text: "Terveisiä Helsingistä.", translation: "Greetings from Helsinki." },
            { speaker: "Pedro", text: "Ahaa, okei. Kiitos avusta!", translation: "Aha, okay. Thanks for your help!" },
          ],
        },
        grammar: {
          title: "Kielioppi",
          topics: [
            {
              title: "Genetiivi (Genitive)",
              content: "Genitive answers 'whose/which' (kenen/minkä). Add -n to nouns and adjectives.",
              examples: [
                "Pedro → Pedron tyttöystävä",
                "Alex → Alexin kotimaa",
                "kiva opettaja → kivan opettajan nimi",
                "Helsinki → Helsingin sää",
                "pitkä kurssi → pitkän kurssin opettaja",
              ],
            },
            {
              title: "Persoonapronominien genetiivi ja possessiivi (Pronoun genitive & possessive)",
              content: "Genitive of pronouns: minun, sinun, hänen, meidän, teidän, heidän. Possessive suffix can be added (ystäväni).",
              examples: [
                "minun ystävä = ystäväni",
                "sinun kirja = kirjasi",
                "hänen auto = hänen autonsa",
                "meidän opettaja = opettajamme",
              ],
            },
            {
              title: "k‑p‑t‑vaihtelu: verbityyppi 1 (Consonant gradation)",
              content: "Many type‑1 verbs and words have consonant gradation (kk→k, pp→p, tt→t; k→∅; nk→ng; nt→nn; mp→mm; lt→ll; rt→rr).",
              examples: [
                "nukkua → minä nukun, hän ei nuku",
                "ottaa → hän ottaa, me otamme",
                "pukea → hän pukee",
                "kirjoittaa → hän kirjoittaa",
                "ymmärtää → hän ymmärtää",
              ],
            },
          ],
        },
        exercises: [
          {
            id: "ex3-1",
            type: "pronunciation",
            question: "Harjoitus 1: Ääntäminen – diftongit (Diphthongs)",
            description: "Lue ja kuuntele. Harjoittele ääntämistä.",
            examples: [
              "ai: aihe, tasainen",
              "ei: keinu, kepeitä",
              "äi: häikkää, äkäinen",
              "iu: niukalla, viuhka",
              "ie: mielessä, viehättävä",
              "oi: koivu, mansikoihin",
              "öi: öitä, kännyköissä",
              "ou: outo, kotoutus",
              "uo: huomenna, puoli",
              "ui: suippo, puluista",
              "au: autoin, kalauttaa",
              "äy: täyttää, käräytin",
              "yö: pyöreä, työläs",
            ],
          },
          {
            id: "ex3-2",
            type: "fill-blank",
            question: "Harjoitus 2: Sanapaino ja sanajärjestys (Word stress & basic order)",
            sentences: [
              { text: "_____ asuu Helsingissä, Suomessa.", answer: "Olga", hint: "Start with the subject." },
              { text: "Pedro puhuu portugalia, englantia ja vähän _____.", answer: "suomea" },
              { text: "Huomenna menen _____.", answer: "konserttiin" },
            ],
          },
          {
            id: "ex3-3",
            type: "fill-blank",
            question: "Harjoitus 3: k‑p‑t‑vaihtelu ja vokaaliharmonia",
            sentences: [
              { text: "kaupunki → Minä asun kaupunki_____.", answer: "ssa", hint: "-ssa/-ssä" },
              { text: "pankki → Hän on pankki_____.", answer: "ssa" },
              { text: "Itävalta → Olen kotoisin Itävalta_____.", answer: "sta" },
              { text: "halpa → Se ei ole halpa, se on kalli_____.", answer: "i" },
            ],
          },
          {
            id: "ex3-4",
            type: "practice",
            question: "Harjoitus 4: Kysy ja pyydä apua",
            description: "Harjoittele kohteliaita pyyntöjä.",
            questions: [
              "Voitko auttaa minua?",
              "Voitko puhua hitaasti?",
              "Voitko sanoa uudelleen?",
              "Mitä sähköposti tarkoittaa?",
              "Miten sanotaan 'thank you' suomeksi?",
            ],
          },
        ],
      },
    ],
  };

  const currentChapters = chapters[selectedLevel] || [];

  const handleFillBlankChange = (exerciseId: string, index: number, value: string) => {
    setFillInBlanks((prev) => {
      const exercise = currentChapters
        .flatMap((ch) => ch.exercises || [])
        .find((ex) => ex.id === exerciseId);
      if (!exercise) return prev;

      const key = `${exerciseId}-${index}`;
      return {
        ...prev,
        [key]: {
          id: key,
          question: exercise.sentences[index].text,
          blanks: [],
          userAnswers: [value],
        },
      };
    });
  };

  const checkAnswer = (exerciseId: string, index: number) => {
    const exercise = currentChapters
      .flatMap((ch) => ch.exercises || [])
      .find((ex) => ex.id === exerciseId);
    if (!exercise) return false;

    const key = `${exerciseId}-${index}`;
    const userAnswer = fillInBlanks[key]?.userAnswers[0]?.toLowerCase().trim();
    const correctAnswer = exercise.sentences[index].answer.toLowerCase().trim();
    return userAnswer === correctAnswer;
  };

  return (
    <div style={{ 
      background: "white", 
      borderRadius: "12px", 
      padding: "40px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      maxWidth: "800px",
      margin: "0 auto"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #e2e8f0", paddingBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "32px", 
          fontWeight: "bold", 
          color: "#1e40af",
          marginBottom: "12px"
        }}>
          🇫🇮 SUOMEN mestari 1
        </h1>
        <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "20px" }}>
          Suomen kielen oppikirja aikuisille
        </p>
        
        {/* Level Selector */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
          {(["A1", "A2", "B1", "B2", "C1"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setExpandedChapter(1);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: `2px solid ${selectedLevel === level ? "#1e40af" : "#e2e8f0"}`,
                background: selectedLevel === level ? "#eff6ff" : "white",
                color: selectedLevel === level ? "#1e40af" : "#64748b",
                fontWeight: selectedLevel === level ? "bold" : "normal",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {currentChapters.map((chapter) => (
          <div
            key={chapter.number}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: expandedChapter === chapter.number ? "0" : "0",
            }}
          >
            {/* Chapter Header */}
            <button
              onClick={() => setExpandedChapter(expandedChapter === chapter.number ? null : chapter.number)}
              style={{
                width: "100%",
                padding: "24px",
                background: expandedChapter === chapter.number ? "#f8faff" : "white",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold", 
                  color: "#1e40af",
                  margin: "0 0 8px 0"
                }}>
                  Kappale {chapter.number}: {chapter.title}
                </h2>
                <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
                  {chapter.subtitle}
                </p>
              </div>
              <span style={{ fontSize: "24px", color: "#64748b" }}>
                {expandedChapter === chapter.number ? "▼" : "▶"}
              </span>
            </button>

            {/* Chapter Content */}
            {expandedChapter === chapter.number && (
              <div style={{ padding: "32px", borderTop: "1px solid #e2e8f0" }}>
                {/* Vocabulary Section */}
                {chapter.vocabulary && (
                  <section style={{ marginBottom: "40px" }}>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#1e40af",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>
                      📚 {chapter.vocabulary.title}
                    </h3>
                    {chapter.vocabulary.items.map((category, catIdx) => (
                      <div key={catIdx} style={{ marginBottom: "24px" }}>
                        <h4 style={{ 
                          fontSize: "16px", 
                          fontWeight: "600", 
                          color: "#334155",
                          marginBottom: "12px"
                        }}>
                          {category.category}
                        </h4>
                        <div style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                          gap: "12px" 
                        }}>
                          {category.words.map((word, wordIdx) => (
                            <div 
                              key={wordIdx}
                              style={{
                                padding: "12px",
                                background: "#f8faff",
                                borderRadius: "8px",
                                border: "1px solid #dbeafe",
                              }}
                            >
                              <div style={{ fontWeight: "600", color: "#1e40af", marginBottom: "4px" }}>
                                {word.finnish}
                              </div>
                              <div style={{ fontSize: "13px", color: "#64748b" }}>
                                {word.english}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* Pronunciation Section */}
                {chapter.pronunciation && (
                  <section style={{ marginBottom: "40px" }}>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#1e40af",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>
                      🎤 {chapter.pronunciation.title}
                    </h3>
                    {chapter.pronunciation.sections.map((section, secIdx) => (
                      <div key={secIdx} style={{ marginBottom: "32px" }}>
                        <h4 style={{ 
                          fontSize: "18px", 
                          fontWeight: "600", 
                          color: "#334155",
                          marginBottom: "8px"
                        }}>
                          {section.title}
                        </h4>
                        {section.subtitle && (
                          <p style={{ 
                            fontSize: "13px", 
                            color: "#64748b",
                            marginBottom: "16px",
                            fontStyle: "italic"
                          }}>
                            {section.subtitle}
                          </p>
                        )}
                        
                        {/* Vowels and Consonants */}
                        {section.content && section.content.length > 0 && typeof section.content[0] === 'object' && ('short' in section.content[0] || 'diphthong' in section.content[0]) && (
                          <div style={{
                            background: "#f8faff",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #dbeafe",
                          }}>
                            {section.content.map((item: any, itemIdx: number) => {
                              if ('short' in item) {
                                return (
                                  <div key={itemIdx} style={{ 
                                    marginBottom: "12px",
                                    padding: "12px",
                                    background: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0"
                                  }}>
                                    <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                                      <div style={{ minWidth: "80px" }}>
                                        <span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>
                                          {item.short}
                                        </span>
                                        {item.long && (
                                          <>
                                            <span style={{ margin: "0 8px", color: "#64748b" }}>/</span>
                                            <span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px" }}>
                                              {item.long}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                      <div style={{ fontSize: "14px", color: "#475569", flex: 1 }}>
                                        {item.example}
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if ('diphthong' in item) {
                                return (
                                  <div key={itemIdx} style={{ 
                                    marginBottom: "12px",
                                    padding: "12px",
                                    background: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    display: "inline-block",
                                    marginRight: "12px",
                                    minWidth: "200px"
                                  }}>
                                    <span style={{ fontWeight: "600", color: "#1e40af", fontSize: "16px", marginRight: "12px" }}>
                                      {item.diphthong}
                                    </span>
                                    <span style={{ fontSize: "14px", color: "#475569" }}>
                                      {item.example}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        )}
                        
                        {/* Intonation and Word Stress - simple text list */}
                        {section.content && section.content.length > 0 && typeof section.content[0] === 'string' && (
                          <div style={{
                            background: "#f8faff",
                            borderRadius: "12px",
                            padding: "20px",
                            border: "1px solid #dbeafe",
                          }}>
                            {section.content.map((text: string, textIdx: number) => (
                              <div key={textIdx} style={{ 
                                marginBottom: "8px",
                                fontSize: "15px",
                                color: "#1e293b",
                                lineHeight: "1.8"
                              }}>
                                {text}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </section>
                )}

                {/* Grammar Section */}
                {chapter.grammar && (
                  <section style={{ marginBottom: "40px" }}>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#1e40af",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>
                      📝 {chapter.grammar.title}
                    </h3>
                    {chapter.grammar.topics.map((topic, topicIdx) => (
                      <div key={topicIdx} style={{ marginBottom: "24px" }}>
                        <h4 style={{ 
                          fontSize: "16px", 
                          fontWeight: "600", 
                          color: "#334155",
                          marginBottom: "8px"
                        }}>
                          {topic.title}
                        </h4>
                        <p style={{ 
                          fontSize: "14px", 
                          color: "#475569",
                          marginBottom: "12px",
                          lineHeight: "1.6"
                        }}>
                          {topic.content}
                        </p>
                        <ul style={{ 
                          margin: 0, 
                          paddingLeft: "24px",
                          fontSize: "14px",
                          color: "#475569",
                          lineHeight: "1.8"
                        }}>
                          {topic.examples.map((example, exIdx) => (
                            <li key={exIdx} style={{ marginBottom: "6px" }}>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </section>
                )}

                {/* Conversation Section */}
                {chapter.conversation && (
                  <section style={{ marginBottom: "40px" }}>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#1e40af",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>
                      💬 {chapter.conversation.title}
                    </h3>
                    <div style={{
                      background: "#f8faff",
                      borderRadius: "12px",
                      padding: "20px",
                      border: "1px solid #dbeafe",
                    }}>
                      {chapter.conversation.dialogues.map((dialogue, dialIdx) => (
                        <div key={dialIdx} style={{ marginBottom: "16px" }}>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#1e40af",
                            marginBottom: "4px"
                          }}>
                            {dialogue.speaker}:
                          </div>
                          <div style={{ 
                            fontSize: "15px", 
                            color: "#1e293b",
                            marginBottom: dialogue.translation ? "4px" : "0"
                          }}>
                            {dialogue.text}
                          </div>
                          {dialogue.translation && (
                            <div style={{ 
                              fontSize: "13px", 
                              color: "#64748b",
                              fontStyle: "italic"
                            }}>
                              {dialogue.translation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Exercises Section */}
                {chapter.exercises && chapter.exercises.length > 0 && (
                  <section>
                    <h3 style={{ 
                      fontSize: "20px", 
                      fontWeight: "bold", 
                      color: "#1e40af",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #e2e8f0"
                    }}>
                      ✏️ Harjoitukset (Exercises)
                    </h3>
                    {chapter.exercises.map((exercise) => (
                      <div 
                        key={exercise.id}
                        style={{
                          background: "#fef3c7",
                          borderRadius: "12px",
                          padding: "24px",
                          marginBottom: "24px",
                          border: "1px solid #fde68a",
                        }}
                      >
                        <h4 style={{ 
                          fontSize: "16px", 
                          fontWeight: "600", 
                          color: "#92400e",
                          marginBottom: exercise.description ? "8px" : "16px"
                        }}>
                          {exercise.question}
                        </h4>
                        {exercise.description && (
                          <p style={{ 
                            fontSize: "14px", 
                            color: "#92400e",
                            marginBottom: "16px",
                            fontStyle: "italic"
                          }}>
                            {exercise.description}
                          </p>
                        )}

                        {/* Pronunciation Exercise */}
                        {exercise.type === "pronunciation" && exercise.examples && (
                          <div style={{
                            background: "white",
                            borderRadius: "8px",
                            padding: "16px",
                            border: "1px solid #fde68a"
                          }}>
                            {exercise.examples.map((example: string, exIdx: number) => (
                              <div key={exIdx} style={{ 
                                marginBottom: "8px",
                                fontSize: "14px",
                                color: "#1e293b",
                                lineHeight: "1.8"
                              }}>
                                {example}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Math Exercise */}
                        {exercise.type === "math" && exercise.problems && (
                          <div>
                            {exercise.vocabulary && (
                              <div style={{
                                background: "#fef3c7",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "16px",
                                border: "1px solid #fde68a"
                              }}>
                                <p style={{ fontSize: "13px", fontWeight: "600", color: "#92400e", marginBottom: "8px" }}>
                                  Vocabulary:
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                                  {exercise.vocabulary.map((vocab: string, vocabIdx: number) => (
                                    <span key={vocabIdx} style={{ 
                                      fontSize: "13px",
                                      color: "#1e293b",
                                      padding: "4px 8px",
                                      background: "white",
                                      borderRadius: "4px"
                                    }}>
                                      {vocab}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {exercise.problems.map((problem: any, probIdx: number) => {
                              const key = `${exercise.id}-${probIdx}`;
                              const userAnswer = fillInBlanks[key]?.userAnswers[0] || "";
                              const isCorrect = userAnswer && (userAnswer.toLowerCase().trim() === problem.answer.toLowerCase().trim() || userAnswer.toLowerCase().trim() === problem.finnishAnswer.toLowerCase().trim());
                              
                              return (
                                <div key={probIdx} style={{ marginBottom: "16px" }}>
                                  <div style={{ 
                                    fontSize: "15px", 
                                    color: "#1e293b",
                                    marginBottom: "8px",
                                    fontWeight: "500"
                                  }}>
                                    {problem.text}
                                  </div>
                                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                    <span style={{ fontSize: "14px", color: "#64748b" }}>Answer:</span>
                                    <input
                                      type="text"
                                      value={userAnswer}
                                      onChange={(e) => handleFillBlankChange(exercise.id, probIdx, e.target.value)}
                                      style={{
                                        width: "200px",
                                        padding: "6px 12px",
                                        border: `2px solid ${isCorrect ? "#10b981" : userAnswer ? "#ef4444" : "#d1d5db"}`,
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        background: isCorrect ? "#d1fae5" : userAnswer ? "#fee2e2" : "white",
                                      }}
                                      placeholder="Enter number or Finnish word"
                                    />
                                  </div>
                                  {problem.hint && !userAnswer && (
                                    <div style={{ 
                                      fontSize: "12px", 
                                      color: "#64748b",
                                      fontStyle: "italic",
                                      marginTop: "4px"
                                    }}>
                                      💡 {problem.hint}
                                    </div>
                                  )}
                                  {userAnswer && (
                                    <div style={{ 
                                      fontSize: "13px", 
                                      color: isCorrect ? "#10b981" : "#ef4444",
                                      fontWeight: "600",
                                      marginTop: "4px"
                                    }}>
                                      {isCorrect ? `✅ Correct! (${problem.answer} = ${problem.finnishAnswer})` : `❌ Try again. Correct: ${problem.answer} (${problem.finnishAnswer})`}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Matching Exercise */}
                        {exercise.type === "matching" && exercise.pairs && (
                          <div>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "16px",
                              marginBottom: "20px"
                            }}>
                              <div>
                                <h5 style={{ fontSize: "14px", fontWeight: "600", color: "#92400e", marginBottom: "12px" }}>
                                  Questions:
                                </h5>
                                {exercise.pairs.map((pair: any, pairIdx: number) => (
                                  <div key={pairIdx} style={{
                                    padding: "12px",
                                    background: "white",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    border: "1px solid #fde68a"
                                  }}>
                                    {pair.question}
                                  </div>
                                ))}
                              </div>
                              <div>
                                <h5 style={{ fontSize: "14px", fontWeight: "600", color: "#92400e", marginBottom: "12px" }}>
                                  Answers (a-g):
                                </h5>
                                {exercise.options?.map((option: any) => (
                                  <div key={option.id} style={{
                                    padding: "12px",
                                    background: "white",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    border: "1px solid #fde68a",
                                    fontSize: "14px"
                                  }}>
                                    <strong>{option.id}.</strong> {option.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div style={{
                              padding: "16px",
                              background: "#f0fdf4",
                              borderRadius: "8px",
                              border: "1px solid #86efac"
                            }}>
                              <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>
                                💡 Match each question with the correct answer. Write the letter (a-g) next to each question number.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Practice Exercise (Questions to practice with partner) */}
                        {exercise.type === "practice" && exercise.questions && (
                          <div style={{
                            background: "white",
                            borderRadius: "8px",
                            padding: "20px",
                            border: "1px solid #fde68a"
                          }}>
                            <p style={{ 
                              fontSize: "14px", 
                              color: "#92400e",
                              marginBottom: "16px",
                              fontStyle: "italic"
                            }}>
                              💬 Practice these questions aloud with a partner or use Knuut AI voice assistant!
                            </p>
                            {exercise.questions.map((question: string, qIdx: number) => (
                              <div key={qIdx} style={{
                                padding: "12px",
                                background: "#fef3c7",
                                borderRadius: "8px",
                                marginBottom: "12px",
                                border: "1px solid #fde68a",
                                fontSize: "15px",
                                color: "#1e293b",
                                lineHeight: "1.8"
                              }}>
                                {question}
                              </div>
                            ))}
                            <div style={{
                              padding: "12px",
                              background: "#eff6ff",
                              borderRadius: "8px",
                              border: "1px solid #bfdbfe",
                              marginTop: "16px"
                            }}>
                              <p style={{ margin: 0, fontSize: "13px", color: "#1e40af" }}>
                                💡 <strong>Tip:</strong> Visit the{" "}
                                <a 
                                  href="/knuut-voice" 
                                  style={{ color: "#1e40af", textDecoration: "underline", fontWeight: "600" }}
                                >
                                  Knuut AI Voice page
                                </a>{" "}
                                to practice these questions with Knuut!
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Fill-in-the-blank Exercise */}
                        {exercise.type === "fill-blank" && exercise.sentences && (
                          <>
                            {exercise.sentences.map((sentence: any, sentIdx: number) => {
                              const key = `${exercise.id}-${sentIdx}`;
                              const userAnswer = fillInBlanks[key]?.userAnswers[0] || "";
                              const isCorrect = userAnswer && checkAnswer(exercise.id, sentIdx);
                              const parts = sentence.text.split("_____");
                              
                              return (
                                <div key={sentIdx} style={{ marginBottom: "16px" }}>
                                  <div style={{ 
                                    fontSize: "15px", 
                                    color: "#1e293b",
                                    marginBottom: "8px",
                                    lineHeight: "1.8"
                                  }}>
                                    {parts[0]}
                                    <input
                                      type="text"
                                      value={userAnswer}
                                      onChange={(e) => handleFillBlankChange(exercise.id, sentIdx, e.target.value)}
                                      style={{
                                        width: "150px",
                                        padding: "6px 12px",
                                        margin: "0 4px",
                                        border: `2px solid ${isCorrect ? "#10b981" : userAnswer ? "#ef4444" : "#d1d5db"}`,
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        background: isCorrect ? "#d1fae5" : userAnswer ? "#fee2e2" : "white",
                                      }}
                                      placeholder="______"
                                    />
                                    {parts[1]}
                                  </div>
                                  {sentence.hint && !userAnswer && (
                                    <div style={{ 
                                      fontSize: "12px", 
                                      color: "#64748b",
                                      fontStyle: "italic",
                                      marginLeft: "20px"
                                    }}>
                                      💡 {sentence.hint}
                                    </div>
                                  )}
                                  {userAnswer && (
                                    <div style={{ 
                                      fontSize: "13px", 
                                      color: isCorrect ? "#10b981" : "#ef4444",
                                      fontWeight: "600",
                                      marginLeft: "20px",
                                      marginTop: "4px"
                                    }}>
                                      {isCorrect ? "✅ Correct!" : `❌ Try again. Correct answer: ${sentence.answer}`}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    ))}
                  </section>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div style={{
        marginTop: "40px",
        padding: "20px",
        background: "#eff6ff",
        borderRadius: "12px",
        border: "1px solid #bfdbfe",
        textAlign: "center",
      }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#1e40af" }}>
          💡 <strong>Want to practice with Knuut AI?</strong> Visit the{" "}
          <a 
            href="/knuut-voice" 
            style={{ color: "#1e40af", textDecoration: "underline", fontWeight: "600" }}
          >
            Voice Assistant page
          </a>{" "}
          to practice pronunciation and conversation!
        </p>
      </div>
    </div>
  );
}

