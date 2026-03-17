import { useState, useEffect } from "react";

const plants = [
  { id: 1, name: "Monstera Deliciosa", nickname: "Monty", emoji: "🌿", water: 7, light: "Bright indirect", lastWatered: 3, health: 95, pot: "#4a7c59" },
  { id: 2, name: "Fiddle Leaf Fig", nickname: "Fig", emoji: "🌳", water: 10, light: "Bright direct", lastWatered: 8, health: 72, pot: "#8b5e3c" },
  { id: 3, name: "Snake Plant", nickname: "Sassy", emoji: "🌱", water: 14, light: "Low to bright", lastWatered: 2, health: 98, pot: "#2d6a4f" },
  { id: 4, name: "Pothos", nickname: "Goldie", emoji: "🍃", water: 7, light: "Low to medium", lastWatered: 5, health: 88, pot: "#6b4423" },
  { id: 5, name: "Peace Lily", nickname: "Lily", emoji: "🤍", water: 5, light: "Low indirect", lastWatered: 4, health: 80, pot: "#3d405b" },
  { id: 6, name: "Rubber Plant", nickname: "Rudy", emoji: "🌴", water: 10, light: "Bright indirect", lastWatered: 9, health: 65, pot: "#944e2d" },
];

const tips = [
  "💧 Always check soil moisture before watering — stick your finger 2 inches in.",
  "☀️ Rotate your plants quarterly for even, balanced growth.",
  "🌫️ Mist tropical plants in the morning so leaves dry before nightfall.",
  "🪴 Repot in spring when roots start peeking out the drainage holes.",
  "🧼 Wipe dusty leaves with a damp cloth to boost photosynthesis.",
];

const symptoms = {
  "yellow leaves": "Likely overwatering or nutrient deficiency. Let soil dry out more between waterings and consider fertilizing.",
  "brown tips": "Low humidity or fluoride in tap water. Try filtered water and mist regularly.",
  "drooping": "Could be underwatering or root rot. Check soil — if dry, water deeply; if soggy, repot.",
  "leggy growth": "Your plant is reaching for light! Move it closer to a bright window.",
  "no growth": "Dormancy or low light. Ensure adequate light and try a balanced fertilizer in spring.",
};

