import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { PRIORITY_DOT_COLORS, PRIORITY_LABELS, STATUS_LABELS } from "@/constants/constants";
import { Task } from "@/interfaces/task/task.interface";
import { PriorityValues, StatusValues } from "@/interfaces/task/task.interface";

interface TasksTableProps {
	tasks: Task[];
	loading: boolean;
	error: unknown;
	footerElement?: React.ReactNode;
	onEdit: (task: Task) => void;
	onDelete: (id: string) => void;
}

export const TasksTable = ({ tasks, loading, error, footerElement, onEdit, onDelete }: TasksTableProps) => {
	if (loading) {
    // [UI_EN loading_tasks]: Loading tasks...
		return <div className="text-center py-12 text-slate-400">טוען משימות...</div>;
	}

	if (error) {
    // [UI_EN error_unexpected]: Unexpected error occurred
		return <div className="text-center py-12 text-red-500">אירעה שגיאה בלתי צפויה</div>;
	}

	if (tasks.length === 0) {
    // [UI_EN no_tasks]: No tasks to display...
		return <div className="text-center py-12 text-slate-400">אין משימות להצגה</div>;
	}

	return (
		<div className="space-y-3">
			{tasks.map((task, idx) => (
				<motion.div
					key={task.id}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: idx * 0.05 }}
					className="grid grid-cols-[6fr_3fr_auto] items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors group"
				>
					<div className="flex items-center gap-2 text-right min-w-[300px]">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="font-medium text-sm text-slate-900 cursor-help">{task.title}</div>
								</TooltipTrigger>
								{task.description && (
									<TooltipContent>
										<p className="max-w-xs">{task.description}</p>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>

						<div className="flex items-center justify-end gap-2 text-sm text-slate-600">
							{task.customerName && (
								<>
									<span>{task.customerName}</span>
									{task.dueDate && <span>•</span>}
								</>
							)}
							{task.dueDate && (
								<>
									<span>{format(new Date(task.dueDate), "EEEE, d MMMM • HH:mm", { locale: he })}</span>
									<Clock className="w-4 h-4" />
								</>
							)}
						</div>
					</div>

					<div className="flex items-start gap-6">
						<div className="flex items-center gap-2">
							<div className={`h-2 w-2 rounded-full ${PRIORITY_DOT_COLORS[task.priority] || "bg-slate-400"}`} />
							<span className="text-slate-900 flex-shrink-0">{PRIORITY_LABELS[task.priority as PriorityValues]}</span>
						</div>
						<span className="text-xs text-slate-500 mt-1">{STATUS_LABELS[task.status as StatusValues]}</span>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
							<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(task)}>
								<Edit className="w-4 h-4 text-primary" />
							</Button>
							<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(task.id)}>
								<Trash2 className="w-4 h-4 text-red-600" />
							</Button>
						</div>
					</div>
				</motion.div>
			))}

			{footerElement && <div className="mt-4">{footerElement}</div>}
		</div>
	);
};
