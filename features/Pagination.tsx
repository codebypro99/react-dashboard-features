import { useMemo } from "react";

interface PaginationProps {
	currentPage: number;
	pages: number;
	onPageSelect: (page: number) => void;
}

export default function Pagination({ currentPage, pages, onPageSelect }: PaginationProps) {
	const buttonsToDisplay = useMemo(() => {
		const set = new Set<number>();

		const safeAdd = (p: number) => {
			if (p >= 1 && p <= pages) set.add(p);
		};

		safeAdd(1);
		safeAdd(2);
		safeAdd(3);

		safeAdd(currentPage - 1);
		safeAdd(currentPage);
		safeAdd(currentPage + 1);

		safeAdd(pages - 1);
		safeAdd(pages);

		const list = Array.from(set).sort((a, b) => a - b);

		const final: (number | "...")[] = [];
		let previous: number | null = null;

		for (const page of list) {
			if (previous !== null && page - previous > 1) {
				final.push("...");
			}
			final.push(page);
			previous = page;
		}

		return final;
	}, [pages, currentPage]);

	if (pages <= 1) return null;

	return (
		<div className="flex gap-2 items-center justify-center py-4">
			{buttonsToDisplay.map((item, idx) =>
				item === "..." ? (
					<span key={idx} className="px-2 text-gray-500 select-none">
						…
					</span>
				) : (
					<button
						key={idx}
						onClick={() => onPageSelect(item)}
						className={`px-3 py-1 cursor-pointer rounded-md border transition 
              ${currentPage === item ? "bg-white text-primary border-primary-foreground" : "bg-primary-foreground hover:bg-white"}`}
					>
						{item}
					</button>
				),
			)}
		</div>
	);
}
