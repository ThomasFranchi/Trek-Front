export default function Button({children, ClassName, onClick }) {
    return (
        <button className={ClassName} onClick={onClick}>{children}</button>
    )
}