export const Section = ({ title,children }) => {
	return (
		<div className="p-2">
			<h1>{title}</h1>
			<div className="border border-stone-200 rounded mx-2 p-2">{children}</div>
		</div>
	);
};