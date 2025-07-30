import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

/**
 * A reusable component that wraps its children in a `group` and applies
 * a continuous rotation animation around the Y-axis.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The 3D objects to be rotated together.
 * @param {boolean} props.autoRotate - A flag to enable or disable the rotation animation.
 */
const RotatingGroup = ({ children, autoRotate }) => {
  // useRef is used to gain direct access to the underlying THREE.Group object.
  const groupRef = useRef();

  // useFrame is a hook from @react-three/fiber that executes a function on every single frame.
  // It is the core of the animation loop in a react-three-fiber application.
  useFrame((state, delta) => {
    // Check if auto-rotation is enabled and the group has been rendered.
    if (autoRotate && groupRef.current) {
      // Increment the rotation on the Y-axis.
      // Multiplying by 'delta' (time since last frame) ensures the animation is
      // smooth and consistent across different screen refresh rates.
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // The children are rendered inside a <group> element, which is the THREE.js
  // equivalent of a container div. The ref connects this JSX element to our groupRef.
  return <group ref={groupRef}>{children}</group>;
};

export default RotatingGroup;
