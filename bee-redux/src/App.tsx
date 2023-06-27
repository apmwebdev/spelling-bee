import "./App.css"
import { Puzzle } from "./features/puzzle/Puzzle"
import { Header } from "./features/header/Header"

function App() {
  return (
    <div className="App">
      <div className="sb-top-container">
        <Header />
        <div className="sb-main-container">
          <div className="sb-main">
            <div className="sb-controls-container">
              <div className="sb-controls">
                <Puzzle />
              </div>
            </div>
            <div className="sb-status">status</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
