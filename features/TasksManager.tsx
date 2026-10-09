"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/shadcn/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/shadcn/ui/select";

import { AppDispatch } from "@/store";
import { deleteTask, fetchTasks } from "@/store/tasks/tasksThunks";
import {
  selectTasks,
	selectTasksFetchLoading,
	selectTasksFilters,
	selectTasksFetchError,
	selectTasksTotalPages,
} from "@/store/tasks/tasksSelectors";
import { selectCustomers } from "@/store/customers/customersSelectors";
import { setTaskFilters } from "@/store/tasks/tasksSlice";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import type { TaskFiltersKeys } from "@/interfaces";
import { Task } from "@/interfaces/task/task.interface";
import { debounce } from "@/lib/utils";

import TaskDialog from "@/components/dialogs/TaskDialog/TaskDialog";
import Pagination from "./ui/Pagination";
import ConfirmDialog from "@/shared/dialogs/ConfirmDialog";
import { TasksTable } from "./ui/TasksTable";

export default function TasksManager() {
	const dispatch = useDispatch<AppDispatch>();

	const tasksToDisplay = useSelector(selectTasks);
	const totalPages = useSelector(selectTasksTotalPages);
	const loading = useSelector(selectTasksFetchLoading);
	const error = useSelector(selectTasksFetchError);
	const filters = useSelector(selectTasksFilters);

	const customers = useSelector(selectCustomers);
	const filteredCustomers = useSelector(selectCustomers);

	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
	const [page, setPage] = useState<number>(1);

	const onFilterValueChange = useCallback(
		(filterKey: TaskFiltersKeys, value: string) => {
			setPage(1);
			dispatch(setTaskFilters({ [filterKey]: value }));
		},
		[dispatch],
	);

	const debouncedFetchTasks = useMemo(() => {
		return debounce(({ filters, page, force = false }) => {
			dispatch(fetchTasks({ filters, page, force }));
		}, 300);
	}, [dispatch]);

	const onConfirmDelete = useCallback(async () => {
		console.log("[DEBUG onConfirm] taskIdToDelete", taskIdToDelete);
		const taskId = Number(taskIdToDelete);
		if (!taskIdToDelete) return;

		try {
			await dispatch(deleteTask({ taskId })).unwrap();
			debouncedFetchTasks({ filters, page });

			// [UI_EN]: Task deleted successfully
			toast.success("המשימה נמחקה בהצלחה");
		} catch {
			// [UI_EN]: Error deleting task
			toast.error("שגיאה במחיקת משימה");
		}
		setIsConfirmDialogOpen(false);
	}, [debouncedFetchTasks, dispatch, filters, page, taskIdToDelete]);

	useEffect(() => {
		debouncedFetchTasks({ filters, page });
	}, [dispatch, debouncedFetchTasks, filters, page]);

	return (
		<div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
			<div className="p-6 border-b border-slate-100 flex items-center justify-between">
				<h2 className="text-2xl font-bold text-slate-900">משימות</h2>
				<Button
					className="bg-primary-foreground text-primary hover:border-secondary hover:bg-secondary-foreground hover:text-secondary border-1 border-primary-foreground cursor-pointer"
					onClick={() => {
						setEditingTask(null);
						setIsTaskDialogOpen(true);
					}}
				>
					<Plus className="w-4 h-4 ml-2" />
					{/* [UI_EN add_task_button]: Add Task */}
					הוסף משימה
				</Button>
			</div>

			<div className="p-6 border-b border-slate-100 bg-slate-50/50 grid grid-cols-5 gap-4">
				<Select value={filters.campaign} onValueChange={(v) => onFilterValueChange("campaign", v)}>
					<SelectTrigger className="bg-white justify-center">
						<SelectValue placeholder="כל הקמפיינים" />
					</SelectTrigger>
					{/* wrappers for dir future possible logic change */}
					<SelectContent dir="rtl">
						{/* [UI_EN placeholder_all_campaigns]: All campaigns */}
						<SelectItem value="all">כל הקמפיינים</SelectItem>
						{/* NOTE: Where to get unique campaigns? */}
						{[].map((c) => (
							<SelectItem key={c} value={c}>
								{c}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.customer} onValueChange={(v) => onFilterValueChange("customer", v)}>
					<SelectTrigger className="bg-white justify-center">
						{/* [UI_EN placeholder_all_customers]: All customers */}
						<SelectValue placeholder="כל הלקוחות" />
					</SelectTrigger>
					<SelectContent dir="rtl">
						<SelectItem value="all">כל הלקוחות</SelectItem>
						{filteredCustomers.map((c) => (
							<SelectItem key={c.id} value={String(c.id)}>
								{c.fullName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={filters.date} onValueChange={(v) => onFilterValueChange("date", v)}>
					<SelectTrigger className="bg-white justify-center">
						{/* [UI_EN placeholder_all_dates]: All dates */}
						<SelectValue placeholder="כל התאריכים" />
					</SelectTrigger>
					<SelectContent dir="rtl">
						{/* [UI_EN date_all]: All dates */}
						<SelectItem value="all">כל התאריכים</SelectItem>

						{/* [UI_EN date_today]: Today */}
						<SelectItem value="today">היום</SelectItem>

						{/* [UI_EN date_week]: This week */}
						<SelectItem value="week">השבוע</SelectItem>

						{/* [UI_EN date_month]: This month */}
						<SelectItem value="month">החודש</SelectItem>
					</SelectContent>
				</Select>

				<Select value={filters.priority} onValueChange={(v) => onFilterValueChange("priority", v)}>
					<SelectTrigger className="bg-white justify-center">
						{/* [UI_EN placeholder_all_priorities]: All priorities */}
						<SelectValue placeholder="כל העדיפויות" />
					</SelectTrigger>
					{/* NOTE: move to constants and use with map */}
					<SelectContent dir="rtl">
						{/* [UI_EN priority_all]: All priorities */}
						<SelectItem value="all">כל העדיפויות</SelectItem>

						{/* [UI_EN priority_low]: Low */}
						<SelectItem value="low">רגיל</SelectItem>

						{/* [UI_EN priority_medium]: Medium */}
						<SelectItem value="medium">בינוני</SelectItem>

						{/* [UI_EN priority_high]: High */}
						<SelectItem value="high">גבוה</SelectItem>

						{/* [UI_EN priority_urgent]: Urgent */}
						<SelectItem value="urgent">מיידי</SelectItem>
					</SelectContent>
				</Select>

				{/* NOTE: Move all on onValueChange to separate universalised fucn */}
				<Select value={filters.status} onValueChange={(v) => onFilterValueChange("status", v)}>
					<SelectTrigger className="bg-white justify-center">
						{/* [UI_EN placeholder_all_statuses]: All statuses */}
						<SelectValue placeholder="כל הסטטוסים" />
					</SelectTrigger>
					<SelectContent dir="rtl">
						{/* [UI_EN status_all]: All statuses */}
						<SelectItem value="all">כל הסטטוסים</SelectItem>

						{/* [UI_EN status_todo]: Todo */}
						<SelectItem value="todo">בהמתנה</SelectItem>

						{/* [UI_EN status_in_progress]: In progress */}
						<SelectItem value="in_progress">בטיפול</SelectItem>

						{/* [UI_EN status_completed]: Completed */}
						<SelectItem value="completed">הושלם</SelectItem>

						{/* [UI_EN status_cancelled]: Cancelled */}
						<SelectItem value="cancelled">בוטל</SelectItem>

						{/* [UI_EN status_on_hold]: On hold */}
						<SelectItem value="on_hold">בהשהיה</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="p-6">
				<TasksTable
					tasks={tasksToDisplay}
					loading={loading}
					error={error}
					onEdit={(task: Task) => {
						setEditingTask(task);
						setIsTaskDialogOpen(true);
					}}
					onDelete={(id: string) => {
						setTaskIdToDelete(id);
						setIsConfirmDialogOpen(true);
					}}
					footerElement={
						<Pagination
							currentPage={page}
							pages={totalPages}
							onPageSelect={(page) => {
								setPage(page);
								debouncedFetchTasks({ filters, page });
							}}
						/>
					}
				/>
			</div>

			<TaskDialog
				isOpen={isTaskDialogOpen}
				onOpenChange={(open) => {
					setIsTaskDialogOpen(open);
					if (!open) setEditingTask(null);
				}}
				editingTask={editingTask}
				customers={customers}
				onSubmit={() => {
					debouncedFetchTasks({ filters, page, force: true });
				}}
			/>

			<ConfirmDialog
				open={isConfirmDialogOpen}
				// [UI_EN dialog_delete_task_title]: Delete Task
				title="מחיקת משימה"
				// [UI_EN dialog_delete_task_description]: Are you sure you want to delete this task?
				description="האם אתה בטוח שברצונך למחוק את המשימה?"
				// [UI_EN dialog_delete_task_confirm]: Delete
				confirmText="מחק"
				// [UI_EN dialog_delete_task_cancel]: Cancel
				cancelText="ביטול"
				onConfirm={onConfirmDelete}
				onCancel={() => {
					setTaskIdToDelete(null);
					setIsConfirmDialogOpen(false);
				}}
			/>
		</div>
	);
}
