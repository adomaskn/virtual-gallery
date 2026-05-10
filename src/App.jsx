import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Text, useTexture } from "@react-three/drei";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { DoubleSide, Raycaster, Vector2, Vector3 } from "three";
import { galleryContent, homeContent } from "./contentConfig";

const ROOM_HALF_WIDTH = 2.5;
const ROOM_HALF_LENGTH = 5;
const ROOM_HALF_HEIGHT = 1;
const PLAYER_START = [0, 0.2, 0];
const GITHUB_URL = galleryContent.githubUrl;
const APP_MODE = (import.meta.env.VITE_APP_MODE ?? "full").toLowerCase();
const PROFILE_APP_URL = homeContent.profileAppUrl;
const ROOM_APP_URL = homeContent.roomAppUrl;

function navigateTo(url, fallback) {
  if (url && typeof url === "string") {
    window.location.href = url;
    return;
  }
  fallback?.();
}

function FloorPhysics() {
  usePlane(() => ({
    type: "Static",
    position: [0, -ROOM_HALF_HEIGHT, 0],
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return null;
}

function WallPhysics() {
  useBox(() => ({
    type: "Static",
    position: [0, 0, -ROOM_HALF_LENGTH],
    args: [ROOM_HALF_WIDTH * 2, ROOM_HALF_HEIGHT * 2, 0.2],
  }));
  useBox(() => ({
    type: "Static",
    position: [0, 0, ROOM_HALF_LENGTH],
    rotation: [0, Math.PI, 0],
    args: [ROOM_HALF_WIDTH * 2, ROOM_HALF_HEIGHT * 2, 0.2],
  }));
  useBox(() => ({
    type: "Static",
    position: [-ROOM_HALF_WIDTH, 0, 0],
    rotation: [0, Math.PI / 2, 0],
    args: [ROOM_HALF_LENGTH * 2, ROOM_HALF_HEIGHT * 2, 0.2],
  }));
  useBox(() => ({
    type: "Static",
    position: [ROOM_HALF_WIDTH, 0, 0],
    rotation: [0, -Math.PI / 2, 0],
    args: [ROOM_HALF_LENGTH * 2, ROOM_HALF_HEIGHT * 2, 0.2],
  }));
  return null;
}

function Room({ pictureRefs, doorRef }) {
  const pictures = useTexture(galleryContent.pictures.map((p) => p.image));

  return (
    <group>
      <mesh position={[0, 0, -ROOM_HALF_LENGTH]}>
        <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_HALF_HEIGHT * 2]} />
        <meshBasicMaterial color="#fff7d6" side={DoubleSide} />
      </mesh>

      <mesh position={[0, 0, ROOM_HALF_LENGTH]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_HALF_HEIGHT * 2]} />
        <meshBasicMaterial color="#fff7d6" side={DoubleSide} />
      </mesh>

      <mesh position={[-ROOM_HALF_WIDTH, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_HALF_LENGTH * 2, ROOM_HALF_HEIGHT * 2]} />
        <meshBasicMaterial color="#fff4cc" side={DoubleSide} />
      </mesh>

      <mesh position={[ROOM_HALF_WIDTH, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_HALF_LENGTH * 2, ROOM_HALF_HEIGHT * 2]} />
        <meshBasicMaterial color="#fff1bf" side={DoubleSide} />
      </mesh>

      <mesh position={[0, -ROOM_HALF_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_HALF_LENGTH * 2]} />
        <meshBasicMaterial color="#94a3b8" side={DoubleSide} />
      </mesh>

      <mesh position={[0, ROOM_HALF_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_HALF_WIDTH * 2, ROOM_HALF_LENGTH * 2]} />
        <meshBasicMaterial color="#e2e8f0" side={DoubleSide} />
      </mesh>

      <GalleryPicture
        pictureRef={pictureRefs[0]}
        texture={pictures[0]}
        position={[-ROOM_HALF_WIDTH + 0.11, 0, -2.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <GalleryPicture
        pictureRef={pictureRefs[1]}
        texture={pictures[1]}
        position={[-ROOM_HALF_WIDTH + 0.11, 0, 2.5]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <GalleryPicture
        pictureRef={pictureRefs[2]}
        texture={pictures[2]}
        position={[ROOM_HALF_WIDTH - 0.11, 0, -2.5]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <GalleryPicture
        pictureRef={pictureRefs[3]}
        texture={pictures[3]}
        position={[ROOM_HALF_WIDTH - 0.11, 0, 2.5]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      <TextPoster text={galleryContent.wallTitle} position={[0, 0.15, -ROOM_HALF_LENGTH + 0.11]} />

      <Door ref={doorRef} position={[0, -0.25, ROOM_HALF_LENGTH - 0.11]} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

function GalleryPicture({ pictureRef, texture, position, rotation }) {
  return (
    <mesh ref={pictureRef} position={position} rotation={rotation}>
      <planeGeometry args={[1.1, 1]} />
      <meshBasicMaterial map={texture} side={DoubleSide} />
    </mesh>
  );
}

const Door = React.forwardRef(function Door(props, ref) {
  return (
    <group position={props.position} rotation={props.rotation}>
      <mesh ref={ref}>
        <planeGeometry args={[1.2, 1.5]} />
        <meshBasicMaterial color="#9a6a3b" side={DoubleSide} />
      </mesh>
      <mesh position={[0.45, 0, 0.01]}>
        <circleGeometry args={[0.04, 20]} />
        <meshBasicMaterial color="#f8e39f" side={DoubleSide} />
      </mesh>
    </group>
  );
});

function TextPoster({ text, position }) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[3.8, 1]} />
        <meshBasicMaterial color="#fffef7" side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3.5, 0.65]} />
        <meshBasicMaterial color="#fef3c7" side={DoubleSide} />
      </mesh>
      <Text position={[0, 0, 0.03]} fontSize={0.32} color="#111827" anchorX="center" anchorY="middle">
        {text}
      </Text>
    </group>
  );
}

function PlayerCamera({ onKeysChange, playerPosRef, viewMode }) {
  const { camera } = useThree();
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  const velocityRef = useRef([0, 0, 0]);
  const positionRef = useRef([...PLAYER_START]);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: PLAYER_START,
    args: [0.35],
    linearDamping: 0.95,
    angularDamping: 1,
    fixedRotation: true,
  }));

  useEffect(() => api.velocity.subscribe((v) => (velocityRef.current = v)), [api.velocity]);
  useEffect(() => api.position.subscribe((p) => (positionRef.current = p)), [api.position]);

  useEffect(() => {
    const syncKeys = () => onKeysChange({ ...keys.current });

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const mapped = key === " " ? "space" : key;
      if (mapped in keys.current) {
        keys.current[mapped] = true;
        syncKeys();
      }
    };

    const onKeyUp = (event) => {
      const key = event.key.toLowerCase();
      const mapped = key === " " ? "space" : key;
      if (mapped in keys.current) {
        keys.current[mapped] = false;
        syncKeys();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeysChange]);

  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());
  const move = useRef(new Vector3());
  const cameraOffset = useRef(new Vector3(0, 1.15, 2.2));
  const rotatedOffset = useRef(new Vector3());

  useFrame(() => {
    if (viewMode === "first") {
      const camX = positionRef.current[0];
      const camY = positionRef.current[1] + 0.35;
      const camZ = positionRef.current[2];
      camera.position.set(camX, camY, camZ);
    } else {
      rotatedOffset.current.copy(cameraOffset.current).applyQuaternion(camera.quaternion);
      const desiredX = positionRef.current[0] + rotatedOffset.current.x;
      const desiredY = positionRef.current[1] + rotatedOffset.current.y;
      const desiredZ = positionRef.current[2] + rotatedOffset.current.z;

      const camMargin = 0.2;
      const minX = -ROOM_HALF_WIDTH + camMargin;
      const maxX = ROOM_HALF_WIDTH - camMargin;
      const minZ = -ROOM_HALF_LENGTH + camMargin;
      const maxZ = ROOM_HALF_LENGTH - camMargin;
      const minY = -ROOM_HALF_HEIGHT + camMargin;
      const maxY = ROOM_HALF_HEIGHT - camMargin;

      camera.position.set(
        Math.max(minX, Math.min(maxX, desiredX)),
        Math.max(minY, Math.min(maxY, desiredY)),
        Math.max(minZ, Math.min(maxZ, desiredZ))
      );
    }
    playerPosRef.current = [...positionRef.current];

    move.current.set(0, 0, 0);
    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.set(-forward.current.z, 0, forward.current.x).normalize();

    if (keys.current.w) move.current.add(forward.current);
    if (keys.current.s) move.current.sub(forward.current);
    if (keys.current.a) move.current.sub(right.current);
    if (keys.current.d) move.current.add(right.current);

    const canJump = Math.abs(velocityRef.current[1]) < 0.05;
    const jumpVelocity = keys.current.space && canJump ? 5.5 : velocityRef.current[1];

    if (move.current.lengthSq() > 0) {
      move.current.normalize().multiplyScalar(8);
      api.velocity.set(move.current.x, jumpVelocity, move.current.z);
    } else {
      api.velocity.set(0, jumpVelocity, 0);
    }
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -0.38, 0]}>
        <capsuleGeometry args={[0.22, 0.65, 8, 16]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#f1c27d" />
      </mesh>
    </group>
  );
}

