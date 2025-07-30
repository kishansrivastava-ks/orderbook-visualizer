import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const RotatingGroup = ({ children, autoRotate }) => {
  const groupRef = useRef();

  // useFrame is a hook that runs on every single frame
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      // Rotate the group on the Y-axis
      groupRef.current.rotation.y += delta * 0.1; // delta ensures smooth animation regardless of frame rate
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default RotatingGroup;
