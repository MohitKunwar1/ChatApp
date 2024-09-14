import { ModalProvider } from "./ContextProvider/ModalContext";
import Card from "./Pages/Card";

function App() {
  return <>
      <main className='font-rubrick w-full h-screen  flex items-center justify-center '>
        <ModalProvider>
        <Card />
        </ModalProvider>
  </main>
  </>;
}

export default App;