export default function PlantParent() {
  const [tab, setTab] = useState("garden");
  const [selected, setSelected] = useState(null);
  const [symptom, setSymptom] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [tipIdx, setTipIdx] = useState(0);
  const [addMode, setAddMode] = useState(false);
  const [newPlant, setNewPlant] = useState({ name: "", nickname: "", emoji: "🌿" });
  const [collection, setCollection] = useState(plants);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const getDaysUntilWater = (plant) => plant.water - plant.lastWatered;
  const getUrgency = (plant) => {
    const d = getDaysUntilWater(plant);
    if (d <= 0) return "urgent";
    if (d <= 2) return "soon";
    return "ok";
  };

  const urgencyColor = { urgent: "#e07a5f", soon: "#f2cc8f", ok: "#81b29a" };
  const urgencyLabel = { urgent: "Water now!", soon: "Soon", ok: "Good" };

  const handleDiagnose = () => {
    const key = Object.keys(symptoms).find(k => symptom.toLowerCase().includes(k));
    setDiagnosis(key ? symptoms[key] : "Hmm, try describing symptoms like 'yellow leaves', 'brown tips', 'drooping', 'leggy growth', or 'no growth'.");
  };

  const handleAddPlant = () => {
    if (!newPlant.name) return;
    const added = { ...newPlant, id: Date.now(), water: 7, light: "Bright indirect", lastWatered: 0, health: 100, pot: "#4a7c59" };
    setCollection(c => [...c, added]);
    setNewPlant({ name: "", nickname: "", emoji: "🌿" });
    setAddMode(false);
    showNotif(`🌱 ${added.nickname || added.name} added to your garden!`);
  };

  const waterPlant = (id) => {
    setCollection(c => c.map(p => p.id === id ? { ...p, lastWatered: 0, health: Math.min(100, p.health + 5) } : p));
    showNotif("💧 Plant watered! Great job keeping it hydrated.");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f1f0f 0%, #1a2e1a 40%, #0d1a0d 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8f0e8",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {["10%,15%", "85%,25%", "5%,70%", "90%,80%", "50%,90%", "60%,10%"].map((pos, i) => (
          <div key={i} style={{
            position: "absolute",
            left: pos.split(",")[0], top: pos.split(",")[1],
            width: `${120 + i * 30}px`, height: `${120 + i * 30}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(74,124,89,${0.06 + i * 0.01}) 0%, transparent 70%)`,
            transform: "translate(-50%,-50%)",
          }} />
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: "#2d6a4f", color: "#d8f3dc", padding: "12px 28px",
          borderRadius: 40, fontSize: 14, fontWeight: 600, zIndex: 1000,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.3s ease",
        }}>{notification}</div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes sway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
        .plant-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important; }
        .plant-card { transition: all 0.3s cubic-bezier(.4,0,.2,1); }
        .tab-btn:hover { background: rgba(74,124,89,0.25) !important; }
        .water-btn:hover { background: #2d6a4f !important; transform: scale(1.05); }
        .water-btn { transition: all 0.2s; }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: #4a7c59 !important; }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "48px 0 32px" }}>
          <div style={{ fontSize: 52, marginBottom: 8, animation: "sway 4s ease-in-out infinite" }}>🌿</div>
          <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-1px", margin: 0, color: "#a8d5b5" }}>
            Plant<span style={{ color: "#4a7c59" }}>Parent</span>
          </h1>
          <p style={{ color: "#6b9f7e", fontSize: 15, marginTop: 8, fontStyle: "italic" }}>
            Your personal botanical companion
          </p>

          {/* Tip ticker */}
          <div style={{
            background: "rgba(74,124,89,0.15)", border: "1px solid rgba(74,124,89,0.3)",
            borderRadius: 40, padding: "10px 24px", marginTop: 20, display: "inline-block",
            fontSize: 13, color: "#a8d5b5", maxWidth: 480,
          }}>
            {tips[tipIdx]}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {[
            { id: "garden", label: "🌱 My Garden" },
            { id: "schedule", label: "📅 Schedule" },
            { id: "health", label: "🩺 Health Check" },
          ].map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
              padding: "10px 22px", borderRadius: 40, border: "1px solid rgba(74,124,89,0.4)",
              background: tab === t.id ? "rgba(74,124,89,0.4)" : "rgba(74,124,89,0.1)",
              color: tab === t.id ? "#d8f3dc" : "#6b9f7e", cursor: "pointer",
              fontSize: 14, fontFamily: "inherit", fontWeight: tab === t.id ? 600 : 400,
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* GARDEN TAB */}
        {tab === "garden" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: "#a8d5b5" }}>My Collection ({collection.length})</h2>
              <button onClick={() => setAddMode(!addMode)} style={{
                padding: "10px 20px", borderRadius: 40, border: "1px solid #4a7c59",
                background: addMode ? "#4a7c59" : "transparent", color: "#d8f3dc",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit",
              }}>{addMode ? "✕ Cancel" : "+ Add Plant"}</button>
            </div>

            {addMode && (
              <div style={{
                background: "rgba(74,124,89,0.1)", border: "1px solid rgba(74,124,89,0.3)",
                borderRadius: 16, padding: 24, marginBottom: 24,
              }}>
                <h3 style={{ margin: "0 0 16px", color: "#a8d5b5", fontSize: 16 }}>Add a new plant</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {["🌿","🌱","🌳","🍃","🌴","🌺","🌸","🪴","🎋","🌾"].map(e => (
                    <button key={e} onClick={() => setNewPlant(p => ({ ...p, emoji: e }))} style={{
                      fontSize: 24, background: newPlant.emoji === e ? "rgba(74,124,89,0.4)" : "transparent",
                      border: "1px solid rgba(74,124,89,0.3)", borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                    }}>{e}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <input value={newPlant.name} onChange={e => setNewPlant(p => ({ ...p, name: e.target.value }))}
                    placeholder="Plant species..." style={{
                      flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(74,124,89,0.3)",
                      background: "rgba(0,0,0,0.3)", color: "#e8f0e8", fontSize: 14, fontFamily: "inherit",
                    }} />
                  <input value={newPlant.nickname} onChange={e => setNewPlant(p => ({ ...p, nickname: e.target.value }))}
                    placeholder="Nickname..." style={{
                      flex: 1, padding: "10px 16px", borderRadius: 10, border: "1px solid rgba(74,124,89,0.3)",
                      background: "rgba(0,0,0,0.3)", color: "#e8f0e8", fontSize: 14, fontFamily: "inherit",
                    }} />
                  <button onClick={handleAddPlant} style={{
                    padding: "10px 20px", borderRadius: 10, border: "none",
                    background: "#4a7c59", color: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                  }}>Add 🌱</button>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {collection.map(plant => {
                const urgency = getUrgency(plant);
                return (
                  <div key={plant.id} className="plant-card" onClick={() => setSelected(selected?.id === plant.id ? null : plant)}
                    style={{
                      background: "rgba(15,31,15,0.8)", border: `1px solid ${selected?.id === plant.id ? "#4a7c59" : "rgba(74,124,89,0.2)"}`,
                      borderRadius: 20, padding: 20, cursor: "pointer",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 44 }}>{plant.emoji}</div>
                      <div style={{
                        background: urgencyColor[urgency] + "33", color: urgencyColor[urgency],
                        border: `1px solid ${urgencyColor[urgency]}55`,
                        padding: "4px 12px", borderRadius: 40, fontSize: 12, fontWeight: 600,
                        animation: urgency === "urgent" ? "pulse 1.5s infinite" : "none",
                      }}>{urgencyLabel[urgency]}</div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: "#d8f3dc" }}>{plant.nickname || plant.name}</div>
                      <div style={{ color: "#6b9f7e", fontSize: 13, fontStyle: "italic", marginTop: 2 }}>{plant.name}</div>
                    </div>

                    {/* Health bar */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6b9f7e", marginBottom: 6 }}>
                        <span>Health</span><span>{plant.health}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 10 }}>
                        <div style={{
                          height: "100%", width: `${plant.health}%`, borderRadius: 10,
                          background: plant.health > 80 ? "#4a7c59" : plant.health > 60 ? "#f2cc8f" : "#e07a5f",
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>

                    {selected?.id === plant.id && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(74,124,89,0.2)" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                          <div style={{ color: "#6b9f7e" }}>☀️ Light</div>
                          <div style={{ color: "#d8f3dc" }}>{plant.light}</div>
                          <div style={{ color: "#6b9f7e" }}>💧 Every</div>
                          <div style={{ color: "#d8f3dc" }}>{plant.water} days</div>
                          <div style={{ color: "#6b9f7e" }}>⏱ Last watered</div>
                          <div style={{ color: "#d8f3dc" }}>{plant.lastWatered === 0 ? "Today" : `${plant.lastWatered}d ago`}</div>
                        </div>
                        <button className="water-btn" onClick={(e) => { e.stopPropagation(); waterPlant(plant.id); }} style={{
                          marginTop: 14, width: "100%", padding: "10px", borderRadius: 10,
                          border: "none", background: "#2d6a4f", color: "#d8f3dc",
                          cursor: "pointer", fontSize: 14, fontFamily: "inherit", fontWeight: 600,
                        }}>💧 Water Now</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div>
            <h2 style={{ margin: "0 0 20px", fontSize: 20, color: "#a8d5b5" }}>Watering Schedule</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...collection].sort((a, b) => getDaysUntilWater(a) - getDaysUntilWater(b)).map(plant => {
                const days = getDaysUntilWater(plant);
                const urgency = getUrgency(plant);
                return (
                  <div key={plant.id} style={{
                    background: "rgba(15,31,15,0.8)", border: "1px solid rgba(74,124,89,0.2)",
                    borderRadius: 16, padding: "16px 20px", display: "flex",
                    alignItems: "center", gap: 16,
                  }}>
                    <div style={{ fontSize: 32 }}>{plant.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#d8f3dc" }}>{plant.nickname || plant.name}</div>
                      <div style={{ color: "#6b9f7e", fontSize: 13 }}>{plant.name}</div>
                    </div>
                    <div style={{ textAlign: "center", minWidth: 80 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: urgencyColor[urgency] }}>
                        {days <= 0 ? "Today!" : `${days}d`}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b9f7e" }}>
                        {days <= 0 ? "Overdue" : "until water"}
                      </div>
                    </div>
                    <div style={{ width: 80, textAlign: "right" }}>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                        <div style={{
                          height: "100%", borderRadius: 10,
                          width: `${Math.max(0, Math.min(100, (plant.lastWatered / plant.water) * 100))}%`,
                          background: urgencyColor[urgency],
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#6b9f7e", marginTop: 4 }}>Cycle {plant.lastWatered}/{plant.water}d</div>
                    </div>
                    <button className="water-btn" onClick={() => waterPlant(plant.id)} style={{
                      padding: "8px 16px", borderRadius: 10, border: "none",
                      background: days <= 0 ? "#e07a5f" : "#2d6a4f",
                      color: "#fff", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                    }}>💧</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

       {/* HEALTH TAB */}
        {tab === "health" && (
          <div>
            <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#a8d5b5" }}>🩺 Plant Health Checker</h2>
            <p style={{ color: "#6b9f7e", fontSize: 14, marginBottom: 24, fontStyle: "italic" }}>
              Describe what you see and get an instant diagnosis
            </p>

            <div style={{ background: "rgba(15,31,15,0.8)", border: "1px solid rgba(74,124,89,0.2)", borderRadius: 20, padding: 24 }}>
              <textarea
                value={symptom}
                onChange={e => setSymptom(e.target.value)}
                placeholder="e.g. 'My plant has yellow leaves and is drooping...' "
                rows={4}
                style={{
                  width: "100%", padding: 16, borderRadius: 12, border: "1px solid rgba(74,124,89,0.3)",
                  background: "rgba(0,0,0,0.3)", color: "#e8f0e8", fontSize: 15,
                  fontFamily: "Georgia, serif", resize: "none", boxSizing: "border-box",
                }}
              />
              <button onClick={handleDiagnose} style={{
                marginTop: 12, padding: "12px 28px", borderRadius: 40, border: "none",
                background: "#4a7c59", color: "#fff", cursor: "pointer", fontSize: 15,
                fontFamily: "inherit", fontWeight: 600, transition: "all 0.2s",
              }}>🔍 Diagnose</button>

              {diagnosis && (
                <div style={{
                  marginTop: 20, padding: 20, borderRadius: 14,
                  background: "rgba(74,124,89,0.15)", border: "1px solid rgba(74,124,89,0.3)",
                }}>
                  <div style={{ fontWeight: 700, color: "#a8d5b5", marginBottom: 8 }}>Diagnosis:</div>
                  <div style={{ color: "#d8f3dc", lineHeight: 1.7 }}>{diagnosis}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 28 }}>
              <h3 style={{ color: "#a8d5b5", fontSize: 16, marginBottom: 14 }}>Common Issues</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {Object.entries(symptoms).map(([symptom, fix]) => (
                  <div key={symptom} onClick={() => { setSymptom(symptom); setDiagnosis(fix); }}
                    style={{
                      background: "rgba(74,124,89,0.1)", border: "1px solid rgba(74,124,89,0.25)",
                      borderRadius: 12, padding: "12px 16px", cursor: "pointer",
                      fontSize: 13, color: "#a8d5b5", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(74,124,89,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(74,124,89,0.1)"}
                  >
                    {symptom.charAt(0).toUpperCase() + symptom.slice(1)} →
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
