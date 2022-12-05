
import AudioPlayer from './components/AudioPlayer'

function App() { 
  return (
    <div className="App h-[100vh] bg-gray-900/5 flex items-center justify-center relative">
      <p className='absolute top-0 left-0 text-xs z-10'>© 2022 <a href="https://www.linkedin.com/in/mourad-yaou/" target="_blank">Yaou Mourad</a> - All Rights Reserved.</p>
      <AudioPlayer/>
    </div>
  )
}

export default App
