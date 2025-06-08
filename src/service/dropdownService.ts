import {Dropdown} from "../types/Dropdown.ts";
import {axiosService} from "./axiosService.ts";

const getDriverDropdown = async (): Promise<Dropdown[]> => {
    const response = await axiosService.get<Dropdown[]>('/dropdown/drivers')
    return response.data
}

const getConstructorDropdown = async (): Promise<Dropdown[]> => {
    const response = await axiosService.get<Dropdown[]>('/dropdown/constructors')
    return response.data
}

const getSetsDropdown = async (): Promise<Dropdown[]> => {
    const response = await axiosService.get<Dropdown[]>('/dropdown/sets')
    return response.data
}

const getParallelDropdown = async (setName: string): Promise<Dropdown[]> => {
    const response = await axiosService.get<Dropdown[]>(`/dropdown/parallels/${setName}`)
    return response.data
}

const getYearDropdown = async (): Promise<Dropdown[]> => {
    const sets = await DropdownService.getSetsDropdown();
    const years = sets.map((set) => set.label.substring(0, 4));
    const noDuplicateYears = [...new Set(years)]
    return noDuplicateYears.map((year) => ({
        label: year,
        value: year
    }))
}

export const DropdownService = {
    getDriverDropdown,
    getConstructorDropdown,
    getSetsDropdown,
    getParallelDropdown,
    getYearDropdown
}