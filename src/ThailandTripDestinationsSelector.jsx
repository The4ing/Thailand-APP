import React, { useEffect, useMemo, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  doc,
  onSnapshot,
  setDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseReady = Object.values(firebaseConfig).every(Boolean);

const app = firebaseReady ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

export default function ThailandTripDestinationsSelector() {
  const friends = ["נועמסה", "שיכורם", "יהיר"];
  const recommenderName = "החתול הממליץ";

  const destinations = [
    {
      id: "bangkok",
      name: "בנגקוק",
      category: "חובה",
      why: "נקודת הנחיתה והחזרה שלכם, עם פתיחה וסיום מושלמים לטיול: רופטופים מפורסמים, חיי לילה, מסאז'ים ואווירת עיר ענקית.",
      notes: "הסיבה המרכזית מבחינתכם: ללכת לרופטופ המפורסם מהסרט 'בדרך לחתונה עוצרים בבנגקוק'.",
      vibe: ["רופטופים", "חיי לילה", "פתיחה/סיום"],
      recommended: true,
      images: [
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "koh-phangan",
      name: "קופנגן",
      category: "חובה",
      why: "החוויה הכי ייחודית למסיבות בתאילנד – פולמון פארטי, מסיבות חוף, מופעי אש ואווירה של פעם בחיים.",
      notes: "הסיבה המרכזית מבחינתכם: מסיבת Full Moon הכי מפורסמת בתאילנד ומסיבות חוף מטורפות.",
      vibe: ["פולמון", "מסיבות חוף", "צעירים"],
      recommended: true,
      images: [
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "phuket",
      name: "פוקט",
      category: "חובה",
      why: "הבסיס הכי חזק לטיול שלכם – חופים, מסיבות, יוקרה, ביץ' קלאבים, מלונות טובים, טיולי יום והמון מה לעשות.",
      notes: "הסיבה המרכזית מבחינתכם: מלא דברים לעשות, מסיבות, ובאופן כללי מקום יפה.",
      vibe: ["יוקרה", "מסיבות", "חופים"],
      recommended: true,
      images: [
        "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "similan",
      name: "איי סימילאן",
      category: "טיול יום",
      why: "יום אחד של מים מטורפים, חול לבן וטבע ברמה של 'וואו' – אחד הימים הכי יפים שאפשר להכניס למסלול.",
      notes: "יוצא מפוקט כטיול יום, לא יעד לינה.",
      vibe: ["טיול יום", "טבע", "מים צלולים"],
      recommended: true,
      images: [
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "phi-phi",
      name: "קופיפי",
      category: "מומלץ מאוד",
      why: "השילוב הכי מדויק בין אי ציורי עם מים מטורפים לבין מסיבות חוף, וייב צעיר ואווירת טיול חברים.",
      notes: "מסיבות חוף בעיקר, פחות מועדונים סגורים, חופים יפים ואי ציורי.",
      vibe: ["מסיבות חוף", "אי יפה", "וייב צעיר"],
      recommended: true,
      images: [
        "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "krabi",
      name: "קראבי",
      category: "סימן שאלה",
      why: "מוסיף לטיול נוף אקזוטי אחר לגמרי – צוקים דרמטיים, Railay, קיאקים, טבע ונוף שמרגיש שונה מהאיים האחרים.",
      notes: "מתאים אם רוצים לשלב גם טבע ונופים ולא רק מסיבות וחופים.",
      vibe: ["צוקים", "טבע", "נוף"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "samui",
      name: "קוסמוי",
      category: "סימן שאלה",
      why: "יכולה להתאים אם אתם רוצים עוד תחנת חוף עם מסיבות חוף כמו ARKbar, מופעי אש ואווירה יותר קלה ונוחה לפני/אחרי קופנגן.",
      notes: "כרגע הדבר המרכזי שמעניין אתכם שם הוא ARKbar ורצועת החוף.",
      vibe: ["ARKbar", "מופעי אש", "חוף"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "koh-tao",
      name: "קו טאו",
      category: "רק אם...",
      why: "אחד המקומות הכי טובים אם רוצים צלילות, שנורקלים, מים יפים ואי רגוע יותר.",
      notes: "פחות מתאים אם אתם לא מתכננים לצלול.",
      vibe: ["צלילות", "שקט", "טבע"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "chiang-mai",
      name: "צ'יאנג מאי",
      category: "כדאי לשקול",
      why: "זה היעד שמכניס לטיול משהו אחר לגמרי – הרים במקום ים, אומגות, טרקטורונים, מפלים, חוות פילים, טיולי יום ומקדשים.",
      notes: "יכול למנוע מהטיול להרגיש רק כמו רצף של איים ומסיבות.",
      vibe: ["טבע", "אטרקציות", "מקדשים"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "chiang-rai",
      name: "צ'יאנג ראי",
      category: "פחות מתאים",
      why: "חזקה בעיקר במקדשים מיוחדים כמו White Temple ו-Blue Temple, אבל פחות נותנת את האקשן והגיוון של צ'יאנג מאי.",
      notes: "נראית פחות מעניינת עבורכם ביחס לאופציות האחרות.",
      vibe: ["מקדשים", "רגוע", "צפון"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1518002054494-3a6f94352e9c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "pai",
      name: "פאי",
      category: "פחות מתאים",
      why: "טובה למי שמחפש שלווה, וייב היפי, מעיינות חמים, ניתוק ורוגע.",
      notes: "כנראה פחות מתאים לווייב שלכם של מסיבות, חופים ואקשן.",
      vibe: ["היפי", "רוגע", "שלווה"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      id: "khao-lak",
      name: "קו לאק",
      category: "לוותר",
      why: "יעד שקט יותר, עם פארקים לאומיים, ריזורטים ואווירה שמתאימה יותר לזוגות או למי שמחפש שקט.",
      notes: "פחות הווייב שלכם.",
      vibe: ["שקט", "זוגות", "טבע"],
      recommended: false,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  ];

  const buildDefaultVotes = () =>
    destinations.reduce((acc, destination) => {
      acc[destination.id] = friends.reduce((friendAcc, friend) => {
        friendAcc[friend] = destination.recommended ? 1 : 0;
        return friendAcc;
      }, {});
      return acc;
    }, {});

  const getRoomIdFromUrl = () => {
    if (typeof window === "undefined") return "thailand-trip-room";
    const url = new URL(window.location.href);
    const existing = url.searchParams.get("room");
    if (existing) return existing;
    const generated = "trip-" + Math.random().toString(36).slice(2, 8);
    url.searchParams.set("room", generated);
    window.history.replaceState({}, "", url.toString());
    return generated;
  };

  const [roomId] = useState(getRoomIdFromUrl);
  const [votes, setVotes] = useState(buildDefaultVotes);
  const [notes, setNotes] = useState("");
  const [recommenderNotes, setRecommenderNotes] = useState({});
  const [syncStatus, setSyncStatus] = useState("טוען נתונים...");

  useEffect(() => {
    if (!db) {
      setSyncStatus("חסר חיבור ל-Firebase");
      return;
    }

    const ref = doc(db, "tripRooms", roomId);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.votes) setVotes(data.votes);
          if (typeof data.notes === "string") setNotes(data.notes);
          if (data.recommenderNotes) setRecommenderNotes(data.recommenderNotes);
          setSyncStatus("מסונכרן לכל המכשירים");
        } else {
          const initialData = {
            roomId,
            votes: buildDefaultVotes(),
            notes: "",
            recommenderNotes: {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          setDoc(ref, initialData, { merge: true });
          setSyncStatus("נוצר חדר משותף חדש");
        }
      },
      () => {
        setSyncStatus("שגיאת סנכרון");
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  const saveData = async (nextVotes, nextNotes, nextRecNotes = recommenderNotes) => {
    if (!db) {
      setSyncStatus("אי אפשר לשמור בלי Firebase");
      return;
    }

    try {
      const ref = doc(db, "tripRooms", roomId);
      await setDoc(
        ref,
        {
          roomId,
          votes: nextVotes,
          notes: nextNotes,
          recommenderNotes: nextRecNotes,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSyncStatus("נשמר בענן");
    } catch {
      setSyncStatus("שגיאת שמירה");
    }
  };

  const setVote = (destinationId, friend, value) => {
    const nextVotes = {
      ...votes,
      [destinationId]: {
        ...votes[destinationId],
        [friend]: value,
      },
    };
    setVotes(nextVotes);
    saveData(nextVotes, notes, recommenderNotes);
  };

  const setRecommenderNote = (destinationId, text) => {
    const nextRecNotes = {
      ...recommenderNotes,
      [destinationId]: text,
    };
    setRecommenderNotes(nextRecNotes);
    saveData(votes, notes, nextRecNotes);
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    saveData(votes, value, recommenderNotes);
  };

  const results = useMemo(() => {
    const mapped = destinations.map((destination) => {
      const total = friends.reduce(
        (sum, friend) => sum + (votes[destination.id]?.[friend] || 0),
        0
      );
      return {
        ...destination,
        total,
      };
    });

    return mapped.sort((a, b) => b.total - a.total);
  }, [votes]);

  const selected = results.filter((item) => item.total >= 5);
  const maybe = results.filter((item) => item.total >= 3 && item.total < 5);
  const skipped = results.filter((item) => item.total < 3);

  const categoryColors = {
    "חובה": "bg-red-100 text-red-700 border-red-200",
    "טיול יום": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "מומלץ מאוד": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "סימן שאלה": "bg-amber-100 text-amber-700 border-amber-200",
    "רק if...": "bg-violet-100 text-violet-700 border-violet-200",
    "רק אם...": "bg-violet-100 text-violet-700 border-violet-200",
    "כדאי לשקול": "bg-sky-100 text-sky-700 border-sky-200",
    "פחות מתאים": "bg-slate-100 text-slate-700 border-slate-200",
    "לוותר": "bg-zinc-100 text-zinc-700 border-zinc-200",
  };

  const scoreLabels = {
    0: "ממש לא",
    1: "אפשרי",
    2: "כן",
  };

  const scoreStyles = {
    0: "bg-slate-100 text-slate-700 border-slate-200",
    1: "bg-amber-100 text-amber-700 border-amber-200",
    2: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  if (!firebaseReady) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 text-slate-900 p-6 md:p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
          <p className="text-sm font-medium text-sky-700 mb-2">Thailand Trip Planner</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">צריך לחבר Firebase לפני פריסה</h1>
          <p className="text-slate-700 leading-8 mb-6">
            הקומפוננטה מוכנה לפריסה ל-Vercel או Netlify, אבל כרגע חסרים משתני הסביבה של Firebase.
            ברגע שתוסיף אותם, הקישור המשותף יעבוד וכל החברים יוכלו לעדכן את אותם הנתונים מכל מכשיר.
          </p>
          <div className="rounded-2xl bg-slate-900 text-white p-5 text-sm leading-8 overflow-x-auto">
            <div>VITE_FIREBASE_API_KEY=...</div>
            <div>VITE_FIREBASE_AUTH_DOMAIN=...</div>
            <div>VITE_FIREBASE_PROJECT_ID=...</div>
            <div>VITE_FIREBASE_STORAGE_BUCKET=...</div>
            <div>VITE_FIREBASE_MESSAGING_SENDER_ID=...</div>
            <div>VITE_FIREBASE_APP_ID=...</div>
          </div>
          <p className="text-slate-500 text-sm mt-5">
            אחרי שתגדיר את המשתנים האלה בפרויקט, הדף יעבוד כרגיל בלי צורך לשנות את הקוד.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-white p-6 md:p-10 mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-sky-700 mb-2">תכנון טיול לתאילנד | 2.12–2.1</p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">בחירת יעדים לטיול החברים</h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 max-w-3xl leading-8">
                כל מי שיפתח את אותו הקישור יראה את אותם נתונים. כל שינוי נשמר בענן ומתעדכן לכל החברים.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center min-w-[260px]">
              <div className="rounded-2xl bg-slate-900 text-white p-4 shadow">
                <div className="text-lg font-bold">{roomId}</div>
                <div className="text-sm text-slate-300">קוד חדר</div>
              </div>
              <div className="rounded-2xl bg-sky-600 text-white p-4 shadow">
                <div className="text-lg font-bold">{syncStatus}</div>
                <div className="text-sm text-sky-100">מצב סנכרון</div>
              </div>
              <div className="rounded-2xl bg-emerald-600 text-white p-4 shadow">
                <div className="text-2xl font-bold">0–2</div>
                <div className="text-sm text-emerald-100">ניקוד לכל יעד</div>
              </div>
              <div className="rounded-2xl bg-orange-500 text-white p-4 shadow">
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="text-lg font-bold underline underline-offset-4"
                >
                  העתק קישור
                </button>
                <div className="text-sm text-orange-100">לשלוח לחברים</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid gap-5">
            {destinations.map((destination) => (
              <div key={destination.id} className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all border border-slate-100 overflow-hidden">
                <div className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{destination.name}</h2>
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${categoryColors[destination.category]}`}>
                        {destination.category}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-slate-900 text-white px-4 py-3 text-center min-w-[90px]">
                      <div className="text-2xl font-bold">{friends.reduce((sum, friend) => sum + (votes[destination.id]?.[friend] || 0), 0)}</div>
                      <div className="text-xs text-slate-300">ניקוד</div>
                    </div>
                  </div>

                  <div className="mb-5 -mx-1 overflow-x-auto">
                    <div className="flex gap-3 px-1 pb-2 min-w-max">
                      {destination.images.map((image, index) => (
                        <div key={index} className="relative h-44 w-72 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                          <img src={image} alt={`${destination.name} ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.vibe.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{tag}</span>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm leading-7 text-slate-700 mb-5">
                    <p><span className="font-bold text-slate-900">למה כדאי:</span> {destination.why}</p>
                    <p><span className="font-bold text-slate-900">מה שכבר חשבנו:</span> {destination.notes}</p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="text-sm font-bold text-slate-900 mb-3">הצבעה של כל חבר</div>
                    <div className="grid gap-3">
                      {friends.map((friend) => (
                        <div key={friend} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="text-sm font-medium text-slate-700">{friend}</div>
                          <div className="flex gap-2 flex-wrap">
                            {[0, 1, 2].map((value) => (
                              <button
                                key={value}
                                onClick={() => setVote(destination.id, friend, value)}
                                className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                                  (votes[destination.id]?.[friend] || 0) === value
                                    ? scoreStyles[value] + " ring-2 ring-offset-1 ring-slate-300"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {scoreLabels[value]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-orange-50 border border-orange-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-xl shadow-sm">
                        🐱
                      </div>
                      <div>
                        <div className="text-sm font-bold text-orange-900">{recommenderName}</div>
                        <div className="text-xs text-orange-700">דעה אישית של המומחה (לא נספר בניקוד)</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2 flex-wrap">
                        {[0, 1, 2].map((value) => (
                          <button
                            key={value}
                            onClick={() => setVote(destination.id, recommenderName, value)}
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                              (votes[destination.id]?.[recommenderName] || 0) === value
                                ? "bg-orange-500 text-white border-orange-600 ring-2 ring-offset-1 ring-orange-300"
                                : "bg-white text-orange-600 border-orange-200 hover:bg-orange-100"
                            }`}
                          >
                            {scoreLabels[value]}
                          </button>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-orange-800 uppercase tracking-wider">הערת החתול:</label>
                        <textarea
                          value={recommenderNotes[destination.id] || ""}
                          onChange={(e) => setRecommenderNote(destination.id, e.target.value)}
                          placeholder="מה החתול חושב על המקום הזה?..."
                          className="w-full min-h-[80px] rounded-xl border border-orange-200 bg-white/50 p-3 text-sm text-slate-800 placeholder:text-orange-300 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">איך משתמשים</h3>
              <ul className="space-y-3 text-sm text-slate-200 leading-7 list-disc pr-5">
                <li>כל חבר נותן לכל יעד ציון: ממש לא / אפשרי / כן.</li>
                <li>כל שינוי נשמר בענן ומתעדכן לכל מי שפתח את אותו הקישור.</li>
                <li>יעד עם 5–6 נקודות נחשב חזק למסלול.</li>
                <li>יעד עם 3–4 נקודות נשאר לבדיקה.</li>
                <li>יעד עם 0–2 נקודות כנראה לא נכנס.</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-sky-600 to-cyan-500 text-white rounded-3xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-3">הערות לקבוצה</h3>
              <textarea
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="למשל: קופנגן חובה בגלל פולמון, קוסמוי רק אם נרצה ARKbar, צ'יאנג מאי אם נחליט שאנחנו רוצים גם טבע..."
                className="w-full min-h-[140px] rounded-2xl border border-white/20 bg-white/15 p-4 text-sm text-white placeholder:text-sky-100 outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>

            <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 lg:sticky lg:top-6">
              <h3 className="text-2xl font-bold mb-4">סיכום אוטומטי</h3>
              <div className="space-y-5 text-sm leading-7 text-slate-700">
                <div>
                  <div className="font-bold text-emerald-700 mb-2">נכנסים למסלול</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.length > 0 ? selected.map((item) => (
                      <span key={item.id} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {item.name} · {item.total}/6
                      </span>
                    )) : <span className="text-slate-500">עדיין אין יעדים שסגורים ברוב ברור.</span>}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-amber-700 mb-2">בסימן שאלה</div>
                  <div className="flex flex-wrap gap-2">
                    {maybe.length > 0 ? maybe.map((item) => (
                      <span key={item.id} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        {item.name} · {item.total}/6
                      </span>
                    )) : <span className="text-slate-500">כרגע אין יעדים באמצע.</span>}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-700 mb-2">כנראה יורדים</div>
                  <div className="flex flex-wrap gap-2">
                    {skipped.length > 0 ? skipped.map((item) => (
                      <span key={item.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.name} · {item.total}/6
                      </span>
                    )) : <span className="text-slate-500">בינתיים הכול חזק במשחק.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
