import { useNavigate } from "react-router-dom";
export function ImageRow({ items= [],title,images =[], className = "",onClick= ()=>{} }) {
	var nav = useNavigate()
	return (
		<div
			onClick={onClick}
			className={["hover:bg-blue-100 duration-300 cursor-pointer w-full border border-stone-500 rounded-lg flex overflow-hidden mb-2", className].join(" ")}
		>
			<div className="w-1/3 h-56 py-2 bg-blue-400 flex justify-center items-center">
				<img
					src={images[0]}
					style={{ height: "100%", objectFit: "contain" }}
				/>
			</div>
            <div className="w-2/3 h-40 p-2 flex flex-col">
                <div>
                    <h2 className="text-xl mt-1 mb-2 bg-blue-500 text-white px-1 rounded w-fit">
                        {title}
                    </h2>
                </div>
                {items.map(item => {
                    return <p>{item.icon} {item.text }</p>
                })}
            </div>
        </div>
	);
}
