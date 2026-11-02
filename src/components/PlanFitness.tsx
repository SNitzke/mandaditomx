import { useState, type ButtonHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { initialProducts } from "@/data/initialProducts";
import { tortilleriaProducts } from "@/data/tortilleriaProducts";
import type { CartItem, ExtraCartItem } from "@/types/product";

/* ---------- CONFIG ---------- */
const WHATSAPP = "525564259421"; // WhatsApp de Mandadito (con lada 52)

type Sexo = "hombre" | "mujer";
type Actividad =
  | "gimnasio" | "correr" | "ciclismo" | "funcional"
  | "natacion" | "deportes" | "caminata" | "yoga";
type Dieta = "omnivoro" | "vegetariano";

interface Meta {
  id: string; label: string; sexo?: Sexo;
  ajuste: number;   // % sobre mantenimiento (+ superávit / - déficit)
  prot: number;     // g de proteína por kg
  tip: string;
}

interface ActividadInfo {
  id: Actividad; label: string; emoji: string; met: [number, number, number];
}

const ACTIVIDADES: ActividadInfo[] = [
  { id: "gimnasio", label: "Gimnasio / pesas", emoji: "🏋️", met: [4, 5, 6] },
  { id: "correr", label: "Correr", emoji: "🏃", met: [0, 0, 0] },
  { id: "ciclismo", label: "Ciclismo", emoji: "🚴", met: [6, 8, 10] },
  { id: "funcional", label: "CrossFit / funcional", emoji: "🤸", met: [6, 8, 10] },
  { id: "natacion", label: "Natación", emoji: "🏊", met: [5, 7, 9] },
  { id: "deportes", label: "Fútbol / deportes", emoji: "⚽", met: [5, 7, 9] },
  { id: "caminata", label: "Caminata / senderismo", emoji: "🥾", met: [3, 4, 5] },
  { id: "yoga", label: "Yoga / pilates", emoji: "🧘", met: [2.5, 3, 4] },
];

const rendimiento = (t = "Mejorar rendimiento"): Meta => ({
  id: "rend", label: t, ajuste: 0.02, prot: 1.5,
  tip: "Prioriza carbohidratos antes y después de entrenar para sostener el rendimiento y recuperarte mejor.",
});
const bajarGrasa = (aj = -0.12): Meta => ({
  id: "grasa", label: "Bajar grasa / definir", ajuste: aj, prot: 1.9,
  tip: "Déficit moderado y proteína alta para conservar músculo. Bajar de forma gradual funciona mejor que hacerlo agresivo.",
});
const mantener = (): Meta => ({
  id: "mant", label: "Mantener peso y figura", ajuste: 0, prot: 1.5,
  tip: "Come en tu mantenimiento y mantén constancia en el entrenamiento.",
});

const METAS: Record<Actividad, Meta[]> = {
  gimnasio: [
    { id: "musculo-h", label: "Ganar músculo", sexo: "hombre", ajuste: 0.10, prot: 1.9, tip: "Superávit ligero y progresión de cargas. Subir 0.25–0.5 kg por semana es un ritmo razonable." },
    { id: "fornido", label: "Verme más fornido / volumen", sexo: "hombre", ajuste: 0.14, prot: 2.0, tip: "Más calorías para crecer, con carbohidratos altos alrededor del entrenamiento. Vigila que no suba de más la grasa." },
    { id: "fuerza", label: "Ganar fuerza", ajuste: 0.05, prot: 1.8, tip: "Un superávit pequeño y buen descanso mejoran la fuerza sin ganar grasa de más." },
    { id: "mantener-m", label: "Mantener figura", sexo: "mujer", ajuste: 0, prot: 1.6, tip: "Calorías de mantenimiento y proteína suficiente en cada comida." },
    { id: "gluteos", label: "Subir / levantar glúteos", sexo: "mujer", ajuste: 0.07, prot: 1.8, tip: "El crecimiento muscular necesita superávit leve, proteína constante y sobrecarga progresiva en tus ejercicios de glúteo." },
    { id: "cintura", label: "Definir cintura", sexo: "mujer", ajuste: -0.10, prot: 1.9, tip: "No se puede reducir grasa de una sola zona. Un déficit leve y fuerza en todo el cuerpo es lo que mejor funciona." },
    { id: "recomp", label: "Tonificar (recomposición)", ajuste: -0.04, prot: 2.0, tip: "Calorías casi de mantenimiento, proteína alta y entrenamiento de fuerza para bajar grasa y ganar músculo." },
    { id: "musculo-m", label: "Ganar músculo", sexo: "mujer", ajuste: 0.08, prot: 1.8, tip: "Superávit leve y pesas pesadas. Ganar músculo no te hará ver voluminosa por accidente." },
    bajarGrasa(),
    { ...mantener(), id: "mant-h", sexo: "hombre" },
  ],
  correr: [
    { id: "r-5-10", label: "Mejorar en 5K / 10K", ajuste: 0.02, prot: 1.5, tip: "Carbohidratos suficientes y una comida con carbohidratos y proteína después de tus rodajes largos." },
    { id: "r-21-42", label: "Preparar media maratón / maratón", ajuste: 0.05, prot: 1.5, tip: "Volumen alto exige comer suficiente. Practica en tus tiradas largas la hidratación y los geles o snacks que usarás en carrera." },
    bajarGrasa(-0.10), mantener(),
  ],
  ciclismo: [rendimiento("Mejorar rendimiento"), bajarGrasa(-0.10), mantener()],
  funcional: [rendimiento("Mejorar rendimiento"), { id: "f-mus", label: "Ganar músculo", ajuste: 0.08, prot: 1.9, tip: "Superávit leve con proteína alta y carbohidratos cerca de tus WODs." }, bajarGrasa(), mantener()],
  natacion: [rendimiento(), bajarGrasa(-0.10), mantener()],
  deportes: [rendimiento(), bajarGrasa(-0.10), mantener()],
  caminata: [bajarGrasa(-0.10), mantener(), rendimiento("Más resistencia")],
  yoga: [mantener(), bajarGrasa(-0.08), { id: "y-tono", label: "Tonificar", ajuste: 0, prot: 1.6, tip: "Proteína en cada comida y algo de fuerza complementaria." }],
};

/* Las comidas cambian según el objetivo (volumen, rendimiento, definición o mantenimiento)
   y se combinan distinto según la actividad, para que no se vea igual en todos los apartados. */
type Clima = "volumen" | "rendimiento" | "definicion" | "mantenimiento";

const CLIMA_LABEL: Record<Clima, string> = {
  volumen: "ganar músculo",
  rendimiento: "rendir más en tus entrenamientos",
  definicion: "bajar grasa conservando músculo",
  mantenimiento: "mantener tu peso y figura",
};

const climaDe = (meta: Meta): Clima =>
  meta.ajuste <= -0.04 ? "definicion"
    : meta.ajuste >= 0.07 ? "volumen"
      : meta.ajuste > 0 ? "rendimiento"
        : "mantenimiento";

const hash = (s: string) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h || 1; };

