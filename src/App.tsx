import { useMemo, useState } from 'react'
import './App.css'
import { AnatomyCanvas } from './components/AnatomyCanvas'
import { type MuscleId, MUSCLES } from './data/muscles'

function App() {
  const [selectedMuscleId, setSelectedMuscleId] = useState<MuscleId | null>(null)

  const selectedMuscle = useMemo(
    () => MUSCLES.find((muscle) => muscle.id === selectedMuscleId) ?? null,
    [selectedMuscleId],
  )

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="canvas-panel">
          <div className="panel-header">
            <div>
              <p className="panel-label">Viewer</p>
              <h2>Anterior anatomy model</h2>
            </div>
            <p className="panel-hint">ドラッグで回転 / ホイールでズーム / 番号ラベルをクリック</p>
          </div>

          <AnatomyCanvas
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={setSelectedMuscleId}
          />
        </div>

        <aside className="info-panel">
          <section className="info-card">
            <p className="panel-label">Selected muscle</p>
            <h2>{selectedMuscle?.name ?? '未選択'}</h2>
            <p className="latin-name">{selectedMuscle?.latinName ?? 'No muscle selected'}</p>
            <p className="muscle-description">
              {selectedMuscle?.description ??
                '番号ラベルをクリックすると、ここに筋肉名と説明を表示します。'}
            </p>
          </section>

          <section className="info-card">
            <p className="panel-label">Muscle regions</p>
            <div className="muscle-list" role="list">
              {MUSCLES.map((muscle) => {
                const isActive = muscle.id === selectedMuscleId

                return (
                  <button
                    key={muscle.id}
                    type="button"
                    className={`muscle-chip${isActive ? ' is-active' : ''}`}
                    onClick={() => setSelectedMuscleId(muscle.id)}
                  >
                    <span>{muscle.name}</span>
                    <small>{muscle.shortLabel}</small>
                  </button>
                )
              })}
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
