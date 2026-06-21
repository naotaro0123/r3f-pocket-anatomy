import { useMemo, useState } from "react";
import "./App.css";
import { AnatomyCanvas } from "./components/AnatomyCanvas";
import { MuscleNameRuby } from "./components/MuscleNameRuby";
import { type MuscleId, MUSCLES } from "./data/muscles";

function App() {
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleId | null>(null);
  const [highlightedMuscleId, setHighlightedMuscleId] = useState<MuscleId | null>(null);

  const selectedMuscle = useMemo(
    () => MUSCLES.find((muscle) => muscle.id === selectedMuscleId) ?? null,
    [selectedMuscleId],
  );

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="canvas-panel">
          <div className="panel-header">
            <div>
              <h2>ポケット解剖図鑑</h2>
            </div>
            <p className="panel-hint">
              ドラッグで回転 / ホイールでズーム / 番号ラベルをホバーでハイライト・クリックで詳細表示
            </p>
          </div>

          <AnatomyCanvas
            highlightedMuscleId={highlightedMuscleId}
            selectedMuscleId={selectedMuscleId}
            onHighlightMuscle={setHighlightedMuscleId}
            onSelectMuscle={setSelectedMuscleId}
          />
        </div>

        <aside className="info-panel">
          <section className="info-card info-card-detail">
            <p className="panel-label">筋肉を選択して下さい。</p>
            <h2>
              {selectedMuscle ? (
                <MuscleNameRuby
                  name={selectedMuscle.name}
                  reading={selectedMuscle.reading}
                  className="muscle-name-ruby muscle-name-ruby-heading"
                />
              ) : (
                "未選択"
              )}
            </h2>
            <p className="muscle-description">
              {selectedMuscle?.description ??
                "番号ラベルをクリックすると、ここに筋肉名と説明を表示します。ホバー中はモデルだけハイライトされます。"}
            </p>
          </section>

          <section className="info-card info-card-scrollable">
            <p className="panel-label">筋肉の部位</p>
            <div className="muscle-list" role="list">
              {MUSCLES.map((muscle, index) => {
                const isActive = muscle.id === selectedMuscleId;

                return (
                  <button
                    key={muscle.id}
                    type="button"
                    className={`muscle-chip${isActive ? " is-active" : ""}`}
                    onClick={() => setSelectedMuscleId(muscle.id)}
                  >
                    <span className="muscle-chip-label">
                      <span className="muscle-chip-index">{index + 1}</span>
                      <MuscleNameRuby
                        name={muscle.name}
                        reading={muscle.reading}
                        className="muscle-name-ruby muscle-name-ruby-chip"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

export default App;
