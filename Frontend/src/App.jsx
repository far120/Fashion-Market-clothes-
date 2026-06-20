import AppComponant from "./app/App"
import Providers from "./app/providers";
function App() {
  return (
    <>
      <Providers>
        <AppComponant />
      </Providers>
    </>
  )
}

export default App