function InteractionDetector({ interactables, playerPosRef, onInteractableChange }) {
  const { camera } = useThree();
  const raycasterRef = useRef(new Raycaster());
  const centerRef = useRef(new Vector2(0, 0));
  const tempPos = useRef(new Vector3());

  useFrame(() => {
    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(centerRef.current, camera);

    const activeTargets = interactables.filter((x) => x.ref.current);
    if (activeTargets.length === 0) {
      onInteractableChange(null);
      return;
    }

    const objects = activeTargets.map((x) => x.ref.current);
    const intersections = raycaster.intersectObjects(objects, true);
    if (intersections.length === 0) {
      onInteractableChange(null);
      return;
    }

    const hit = intersections[0].object;
    const target = activeTargets.find((x) => x.ref.current === hit);
    if (!target) {
      onInteractableChange(null);
      return;
    }

    const targetPos = target.ref.current.getWorldPosition(tempPos.current);
    const dx = playerPosRef.current[0] - targetPos.x;
    const dy = playerPosRef.current[1] - targetPos.y;
    const dz = playerPosRef.current[2] - targetPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    onInteractableChange(distance <= target.distance ? target : null);
  });

  return null;
}

function GalleryPage({ onBackHome }) {
  const controlsRef = useRef(null);
  const [locked, setLocked] = useState(false);
  const [pressed, setPressed] = useState({ w: false, a: false, s: false, d: false, space: false });
  const [activeInteractable, setActiveInteractable] = useState(null);
  const [viewMode, setViewMode] = useState("first");

  const playerPosRef = useRef([...PLAYER_START]);
  const pictureRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const doorRef = useRef(null);

  const interactables = useMemo(
    () => [
      { ref: pictureRefs[0], label: galleryContent.pictures[0].prompt, url: galleryContent.pictures[0].link, distance: 2.2, sameTab: false },
      { ref: pictureRefs[1], label: galleryContent.pictures[1].prompt, url: galleryContent.pictures[1].link, distance: 2.2, sameTab: false },
      { ref: pictureRefs[2], label: galleryContent.pictures[2].prompt, url: galleryContent.pictures[2].link, distance: 2.2, sameTab: false },
      { ref: pictureRefs[3], label: galleryContent.pictures[3].prompt, url: galleryContent.pictures[3].link, distance: 2.2, sameTab: false },
      { ref: doorRef, label: "Press E to Go Home", url: PROFILE_APP_URL, distance: 2.8, sameTab: true },
    ],
    []
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === "e" && activeInteractable?.url) {
        if (activeInteractable.sameTab) {
          navigateTo(activeInteractable.url, onBackHome);
        } else {
          window.open(activeInteractable.url, "_blank", "noopener,noreferrer");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeInteractable, onBackHome]);

  return (
    <>
      <div style={badgeStyle(12, 12)}>E-Galerija</div>
      <button
        type="button"
        onClick={() => {
          if (!controlsRef.current) return;
          if (locked) controlsRef.current.unlock();
          else controlsRef.current.lock();
        }}
        style={lockBtnStyle}
      >
        {locked ? "Unlock Pointer" : "Lock Pointer"}
      </button>
      <button
        type="button"
        onClick={() => setViewMode((m) => (m === "first" ? "third" : "first"))}
        style={modeBtnStyle}
      >
        {viewMode === "first" ? "Switch to Third Person" : "Switch to First Person"}
      </button>

      <Canvas
        camera={{ position: [0, 0, 0], fov: 90, near: 0.1, far: 100 }}
        style={{ width: "100vw", height: "100vh", background: "#0f172a" }}
        gl={{ antialias: false, alpha: false }}
        onCreated={({ camera }) => camera.lookAt(0, 0, -ROOM_HALF_LENGTH)}
      >
        <Physics gravity={[0, -9.81, 0]}>
          <FloorPhysics />
          <WallPhysics />
          <Room pictureRefs={pictureRefs} doorRef={doorRef} />
          <PlayerCamera onKeysChange={setPressed} playerPosRef={playerPosRef} viewMode={viewMode} />
          <InteractionDetector
            interactables={interactables}
            playerPosRef={playerPosRef}
            onInteractableChange={setActiveInteractable}
          />
          <PointerLockControls ref={controlsRef} onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />
        </Physics>
      </Canvas>

      <WASDOverlay pressed={pressed} />

      {!locked && <div style={centerOverlayStyle}>Click Lock Pointer to Look Around</div>}

      {locked && activeInteractable && (
        <div style={interactionPromptStyle}>{activeInteractable.label}</div>
      )}
    </>
  );
}

