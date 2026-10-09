"use client";

import { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "@/store";
import { setCustomerFilters } from "@/store/customers/customersSlice";
import TopSection from "./components/TopSection/TopSection";
import CustomersManager from "./components/CustomersManager/CustomersManager";

import { CustomerFilters } from "./interfaces/interfaces";
import { debounce } from "@/lib/utils";
import TasksManager from "./components/TasksManager/TasksManager";
import { selectCustomersFilters } from "@/store/customers/customersSelectors";
import { useSyncCustomerFiltersWithUrl } from "@/hooks/useSyncCustomerFiltersWithUrl";

export default function DashboardHomeClient() {
	const dispatch = useDispatch<AppDispatch>();

	useSyncCustomerFiltersWithUrl();

	const customerFilters = useSelector(selectCustomersFilters);

	const handleCustomerFilterChange = useCallback(
		(updates: Partial<CustomerFilters>) => {
			dispatch(setCustomerFilters(updates));
		},
		[dispatch],
	);

	const debouncedCustomerFilterChange = useMemo(() => {
		return debounce(handleCustomerFilterChange, 300);
	}, [handleCustomerFilterChange]);

	const handleSearchTermChange = (value: string): void => debouncedCustomerFilterChange({ searchTerm: value });

	return (
		<div className="space-y-6" dir="rtl">
			<TopSection searchTerm={customerFilters.searchTerm} handleSearchTermChange={handleSearchTermChange} />

			<CustomersManager customerFilters={customerFilters} onFilterChange={debouncedCustomerFilterChange} />

			<TasksManager />
		</div>
	);
}
