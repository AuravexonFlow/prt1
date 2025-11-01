import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function NeonBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "#0a0a0f" }, // deep night
        fpsLimit: 60,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          color: { value: ["#00ffff", "#ff00ff", "#39ff14", "#ff073a"] },
          links: { enable: true, color: "#00ffff", distance: 150, opacity: 0.3, width: 1 },
          move: { enable: true, speed: 1, outModes: { default: "bounce" } },
          size: { value: { min: 1, max: 3 } },
          opacity: { value: 0.8 },
          shadow: { enable: true, color: "#00ffff", blur: 10 },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            grab: { distance: 200, links: { opacity: 0.6 } },
            push: { quantity: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}