/* De cada bolsa de opciones mostramos 2, elegidas según actividad + objetivo */
const elegir = (arr: string[], seed: number, n = 2): string[] => {
  if (arr.length <= n) return arr;
  const pool = [...arr]; const out: string[] = []; let s = seed % 2147483647 || 1;
  while (out.length < n && pool.length) { s = (s * 48271) % 2147483647; out.push(pool.splice(s % pool.length, 1)[0]); }
  return out;
};

const COMIDAS: Record<Dieta, Record<Clima, Record<string, string[]>>> = {
  omnivoro: {
    volumen: {
      Desayuno: [
        "Avena con leche, plátano y crema de cacahuate + 3 huevos",
        "Huevos revueltos con frijoles, tortillas, aguacate y fruta + leche",
        "Omelette de 3 huevos con espinaca y queso + avena con fruta y nueces",
      ],
      Comida: [
        "Pechuga de pollo + arroz + frijoles + tortillas + ensalada",
        "Bistec de res magro + camote o papa + calabaza y zanahoria + tortillas",
        "Molida de res con arroz, frijoles y verduras + guacamole",
      ],
      Colación: [
        "Sándwich de pavo o atún + fruta",
        "Yogurt griego con avena y nueces",
        "Leche con plátano y crema de cacahuate",
      ],
      Cena: [
        "Tacos de res o pollo con nopales, guacamole y salsa (3 tortillas)",
        "Pescado o atún con arroz y verduras al vapor",
        "Huevos a la mexicana con tortillas y frijoles + fruta",
      ],
    },
    rendimiento: {
      Desayuno: [
        "Avena con leche, plátano y canela + 2 huevos",
        "Tortillas con frijoles, huevo y aguacate + fruta",
        "Avena con yogurt griego, plátano y nueces",
      ],
      Comida: [
        "Pollo a la plancha + arroz + frijoles + ensalada",
        "Molida de res magra con papa y verduras + tortillas",
        "Pechuga de pollo con camote, brócoli y tortillas",
      ],
      Colación: [
        "Plátano con crema de cacahuate",
        "Sándwich de pavo o atún + fruta",
        "Yogurt griego con avena y fruta",
      ],
      Cena: [
        "Pescado o atún con camote y ensalada",
        "Tacos de pollo con nopales y verdura (2–3 tortillas)",
        "Quesadillas de espinaca con queso + frijoles",
      ],
    },
    definicion: {
      Desayuno: [
        "Omelette de 3 huevos con espinaca, jitomate y nopales + 1 tortilla",
        "Yogurt griego con fresas o fruta de temporada y nueces",
        "2 huevos cocidos con jitomate, aguacate y 2 tortillas",
      ],
      Comida: [
        "Pechuga de pollo a la plancha + ensalada de lechuga, jitomate y aguacate + nopales",
        "Molida de res magra con calabaza y zanahoria + frijoles",
        "Filete de pescado al horno con brócoli y espinacas",
      ],
      Colación: [
        "Yogurt griego con fruta y canela",
        "Huevo cocido + fruta de temporada",
        "Tostada con requesón y aguacate",
      ],
      Cena: [
        "Tacos de pollo con nopales y salsa (2 tortillas) + ensalada",
        "Atún con verduras salteadas y aguacate",
        "Pescado a la plancha con calabaza y espinacas",
      ],
    },
    mantenimiento: {
      Desayuno: [
        "Omelette de 3 huevos con nopales + frijoles + tortillas + fruta",
        "Avena con leche, plátano y crema de cacahuate + 2 huevos cocidos",
        "Huevos a la mexicana con tortillas, aguacate y jitomate",
      ],
      Comida: [
        "Pechuga de pollo a la plancha + arroz + frijoles + ensalada",
        "Bistec de res magro + papa o camote + verduras al vapor",
        "Molida de res con calabaza y zanahoria + arroz + tortillas",
      ],
      Colación: [
        "Yogurt griego con fruta y nueces",
        "Sándwich de pavo o atún + fruta",
        "Tostada con requesón y aguacate",
      ],
      Cena: [
        "Tacos de pollo o res con nopales y verduras (2–3 tortillas)",
        "Pescado o atún con ensalada y camote",
        "Quesadillas de champiñón y espinaca con queso + frijoles",
      ],
    },
  },
  vegetariano: {
    volumen: {
      Desayuno: [
        "Avena con leche, plátano, nueces y crema de cacahuate + 3 huevos",
        "Chilaquiles al horno con huevo, frijoles, queso y aguacate",
        "Omelette de 3 huevos con queso y espinaca + avena con fruta",
      ],
      Comida: [
        "Bowl de frijoles, arroz, queso panela, aguacate y verduras",
        "Lentejas con verduras + arroz + tortillas + queso cottage",
        "Pasta de arroz con lentejas, jitomate y queso",
      ],
      Colación: [
        "Yogurt griego con granola y fruta",
        "Sándwich de queso panela y aguacate + fruta",
        "Leche con avena, plátano y crema de cacahuate",
      ],
      Cena: [
        "Quesadillas de champiñón y espinaca con frijoles y aguacate",
        "Omelette de verduras con queso + frijoles + tortillas",
        "Tostadas de frijol, requesón, jitomate y aguacate",
      ],
    },
    rendimiento: {
      Desayuno: [
        "Avena con leche, plátano y nueces + 2 huevos",
        "Tortillas con frijoles, huevo y aguacate + fruta",
        "Yogurt griego con avena, fruta y crema de cacahuate",
      ],
      Comida: [
        "Arroz con frijoles, queso panela, verduras y aguacate",
        "Lentejas con arroz, calabaza y zanahoria + tortillas",
        "Bowl de tortillas, frijoles, jitomate, queso y aguacate",
      ],
      Colación: [
        "Plátano con crema de cacahuate",
        "Yogurt griego con granola y fruta",
        "Tostada con requesón y jitomate",
      ],
      Cena: [
        "Quesadillas de champiñón y espinaca con ensalada",
        "Frijoles con queso, verduras y tortillas + fruta",
        "Omelette de verduras con queso cottage + tortilla",
      ],
    },
    definicion: {
      Desayuno: [
        "Omelette de 3 huevos con espinaca, jitomate y nopales + 1 tortilla",
        "Yogurt griego con fresas o fruta de temporada y nueces",
        "Huevo cocido con aguacate, jitomate y 2 tortillas",
      ],
      Comida: [
        "Ensalada grande de lechuga, jitomate, frijoles, queso panela y aguacate",
        "Lentejas con calabaza y zanahoria + nopales",
        "Tostadas de frijol, requesón, lechuga y jitomate",
      ],
      Colación: [
        "Yogurt griego con fruta y canela",
        "Jícama o zanahoria con limón y chile",
        "Requesón con fruta de temporada",
      ],
      Cena: [
        "Quesadillas de nopales y espinaca con queso (2 tortillas)",
        "Verduras salteadas con queso cottage y frijoles",
        "Omelette de verduras con aguacate",
      ],
    },
    mantenimiento: {
      Desayuno: [
        "Chilaquiles al horno con huevo y frijoles",
        "Avena con leche, fruta y nueces + yogurt griego",
        "Huevos a la mexicana con tortillas, aguacate y frijoles",
      ],
      Comida: [
        "Bowl de frijoles, arroz, queso panela, aguacate y verduras",
        "Lentejas con verduras + tortillas + queso cottage",
        "Tostadas de frijol, requesón, lechuga, jitomate y aguacate",
      ],
      Colación: [
        "Yogurt griego con fruta y granola",
        "Tostada con requesón y aguacate",
        "Fruta con nueces o crema de cacahuate",
      ],
      Cena: [
        "Quesadillas de champiñón con ensalada",
        "Omelette de verduras + frijoles + tortilla",
        "Frijoles con queso panela, nopales y tortillas",
      ],
    },
  },
};

