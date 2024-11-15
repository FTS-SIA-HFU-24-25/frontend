import './global.css'

const nav = document.querySelector('nav');
if (nav) {
	nav.innerHTML = `
      <ul class="max-w-full p-2 px-6 flex justify-between items-center">
        <li class="w-1/2 font-bold flex justify-start items-center text-white">
          <img
            src="/public/fts-40px.png"
            alt="Fitness Tracker"
            class="rounded-sm max-w-[40px] max-h-[30px] bg-white mr-2"
          />
          <a href="/">HFU SIA-Projekt</a>
        </li>
        <li><a href="/ekg-sensor">EKG</a></li>
        <li><a href="/temp">Körpertemperatur</a></li>
        <li><a href="/gps">GPS</a></li>
      </ul>
	`
}
