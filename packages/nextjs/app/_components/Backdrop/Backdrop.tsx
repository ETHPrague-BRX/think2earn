import { ReactNode, useRef } from "react";
import styles from "./Backdrop.module.scss";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // const handleClick = (e: MouseEvent) => {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (wrapperRef.current === e.target) {
      onClick();
    }
  };
  return (
    <>
      <motion.div
        className={styles.Backdrop}
        onClick={handleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={wrapperRef}
      >
        <div style={{ zIndex: 100, width: "auto", height: "auto" }}>{children}</div>
      </motion.div>
    </>
  );
};

export default Backdrop;
