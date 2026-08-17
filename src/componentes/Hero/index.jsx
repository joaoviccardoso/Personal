import { useEffect, useRef } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import background from "/backgroud.png"

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #050505; overflow-x: hidden; }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const glitch = keyframes`
  0%, 100% { clip-path: inset(0 0 98% 0); transform: translate(-2px, 0); }
  10% { clip-path: inset(30% 0 50% 0); transform: translate(2px, 0); }
  20% { clip-path: inset(60% 0 20% 0); transform: translate(-1px, 0); }
  30% { clip-path: inset(10% 0 80% 0); transform: translate(1px, 0); }
  40%, 90% { clip-path: inset(0 0 0 0); transform: translate(0, 0); opacity: 0; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseGreen = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 100, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(0, 255, 100, 0); }
`;

const devices = {
  mobile: "(max-width: 768px)",
  tablet: "(max-width: 1024px)",
};

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;

  background-image: 
    linear-gradient(
      to right,
      rgba(0,0,0,0.9) 0%,
      rgba(0,0,0,0.7) 40%,
      rgba(0,0,0,0.4) 100%
    ),
    url(${background});

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  overflow: hidden;

  @media ${devices.mobile} {
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding-top: 60px;
  }
`;

const Scanline = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 255, 80, 0.04);
    animation: ${scanline} 6s linear infinite;
  }
`;

const GridBg = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 255, 80, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 80, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0,255,80,0.07) 0%, transparent 70%);
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 0;
  pointer-events: none;
`;

const CanvasContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 55%;
  height: 100%;
  z-index: 2;
  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  @media ${devices.mobile} {
    position: relative;
    width: 120%;
    height: 400px;

    /* joga ele um pouco pra cima do texto */
    margin-bottom: -180px;
    z-index: 5;
  }
`;

const DragZone = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-20%, -50%);
  width: 340px;
  height: 240px;
  z-index: 3;
  pointer-events: auto;
  cursor: grab;
  border-radius: 50%;
  &:active { cursor: grabbing; }
`;

const LoadingText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(0, 255, 100, 0.5);
  z-index: 5;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 10;
  padding: 0 5vw;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  @media ${devices.mobile} {
    align-items: center;
    text-align: center;
  }
`;

const EyebrowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 0.2s;
`;

const Dot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff64;
  animation: ${pulseGreen} 2s ease infinite;
`;

const Eyebrow = styled.span`
  font-family: 'Barlow', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #00ff64;
`;

const TitleWrap = styled.div`
  position: relative;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 0.45s;
`;

const Title = styled.h1`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(38px, 7vw, 90px);
  line-height: 0.9;
  color: #f0f0f0;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 1;

  span.green {
    color: #00ff64;
    display: block;
  }

  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: #00ff64;
    opacity: 0.6;
    animation: ${glitch} 5s steps(1) infinite;
    z-index: -1;
  }

  @media ${devices.mobile} {
    line-height: 45px;
  }
`;

const Divider = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #00ff64, transparent);
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 0.65s;
`;

const Subtitle = styled.p`
  font-family: 'Barlow', sans-serif;
  font-size: 17px;
  font-weight: 300;
  color: rgba(200, 200, 200, 0.75);
  line-height: 1.7;
  max-width: 420px;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 0.85s;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 1.05s;
`;

const BtnPrimary = styled.button`
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 16px 36px;
  background: #00ff64;
  color: #050505;
  border: none;
  cursor: pointer;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #fff;
    transform: translateY(-2px);
  }
`;

const BtnSecondary = styled.button`
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 15px 36px;
  background: transparent;
  color: #00ff64;
  border: 1px solid rgba(0, 255, 100, 0.4);
  cursor: pointer;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  &:hover {
    background: rgba(0,255,100,0.07);
    border-color: #00ff64;
    transform: translateY(-2px);
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 36px;
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards 1.25s;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatNumber = styled.span`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 34px;
  color: #fff;
  line-height: 1;
`;

const StatLabel = styled.span`
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(0, 255, 100, 0.6);
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(0,255,100,0.15);
  align-self: center;
