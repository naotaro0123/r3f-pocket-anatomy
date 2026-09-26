import { useMemo, useState } from "react";
import "./App.css";
import { AnatomyCanvas } from "./components/AnatomyCanvas";
import { MuscleNameRuby } from "./components/MuscleNameRuby";
import { type MuscleId, MUSCLES } from "./data/muscles";

const App = () => {
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleId | null>(null);
  const [highlightedMuscleId, setHighlightedMuscleId] = useState<MuscleId | null>(null);

  const displayedMuscle = useMemo(
    () => MUSCLES.find((muscle) => muscle.id === (highlightedMuscleId ?? selectedMuscleId)) ?? null,
    [highlightedMuscleId, selectedMuscleId],
  );

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="canvas-panel">
          <div className="panel-header">
            <div>
              <h2>ポケット筋肉図鑑</h2>
            </div>
            <p className="panel-hint">
              左ドラッグで回転 / 右ドラッグで移動 / ホイールでズーム /
              番号ラベルをホバーでハイライト・クリックで詳細表示
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
              {displayedMuscle ? (
                <MuscleNameRuby
                  name={displayedMuscle.name}
                  reading={displayedMuscle.reading}
                  className="muscle-name-ruby muscle-name-ruby-heading"
                />
              ) : (
                "未選択"
              )}
            </h2>
            <p className="muscle-description">
              {displayedMuscle?.description ??
                "番号ラベルをクリックすると、ここに筋肉名と説明を表示します。筋肉や一覧のホバー中は対応する部位がハイライトされます。"}
            </p>
          </section>

          <section className="info-card info-card-scrollable">
            <p className="panel-label">筋肉の部位</p>
            <div className="muscle-list" role="list">
              {MUSCLES.map((muscle, index) => {
                const isActive = muscle.id === selectedMuscleId;
                const isHighlighted = muscle.id === highlightedMuscleId;

                return (
                  <button
                    key={muscle.id}
                    type="button"
                    className={`muscle-chip${isActive ? " is-active" : ""}${isHighlighted ? " is-highlighted" : ""}`}
                    onPointerEnter={() => setHighlightedMuscleId(muscle.id)}
                    onPointerLeave={() => setHighlightedMuscleId(null)}
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
};

export default App;