/* Snack alrededor del entrenamiento, según el deporte */
const PREPOST: Record<Actividad, { pre: string; post: string }> = {
  gimnasio: { pre: "Plátano con crema de cacahuate o yogurt con avena, 1–2 h antes", post: "Pechuga, atún o huevos con arroz, camote o papa y verdura, hasta 1 h después" },
  correr: { pre: "Avena con plátano y algo de sal, 1–2 h antes", post: "Yogurt griego con fruta + sándwich de atún o pavo" },
  ciclismo: { pre: "Avena con fruta, y fruta o jícama en ruta", post: "Sándwich de atún o pavo + fruta + agua con limón y sal" },
  funcional: { pre: "Yogurt con avena y plátano, 1–2 h antes", post: "Pollo o huevos con camote y verduras" },
  natacion: { pre: "Avena con leche y plátano, 1–2 h antes", post: "Huevos con tortillas y frijoles + fruta" },
  deportes: { pre: "Tortillas con frijoles y aguacate, 1–2 h antes", post: "Pollo o res con arroz, verdura y guacamole" },
  caminata: { pre: "Fruta de temporada o yogurt ligero", post: "Yogurt con nueces o huevo cocido con verdura" },
  yoga: { pre: "Fruta o yogurt ligero, 30–60 min antes", post: "Verduras con huevo o queso y tortillas" },
};

