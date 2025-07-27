import styles from "./style.module.css";
export default function LoadingPage() {
  return (
    <div className="absolute z-[99999] bg-[#fff] w-screen h-screen flex justify-center items-center">
      <div className={`${styles.loading}`}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
