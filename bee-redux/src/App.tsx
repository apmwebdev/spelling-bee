import "./styles/_main.scss"
import { Puzzle } from "./features/puzzle/Puzzle"
import { Header } from "./features/header/Header"
import { Status } from "./features/status/Status"

function App() {
  return (
    <div className="App">
      <div className="sb-top-container">
        <Header />
        <div className="sb-main-container">
          <div className="sb-main">
            <Puzzle />
            <Status />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