const REPARTO: [string, number][] = [["Desayuno", 0.25], ["Comida", 0.35], ["Colación", 0.15], ["Cena", 0.25]];

/* Productos del menú que se agregan al carrito (id del catálogo) */
const MENU_IDS: Record<Dieta, string[]> = {
  omnivoro: ["119", "104", "81", "44", "7", "51", "34", "43", "62", "40", "45", "41", "42", "22", "16"],
  vegetariano: ["119", "107", "42", "41", "45", "22", "62", "40", "43", "7", "16"],
};
const TORTILLERIA_IDS: Record<Dieta, string[]> = { omnivoro: ["Tortilla de Harina Integral"], vegetariano: ["Tortilla de Harina Integral", "Tostadas"] };

function llenarCarrito(dieta: Dieta) {
  const read = <T,>(k: string): T[] => { try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
  const cart = read<CartItem>("mi-super-cart");
  MENU_IDS[dieta].forEach((id) => {
    const product = initialProducts.find((p) => p.id === id);
    if (!product || cart.some((c) => c.product.id === id)) return;
    const weight = product.minWeight || 500;
    cart.push({ product, weight, totalPrice: Math.round(product.pricePerKg * weight / 10) / 100 });
  });
  const extras = read<ExtraCartItem>("mi-super-extras-cart");
  const addExtra = (e: ExtraCartItem) => { if (!extras.some((x) => x.id === e.id)) extras.push(e); };
  TORTILLERIA_IDS[dieta].forEach((name) => {
    const t = tortilleriaProducts.find((p) => p.name === name); const v = t?.variants[t.variants.length - 1];
    if (t && v) addExtra({ id: `tortilleria-${t.id}-${v.id}`, name: t.name, variantLabel: v.label, price: v.price, quantity: 1, category: "Tortillería", emoji: t.emoji });
  });
  DESPENSA[dieta].aparte.forEach((name) => addExtra({ id: `aparte-${name}`, name, variantLabel: "precio por confirmar", price: 0, quantity: 1, category: "Conseguir por aparte", emoji: "🛍️" }));
  localStorage.setItem("mi-super-cart", JSON.stringify(cart));
  localStorage.setItem("mi-super-extras-cart", JSON.stringify(extras));
}

/* Ingredientes de las comidas: qué está en el catálogo de mandadito y qué se consigue por aparte */
const DESPENSA: Record<Dieta, { tenemos: string[]; aparte: string[] }> = {
  omnivoro: {
    tenemos: ["Huevo (cartón 30 pz)", "Pechuga de pollo", "Bistec / Molida de res", "Nopal", "Plátano", "Papa", "Camote", "Brócoli", "Calabaza", "Zanahoria", "Lechuga", "Jitomate", "Aguacate", "Espinaca", "Jícama", "Fresa", "Limón", "Chile serrano", "Fruta de temporada", "Tortillas"],
    aparte: ["Avena", "Leche", "Crema de cacahuate", "Arroz", "Frijoles", "Yogurt griego", "Nueces", "Canela", "Pan y pavo", "Atún", "Pescado", "Queso panela", "Requesón", "Champiñones"],
  },
  vegetariano: {
    tenemos: ["Huevo (cartón 30 pz)", "Queso Oaxaca", "Aguacate", "Jitomate", "Lechuga", "Espinaca", "Calabaza", "Zanahoria", "Brócoli", "Plátano", "Jícama", "Fresa", "Limón", "Chile serrano", "Nopal", "Fruta de temporada", "Tortillas", "Tostadas"],
    aparte: ["Avena", "Leche", "Frijoles", "Arroz", "Lentejas", "Yogurt griego", "Nueces", "Granola", "Crema de cacahuate", "Canela", "Queso panela", "Queso cottage", "Requesón", "Champiñones"],
  },
};

/* ---------- CÁLCULO ---------- */
interface Form {
  sexo: Sexo; edad: string; peso: string; estatura: string;
  trabajo: "1.2" | "1.3" | "1.4";
  actividad: Actividad | ""; metaId: string;
  dias: string; minutos: string; intensidad: "0" | "1" | "2"; km: string;
  dieta: Dieta; acepta: boolean;
}

interface Plan {
  kcal: number;
  mantenimiento: number;
  aviso: boolean;
  meta: Meta;
  act: ActividadInfo;
  prot: number;
  grasa: number;
  carbs: number;
  agua: string;
}
interface Resultado { plan: Plan | null; error: string | null }

function calcular(f: Form): Resultado {
  const edad = +f.edad, peso = +f.peso, est = +f.estatura;
  if (![edad, peso, est].every((n) => Number.isFinite(n))) {
    return { plan: null, error: "Completa edad, peso y estatura con números válidos." };
  }
  if (edad < 18 || edad > 65) return { plan: null, error: "Esta herramienta es solo para adultos de 18 a 65 años. Consulta a un nutriólogo." };
  if (peso < 40 || peso > 200 || est < 140 || est > 210) return { plan: null, error: "Revisa tu peso (40–200 kg) y estatura (140–210 cm)." };

  const act = ACTIVIDADES.find((a) => a.id === f.actividad);
  const meta = act ? METAS[act.id].find((m) => m.id === f.metaId) : undefined;
  if (!act || !meta) return { plan: null, error: "Elige una actividad y un objetivo para continuar." };

  const bmr = 10 * peso + 6.25 * est - 5 * edad + (f.sexo === "hombre" ? 5 : -161);
  const dias = Math.min(7, Math.max(0, +f.dias || 0));
  const met = act.met[Number(f.intensidad)] ?? 0;
  const semanal = act.id === "correr"
    ? Math.max(0, +f.km || 0) * peso * 1.0
    : dias * ((+f.minutos || 0) / 60) * (met - 1) * peso;
  const mantenimiento = bmr * +f.trabajo + semanal / 7;

  let kcal = mantenimiento * (1 + meta.ajuste);
  const piso = f.sexo === "hombre" ? 1800 : 1500;
  const aviso = kcal < piso;
  if (aviso) kcal = piso;
  kcal = Math.round(kcal / 10) * 10;

  const prot = Math.min(2.2, meta.prot) * peso;
  const grasa = Math.max(0.8 * peso, (kcal * 0.25) / 9);
  const carbs = Math.max(0, (kcal - prot * 4 - grasa * 9) / 4);
  return {
    plan: {
      kcal, mantenimiento: Math.round(mantenimiento / 10) * 10, aviso, meta, act,
      prot: Math.round(prot), grasa: Math.round(grasa), carbs: Math.round(carbs),
      agua: (peso * 0.035).toFixed(1),
    },
    error: null,
  };
}

/* ---------- UI ---------- */
const input = "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const Chip = ({ on, children, ...p }: { on: boolean } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" {...p}
    className={`rounded-lg border px-3 py-2 text-sm text-left transition ${on ? "border-primary bg-primary text-primary-foreground shadow-sm" : "bg-card hover:bg-accent"}`}>
    {children}
  </button>
);