`;

export default function Hero() {
  const canvasRef = useRef(null);
  const loadingRef = useRef(null);
   const dragZoneRef = useRef(null);
  const rendererRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 1.2, 7);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(4, 6, 5);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x00ff64, 1.0);
    fill.position.set(-5, 2, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 1.2);
    rim.position.set(0, -3, -5);
    scene.add(rim);

    const greenPoint = new THREE.PointLight(0x00ff64, 2, 8);
    greenPoint.position.set(0, 0, 3);
    scene.add(greenPoint);

    // Loader GLB
    const loader = new GLTFLoader();
    loader.load(
      "/dumbbell.glb",
      (gltf) => {
        // Remove loading text
        if (loadingRef.current) loadingRef.current.style.display = "none";

        const model = gltf.scene;

        // Centraliza o modelo automaticamente
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim;

        model.position.sub(center);
        model.scale.setScalar(scale * 0);

        scene.add(model);

        // Animação de entrada
        gsap.to(model.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 1.4,
          ease: "back.out(1.6)",
          delay: 0.3,
        });

        gsap.fromTo(
          model.rotation,
          { y: -1.2 },
          {
            y: 0.3,
            duration: 1.6,
            ease: "power3.out",
            delay: 0.3,
          }
        );

        // Float contínuo
        gsap.to(model.position, {
          y: 0.2,
          duration: 2.8,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });

        // Registra modelo para drag
        setModel(model);

        // Rotação lenta contínua (pausada/retomada no drag)
        const spin = gsap.to(model.rotation, {
          y: model.rotation.y + Math.PI * 2,
          duration: 20,
          ease: "none",
          repeat: -1,
          delay: 1.8,
        });
        setSpinTween(spin);

        // Pulso da luz verde
        gsap.to(greenPoint, {
          intensity: 4,
          duration: 1.4,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      },
      (xhr) => {
        // Progresso do carregamento
        if (loadingRef.current) {
          const pct = Math.round((xhr.loaded / xhr.total) * 100);
          loadingRef.current.textContent = `Carregando... ${pct}%`;
        }
      },
      (error) => {
        console.error("Erro ao carregar dumbbell.glb:", error);
        if (loadingRef.current) {
          loadingRef.current.textContent = "Erro ao carregar modelo";
        }
      }
    );

    // --- Drag / parallax ---
    let mx = 0, my = 0;
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let modelRef = null;
    let spinTween = null;
    let velX = 0, velY = 0;

    const setModel = (m) => { modelRef = m; };
    const setSpinTween = (t) => { spinTween = t; };

    const getXY = (e) => {
      if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };

    const onPointerDown = (e) => {
      if (!modelRef) return;
      isDragging = true;
      const { x, y } = getXY(e);
      prevX = x; prevY = y;
      velX = 0; velY = 0;
      if (spinTween) { spinTween.kill(); spinTween = null; }
      dragZoneRef.current.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      const { x, y } = getXY(e);
      mx = (x / window.innerWidth - 0.5) * 2;
      my = -(y / window.innerHeight - 0.5) * 2;
      if (!isDragging || !modelRef) return;
      const dx = x - prevX;
      const dy = y - prevY;
      modelRef.rotation.y += dx * 0.012;
      modelRef.rotation.x += dy * 0.012;
      velX = dx * 0.012;
      velY = dy * 0.012;
      prevX = x; prevY = y;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      dragZoneRef.current.style.cursor = "grab";
      const inertia = () => {
        if (Math.abs(velX) < 0.0005 && Math.abs(velY) < 0.0005) {
          // Cria novo spin a partir da posição atual — sem salto
          if (modelRef) {
            if (spinTween) spinTween.kill();
            const newSpin = gsap.to(modelRef.rotation, {
              y: modelRef.rotation.y + Math.PI * 2,
              duration: 20,
              ease: "none",
              repeat: -1,
            });
            setSpinTween(newSpin);
          }
          return;
        }
        if (modelRef) {
          modelRef.rotation.y += velX;
          modelRef.rotation.x += velY;
        }
        velX *= 0.92;
        velY *= 0.92;
        requestAnimationFrame(inertia);
      };
      inertia();
    };

    const dragZone = dragZoneRef.current;
    dragZone.addEventListener("mousedown", onPointerDown);
    dragZone.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);

    // Render loop
    const tick = () => {
      animRef.current = requestAnimationFrame(tick);
      if (!isDragging) {
        camera.position.x += (mx * 0.6 - camera.position.x) * 0.04;
        camera.position.y += (my * 0.4 + 1.2 - camera.position.y) * 0.04;
      }
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const onResize = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      dragZone.removeEventListener("mousedown", onPointerDown);
      dragZone.removeEventListener("touchstart", onPointerDown);
      canvas.removeEventListener("mousedown", onPointerDown);
      canvas.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <GridBg />
        <GlowOrb />
        <Scanline />

        <CanvasContainer>
          <canvas ref={canvasRef} />
          <LoadingText ref={loadingRef}>Carregando modelo...</LoadingText>
          <DragZone ref={dragZoneRef} />
        </CanvasContainer>

        <Content>
          <EyebrowRow>
            <Dot />
            <Eyebrow>Elite Performance Studio</Eyebrow>
          </EyebrowRow>

          <TitleWrap>
            <Title data-text="FORGE">
              Transforme seu corpo e alcance sua
              <span className="green">melhor versão</span>
            </Title>
          </TitleWrap>

          <Divider />

          <Subtitle>
            Treinamento de alta performance para quem recusa a mediocridade.
            Equipamentos profissionais, metodologia de resultados.
          </Subtitle>

          <ButtonRow>
            <BtnPrimary>Começar agora</BtnPrimary>
            <BtnSecondary>Ver planos</BtnSecondary>
          </ButtonRow>

          <StatsRow>
            <Stat>
              <StatNumber>12K+</StatNumber>
              <StatLabel>Atletas</StatLabel>
            </Stat>
            <StatDivider />
            <Stat>
              <StatNumber>98%</StatNumber>
              <StatLabel>Resultado</StatLabel>
            </Stat>
            <StatDivider />
            <Stat>
              <StatNumber>8 Anos</StatNumber>
              <StatLabel>Experiência</StatLabel>
            </Stat>
          </StatsRow>
        </Content>
      </Wrapper>
    </>
  );
}