function HomePage({ onEnterGallery }) {
  return (
    <main style={homeWrapStyle}>
      <section style={homeCardStyle}>
        <header style={heroHeaderStyle}>
          <p style={eyebrowStyle}>{homeContent.role}</p>
          <h1 style={homeTitleStyle}>{homeContent.heroTitle ?? homeContent.name}</h1>
          {homeContent.profileImage && (
            <a href={homeContent.profileImageLink} target="_blank" rel="noreferrer" style={profileImageLinkStyle}>
              <img src={homeContent.profileImage} alt={homeContent.name} style={profileImageStyle} />
              <span style={profileCaptionStyle}>{homeContent.profileImageCaption}</span>
            </a>
          )}
          <p style={homeTextStyle}>{homeContent.intro}</p>
          <p style={homeTextStyle}>{homeContent.details}</p>
        </header>

        {homeContent.aboutSections?.length > 0 && (
          <section style={projectSectionStyle}>
            <p style={sectionTitleStyle}>About Me</p>
            <article style={projectCardStyle}>
              {homeContent.aboutSections.map((section) => (
                <div key={section.title} style={aboutBlockStyle}>
                  <h3 style={aboutTitleStyle}>{section.title}</h3>
                  <p style={homeTextStyle}>{section.text}</p>
                </div>
              ))}
              {homeContent.interests?.length > 0 && (
                <>
                  <h3 style={aboutTitleStyle}>My Interests</h3>
                  <ul style={interestListStyle}>
                    {homeContent.interests.map((interest) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                </>
              )}
            </article>
          </section>
        )}

        <section style={projectSectionStyle}>
          <p style={sectionTitleStyle}>Featured Project</p>
          <article style={projectCardStyle}>
            <h2 style={projectTitleStyle}>{homeContent.featuredProject.title}</h2>
            <p style={projectSubStyle}>{homeContent.featuredProject.subtitle}</p>
            <p style={homeTextStyle}>{homeContent.featuredProject.summary}</p>
            <button
              type="button"
              onClick={() => navigateTo(ROOM_APP_URL, onEnterGallery)}
              style={primaryBtnStyle}
            >
              {homeContent.featuredProject.cta}
            </button>
          </article>
        </section>

        <section style={projectSectionStyle}>
          <p style={sectionTitleStyle}>Contact</p>
          <div style={homeActionsStyle}>
            <a href={`mailto:${homeContent.email}`} style={ghostLinkStyle}>
              {homeContent.email}
            </a>
            {homeContent.links.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={ghostLinkStyle}>
                {link.label}
              </a>
            ))}
          </div>
          <p style={metaTextStyle}>Location: {homeContent.location}</p>
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState(() => (window.location.hash === "#gallery" ? "gallery" : "home"));

  useEffect(() => {
    const onHash = () => setPage(window.location.hash === "#gallery" ? "gallery" : "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openGallery = () => {
    window.location.hash = "gallery";
    setPage("gallery");
  };

  const openHome = () => {
    window.location.hash = "";
    setPage("home");
  };

  if (APP_MODE === "profile") {
    return <HomePage onEnterGallery={openGallery} />;
  }

  if (APP_MODE === "room") {
    return <GalleryPage onBackHome={openHome} />;
  }

  return page === "gallery" ? <GalleryPage onBackHome={openHome} /> : <HomePage onEnterGallery={openGallery} />;
}

function WASDOverlay({ pressed }) {
  return (
    <div style={wasdWrapStyle}>
      <KeyBox label="W" active={pressed.w} col={2} row={1} />
      <KeyBox label="A" active={pressed.a} col={1} row={2} />
      <KeyBox label="S" active={pressed.s} col={2} row={2} />
      <KeyBox label="D" active={pressed.d} col={3} row={2} />
      <KeyBox label="SPACE" active={pressed.space} col={1} row={3} span={3} />
    </div>
  );
}

function KeyBox({ label, active, col, row, span = 1 }) {
  return (
    <div
      style={{
        gridColumn: col,
        gridColumnEnd: `span ${span}`,
        gridRow: row,
        borderRadius: 10,
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        fontWeight: 700,
        color: active ? "#07111f" : "#e5e7eb",
        background: active ? "#60a5fa" : "rgba(17, 24, 39, 0.85)",
        border: active ? "2px solid #bfdbfe" : "2px solid #374151",
        boxShadow: active ? "0 0 20px rgba(96,165,250,0.8)" : "none",
      }}
    >
      {label}
    </div>
  );
}

const badgeStyle = (top, left) => ({
  position: "fixed",
  top,
  left,
  zIndex: 20,
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(0,0,0,0.7)",
  color: "white",
  fontFamily: "system-ui, sans-serif",
  fontSize: 13,
});

const lockBtnStyle = {
  position: "fixed",
  top: 12,
  right: 12,
  zIndex: 30,
  border: "none",
  borderRadius: 8,
  padding: "10px 14px",
  background: "#111827",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
  cursor: "pointer",
};

const modeBtnStyle = {
  position: "fixed",
  top: 12,
  right: 168,
  zIndex: 30,
  border: "none",
  borderRadius: 8,
  padding: "10px 14px",
  background: "#334155",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
  cursor: "pointer",
};

const wasdWrapStyle = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 35,
  display: "grid",
  gridTemplateColumns: "repeat(3, 52px)",
  gridTemplateRows: "repeat(3, 52px)",
  gap: 6,
  pointerEvents: "none",
};

const centerOverlayStyle = {
  position: "fixed",
  inset: 0,
  display: "grid",
  placeItems: "center",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 20,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  background: "rgba(5, 10, 20, 0.2)",
  pointerEvents: "none",
  zIndex: 20,
};

const interactionPromptStyle = {
  position: "fixed",
  left: "50%",
  bottom: 24,
  transform: "translateX(-50%)",
  zIndex: 40,
  padding: "10px 14px",
  borderRadius: 10,
  background: "rgba(17, 24, 39, 0.92)",
  color: "#fff",
  fontFamily: "system-ui, sans-serif",
  fontSize: 16,
  letterSpacing: "0.02em",
  border: "1px solid #60a5fa",
};

const homeWrapStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(160deg, #0b1222 0%, #1d335a 45%, #2f4f84 100%)",
  padding: "24px",
};

const homeCardStyle = {
  width: "min(860px, 94vw)",
  background: "rgba(255, 255, 255, 0.94)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: "18px",
  boxShadow: "0 25px 80px rgba(0,0,0,0.28)",
  padding: "34px 30px",
  fontFamily: "system-ui, sans-serif",
};

const heroHeaderStyle = {
  marginBottom: 24,
};

const eyebrowStyle = {
  margin: "0 0 10px",
  fontSize: "0.85rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#475569",
};

const homeTitleStyle = {
  margin: "0 0 12px",
  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
  color: "#111827",
};

const homeTextStyle = {
  margin: "0 0 10px",
  fontSize: "1rem",
  lineHeight: 1.6,
  color: "#334155",
};

const profileImageLinkStyle = {
  display: "inline-flex",
  flexDirection: "column",
  textDecoration: "none",
  margin: "8px 0 14px",
};

const profileImageStyle = {
  width: "min(220px, 40vw)",
  borderRadius: 12,
  border: "1px solid #dbe4f0",
};

const profileCaptionStyle = {
  marginTop: 8,
  fontSize: "0.85rem",
  color: "#475569",
};

const aboutBlockStyle = {
  marginBottom: 14,
};

const aboutTitleStyle = {
  margin: "0 0 8px",
  fontSize: "1rem",
  color: "#0f172a",
};

const interestListStyle = {
  margin: "0",
  paddingLeft: "20px",
  color: "#334155",
  lineHeight: 1.7,
};

const projectSectionStyle = {
  marginTop: 20,
};

const sectionTitleStyle = {
  margin: "0 0 10px",
  fontSize: "0.9rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#64748b",
};

const projectCardStyle = {
  border: "1px solid #dbe4f0",
  borderRadius: 12,
  padding: "16px",
  background: "#f8fafc",
};

const projectTitleStyle = {
  margin: "0 0 4px",
  fontSize: "1.3rem",
  color: "#0f172a",
};

const projectSubStyle = {
  margin: "0 0 10px",
  color: "#475569",
  fontSize: "0.95rem",
};

const homeActionsStyle = {
  marginTop: 10,
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const metaTextStyle = {
  margin: "14px 0 0",
  color: "#64748b",
  fontSize: "0.92rem",
};

const primaryBtnStyle = {
  border: "none",
  borderRadius: 10,
  padding: "11px 16px",
  background: "#0f172a",
  color: "#fff",
  fontSize: "0.95rem",
  cursor: "pointer",
};

const ghostLinkStyle = {
  border: "1px solid #0f172a",
  borderRadius: 10,
  padding: "10px 15px",
  color: "#0f172a",
  textDecoration: "none",
  fontSize: "0.95rem",
};