export default function PlanFitness() {
  const [f, setF] = useState<Form>({
    sexo: "hombre", edad: "", peso: "", estatura: "", trabajo: "1.3",
    actividad: "", metaId: "", dias: "4", minutos: "60", intensidad: "1", km: "20",
    dieta: "omnivoro", acepta: false,
  });
  const [res, setRes] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));

  const metas = f.actividad ? METAS[f.actividad].filter((m) => !m.sexo || m.sexo === f.sexo) : [];
  const listo = Boolean(f.edad && f.peso && f.estatura && f.actividad && f.metaId && f.acepta);

  const wa = (r: Plan) => {
    const d = DESPENSA[f.dieta];
    const msg = [
      `Hola mandadito 👋 Armé mi plan fitness:`,
      `• ${r.act.label} – ${r.meta.label}`,
      `• ${r.kcal} kcal/día · ${r.prot} g proteína · ${r.carbs} g carbs · ${r.grasa} g grasas`,
      ``,
      `✅ *Productos de mandadito:*`,
      ...d.tenemos.map((x) => `- ${x}`),
      ``,
      `🛍️ *Conseguir por aparte (no están en catálogo):*`,
      ...d.aparte.map((x) => `- ${x}`),
      ``,
      `Quiero cotizar mi despensa de la semana.`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };
  const abrirWhatsApp = (url: string) => {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      try { (window.top ?? window).location.href = url; } catch { window.location.href = url; }
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <header className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Arma tu plan de alimentación 💪</h2>
        <p className="text-muted-foreground">Cuéntanos cómo entrenas y qué buscas. Te damos una guía de calorías, macros y comidas con ingredientes frescos que te llevamos a casa.</p>
      </header>

      <Card>
        <CardHeader><CardTitle>1. Tus datos</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 grid grid-cols-2 gap-2">
            <Chip on={f.sexo === "hombre"} onClick={() => setF((p) => ({ ...p, sexo: "hombre", metaId: "" }))}>Hombre</Chip>
            <Chip on={f.sexo === "mujer"} onClick={() => setF((p) => ({ ...p, sexo: "mujer", metaId: "" }))}>Mujer</Chip>
          </div>
          <label className="text-sm">Edad<input className={input} type="number" value={f.edad} onChange={(e) => set("edad", e.target.value)} placeholder="25" /></label>
          <label className="text-sm">Peso (kg)<input className={input} type="number" value={f.peso} onChange={(e) => set("peso", e.target.value)} placeholder="70" /></label>
          <label className="text-sm">Estatura (cm)<input className={input} type="number" value={f.estatura} onChange={(e) => set("estatura", e.target.value)} placeholder="170" /></label>
          <label className="text-sm">Tu día a día (fuera del ejercicio)
            <select className={input} value={f.trabajo} onChange={(e) => set("trabajo", e.target.value as Form["trabajo"])}>
              <option value="1.2">Sentado la mayor parte del día</option>
              <option value="1.3">De pie / me muevo moderadamente</option>
              <option value="1.4">Trabajo físico o muy activo</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">Tipo de alimentación
            <select className={input} value={f.dieta} onChange={(e) => set("dieta", e.target.value as Dieta)}>
              <option value="omnivoro">Como de todo</option>
              <option value="vegetariano">Vegetariana</option>
            </select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. ¿Qué actividad haces?</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ACTIVIDADES.map((a) => (
            <Chip key={a.id} on={f.actividad === a.id} onClick={() => setF((p) => ({ ...p, actividad: a.id, metaId: "" }))}>
              <span className="mr-1">{a.emoji}</span>{a.label}
            </Chip>
          ))}
        </CardContent>
      </Card>

      {f.actividad && (
        <>
          <Card>
            <CardHeader><CardTitle>3. Tu objetivo</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {metas.map((m) => <Chip key={m.id} on={f.metaId === m.id} onClick={() => set("metaId", m.id)}>{m.label}</Chip>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>4. Tu entrenamiento</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {f.actividad === "correr" ? (
                <label className="text-sm sm:col-span-3">¿Cuántos km corres por semana?
                  <input className={input} type="number" value={f.km} onChange={(e) => set("km", e.target.value)} />
                </label>
              ) : (
                <>
                  <label className="text-sm">Días por semana<input className={input} type="number" min={1} max={7} value={f.dias} onChange={(e) => set("dias", e.target.value)} /></label>
                  <label className="text-sm">Minutos por sesión<input className={input} type="number" value={f.minutos} onChange={(e) => set("minutos", e.target.value)} /></label>
                  <label className="text-sm">Intensidad
                    <select className={input} value={f.intensidad} onChange={(e) => set("intensidad", e.target.value as Form["intensidad"])}>
                      <option value="0">Ligera</option><option value="1">Moderada</option><option value="2">Alta</option>
                    </select>
                  </label>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <label className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-sm">
        <input type="checkbox" className="mt-1" checked={f.acepta} onChange={(e) => set("acepta", e.target.checked)} />
        <span>Entiendo que Mandadito <b>no es un servicio médico ni de nutrición</b>. Esta herramienta es solo orientativa y consultaré a un nutriólogo, sobre todo si tengo alguna condición de salud, alergia, estoy embarazada o tomo medicamentos.</span>
      </label>

      <Button size="lg" className="w-full" disabled={!listo} onClick={() => { const r = calcular(f); if (r.plan) { setRes(r.plan); setError(null); setTimeout(() => document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" }), 50); } else { setRes(null); setError(r.error ?? "Completa tus datos para generar el plan."); } }}>
        Generar mi plan
      </Button>

      {error && <p className="rounded-lg border border-destructive p-3 text-sm text-destructive">{error}</p>}

      {res && (
        <div id="plan" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tu plan: {res.act.label} · {res.meta.label}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-center">
                {[["Calorías", `${res.kcal}`, "kcal/día"], ["Proteína", `${res.prot}`, "g"], ["Carbohidratos", `${res.carbs}`, "g"], ["Grasas", `${res.grasa}`, "g"]].map(([t, v, u]) => (
                  <div key={t} className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">{t}</div><div className="text-2xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{u}</div></div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Tu mantenimiento estimado es de ~{res.mantenimiento} kcal. Agua sugerida: ~{res.agua} L al día (más si sudas mucho).</p>
              {res.aviso && <p className="rounded-md bg-muted p-2 text-sm">Ajustamos tus calorías a un mínimo seguro. Si buscas bajar más rápido, hazlo con un nutriólogo.</p>}
              <p className="text-sm">💡 {res.meta.tip}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ideas de comidas (ejemplo de un día)</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {REPARTO.map(([n, p]) => (
                <div key={n} className="rounded-lg border p-3 text-sm">
                  <div className="font-semibold">{n} · ~{Math.round(res.kcal * p)} kcal · {Math.round(res.prot * p)} g prot.</div>
                  <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                    {(COMIDAS[f.dieta][n] ?? []).map((o) => <li key={o}>{o}</li>)}
                  </ul>
                  {f.dieta === "omnivoro" && (n === "Comida" || n === "Cena") && (
                    <p className="mt-1 text-xs">Referencia: ~{Math.round((res.prot * p) / 0.28 / 10) * 10} g de pollo o carne magra cocida cubren tu proteína de esta comida.</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tu despensa fitness</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border border-primary/40 p-3">
                <div className="font-semibold">✅ Lo tenemos en mandadito</div>
                <ul className="mt-1 list-disc pl-4 text-muted-foreground">{DESPENSA[f.dieta].tenemos.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="rounded-lg border p-3">
                <div className="font-semibold">🛍️ Te lo conseguimos por aparte</div>
                <ul className="mt-1 list-disc pl-4 text-muted-foreground">{DESPENSA[f.dieta].aparte.map((x) => <li key={x}>{x}</li>)}</ul>
                <p className="mt-2 text-xs">Estos productos no están en nuestro catálogo, pero los conseguimos para ti y te confirmamos precio por WhatsApp.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={() => { llenarCarrito(f.dieta); navigate("/?carrito=1"); }}>🛒 Pedir mi despensa fitness por WhatsApp</Button>
            <Button variant="outline" onClick={() => window.print()}>Imprimir / guardar PDF</Button>
          </div>

          <p className="text-xs text-muted-foreground">
            ⚠️ Esta información es orientativa y no sustituye la consulta con un médico o nutriólogo certificado. Mandadito no ofrece diagnósticos ni tratamientos. Los cálculos son estimaciones y cada cuerpo responde distinto.
          </p>
        </div>
      )}
    </section>
  );
}
